# Простой Dockerfile для отладки
FROM python:3.10-slim

WORKDIR /app

# Принимаем build args для переменных окружения
ARG CORS_ORIGINS
ENV CORS_ORIGINS=$CORS_ORIGINS

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements и устанавливаем зависимости
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код приложения
COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 