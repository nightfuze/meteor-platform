FROM oven/bun:1.4.2-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
COPY apps/platform/package.json ./apps/platform/
COPY packages/types/package.json ./packages/types/

RUN bun install

COPY packages/ ./packages/
COPY apps/platform/ ./apps/platform/

RUN bun run build:platform

FROM oven/bun:1.4.2-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000
ENV ASTRO_NODE_LOGGING=disabled

COPY --from=builder /app/apps/platform/dist ./dist
COPY --from=builder /app/apps/platform/package.json ./package.json

USER bun
EXPOSE 8000/tcp

CMD ["sh", "-c", "echo 'Server listening on http://localhost:8000' && bun ./dist/server/entry.mjs"]
