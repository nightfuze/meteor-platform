FROM --platform=$BUILDPLATFORM oven/bun:1.4.5-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
COPY apps/platform/package.json ./apps/platform/
COPY packages/types/package.json ./packages/types/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/

RUN bun install

COPY packages/ ./packages/
COPY apps/platform/ ./apps/platform/

RUN bun run build:platform

FROM --platform=$BUILDPLATFORM oven/bun:1.4.5-alpine AS migrator
WORKDIR /app/migrator

COPY migrations/package.json ./
RUN bun install --production

COPY migrations/migrate-mongo-config.js ./
COPY migrations/docker-entrypoint.sh ./entrypoint.sh
COPY migrations/files ./files
RUN chmod +x ./entrypoint.sh

FROM oven/bun:1.4.5-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000

COPY --from=builder /app/apps/platform/dist ./dist
COPY --from=builder /app/apps/platform/package.json ./package.json
COPY --from=migrator /app/migrator /app/migrator

USER bun
EXPOSE 8000/tcp

CMD ["sh", "/app/migrator/entrypoint.sh"]
