# Backend (FastAPI + MongoDB)

## Описание

Бэкенд реализует REST API для:

- Получения списка вопросов (без весов и баллов)
- Приёма и расчёта результатов теста
- Генерации AI-рекомендаций
- Сохранения истории прохождений

## Структура

- `app/main.py` — точка входа FastAPI
- `app/models.py` — Pydantic-модели
- `app/db.py` — подключение к MongoDB
- `app/routers/questions.py` — ручки для вопросов
- `app/routers/results.py` — ручки для результатов
- `app/routers/recommendations.py` — AI-рекомендации

## Запуск

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

MongoDB должен быть запущен локально или доступен по переменной окружения `MONGO_URL`.
