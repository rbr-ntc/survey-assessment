# 🚀 Быстрый старт Survey Assessment

## 📋 Что нужно сделать за 5 минут

### 1. **Клонировать и настроить**

```bash
git clone <your-repo-url>
cd survey
make setup
```

### 2. **Создать .env файлы**

```bash
# backend/.env
MONGO_URL=mongodb://localhost:27017/assessment
OPENAI_API_KEY=your_openai_key
API_KEY=MY_SUPER_SECRET_API_KEY

# system-analyst-assessment/.env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=MY_SUPER_SECRET_API_KEY
```

### 3. **Запустить локально**

```bash
make dev
# или
docker compose up -d
```

### 4. **Проверить работу**

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Health check: http://localhost:8000/health

## 🐳 Основные команды

```bash
make help          # Показать все команды
make dev           # Запустить в режиме разработки
make prod          # Запустить production версию
make down          # Остановить контейнеры
make logs          # Показать логи
make status        # Статус контейнеров
make clean         # Очистить Docker
```

## 🔧 Полезные команды

```bash
# Открыть shell в контейнерах
make shell-backend
make shell-frontend
make shell-mongo

# Мониторинг
make stats
make health

# Backup/restore
make backup
make restore BACKUP_PATH=./backups/backup_20240101_120000
```

## 🚀 Деплой на сервер

### Автоматический (рекомендуется)

1. Настройте GitHub Secrets
2. Сделайте push в main ветку
3. GitHub Actions автоматически развернет на сервере

### Ручной

```bash
make deploy-manual
```

## 📁 Структура проекта

```
survey/
├── .github/workflows/     # CI/CD pipeline
├── backend/               # FastAPI backend
├── system-analyst-assessment/  # Next.js frontend
├── scripts/               # Скрипты деплоя
├── mongo-init/            # Инициализация MongoDB
├── docker-compose.yml     # Локальная разработка
├── docker-compose.prod.yml # Production
└── Makefile               # Команды для разработки
```

## 🆘 Если что-то не работает

1. **Проверьте статус**: `make status`
2. **Посмотрите логи**: `make logs`
3. **Проверьте health**: `make health`
4. **Перезапустите**: `make restart`

## 📚 Подробная документация

- [Полное руководство по деплою](DEPLOYMENT.md)
- [README проекта](README.md)

---

**Готово! 🎉 Проект должен работать на http://localhost:3000**
