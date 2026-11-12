FROM --platform=$BUILDPLATFORM oven/bun:1.4.4-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
COPY apps/platform/package.json ./apps/platform/
COPY apps/storybook/package.json ./apps/storybook/
COPY packages/types/package.json ./packages/types/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/

RUN bun install

COPY packages/ ./packages/
COPY apps/platform/ ./apps/platform/
COPY apps/storybook/ ./apps/storybook/

RUN bun run build:platform && bun run build:storybook

FROM builder AS storybook
WORKDIR /app/apps/storybook
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321/tcp
CMD ["bun", "run", "preview", "--", "--host", "0.0.0.0"]

FROM oven/bun:1.4.4-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000

COPY --from=builder /app/apps/platform/dist ./dist
COPY --from=builder /app/apps/platform/package.json ./package.json

USER bun
EXPOSE 8000/tcp

CMD ["bun", "./dist/server/entry.mjs"]
