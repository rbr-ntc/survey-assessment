# 🗄️ DATABASE_SCHEMA — Hybrid модель (MongoDB + PostgreSQL)

## 🎯 Принцип выбора хранилищ (какую модель мы выбираем)

Мы **НЕ переводим текущий тест на Postgres прямо сейчас**. Сохраняем рабочее:

- **MongoDB** = “контентная” база (гибкие структуры, частые изменения схемы):

  - вопросы теста (как сейчас)
  - курсы/модули/уроки (контент, Markdown/MDX, блоки, JSON-конфиги практик)
  - квизы/вопросы (структуры разных типов)
  - практики (конфиги редакторов, эталонные решения, правила проверки)

- **PostgreSQL** = “регламентная/транзакционная” база (ACID, аналитика, связи, платежи):
  - пользователи, роли
  - подписки/покупки/платежи
  - enrolments (записи на курсы)
  - прогресс (lesson completion, streak, total time)
  - попытки квизов/практик и их результаты (можно хранить summary в Postgres, а детали — в Mongo)
  - аудит/soft delete, полнотекст, отчеты

**Ключевая идея:** Postgres хранит “кто/что/когда/сколько/имеет право”, Mongo хранит “что именно показываем/какой контент/какие вопросы”.

---

## 🧱 Обязательные “регламентные” требования (для Postgres)

- **ID**: UUIDv7 (time-sortable)
- **Soft delete**: `deleted_at TIMESTAMPTZ NULL`
- **Audit**: `created_at`, `updated_at`, `created_by`, `updated_by`
- **API versioning**: `/api/v1/...`

---

## 🐘 PostgreSQL (сущности управления)

### 1) users

- **Назначение**: аккаунт/идентичность/роль/профиль-минимум
- **Важное**: email unique, password hash, role

Поля (минимум):

- `id uuid PRIMARY KEY` (uuidv7)
- `email text UNIQUE NOT NULL`
- `password_hash text NULL` (если OAuth-only)
- `name text NOT NULL`
- `role text NOT NULL` (`student|author|admin`)
- `email_verified boolean NOT NULL DEFAULT false`
- `created_at`, `updated_at`, `deleted_at`
- `created_by`, `updated_by` (uuid, nullable)

### 2) auth_refresh_tokens (или sessions)

- `id uuid PK`
- `user_id uuid FK -> users(id)`
- `token_hash text NOT NULL`
- `expires_at timestamptz NOT NULL`
- `revoked_at timestamptz NULL`
- `created_at`, `updated_at`, `deleted_at`

### 3) categories (категории каталога)

- `id uuid PK`
- `name text NOT NULL`
- `slug text UNIQUE NOT NULL`
- `created_at`, `updated_at`, `deleted_at`

### 4) tracks (учебные треки)

- `id uuid PK`
- `category_id uuid FK -> categories(id)`
- `name text NOT NULL`
- `description text NULL`
- `created_at`, `updated_at`, `deleted_at`

### 5) courses (метаданные курса)

Контент самого курса (описания блоков) — в Mongo, а в Postgres держим “каталожную карточку” и управление доступами.

- `id uuid PK`
- `content_id text NOT NULL` (ссылка на Mongo `_id`/slug, см. ниже)
- `category_id uuid FK`
- `level text NOT NULL` (`Beginner|Elementary|Intermediate|Advanced|Expert`)
- `status text NOT NULL` (`draft|published|archived`)
- `price_cents int NULL` (если разовая покупка)
- `created_at`, `updated_at`, `deleted_at`

### 6) enrollments (запись на курс)

- `id uuid PK`
- `user_id uuid FK`
- `course_id uuid FK`
- `status text NOT NULL` (`active|completed|cancelled`)
- `enrolled_at timestamptz NOT NULL`
- `completed_at timestamptz NULL`
- `created_at`, `updated_at`, `deleted_at`

### 7) lesson_progress (уроки пройдены/закладки/заметки)

Урок как контент — в Mongo, здесь ссылка на `lesson_content_id`.

- `id uuid PK`
- `user_id uuid FK`
- `course_id uuid FK`
- `lesson_content_id text NOT NULL` (Mongo lesson id/slug)
- `status text NOT NULL` (`started|completed`)
- `completed_at timestamptz NULL`
- `bookmarked boolean NOT NULL DEFAULT false`
- `note text NULL`
- `created_at`, `updated_at`, `deleted_at`

### 8) quiz_attempts (попытки квизов)

Квиз/вопросы — в Mongo, но попытка и итог — в Postgres (для статистики/лицензий).

- `id uuid PK`
- `user_id uuid FK`
- `course_id uuid FK NULL`
- `quiz_content_id text NOT NULL` (Mongo quiz id)
- `attempt_no int NOT NULL`
- `started_at timestamptz NOT NULL`
- `submitted_at timestamptz NULL`
- `score int NOT NULL DEFAULT 0`
- `max_score int NOT NULL DEFAULT 0`
- `passed boolean NOT NULL DEFAULT false`
- `details_ref text NULL` (ссылка на Mongo документ с ответами/деталями, если нужно)
- `created_at`, `updated_at`, `deleted_at`

### 9) achievements + user_achievements

Достижения как справочник в Postgres (правила можно держать JSONB):

- `achievements(id, code, title, description, rarity, rule jsonb, created_at...)`
- `user_achievements(id, user_id, achievement_id, awarded_at, context jsonb, ...)`

### 10) subscriptions + payments

Как в ТЗ: Stripe/ЮKassa и webhooks.

---

## 🍃 MongoDB (контент и тесты)

### A) questions (как сейчас)

Документы из `improved-test-questions.json` уже подходят:

- `id` (string)
- `category`, `type`, `question`, `options[]`

### B) course_content

Пример:

```json
{
	"_id": "course:rest-api-design",
	"title": "REST API Design",
	"level": "Elementary",
	"description": "...",
	"modules": [
		{
			"id": "m1",
			"title": "...",
			"order": 1,
			"lessons": ["lesson:...", "lesson:..."]
		}
	],
	"updated_at": "2025-12-14T00:00:00Z"
}
```

### C) lesson_content

```json
{
	"_id": "lesson:rest-intro",
	"course_id": "course:rest-api-design",
	"title": "Введение",
	"content_mdx": "...",
	"blocks": [{ "type": "callout", "data": {} }]
}
```

### D) quiz_content / practice_content

Храним гибкие типы вопросов и конфиги редакторов (JSON/SQL/API tester/etc).

---

## 🔗 Как связываем Mongo и Postgres

- В Postgres храним `content_id` / `lesson_content_id` / `quiz_content_id` как **строки** (stable IDs).
- Это позволяет менять Mongo схему без миграций Postgres.
- Для аналитики и прав доступа используем Postgres `user_id`, `course_id`, `enrollment`.

---

## ✅ MVP-срез (минимально, чтобы стартануть “кабинет + тест”)

1. Postgres: `users`, `auth_refresh_tokens`, `enrollments` (опционально), `quiz_attempts` (summary)
2. Mongo: текущие `questions`, плюс минимум `course_content` (1 “курс-тест”)
3. API:
   - Auth: `/api/v1/auth/*`
   - Test/quiz: `/api/v1/quizzes/...` (прокидываем в текущую логику)
   - Profile: `/api/v1/users/me`
