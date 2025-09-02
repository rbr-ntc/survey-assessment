FROM python:3.10-slim

WORKDIR /app

# Принимаем build args для переменных окружения
ARG CORS_ORIGINS

# Устанавливаем переменные окружения во время сборки
ENV CORS_ORIGINS=$CORS_ORIGINS

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

# Создаем пользователя для безопасности
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 