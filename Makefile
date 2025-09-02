# Makefile для System Analyst Assessment
# Автоматизация основных задач

.PHONY: help install test build clean deploy-local deploy-prod

# Цвета для вывода
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Показать справку по командам
	@echo "$(GREEN)Доступные команды:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Установить зависимости для backend и frontend
	@echo "$(GREEN)Устанавливаем зависимости...$(NC)"
	@cd backend && pip install -r requirements.txt
	@cd system-analyst-assessment && npm install

test: ## Запустить тесты
	@echo "$(GREEN)Запускаем тесты...$(NC)"
	@cd backend && pytest -v
	@cd system-analyst-assessment && npm run build

build: ## Собрать Docker образы
	@echo "$(GREEN)Собираем Docker образы...$(NC)"
	@docker compose build

clean: ## Очистить Docker контейнеры и образы
	@echo "$(GREEN)Очищаем Docker...$(NC)"
	@docker compose down --rmi all --volumes --remove-orphans
	@docker system prune -f

deploy-local: ## Запустить локально
	@echo "$(GREEN)Запускаем локально...$(NC)"
	@docker compose up -d

deploy-prod: ## Деплой в production (требует настройки)
	@echo "$(RED)Деплой в production через GitHub Actions$(NC)"
	@echo "Проверьте статус: https://github.com/rbr-ntc/survey-assessment/actions"

logs: ## Показать логи
	@echo "$(GREEN)Логи контейнеров:$(NC)"
	@docker compose logs -f

status: ## Статус контейнеров
	@echo "$(GREEN)Статус контейнеров:$(NC)"
	@docker compose ps

restart: ## Перезапустить контейнеры
	@echo "$(GREEN)Перезапускаем контейнеры...$(NC)"
	@docker compose restart

health: ## Проверить здоровье сервисов
	@echo "$(GREEN)Проверяем здоровье сервисов...$(NC)"
	@curl -f http://localhost:8000/health || echo "$(RED)Backend недоступен$(NC)"
	@curl -f http://localhost:3000/ || echo "$(RED)Frontend недоступен$(NC)"
