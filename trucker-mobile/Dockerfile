# ============================================================================
# Trucker Mobile - Production Dockerfile
# Multi-stage build for optimized production image
# ============================================================================

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Vite frontend
RUN npm run build

# ============================================================================
# Stage 2: Production runtime
# ============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 trucker

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server files (Express backend)
COPY --from=builder /app/server ./server

# Copy public assets
COPY --from=builder /app/public ./public

# Set ownership to non-root user
RUN chown -R trucker:nodejs /app

# Switch to non-root user
USER trucker

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5003

# Expose the application port
EXPOSE 5003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5003/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the production server
CMD ["npm", "run", "start"]

