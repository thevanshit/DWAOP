# =============================================================================
# DWAOP - Department Workflow Academy Operation Platform
# Multi-stage Docker Build
# =============================================================================

# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY services/api/package.json services/api/
COPY packages/config/package.json packages/config/
COPY packages/types/package.json packages/types/
COPY packages/ui/package.json packages/ui/

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build shared packages
RUN npm run build --workspace=packages/types

# Build frontend
RUN npm run build --workspace=apps/web

# Build backend
RUN npm run build --workspace=services/api

# ---- Frontend Production Stage ----
FROM node:20-alpine AS frontend

WORKDIR /app

# Copy frontend build output
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/apps/web/next.config.js ./next.config.js
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]

# ---- Backend Production Stage ----
FROM node:20-alpine AS backend

WORKDIR /app

# Install production dependencies only
COPY services/api/package.json ./
RUN npm ci --legacy-peer-deps --only=production

# Copy compiled output
COPY --from=builder /app/services/api/dist ./dist
COPY --from=builder /app/services/api/.env.example ./.env

EXPOSE 3001

CMD ["node", "dist/index.js"]
