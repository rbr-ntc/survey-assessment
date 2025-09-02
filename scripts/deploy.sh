#!/bin/bash

# Скрипт деплоя survey-assessment на удаленный сервер
# Использование: ./scripts/deploy.sh [environment]

set -e  # Останавливаем выполнение при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфигурация
PROJECT_NAME="survey-assessment"
PROJECT_DIR="/opt/$PROJECT_NAME"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"

# Функция для логирования
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Проверяем аргументы
if [ $# -eq 0 ]; then
    error "Укажите окружение: staging или production"
    echo "Использование: $0 [staging|production]"
    exit 1
fi

ENVIRONMENT=$1

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    error "Неверное окружение. Используйте: staging или production"
    exit 1
fi

log "Начинаем деплой в окружение: $ENVIRONMENT"

# Проверяем подключение к серверу
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $ENVIRONMENT "echo 'SSH connection successful'" > /dev/null 2>&1; then
    error "Не удается подключиться к серверу $ENVIRONMENT"
    exit 1
fi

success "SSH подключение установлено"

# Останавливаем существующие контейнеры
log "Проверяем существующие контейнеры..."
if ssh $ENVIRONMENT "cd $PROJECT_DIR && docker compose -f $DOCKER_COMPOSE_FILE ps | grep -q 'Up'"; then
    warning "Найдены запущенные контейнеры. Останавливаем..."
    ssh $ENVIRONMENT "cd $PROJECT_DIR && docker compose -f $DOCKER_COMPOSE_FILE down"
    success "Контейнеры остановлены"
else
    log "Запущенных контейнеров не найдено"
fi

# Очищаем старые образы
log "Очищаем старые Docker образы..."
ssh $ENVIRONMENT "docker image prune -f"
success "Старые образы очищены"

# Обновляем код
log "Обновляем код на сервере..."
ssh $ENVIRONMENT "cd $PROJECT_DIR && git pull origin main"
success "Код обновлен"

# Создаем .env файл
log "Создаем .env файл..."
ssh $ENVIRONMENT "cd $PROJECT_DIR && cat > .env << 'EOF'
MONGO_URL=mongodb://mongo:27017/assessment
OPENAI_API_KEY=$OPENAI_API_KEY
API_KEY=$API_KEY
EOF"
success ".env файл создан"

# Копируем вопросы для инициализации MongoDB
log "Подготавливаем данные для MongoDB..."
ssh $ENVIRONMENT "cd $PROJECT_DIR && mkdir -p mongo-init"
scp backend/improved-test-questions.json $ENVIRONMENT:$PROJECT_DIR/mongo-init/
success "Данные для MongoDB подготовлены"

# Запускаем контейнеры
log "Запускаем контейнеры..."
ssh $ENVIRONMENT "cd $PROJECT_DIR && docker compose -f $DOCKER_COMPOSE_FILE up -d"
success "Контейнеры запущены"

# Ждем запуска MongoDB
log "Ждем запуска MongoDB..."
sleep 30

# Проверяем статус
log "Проверяем статус сервисов..."
ssh $ENVIRONMENT "cd $PROJECT_DIR && docker compose -f $DOCKER_COMPOSE_FILE ps"

# Проверяем подключение к MongoDB
log "Проверяем подключение к MongoDB..."
if ssh $ENVIRONMENT "cd $PROJECT_DIR && docker exec ${PROJECT_NAME}-mongo-1 mongosh --eval \"db.runCommand('ping')\" assessment"; then
    success "MongoDB доступен"
else
    error "MongoDB недоступен"
    exit 1
fi

# Проверяем количество вопросов в базе
log "Проверяем количество вопросов в базе..."
QUESTION_COUNT=$(ssh $ENVIRONMENT "cd $PROJECT_DIR && docker exec ${PROJECT_NAME}-mongo-1 mongosh --quiet --eval \"db.questions.countDocuments()\" assessment")
log "В базе данных: $QUESTION_COUNT вопросов"

# Проверяем health check backend
log "Проверяем health check backend..."
if ssh $ENVIRONMENT "curl -f http://localhost:8000/health" > /dev/null 2>&1; then
    success "Backend доступен"
else
    error "Backend недоступен"
    exit 1
fi

success "Деплой завершен успешно!"
log "Frontend доступен по адресу: http://$ENVIRONMENT:3000"
log "Backend API доступен по адресу: http://$ENVIRONMENT:8000"
log "MongoDB доступен по адресу: $ENVIRONMENT:27017"
