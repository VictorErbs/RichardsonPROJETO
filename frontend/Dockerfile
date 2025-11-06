# Frontend Dockerfile (Vite build + Nginx static server)
# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Nginx stage ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build output
COPY --from=builder /app/dist .

# Copy SPA-friendly nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
