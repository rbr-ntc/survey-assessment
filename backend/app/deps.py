import os

from fastapi import Depends, Header, HTTPException, status

API_KEY = os.getenv("API_KEY", "MY_SUPER_SECRET_API_KEY")

def verify_api_key(x_api_key: str = Header(None)):
    if not x_api_key or x_api_key != API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or missing API Key") 