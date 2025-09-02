# 🚀 Настройка деплоя Survey Assessment

## ⚠️ **ВАЖНО: Безопасность**

**НЕ добавляйте приватные SSH ключи в Git репозиторий!** Они должны быть только в GitHub Secrets.

## 📋 **Пошаговая настройка**

### **1. Создание SSH ключей для сервера**

```bash
# Создайте новую пару SSH ключей (НЕ в проекте!)
ssh-keygen -t rsa -b 4096 -C "deploy@your-server" -f ~/.ssh/survey_deploy

# Скопируйте публичный ключ на сервер
cat ~/.ssh/survey_deploy.pub
```

### **2. Настройка сервера**

```bash
# На сервере создайте пользователя deploy
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy

# Создайте директорию проекта
sudo mkdir -p /opt/survey-assessment
sudo chown deploy:deploy /opt/survey-assessment

# Добавьте публичный ключ в authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ВАШ_ПУБЛИЧНЫЙ_КЛЮЧ_ЗДЕСЬ" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### **3. GitHub Secrets**

Перейдите в [GitHub Settings → Secrets and variables → Actions](https://github.com/rbr-ntc/survey-assessment/settings/secrets/actions) и добавьте:

| Secret Name | Описание | Пример значения |
|-------------|----------|-----------------|
| `SERVER_HOST` | IP адрес или домен сервера | `192.168.1.100` |
| `SERVER_USER` | SSH пользователь | `deploy` |
| `SERVER_SSH_KEY` | **Приватный** SSH ключ | Содержимое `~/.ssh/survey_deploy` |
| `OPENAI_API_KEY` | API ключ OpenAI | `sk-...` |
| `API_KEY` | Секретный ключ для API | `MY_SUPER_SECRET_API_KEY` |

### **4. Проверка подключения**

```bash
# Проверьте SSH подключение к серверу
ssh -i ~/.ssh/survey_deploy deploy@YOUR_SERVER_IP
```

## 🚀 **После настройки**

1. **Сделайте любой коммит и push** - автоматически запустится деплой
2. **Или запустите workflow вручную** в GitHub Actions

## 🔒 **Безопасность**

- ✅ **Публичные ключи** можно добавлять в репозиторий
- ❌ **Приватные ключи** НИКОГДА не добавляйте в Git
- ✅ **GitHub Secrets** - безопасное место для приватных данных
- ❌ **Не коммитьте** файлы с паролями, ключами, токенами

---

**Удачи с настройкой! 🚀**
