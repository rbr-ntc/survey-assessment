# Простой Dockerfile для отладки
FROM node:18-alpine

WORKDIR /app

# Принимаем build args для переменных окружения
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_KEY
ARG NEXT_PUBLIC_ENABLE_QUICK_TEST

# Устанавливаем переменные окружения во время сборки
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY
ENV NEXT_PUBLIC_ENABLE_QUICK_TEST=$NEXT_PUBLIC_ENABLE_QUICK_TEST

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Запускаем
EXPOSE 3000

CMD ["npm", "start"] 