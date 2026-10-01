FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml prisma.config.ts ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# next build imports the route modules, which validate env at import time, and .env isn't in the image.
# Placeholders are safe: Prisma and Redis only connect on first use, and Compose supplies the real values at runtime.
# Scoped to this stage only; the runner stage doesn't inherit them.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build REDIS_URL=redis://localhost:6379 APP_URL=http://localhost:3000
RUN pnpm prisma generate && pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm prisma db seed && pnpm start"]
