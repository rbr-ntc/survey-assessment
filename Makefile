.PHONY: help build build-backend build-frontend push push-backend push-frontend deploy deploy-manual clean logs status restart down up dev prod

# Переменные
PROJECT_NAME := survey-assessment
REGISTRY := ghcr.io
REPO := $(shell git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1\/\2/')
BACKEND_IMAGE := $(REGISTRY)/$(REPO)/backend
FRONTEND_IMAGE := $(REGISTRY)/$(REPO)/frontend
TAG := $(shell git rev-parse --short HEAD)

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: build-backend build-frontend ## Собрать все образы

build-backend: ## Собрать backend образ
	@echo "🔨 Собираю backend образ..."
	docker build -t $(BACKEND_IMAGE):$(TAG) -t $(BACKEND_IMAGE):latest ./backend

build-frontend: ## Собрать frontend образ
	@echo "🔨 Собираю frontend образ..."
	docker build -t $(FRONTEND_IMAGE):$(TAG) -t $(FRONTEND_IMAGE):latest ./system-analyst-assessment

push: push-backend push-frontend ## Загрузить все образы в registry

push-backend: ## Загрузить backend образ в registry
	@echo "📤 Загружаю backend образ..."
	docker push $(BACKEND_IMAGE):$(TAG)
	docker push $(BACKEND_IMAGE):latest

push-frontend: ## Загрузить frontend образ в registry
	@echo "📤 Загружаю frontend образ..."
	docker push $(FRONTEND_IMAGE):$(TAG)
	docker push $(FRONTEND_IMAGE):latest

deploy: ## Автоматический деплой через GitHub Actions
	@echo "🚀 Запускаю автоматический деплой..."
	@echo "Сделайте push в ветку main для запуска CI/CD pipeline"
	@echo "Или запустите workflow вручную в GitHub Actions"

deploy-manual: ## Ручной деплой на сервер
	@echo "🚀 Запускаю ручной деплой..."
	@chmod +x scripts/deploy.sh
	@./scripts/deploy.sh production

dev: ## Запустить в режиме разработки
	@echo "🛠️ Запускаю в режиме разработки..."
	docker compose up -d

prod: ## Запустить production версию
	@echo "🚀 Запускаю production версию..."
	docker compose -f docker-compose.prod.yml up -d

up: dev ## Алиас для dev

down: ## Остановить все контейнеры
	@echo "🛑 Останавливаю контейнеры..."
	docker compose down
	docker compose -f docker-compose.prod.yml down

restart: down up ## Перезапустить контейнеры

status: ## Показать статус контейнеров
	@echo "📊 Статус контейнеров:"
	@docker compose ps
	@echo ""
	@echo "📊 Статус production контейнеров:"
	@docker compose -f docker-compose.prod.yml ps

logs: ## Показать логи всех сервисов
	@echo "📝 Логи всех сервисов:"
	@docker compose logs -f

logs-backend: ## Показать логи backend
	@echo "📝 Логи backend:"
	@docker compose logs -f backend

logs-frontend: ## Показать логи frontend
	@echo "📝 Логи frontend:"
	@docker compose logs -f frontend

logs-mongo: ## Показать логи MongoDB
	@echo "📝 Логи MongoDB:"
	@docker compose logs -f mongo

clean: ## Очистить все образы и volumes
	@echo "🧹 Очищаю Docker..."
	@docker compose down -v
	@docker compose -f docker-compose.prod.yml down -v
	@docker image prune -f
	@docker volume prune -f

test: ## Запустить тесты
	@echo "🧪 Запускаю тесты..."
	@cd backend && python -m pytest tests/ -v
	@cd system-analyst-assessment && npm test

install: ## Установить зависимости
	@echo "📦 Устанавливаю зависимости..."
	@cd backend && pip install -r requirements.txt
	@cd system-analyst-assessment && npm install

setup: install ## Установить зависимости и настроить проект
	@echo "⚙️ Настраиваю проект..."
	@cp backend/.env.example backend/.env 2>/dev/null || echo "Создайте backend/.env файл"
	@cp system-analyst-assessment/.env.example system-analyst-assessment/.env 2>/dev/null || echo "Создайте system-analyst-assessment/.env файл"

mongo-init: ## Инициализировать MongoDB с вопросами
	@echo "🗄️ Инициализирую MongoDB..."
	@docker exec survey-assessment-mongo-1 mongosh assessment --eval "db.questions.countDocuments()" || echo "MongoDB не запущен"

health: ## Проверить health check endpoints
	@echo "🏥 Проверяю health endpoints..."
	@curl -f http://localhost:8000/health || echo "Backend недоступен"
	@curl -f http://localhost:3000 || echo "Frontend недоступен"

# Команды для работы с Git
commit: ## Сделать коммит с текущими изменениями
	@echo "💾 Делаю коммит..."
	@git add .
	@git commit -m "Update: $(shell date +%Y-%m-%d_%H-%M-%S)"

push: ## Отправить изменения в remote
	@echo "📤 Отправляю изменения..."
	@git push origin main

pull: ## Получить изменения с remote
	@echo "📥 Получаю изменения..."
	@git pull origin main

# Команды для работы с Docker
images: ## Показать все образы
	@echo "🐳 Docker образы:"
	@docker images | grep -E "(survey|assessment)"

volumes: ## Показать volumes
	@echo "💾 Docker volumes:"
	@docker volume ls | grep survey

networks: ## Показать сети
	@echo "🌐 Docker сети:"
	@docker network ls | grep survey

# Команды для мониторинга
stats: ## Показать статистику использования ресурсов
	@echo "📊 Статистика использования ресурсов:"
	@docker stats --no-stream

top: ## Показать процессы в контейнерах
	@echo "📈 Процессы в контейнерах:"
	@docker compose top

# Команды для отладки
shell-backend: ## Открыть shell в backend контейнере
	@echo "🐚 Открываю shell в backend контейнере..."
	@docker compose exec backend /bin/bash

shell-frontend: ## Открыть shell во frontend контейнере
	@echo "🐚 Открываю shell во frontend контейнере..."
	@docker compose exec frontend /bin/sh

shell-mongo: ## Открыть shell в MongoDB контейнере
	@echo "🐚 Открываю shell в MongoDB контейнере..."
	@docker compose exec mongo mongosh assessment

# Команды для backup
backup: ## Создать backup MongoDB
	@echo "💾 Создаю backup MongoDB..."
	@mkdir -p backups
	@docker compose exec mongo mongodump --db assessment --out /tmp/backup
	@docker cp survey-assessment-mongo-1:/tmp/backup ./backups/backup_$(shell date +%Y%m%d_%H%M%S)
	@echo "Backup создан в ./backups/"

restore: ## Восстановить MongoDB из backup
	@echo "🔄 Восстанавливаю MongoDB из backup..."
	@echo "Укажите путь к backup директории: BACKUP_PATH=./backups/backup_YYYYMMDD_HHMMSS"
	@if [ -z "$(BACKUP_PATH)" ]; then echo "Ошибка: укажите BACKUP_PATH"; exit 1; fi
	@docker compose exec mongo mongorestore --db assessment --drop $(BACKUP_PATH)/assessment
