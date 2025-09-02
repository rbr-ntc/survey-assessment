FROM python:3.10-slim

WORKDIR /app

# Принимаем build args для переменных окружения
ARG CORS_ORIGINS

# Устанавливаем переменные окружения во время сборки
ENV CORS_ORIGINS=$CORS_ORIGINS

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 