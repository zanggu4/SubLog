FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Auth.js needs AUTH_SECRET at build time for JWT, but we use a dummy value.
# The real value is injected at runtime via environment variables.
ENV AUTH_SECRET=build-placeholder
ENV AUTH_GITHUB_ID=build-placeholder
ENV AUTH_GITHUB_SECRET=build-placeholder

RUN pnpm build

# --- Runner ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Environment variables are read at RUNTIME, not baked into the image.
# Pass them via docker-compose.yml or `docker run -e`.
CMD ["node", "server.js"]
