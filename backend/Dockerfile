# Backend Dockerfile (Node.js + Prisma + Express)
# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps first for better caching
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
RUN npm run build

# --- Production stage ---
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts and required runtime assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
# Prisma Client (already in node_modules) + Prisma folder (includes SQLite DB if used)
COPY --from=builder /app/prisma ./prisma

# Expose API port
EXPOSE 3000

# Health defaults (optional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Start server
CMD ["node", "dist/server.js"]
