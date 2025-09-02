# Multi-stage build для оптимизации размера образа

# Stage 1: Build dependencies
FROM python:3.10-slim as builder

WORKDIR /app

# Устанавливаем системные зависимости для сборки
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements и устанавливаем зависимости
COPY requirements.txt ./
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime image
FROM python:3.10-slim as runtime

WORKDIR /app

# Принимаем build args для переменных окружения
ARG CORS_ORIGINS
ENV CORS_ORIGINS=$CORS_ORIGINS

# Копируем установленные зависимости из builder stage
COPY --from=builder /root/.local /root/.local

# Создаем пользователя для безопасности
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app

# Копируем код приложения
COPY ./app ./app

# Устанавливаем права доступа
RUN chown -R app:app /app

# Переключаемся на пользователя app
USER app

# Добавляем Python path
ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 