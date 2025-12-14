#!/bin/bash

# Скрипт для подготовки Frontend репозитория
# Использование: ./scripts/prepare-frontend-repo.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/system-analyst-assessment"
NEW_REPO_DIR="$PROJECT_ROOT/../survey-assessment-frontend"

echo "🚀 Подготовка Frontend репозитория..."

# Создаем новую директорию для репозитория
if [ -d "$NEW_REPO_DIR" ]; then
    echo "⚠️  Директория $NEW_REPO_DIR уже существует. Удаляем..."
    rm -rf "$NEW_REPO_DIR"
fi

mkdir -p "$NEW_REPO_DIR"
cd "$NEW_REPO_DIR"

echo "📦 Копирование файлов из system-analyst-assessment/..."

# Копируем все файлы из frontend
cp -r "$FRONTEND_DIR"/* "$NEW_REPO_DIR/" 2>/dev/null || true
cp -r "$FRONTEND_DIR"/.??* "$NEW_REPO_DIR/" 2>/dev/null || true

# Убеждаемся, что .gitignore существует
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files
.env*
!.env.example

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF
fi

# Обновляем README.md
cat > README.md << 'EOF'
# Survey Assessment Frontend

Next.js frontend для системы оценки системных аналитиков.

## 🚀 Технологии

- **Next.js 14** - React фреймворк
- **React** - UI библиотека
- **Tailwind CSS** - стилизация
- **shadcn/ui** - UI компоненты

## 📋 Требования

- Node.js 18+
- npm или yarn

## 🔧 Установка

```bash
# Установить зависимости
npm install
# или
yarn install
# или
pnpm install
```

## ⚙️ Настройка

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=your-secret-api-key
NEXT_PUBLIC_ENABLE_QUICK_TEST=true
```

**Важно:** Переменные, начинающиеся с `NEXT_PUBLIC_`, доступны в браузере.

## 🏃 Запуск

```bash
# Режим разработки
npm run dev
# или
yarn dev
# или
pnpm dev

# Сборка для продакшена
npm run build

# Запуск продакшен сборки
npm start
```

Приложение будет доступно по адресу: `http://localhost:3000`

## 🐳 Docker

```bash
# Сборка образа
docker build -t survey-assessment-frontend .

# Запуск контейнера
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  -e NEXT_PUBLIC_API_KEY=your-api-key \
  survey-assessment-frontend
```

## 🧪 Тестирование

```bash
# Запуск линтера
npm run lint

# Проверка типов (если используется TypeScript)
npm run type-check
```

## 📁 Структура проекта

```
src/
├── app/              # Next.js App Router
│   ├── layout.js     # Корневой layout
│   ├── page.js       # Главная страница
│   └── result/       # Страница результатов
├── components/       # React компоненты
│   ├── AssessmentContext.js
│   ├── QuestionScreen.js
│   ├── ResultsScreen.js
│   └── ui/           # UI компоненты
└── lib/              # Утилиты и константы
    ├── categories.js
    └── questions.js
```

## 🎨 Стилизация

Проект использует Tailwind CSS для стилизации. Конфигурация находится в `tailwind.config.js`.

## 🚀 Деплой на Vercel

1. Создайте проект на [Vercel](https://vercel.com)
2. Подключите этот репозиторий
3. Установите Root Directory: `.` (корень репозитория)
4. Добавьте переменные окружения:
   - `NEXT_PUBLIC_API_URL` - URL вашего бэкенда
   - `NEXT_PUBLIC_API_KEY` - API ключ (должен совпадать с бэкендом)
   - `NEXT_PUBLIC_ENABLE_QUICK_TEST` - включить быстрый тест
5. Vercel автоматически задеплоит приложения

## 🔗 Интеграция с Backend

Frontend подключается к Backend через переменную `NEXT_PUBLIC_API_URL`.

Убедитесь, что:
- Backend доступен по указанному URL
- CORS настроен на бэкенде для разрешения запросов с фронтенда
- `NEXT_PUBLIC_API_KEY` совпадает с `API_KEY` на бэкенде

## 📝 Лицензия

MIT
EOF

echo "✅ Frontend репозиторий подготовлен в: $NEW_REPO_DIR"
echo ""
echo "📝 Следующие шаги:"
echo "1. cd $NEW_REPO_DIR"
echo "2. git init"
echo "3. git add ."
echo "4. git commit -m 'Initial commit: Frontend repository'"
echo "5. Создайте новый репозиторий на GitHub"
echo "6. git remote add origin git@github.com:YOUR_USERNAME/survey-assessment-frontend.git"
echo "7. git push -u origin main"

