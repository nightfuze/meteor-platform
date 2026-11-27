# Платформа для многопользовательских браузерных игр

Лабораторная работа №6 по дисциплине «Методы и средства проектирования информационных систем и технологий».  
Студент: Васильев Д.С., группа ИСТбд-41.

Версия 0.0.6. Журнал версий в [CHANGELOG.md](./CHANGELOG.md).

## Требования

- Docker с Docker Compose
- Для локальной разработки и заполнения базы данных: Bun 1.4.5

## Запуск

Приложение запускается из опубликованного образа `nightfuze/mispisit-lab1:0.0.6`.
Файл `.env` нужно заполнить: значения по умолчанию заданы в `compose.yml`.

```bash
docker compose up -d
```

При старте контейнера приложения автоматически применяются миграции MongoDB.

Платформа: http://localhost:8000

Остановить сервисы:

```bash
docker compose down
```

Удалить данные MongoDB:

```bash
docker compose down -v
```

## Резервная копия и восстановление

Копия сохраняется в `backup/app.archive`.

```bash
docker compose run --rm backup
```

Восстановление в чистую базу:

```bash
docker compose down -v
docker compose up -d mongo
docker compose run --rm restore
docker compose up -d
```

Сервисы `backup` и `restore` не запускаются при обычном `docker compose up -d`: у них профиль `tools`.

## Локальная разработка

Установите зависимости из корня проекта:

```bash
bun install
cp .env.example .env
```

Запустите MongoDB и Mongo Express:

```bash
docker compose -f compose.dev.yml up -d
```

Dev запуск платформы и Storybook:

```bash
bun dev:platform
bun dev:storybook
```

## Сборка и предпросмотр Storybook

```bash
bun build:storybook
bun preview:storybook
```

Storybook запускается локально.

## Заполнение базы тестовыми данными

Сначала установите зависимости и примените миграции из корня проекта:

```bash
bun install
bun run db:migrate
```

Проверить применённые миграции:

```bash
bun run db:migrate:status
```

Затем заполните базу:

```bash
bun db:seed
```
