# Платформа для многопользовательских браузерных игр

Лабораторная работа №4 по дисциплине «Методы и средства проектирования информационных систем и технологий».  
Студент: Васильев Д.С., группа ИСТбд-41.

## Требования

- Docker с Docker Compose
- Для локальной разработки и заполнения базы данных: Bun 1.4.4

## Запуск через Docker Compose

Создайте `.env`:

```bash
cp .env.example .env
```

Соберите и запустите приложение:

```bash
docker compose up --build -d
```

Адреса по умолчанию:

- Платформа: http://localhost:8000
- Storybook: http://localhost:4321

Порты на хосте можно переопределить в `.env` переменными `PORT`, `STORYBOOK_PORT` и `MONGO_PORT`.

Остановить сервисы:

```bash
docker compose down
```

Чтобы также удалить данные MongoDB:

```bash
docker compose down -v
```

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

В Docker Compose Storybook собирается в образе и запускается командой preview.

## Заполнение базы тестовыми данными

При запущенной MongoDB выполните из корня проекта:

```bash
bun db:seed
```
