# Инструкция по созданию новых GitHub репозиториев

## 🎯 Цель

Создать два новых репозитория на GitHub для разделенного проекта:

- `survey-assessment-backend`
- `survey-assessment-frontend`

---

## 📋 Вариант 1: Через веб-интерфейс GitHub

### Шаг 1: Создание Backend репозитория

1. Зайдите на [GitHub](https://github.com)
2. Нажмите кнопку **"+"** в правом верхнем углу → **"New repository"**
3. Заполните форму:
   - **Repository name:** `survey-assessment-backend`
   - **Description:** `FastAPI backend for System Analyst Assessment with AI recommendations`
   - **Visibility:** Выберите Private или Public
   - **НЕ** инициализируйте с README, .gitignore или лицензией (мы уже подготовили файлы)
4. Нажмите **"Create repository"**
5. Скопируйте SSH URL репозитория (например: `git@github.com:YOUR_USERNAME/survey-assessment-backend.git`)

### Шаг 2: Создание Frontend репозитория

1. Повторите шаги из Шага 1, но с другими данными:
   - **Repository name:** `survey-assessment-frontend`
   - **Description:** `Next.js frontend for System Analyst Assessment`
   - **Visibility:** Выберите Private или Public
   - **НЕ** инициализируйте с README, .gitignore или лицензией
2. Нажмите **"Create repository"**
3. Скопируйте SSH URL репозитория (например: `git@github.com:YOUR_USERNAME/survey-assessment-frontend.git`)

---

## 📋 Вариант 2: Через GitHub CLI (gh)

Если у вас установлен GitHub CLI:

### Backend репозиторий:

```bash
gh repo create survey-assessment-backend \
  --description "FastAPI backend for System Analyst Assessment with AI recommendations" \
  --private  # или --public
```

### Frontend репозиторий:

```bash
gh repo create survey-assessment-frontend \
  --description "Next.js frontend for System Analyst Assessment" \
  --private  # или --public
```

---

## 🚀 После создания репозиториев

### Для Backend:

```bash
# Перейдите в подготовленную директорию
cd ../survey-assessment-backend

# Инициализируйте git (если еще не сделано)
git init

# Добавьте все файлы
git add .

# Сделайте первый коммит
git commit -m "Initial commit: Backend repository"

# Добавьте remote
git remote add origin git@github.com:YOUR_USERNAME/survey-assessment-backend.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Запушьте код
git push -u origin main
```

### Для Frontend:

```bash
# Перейдите в подготовленную директорию
cd ../survey-assessment-frontend

# Инициализируйте git (если еще не сделано)
git init

# Добавьте все файлы
git add .

# Сделайте первый коммит
git commit -m "Initial commit: Frontend repository"

# Добавьте remote
git remote add origin git@github.com:YOUR_USERNAME/survey-assessment-frontend.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Запушьте код
git push -u origin main
```

---

## 🔄 Сохранение истории коммитов (опционально)

Если вы хотите сохранить историю коммитов из оригинального репозитория:

### Для Backend:

```bash
cd ../survey-assessment-backend

# Добавьте оригинальный репозиторий как remote
git remote add old-origin git@github.com:rbr-ntc/survey-assessment.git

# Получите историю
git fetch old-origin

# Создайте новую ветку с историей только для backend файлов
git filter-branch --subdirectory-filter backend -- --all

# Удалите старый remote
git remote remove old-origin

# Запушьте в новый репозиторий
git push -u origin main
```

### Для Frontend:

```bash
cd ../survey-assessment-frontend

# Добавьте оригинальный репозиторий как remote
git remote add old-origin git@github.com:rbr-ntc/survey-assessment.git

# Получите историю
git fetch old-origin

# Создайте новую ветку с историей только для frontend файлов
git filter-branch --subdirectory-filter system-analyst-assessment -- --all

# Удалите старый remote
git remote remove old-origin

# Запушьте в новый репозиторий
git push -u origin main
```

**Примечание:** `git filter-branch` может быть медленным для больших репозиториев. Альтернатива - использовать `git filter-repo` (требует установки).

---

## ✅ Проверка

После пуша проверьте:

1. **Backend репозиторий:**

   - ✅ Все файлы из `backend/` присутствуют
   - ✅ `.gitignore` настроен правильно
   - ✅ `README.md` обновлен
   - ✅ `requirements.txt` присутствует

2. **Frontend репозиторий:**
   - ✅ Все файлы из `system-analyst-assessment/` присутствуют
   - ✅ `.gitignore` настроен правильно
   - ✅ `README.md` обновлен
   - ✅ `package.json` присутствует

---

## 🔐 Настройка секретов (для CI/CD)

После создания репозиториев, если планируете использовать CI/CD:

### Backend (Railway):

- Секреты будут настроены в Railway, а не в GitHub

### Frontend (Vercel):

- Секреты будут настроены в Vercel, а не в GitHub

Если нужен GitHub Actions для других целей, добавьте секреты в:

- Settings → Secrets and variables → Actions → New repository secret

---

## 📝 Следующие шаги

После создания репозиториев:

1. ✅ Настроить деплой Backend на Railway
2. ✅ Настроить деплой Frontend на Vercel
3. ✅ Обновить переменные окружения
4. ✅ Протестировать интеграцию

---

**Готово! 🎉**
