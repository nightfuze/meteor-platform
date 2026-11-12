# Платформа для многопользовательских браузерных игр

Лабораторная работа №4 по дисциплине «Методы и средства проектирования информационных систем и технологий».  
Студент: Васильев Д.С., группа ИСТбд-41.

## Инструкция
### Скачать репозиторий
```bash
git clone https://github.com/nightfuze/meteor-platform
```
### Сменить ветку 
```bash
git switch lab4
```

### Установить .env
```bash
cp .env.example .env
```

### Запуск
```bash
docker compose up -d
```

### Заполнение данных бд
```bash
bun db:seed
```

### Запуск платформы в dev-режиме
```bash
docker compose -f compose.dev.yml up -d
bun dev:platform
```

### Запуск storybook
```bash
bun build:storybook
bun preview:storybook
```
