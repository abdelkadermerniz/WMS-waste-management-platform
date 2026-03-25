# ─── Base Stage ────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ─── Development Stage ─────────────────────────────────────────
FROM base AS development
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# ─── Builder Stage ─────────────────────────────────────────────
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci --only=production
COPY --from=development /app/dist ./dist

# ─── Production Stage ──────────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressuser
USER expressuser
EXPOSE 3001
CMD ["node", "dist/main.js"]
