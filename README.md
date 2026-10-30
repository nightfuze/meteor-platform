# Платформа для многопользовательских браузерных игр

Лабораторная работа №3 по дисциплине «Методы и средства проектирования информационных систем и технологий».  
Студент: Васильев Д.С., группа ИСТбд-41.

## Инструкция
### Скачать репозиторий
```bash
git clone https://github.com/nightfuze/meteor-platform
```
### Сменить ветку 
```bash
git switch lab3
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

### Запуск в dev-режиме
```bash
docker compose -f compose.dev.yml up -d
bun dev:platoform
```
