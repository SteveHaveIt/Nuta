# Multi-stage Dockerfile for Nuta E-commerce
# Optimized for fast builds and minimal image size

# Stage 1: Dependencies
FROM node:22-alpine AS dependencies
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Stage 3: Runtime
FROM node:22-alpine AS runtime
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/index.js"]
