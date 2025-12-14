# 🚀 Быстрый старт: Разделение репозиториев

## Шаг 1: Подготовка репозиториев

Запустите скрипты для подготовки:

```bash
# Подготовить Backend репозиторий
./scripts/prepare-backend-repo.sh

# Подготовить Frontend репозиторий
./scripts/prepare-frontend-repo.sh
```

Это создаст две новые директории:

- `../survey-assessment-backend/`
- `../survey-assessment-frontend/`

---

## Шаг 2: Создание GitHub репозиториев

Следуйте инструкциям в `GITHUB_REPOS_SETUP.md`:

1. Создайте два новых репозитория на GitHub:

   - `survey-assessment-backend`
   - `survey-assessment-frontend`

2. Или используйте GitHub CLI:
   ```bash
   gh repo create survey-assessment-backend --private --description "FastAPI backend"
   gh repo create survey-assessment-frontend --private --description "Next.js frontend"
   ```

---

## Шаг 3: Инициализация и пуш

### Backend:

```bash
cd ../survey-assessment-backend
git init
git add .
git commit -m "Initial commit: Backend repository"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/survey-assessment-backend.git
git push -u origin main
```

### Frontend:

```bash
cd ../survey-assessment-frontend
git init
git add .
git commit -m "Initial commit: Frontend repository"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/survey-assessment-frontend.git
git push -u origin main
```

---

## ✅ Готово!

Теперь у вас два независимых репозитория, готовых к деплою на Railway и Vercel.

**Следующие шаги:**

- Настроить деплой Backend на Railway (см. `SEPARATION_PLAN.md`)
- Настроить деплой Frontend на Vercel (см. `SEPARATION_PLAN.md`)
