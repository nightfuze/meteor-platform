#!/bin/sh

set -e

cd /app/migrator

attempt=1
while ! bunx --bun --no-install migrate-mongo up; do
  if [ "$attempt" -ge 10 ]; then
    echo "Не удалось применить миграции за 10 попыток" >&2
    exit 1
  fi
  attempt=$((attempt + 1))
  echo "Миграции не применились, повтор через 3 секунды (попытка $attempt)" >&2
  sleep 3
done

cd /app
exec bun ./dist/server/entry.mjs
