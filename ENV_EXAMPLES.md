# Примеры переменных окружения

## 🔵 Frontend (Vercel)

Скопируйте эти переменные в Settings → Environment Variables на Vercel:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_API_KEY=your-secret-api-key-min-32-chars
NEXT_PUBLIC_ENABLE_QUICK_TEST=true
```

### Пример с кастомным доменом:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_KEY=your-secret-api-key-min-32-chars
NEXT_PUBLIC_ENABLE_QUICK_TEST=true
```

---

## 🔴 Backend (Railway)

Скопируйте эти переменные в Settings → Variables на Railway:

```bash
# API Configuration
API_KEY=your-secret-api-key-min-32-chars
SECRET_KEY=your-very-secret-jwt-key-min-64-chars-use-random-generator

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-5.2-mini
OPENAI_MAX_TOKENS=4000
OPENAI_REASONING_EFFORT=medium

# Database (Railway MongoDB или MongoDB Atlas)
MONGO_URL=mongodb://username:password@host:port/database?authSource=admin

# CORS - ВАЖНО: укажите URL вашего фронтенда на Vercel!
CORS_ORIGINS=https://your-app.vercel.app,https://yourdomain.com

# Features
ENABLE_QUICK_TEST=true

# Optional
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
LOG_LEVEL=INFO
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Пример с кастомными доменами:
```bash
# API Configuration
API_KEY=your-secret-api-key-min-32-chars
SECRET_KEY=your-very-secret-jwt-key-min-64-chars

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-5.2-mini
OPENAI_MAX_TOKENS=4000
OPENAI_REASONING_EFFORT=medium

# Database
MONGO_URL=mongodb://username:password@host:port/database?authSource=admin

# CORS - укажите все возможные домены фронтенда
CORS_ORIGINS=https://your-app.vercel.app,https://www.yourdomain.com,https://yourdomain.com

# Features
ENABLE_QUICK_TEST=true

# Optional
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
LOG_LEVEL=INFO
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 🔑 Генерация секретных ключей

### API_KEY (минимум 32 символа):
```bash
# Linux/Mac
openssl rand -hex 32

# Или используйте онлайн генератор
# https://www.random.org/strings/
```

### SECRET_KEY (минимум 64 символа, для JWT):
```bash
# Linux/Mac
openssl rand -hex 64

# Или используйте онлайн генератор
# https://www.random.org/strings/
```

---

## ⚠️ Важные замечания

1. **API_KEY должен совпадать:**
   - `NEXT_PUBLIC_API_KEY` на Vercel = `API_KEY` на Railway

2. **CORS_ORIGINS должен включать все домены фронтенда:**
   - URL Vercel (например: `https://your-app.vercel.app`)
   - Кастомный домен (если есть: `https://yourdomain.com`)
   - Разделяйте несколько доменов запятой

3. **MONGO_URL формат:**
   - Railway MongoDB: будет автоматически предоставлен при создании сервиса
   - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

4. **Никогда не коммитьте эти значения в Git!**

