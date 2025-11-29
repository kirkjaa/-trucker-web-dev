# Docker Deployment

This directory contains Docker-related files for deploying the Trucker Web application.

## Files

- `Dockerfile` - Multi-stage Docker build configuration
- `deploy.sh` - Deployment helper script

## Quick Start

### Using Docker Compose (Recommended)

1. Create a `.env` file in the project root with all required environment variables (template at `env/env.production.example`)
2. Run:
   ```bash
   docker-compose up -d --build
   ```

### Using the Deployment Script

```bash
./docker/deploy.sh
```

### Manual Build

```bash
docker build -f docker/Dockerfile -t trucker-web:latest .

# Backend API (optional manual build)
docker build -f backend/Dockerfile -t trucker-api:latest ./backend
```

## Environment Variables

All environment variables must be set before building. See the main `DOCKER.md` file for details.

## Services

- `trucker-web` – Next.js frontend (port 5002)
- `trucker-api` – Express backend API (port 5300)
- `postgres` – PostgreSQL database (port 5432)

## Dockerfile Stages

1. **base** - Base image with Node.js and pnpm
2. **deps** - Install dependencies
3. **builder** - Build the Next.js application
4. **runner** - Final runtime image (minimal, secure)

## Security Features

- Non-root user execution
- Minimal Alpine Linux base image
- Multi-stage build for smaller image size
- Environment variables for secrets (not hardcoded)

## Image Size Optimization

The Dockerfile uses:
- Multi-stage builds to reduce final image size
- Alpine Linux for minimal base image
- Next.js standalone output mode
- Only necessary files copied to final image

