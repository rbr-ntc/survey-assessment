# Security Audit Report

**Date:** September 3, 2025
**Author:** Jules (AI Assistant)
**Scope:** Backend API, Database, and Deployment Infrastructure

## 1. Executive Summary

This audit was triggered by a report of outgoing attacks from the server (IP 147.45.166.90). The investigation identified a critical misconfiguration in the MongoDB deployment that likely allowed unauthorized access, leading to the compromise.

The primary vulnerability was the exposure of the MongoDB port (27017) to the public internet without authentication. This has been remediated in the codebase, and additional hardening measures have been implemented.

## 2. Findings

### 2.1. Critical: Exposed MongoDB Port without Authentication
- **Description:** The `docker-compose.yml` file mapped port 27017 to the host's 0.0.0.0 interface.
- **Impact:** Any attacker could connect to the database, read/write data, and potentially execute code depending on the configuration and version. This is the most likely vector for the "outgoing attacks" (e.g., crypto miners or botnet scripts installed on the host).
- **Remediation:**
    - Restricted MongoDB to `127.0.0.1` in `docker-compose.yml`.
    - Enabled authentication (username/password) in `docker-compose.prod.yml`.
    - Removed default connection strings in `config.py`.

### 2.2. High: Weak/Hardcoded Secrets
- **Description:**
    - `API_KEY` defaulted to "MY_SUPER_SECRET_API_KEY".
    - `SECRET_KEY` (for JWT) defaulted to "your-secret-key-change-in-production".
    - `MONGO_URL` defaulted to `mongodb://localhost:27017` (unauthenticated).
- **Impact:** If environment variables were missing, the application would default to insecure known secrets, allowing authentication bypass.
- **Remediation:** Removed default values for critical secrets in `config.py` and `deps.py`. The application will now fail to start if these are not provided in the environment.

### 2.3. Medium: Broad CORS Configuration
- **Description:** Nginx was configured with `Access-Control-Allow-Origin *`, which is overly permissive.
- **Remediation:** Removed the Nginx header to rely on the application's `CORSMiddleware`, which allows for specific origin configuration via `CORS_ORIGINS`.

### 2.4. Medium: Unpinned Dependencies
- **Description:** `requirements.txt` did not specify versions, leading to unpredictable builds and potential installation of vulnerable packages in the future.
- **Remediation:** Generated `requirements.lock` with pinned versions and ran `pip-audit`.

### 2.5. Low: Vulnerable Dependency
- **Description:** `ecdsa` version `0.19.1` has a known vulnerability (CVE-2024-23342).
- **Remediation:** Recommend updating `python-jose` or explicitly upgrading `ecdsa`. (Action: Pending user update or library patch).

## 3. Incident Response & Cleanup Checklist

**WARNING:** The server is compromised. Do not trust *any* executable or configuration on the current server instance if possible. The best course of action is to provision a **new server** and deploy the hardened code there.

If you must reuse the server, follow these steps immediately:

1.  **Isolate the Server:** Ensure it is disconnected from the internet (provider has already blocked it).
2.  **Back up Data (Carefully):** Dump the MongoDB data if needed, but inspect it for malicious content.
3.  **Wipe and Reinstall:**
    -   Reinstall the OS.
    -   Install Docker and Docker Compose.
4.  **Rotate ALL Secrets:**
    -   Generate a NEW `API_KEY`.
    -   Generate a NEW `OPENAI_API_KEY` (revoke the old one).
    -   Generate a NEW `SECRET_KEY`.
    -   Generate NEW MongoDB credentials.
    -   Update your `.env` file with these new values.
5.  **Deploy Hardened Code:**
    -   Pull the latest code from this repository (containing the security fixes).
    -   Run `docker-compose -f docker-compose.prod.yml up -d --build`.
6.  **Verify:**
    -   Check that port 27017 is NOT accessible from the outside (`nmap <server-ip> -p 27017`).
    -   Check application logs.

## 4. Future Recommendations

-   **CI/CD Security:** Implement Github Actions to run `pip-audit` and `trivy` (container scanning) on every push.
-   **Monitoring:** Set up centralized logging (e.g., ELK, Loki) to detect suspicious patterns.
-   **Rate Limiting:** Ensure Nginx or the application limits request rates to prevent abuse (partially implemented in config).
