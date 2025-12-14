# 🚀 Быстрый старт: Разделение Frontend и Backend

## 📦 Что было подготовлено

1. **SEPARATION_PLAN.md** - Полный план разделения с детальными инструкциями
2. **DEPLOYMENT_CHECKLIST.md** - Пошаговый чеклист для деплоя
3. **ENV_EXAMPLES.md** - Примеры всех переменных окружения
4. **vercel.json** - Конфигурация для Vercel
5. **railway.json** и **railway.toml** - Конфигурация для Railway
6. **Dockerfile** - Обновлен для поддержки переменной PORT

---

## 🎯 Краткий план действий

### 1️⃣ Backend на Railway (сначала!)

1. Зайдите на [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Root Directory: `backend`
4. Добавьте MongoDB (New → Database → MongoDB)
5. Добавьте переменные окружения (см. ENV_EXAMPLES.md)
6. Скопируйте URL бэкенда (например: `https://your-backend.railway.app`)

### 2️⃣ Frontend на Vercel (потом!)

1. Зайдите на [vercel.com](https://vercel.com)
2. Add New Project → Import Git Repository
3. Root Directory: `system-analyst-assessment`
4. Добавьте переменные окружения:
   - `NEXT_PUBLIC_API_URL` = URL бэкенда с Railway
   - `NEXT_PUBLIC_API_KEY` = должен совпадать с `API_KEY` на Railway
   - `NEXT_PUBLIC_ENABLE_QUICK_TEST` = `true` или `false`

### 3️⃣ Интеграция

1. Скопируйте URL фронтенда с Vercel
2. Вернитесь в Railway → Backend → Variables
3. Обновите `CORS_ORIGINS`: добавьте URL фронтенда
4. Проверьте работу приложения

---

## 🔑 Ключевые переменные

### Frontend (Vercel):
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_API_KEY=your-api-key-here
NEXT_PUBLIC_ENABLE_QUICK_TEST=true
```

### Backend (Railway):
```bash
API_KEY=your-api-key-here  # Должен совпадать с NEXT_PUBLIC_API_KEY!
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=sk-proj-...
MONGO_URL=mongodb://...
CORS_ORIGINS=https://your-frontend.vercel.app
ENABLE_QUICK_TEST=true
```

---

## ⚠️ Важно!

1. **API_KEY должен совпадать** на фронтенде и бэкенде
2. **CORS_ORIGINS** должен включать URL вашего фронтенда
3. **Деплойте бэкенд первым**, чтобы получить его URL
4. **SSL сертификаты** выдаются автоматически на обеих платформах

---

## 📚 Подробные инструкции

- **Полный план:** `SEPARATION_PLAN.md`
- **Чеклист:** `DEPLOYMENT_CHECKLIST.md`
- **Примеры переменных:** `ENV_EXAMPLES.md`

---

**Удачи с деплоем! 🎉**

