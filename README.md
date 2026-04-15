# 🎮 Alias Game

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5+-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)

Многопользовательская онлайн-игра "Alias" (Объясни слово) на Next.js с PostgreSQL. Игроки объясняют слова своей команде, зарабатывая очки за угаданные слова.

## 🌐 Демо

**[🎮 Играть онлайн](https://alias-game-lyart.vercel.app/)**

## 🚀 Особенности

- **Next.js 16+** с App Router
- **Полная TypeScript** поддержка
- **10 категорий слов** с более чем 600 словами
- **2-4 команды** по 2-6 игроков в каждой
- **Настраиваемое время раунда** (30-120 секунд)
- **Гибкие условия победы** (25-100 очков)
- **Система подсчёта очков** с опциональными штрафами
- **Звуковые оповещения** об окончании времени
- **История игр** с сохранением по сессиям
- **Адаптивный дизайн** для всех устройств

## 📂 Структура проекта

```
└── 📁alias-game
    └── 📁app
        └── 📁api
            └── 📁categories
                ├── route.ts
            └── 📁games
                └── 📁[id]
                    └── 📁rounds
                        ├── route.ts
                    └── 📁words
                        ├── route.ts
                    ├── route.ts
                ├── route.ts
        └── 📁game
            └── 📁[id]
                ├── page.tsx
        └── 📁history
            ├── page.tsx
        └── 📁new-game
            ├── page.tsx
        └── 📁results
            └── 📁[id]
                ├── page.tsx
        ├── favicon.ico
        ├── globals.css
        ├── layout.tsx
        ├── page.tsx
    └── 📁components
        ├── GameBoard.tsx
        ├── GameSetup.tsx
        ├── ResultsView.tsx
    └── 📁lib
        ├── prisma.ts
    └── 📁prisma
        └── 📁migrations
        ├── schema.prisma
        ├── seed.ts
    └── 📁types
        ├── game.ts
    ├── .env
    ├── .gitignore
    ├── next.config.ts
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

## 🛠 Установка

1. Клонировать репозиторий:

```bash
git clone <repository-url>
cd alias-game
```

2. Установить зависимости:

```bash
npm install
```

3. Настроить окружение:

Создайте файл `.env` в корне проекта:

```ini
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Optional: для production
POSTGRES_PRISMA_URL="postgresql://user:password@host:5432/database?sslmode=require&pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:5432/database?sslmode=require"
```

**Получение DATABASE_URL:**

**Вариант A: Через Vercel (рекомендуется)**

1. Зайдите на [vercel.com](https://vercel.com) → ваш проект
2. Перейдите в **Storage** → **Create Database** → **Postgres (Neon)**
3. После создания БД, перейдите в **.env.local** tab
4. Скопируйте все переменные и вставьте в ваш локальный `.env` файл

**Вариант B: Напрямую через Neon**

1. Зарегистрируйтесь на [neon.tech](https://neon.tech)
2. Создайте новый проект
3. Скопируйте Connection String из раздела "Connection Details"

4. Настроить базу данных:

```bash
# Примените миграции
npx prisma migrate deploy

# Заполните БД начальными данными (10 категорий, 600+ слов)
npx prisma db seed
```

5. Запустить проект:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🔧 Конфигурация

Обязательные переменные окружения (`.env`):

```ini
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Optional: для production
POSTGRES_PRISMA_URL="postgresql://user:password@host:5432/database?sslmode=require&pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:5432/database?sslmode=require"
```

## 🧩 Основные технологии

- **Frontend**:
  ![Next.js](https://img.shields.io/badge/-Next.js-000?logo=next.js)
  ![React](https://img.shields.io/badge/-React-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript)
- **Стили**:
  ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css)
- **База данных**:
  ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql)
  ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma)
- **Deployment**:
  ![Vercel](https://img.shields.io/badge/-Vercel-000?logo=vercel)

## 🌐 API Endpoints

| Метод  | Путь                     | Описание                    |
| ------ | ------------------------ | --------------------------- |
| GET    | /api/games?sessionId=xxx | Получить все игры сессии    |
| POST   | /api/games               | Создать новую игру          |
| GET    | /api/games/[id]          | Получить игру по ID         |
| DELETE | /api/games/[id]          | Удалить игру                |
| POST   | /api/games/[id]/rounds   | Сохранить результаты раунда |
| GET    | /api/games/[id]/words    | Получить слова для раунда   |
| GET    | /api/categories          | Получить все категории      |

## 🎯 Игровой процесс

### 1. Создание игры

- Выберите количество команд (2-4)
- Добавьте игроков в каждую команду (2-6 игроков)
- Настройте время раунда (30-120 секунд)
- Установите очки для победы (25-100)
- Выберите категории слов
- Включите/выключите штраф за пропуск

### 2. Раунд

- Игрок объясняет слова своей команде
- Нажмите "Угадано" (+1 очко) или "Пропустить" (-1 очко при включенном штрафе)
- Используйте паузу при необходимости
- Раунд завершается по истечении времени или нажатию "Завершить раунд"

### 3. Результаты

- Просмотр таблицы счёта
- История всех раундов
- Определение победителя при достижении целевого счёта

### 4. История

- Все игры сохраняются по sessionId
- Просмотр завершённых игр
- Удаление старых игр

## 📚 Категории слов

Игра включает **10 категорий** с более чем **600 словами**:

| №   | Категория            | Количество слов |
| --- | -------------------- | --------------- |
| 1   | Животные             | 91              |
| 2   | Еда и напитки        | 76              |
| 3   | Профессии            | 60              |
| 4   | Спорт                | 52              |
| 5   | Путешествия и страны | 66              |
| 6   | Фильмы и сериалы     | 64              |
| 7   | Природа              | 71              |
| 8   | Быт и предметы       | 68              |
| 9   | Действия             | 62              |
| 10  | Абстрактные понятия  | 51              |

## 🗄️ База данных

Проект использует **Prisma ORM** со следующей схемой:

- **Category** - Категории слов
- **Word** - Слова с привязкой к категориям
- **Game** - Игровые сессии
- **Team** - Команды в игре
- **Player** - Игроки в командах
- **Round** - Раунды игры
- **RoundWord** - Результаты слов в раунде

### Полезные команды Prisma

```bash
# Открыть Prisma Studio (GUI для БД)
npx prisma studio

# Создать новую миграцию
npx prisma migrate dev --name migration_name

# Применить миграции в production
npx prisma migrate deploy

# Сгенерировать Prisma Client
npx prisma generate

# Пересоздать БД и применить seed
npx prisma migrate reset
```

## 🌐 Деплой на Vercel

### 1. Подготовка

- Убедитесь, что база данных Neon настроена
- Все переменные окружения готовы

### 2. Деплой через Vercel CLI

```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel

# Production деплой
vercel --prod
```

### 3. Деплой через Vercel Dashboard

- Импортируйте проект с GitHub
- Добавьте переменные окружения:
  - `DATABASE_URL`
  - `POSTGRES_PRISMA_URL` (опционально)
  - `POSTGRES_URL_NON_POOLING` (опционально)
- Vercel автоматически определит Next.js и настроит build

### 4. После деплоя

```bash
# Примените миграции к production БД
npx prisma migrate deploy

# Заполните БД данными (если нужно)
npx prisma db seed
```

## 📝 Разработка

```bash
# Запуск dev сервера
npm run dev

# Build для production
npm run build

# Запуск production сборки
npm start

# Линтинг
npm run lint
```

## 🐛 Решение проблем

### ❌ "Environment variable not found: DATABASE_URL"

**Решение:** Создайте файл `.env` в корне проекта и заполните `DATABASE_URL`

### ❌ "Error: P1001: Can't reach database server"

**Решение:**

- Проверьте правильность `DATABASE_URL`
- Для Neon: убедитесь, что проект активен (не в режиме Sleep)

### ❌ "Cannot find module '@prisma/client'"

**Решение:**

```bash
npx prisma generate
```

### ❌ Пустой список категорий

**Решение:**

```bash
npx prisma db seed
```

## 📄 Лицензия

Этот проект создан для образовательных целей.

---

> **Pet-project** разработан с ❤️ для изучения современных веб-технологий
