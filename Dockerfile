FROM --platform=$BUILDPLATFORM oven/bun:1.4.2-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
COPY apps/platform/package.json ./apps/platform/
COPY packages/types/package.json ./packages/types/

RUN bun install

COPY packages/ ./packages/
COPY apps/platform/ ./apps/platform/

RUN bun run build:platform

FROM node:26.10.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000

COPY --from=builder /app/apps/platform/dist ./dist
COPY --from=builder /app/apps/platform/package.json ./package.json

USER node
EXPOSE 8000/tcp

CMD ["node", "./dist/server/entry.mjs"]
