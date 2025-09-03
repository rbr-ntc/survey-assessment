# 🔒 Безопасное хранение SSL сертификатов

## 🚨 **Проблемы неправильного хранения:**

### **Что НЕЛЬЗЯ делать:**
- ❌ **Создавать файлы через SSH** команды
- ❌ **Хранить приватные ключи** в открытом виде
- ❌ **Оставлять файлы** доступными для чтения всем
- ❌ **Коммитить сертификаты** в Git репозиторий

## ✅ **Правильные способы хранения:**

### **1. GitHub Secrets (Рекомендуется для разработки)**

#### **Добавьте в GitHub Secrets:**
```
SSL_CERTIFICATE: -----BEGIN CERTIFICATE-----
MIIHUzCCBjugAwIBAgIMLlKFsuXf+jsa2nmOMA0GCSqGSIb3DQEBCwUAMFUxCzAJ
... (весь сертификат)
-----END CERTIFICATE-----

SSL_PRIVATE_KEY: -----BEGIN RSA PRIVATE KEY-----
MIIJKAIBAAKCAgEAyGX652ijAznYMclUtXXJ0Ab6R7wJwjz+jMGgBSpT/e19WkP7
... (весь приватный ключ)
-----END RSA PRIVATE KEY-----
```

#### **Преимущества:**
- ✅ **Безопасно** - ключи зашифрованы в GitHub
- ✅ **Автоматически** - создаются при деплое
- ✅ **Правильные права** - настраиваются автоматически
- ✅ **Версионирование** - через Git workflow

### **2. Docker Secrets (Для production)**

```yaml
# docker-compose.yml
services:
  nginx:
    secrets:
      - ssl_certificate
      - ssl_private_key

secrets:
  ssl_certificate:
    file: ./ssl/fullchain.crt
  ssl_private_key:
    file: ./ssl/privkey.key
```

### **3. Внешние хранилища (Enterprise)**

- **HashiCorp Vault**
- **AWS Secrets Manager**
- **Azure Key Vault**
- **Google Secret Manager**

## 🛠️ **Настройка через GitHub Secrets:**

### **Шаг 1: Добавьте сертификаты в GitHub Secrets**
1. Перейдите в ваш репозиторий
2. **Settings** → **Secrets and variables** → **Actions**
3. Добавьте:
   - `SSL_CERTIFICATE` - содержимое вашего `.crt` файла
   - `SSL_PRIVATE_KEY` - содержимое вашего `.key` файла

### **Шаг 2: GitHub Actions автоматически:**
1. ✅ Создаст директорию `ssl/`
2. ✅ Создаст файлы с правильными правами
3. ✅ Настроит HTTPS в Nginx
4. ✅ Запустит контейнеры с SSL

## 🔐 **Права доступа файлов:**

### **Автоматически настраиваются:**
- **`privkey.key`**: `600` (только root может читать/писать)
- **`fullchain.crt`**: `644` (root может читать/писать, все могут читать)
- **Владелец**: `root:root`

## 📋 **Проверка безопасности:**

### **После деплоя проверьте:**
```bash
# Подключитесь к серверу
ssh root@147.45.166.90

# Проверьте права доступа
ls -la /opt/survey-assessment/ssl/

# Должно быть:
# -rw-r--r-- 1 root root 2561 fullchain.crt
# -rw------- 1 root root 3196 privkey.key
```

## 🎯 **Итог:**

**Используйте GitHub Secrets** для хранения SSL сертификатов:
- ✅ **Безопасно** - ключи зашифрованы
- ✅ **Автоматически** - настраивается при деплое
- ✅ **Правильно** - права доступа настраиваются
- ✅ **Просто** - не нужно делать вручную

## 🚀 **Следующие шаги:**

1. **Добавьте** `SSL_CERTIFICATE` и `SSL_PRIVATE_KEY` в GitHub Secrets
2. **Запустите деплой** - GitHub Actions настроит все автоматически
3. **Проверьте** - HTTPS должен работать с вашим GlobalSign сертификатом
