# Multi-stage build для оптимизации размера образа
# Основано на официальной документации Next.js

# Stage 1: Build dependencies
FROM node:18-alpine AS deps

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev для сборки)
RUN npm ci

# Stage 2: Build application
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем зависимости из deps stage
COPY --from=deps /app/node_modules ./node_modules

# Копируем исходный код
COPY . .

# Принимаем build args для переменных окружения
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_KEY

# Устанавливаем переменные окружения во время сборки
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY

# Собираем приложение
RUN npm run build

# Stage 3: Production runtime
FROM node:18-alpine AS runner

WORKDIR /app

# Устанавливаем curl для health check
RUN apk add --no-cache curl

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем собранное приложение из builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Устанавливаем права доступа
RUN chown -R nextjs:nodejs /app

# Переключаемся на пользователя nextjs
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check с curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"] 