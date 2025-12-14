#!/bin/bash

# Скрипт для подготовки Backend репозитория
# Использование: ./scripts/prepare-backend-repo.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
NEW_REPO_DIR="$PROJECT_ROOT/../survey-assessment-backend"

echo "🚀 Подготовка Backend репозитория..."

# Создаем новую директорию для репозитория
if [ -d "$NEW_REPO_DIR" ]; then
    echo "⚠️  Директория $NEW_REPO_DIR уже существует. Удаляем..."
    rm -rf "$NEW_REPO_DIR"
fi

mkdir -p "$NEW_REPO_DIR"
cd "$NEW_REPO_DIR"

echo "📦 Копирование файлов из backend/..."

# Копируем все файлы из backend
cp -r "$BACKEND_DIR"/* "$NEW_REPO_DIR/" 2>/dev/null || true
cp -r "$BACKEND_DIR"/.??* "$NEW_REPO_DIR/" 2>/dev/null || true

# Создаем .gitignore для backend
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
env/
ENV/
.venv

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Testing
.pytest_cache/
.coverage
htmlcov/
.tox/
.nox/
coverage.xml
*.cover
.hypothesis/

# Logs
*.log
logs/

# Database
*.db
*.sqlite
*.sqlite3

# Docker
.dockerignore

# Backup files
*.bak
*.backup
*.old
EOF

# Обновляем README.md
cat > README.md << 'EOF'
# Survey Assessment Backend

FastAPI backend для системы оценки системных аналитиков с AI-рекомендациями.

## 🚀 Технологии

- **FastAPI** - современный веб-фреймворк для Python
- **MongoDB** - NoSQL база данных
- **OpenAI API** - генерация AI-рекомендаций (GPT-5.2-mini)
- **Pydantic** - валидация данных
- **Uvicorn** - ASGI сервер

## 📋 Требования

- Python 3.10+
- MongoDB 6.0+
- OpenAI API ключ

## 🔧 Установка

```bash
# Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# Установить зависимости
pip install -r requirements.txt
```

## ⚙️ Настройка

Создайте файл `.env` в корне проекта:

```env
API_KEY=your-secret-api-key
SECRET_KEY=your-secret-key-for-jwt
OPENAI_API_KEY=sk-proj-...
MONGO_URL=mongodb://localhost:27017/assessment
CORS_ORIGINS=http://localhost:3000
ENABLE_QUICK_TEST=true
OPENAI_MODEL=gpt-5.2-mini
OPENAI_MAX_TOKENS=4000
OPENAI_REASONING_EFFORT=medium
```

## 🏃 Запуск

```bash
# Запуск в режиме разработки
uvicorn app.main:app --reload

# Запуск в продакшене
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API будет доступен по адресу: `http://localhost:8000`

Документация API: `http://localhost:8000/docs`

## 🐳 Docker

```bash
# Сборка образа
docker build -t survey-assessment-backend .

# Запуск контейнера
docker run -p 8000:8000 --env-file .env survey-assessment-backend
```

## 🧪 Тестирование

```bash
# Запуск тестов
pytest

# С покрытием
pytest --cov=app tests/
```

## 📚 API Endpoints

- `GET /health` - Health check
- `GET /questions` - Получить список вопросов
- `POST /results` - Отправить результаты теста
- `GET /results/{id}` - Получить результат по ID
- `POST /recommendations` - Сгенерировать AI-рекомендации
- `POST /quick-test` - Быстрый тест (если включен)

## 🚂 Деплой на Railway

1. Создайте проект на [Railway](https://railway.app)
2. Подключите этот репозиторий
3. Установите Root Directory: `backend` (если репозиторий содержит только backend)
4. Добавьте все переменные окружения из `.env`
5. Railway автоматически задеплоит приложения

## 📝 Лицензия

MIT
EOF

echo "✅ Backend репозиторий подготовлен в: $NEW_REPO_DIR"
echo ""
echo "📝 Следующие шаги:"
echo "1. cd $NEW_REPO_DIR"
echo "2. git init"
echo "3. git add ."
echo "4. git commit -m 'Initial commit: Backend repository'"
echo "5. Создайте новый репозиторий на GitHub"
echo "6. git remote add origin git@github.com:YOUR_USERNAME/survey-assessment-backend.git"
echo "7. git push -u origin main"

