# 🚀 Руководство по деплою Survey Assessment

## Обзор

Этот проект использует автоматизированный CI/CD pipeline для деплоя на удаленный сервер. При каждом push в ветку `main` автоматически:

1. Собираются Docker образы
2. Загружаются в GitHub Container Registry
3. Деплоятся на удаленный сервер
4. Инициализируется MongoDB с вопросами

## 📋 Предварительные требования

### На GitHub

- [ ] Создать репозиторий
- [ ] Настроить GitHub Actions (включить в Settings → Actions → General)
- [ ] Добавить Secrets в Settings → Secrets and variables → Actions:

```
SERVER_HOST          - IP адрес или домен сервера
SERVER_USER          - SSH пользователь для подключения
SERVER_SSH_KEY       - Приватный SSH ключ для подключения
OPENAI_API_KEY       - API ключ OpenAI
API_KEY              - Секретный ключ для API
```

### На удаленном сервере

- [ ] Установить Docker и Docker Compose
- [ ] Создать пользователя для деплоя
- [ ] Настроить SSH ключи
- [ ] Создать директорию проекта: `/opt/survey-assessment`

## 🔧 Настройка сервера

### 1. Установка Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Установка Docker Compose

```bash
# Скачиваем Docker Compose V2
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Проверяем версию
docker compose version
```

### 3. Создание пользователя и директории

```bash
# Создаем пользователя
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy

# Создаем директорию проекта
sudo mkdir -p /opt/survey-assessment
sudo chown deploy:deploy /opt/survey-assessment

# Переключаемся на пользователя deploy
sudo su - deploy
cd /opt/survey-assessment

# Клонируем репозиторий
git clone https://github.com/your-username/survey.git .
```

### 4. Настройка SSH ключей

```bash
# На сервере (пользователь deploy)
ssh-keygen -t rsa -b 4096 -C "deploy@server"

# Копируем публичный ключ в authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# На локальной машине добавляем приватный ключ в GitHub Secrets
cat ~/.ssh/id_rsa
```

## 🚀 Автоматический деплой

### 1. Push в main ветку

После настройки всех secrets, просто сделайте push в ветку `main`:

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### 2. Мониторинг деплоя

- Перейдите в GitHub → Actions
- Следите за выполнением workflow "Deploy to Production"
- Проверьте логи на каждом этапе

### 3. Проверка деплоя

После успешного деплоя проверьте:

```bash
# Статус контейнеров
docker compose -f docker-compose.prod.yml ps

# Логи MongoDB
docker compose -f docker-compose.prod.yml logs mongo

# Логи Backend
docker compose -f docker-compose.prod.yml logs backend

# Логи Frontend
docker compose -f docker-compose.prod.yml logs frontend
```

## 🛠️ Ручной деплой

Если нужно развернуть вручную:

### 1. Используя скрипт

```bash
# Делаем скрипт исполняемым
chmod +x scripts/deploy.sh

# Запускаем деплой
./scripts/deploy.sh production
```

### 2. Пошагово

```bash
# 1. Останавливаем контейнеры
docker compose -f docker-compose.prod.yml down

# 2. Обновляем код
git pull origin main

# 3. Создаем .env
cat > .env << EOF
MONGO_URL=mongodb://mongo:27017/assessment
OPENAI_API_KEY=your_key_here
API_KEY=your_api_key_here
EOF

# 4. Подготавливаем MongoDB
mkdir -p mongo-init
cp backend/improved-test-questions.json mongo-init/

# 5. Запускаем
docker compose -f docker-compose.prod.yml up -d
```

## 🔍 Troubleshooting

### Проблема: MongoDB не инициализируется

```bash
# Проверяем логи MongoDB
docker compose -f docker-compose.prod.yml logs mongo

# Проверяем наличие файла вопросов
docker exec survey-assessment-mongo-1 ls -la /docker-entrypoint-initdb.d/

# Ручная инициализация
docker exec -it survey-assessment-mongo-1 mongosh assessment
db.questions.countDocuments()
```

### Проблема: Backend не подключается к MongoDB

```bash
# Проверяем переменные окружения
docker compose -f docker-compose.prod.yml exec backend env | grep MONGO

# Проверяем сеть Docker
docker network ls
docker network inspect survey-assessment_default
```

### Проблема: Frontend не может достучаться до Backend

```bash
# Проверяем переменную NEXT_PUBLIC_API_URL
docker compose -f docker-compose.prod.yml exec frontend env | grep API_URL

# Проверяем доступность Backend
curl -f http://localhost:8000/health
```

## 📊 Мониторинг

### Health Checks

- **Backend**: `http://server:8000/health`
- **Frontend**: Проверка доступности на порту 3000
- **MongoDB**: Проверка подключения и количества документов

### Логи

```bash
# Все логи
docker compose -f docker-compose.prod.yml logs -f

# Логи конкретного сервиса
docker compose -f docker-compose.prod.yml logs -f backend
```

### Статистика

```bash
# Использование ресурсов
docker stats

# Размер образов
docker images

# Размер volumes
docker volume ls
docker volume inspect survey-assessment_mongo_data
```

## 🔄 Обновление

### Автоматическое обновление

Просто сделайте push в ветку `main` - деплой произойдет автоматически.

### Принудительное обновление

```bash
# На GitHub: Actions → Deploy to Production → Run workflow
# Или локально:
git push origin main
```

## 🗑️ Откат

### Откат к предыдущей версии

```bash
# Останавливаем контейнеры
docker compose -f docker-compose.prod.yml down

# Откатываемся к предыдущему коммиту
git reset --hard HEAD~1

# Перезапускаем
docker compose -f docker-compose.prod.yml up -d
```

### Откат к конкретному тегу

```bash
git checkout v1.0.0
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи GitHub Actions
2. Проверьте логи контейнеров на сервере
3. Убедитесь, что все secrets настроены правильно
4. Проверьте доступность сервера и портов

---

**Удачного деплоя! 🚀**
