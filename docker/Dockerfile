# Stage 1: Base image with shared global dependencies
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat \
    && npm install -g pnpm env-cmd

# Stage 2: Install dependencies using the appropriate package manager
FROM base AS deps
WORKDIR /app

COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else echo "No lockfile found." && exit 1; \
  fi

# Stage 3: Build the application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables with defaults
# These will be available during build time for NEXT_PUBLIC_* variables
ARG NEXTAUTH_SECRET=temp-build-secret
ARG NEXTAUTH_URL=http://localhost:5002
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:5300
ARG JWT_SECRET=temp-build-secret
ARG REFRESH_TOKEN_SECRET=temp-build-secret
ARG GOOGLE_MAPS_API_KEY=
ARG NEXT_PUBLIC_FIREBASE_API_KEY=
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID=
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
ARG NEXT_PUBLIC_FIREBASE_APP_ID=
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Set build-time environment variables
# Note: Defaults are set in ARG above, actual values come from docker-compose build args
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET} \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    JWT_SECRET=${JWT_SECRET} \
    REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET} \
    GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY} \
    NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY} \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN} \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID} \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET} \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID} \
    NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID} \
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} \
    NODE_ENV=production

# Run lint before building to ensure code quality
RUN \
  if [ -f yarn.lock ]; then yarn run lint; \
  elif [ -f package-lock.json ]; then npm run lint; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run lint; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage 4: Final runtime image
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment and timezone
ENV TZ=Asia/Bangkok \
    PORT=5002 \
    NODE_ENV=production \
    HOSTNAME="0.0.0.0"

# Runtime environment variables (can be overridden via docker-compose or -e flags)
# These are set as defaults but should be provided at runtime
ENV NEXTAUTH_SECRET="" \
    NEXTAUTH_URL="" \
    NEXT_PUBLIC_API_BASE_URL="" \
    JWT_SECRET="" \
    REFRESH_TOKEN_SECRET="" \
    GOOGLE_MAPS_API_KEY="" \
    NEXT_PUBLIC_FIREBASE_API_KEY="" \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="" \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="" \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="" \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="" \
    NEXT_PUBLIC_FIREBASE_APP_ID="" \
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

# Create secure non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy built application files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ /app/
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Change to non-root user
USER nextjs

EXPOSE 5002

# Run the app
CMD ["node", "server.js"]