# Docker Deployment Guide

This guide explains how to deploy the Trucker Web application using Docker.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- All required environment variables configured

## Quick Start

### Option 1: Automated Deployment Script (Recommended)

The easiest way to deploy everything is using the provided deployment script:

```bash
# Make script executable (Linux/Mac)
chmod +x docker/deploy.sh

# Run deployment
./docker/deploy.sh
```

The script will:
- ✅ Check prerequisites (Docker, Docker Compose)
- ✅ Validate environment variables
- ✅ Check port availability
- ✅ Build Docker images
- ✅ Start all services (Next.js + PostgreSQL)
- ✅ Wait for services to be healthy
- ✅ Verify database initialization
- ✅ Display service status and access information

### Option 2: Manual Docker Compose

### 1. Prepare Environment Variables

Create a `.env` file in the project root with all required environment variables:

```bash
# Copy template if available
cp env/env.production.example .env
```

Edit `.env` and fill in all the required values. **Required variables:**
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your application URL (e.g., `https://your-domain.com`)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `REFRESH_TOKEN_SECRET` - Generate with: `openssl rand -base64 32`
- `POSTGRES_PASSWORD` - Strong database password
- All Firebase configuration variables
- Google Maps API key

### 2. Build and Run with Docker Compose

```bash
docker-compose up -d --build
```

This will:
- Build the Docker images (Next.js frontend)
- Start PostgreSQL database
- Initialize database schema automatically
- Start the Next.js application container
- Expose the application on port 5002 (internal)

### 3. Access the Application

Open your browser and navigate to:
- Local: `http://localhost:5002`
- Production: `https://your-domain.com` (if configured with reverse proxy)
- Health Check: `http://localhost:5002/health-check`
- Database: `localhost:5432` (for management tools)

### Demo Accounts

The PostgreSQL container automatically seeds demo organizations and users the first time the `postgres_data` volume is created:

| Role            | Username               | Password  |
|-----------------|------------------------|-----------|
| Super Admin     | `superadmin@demo.com`  | `Demo@123` |
| Factory Admin   | `factory@demo.com`     | `Demo@123` |
| Company Admin   | `company@demo.com`     | `Demo@123` |
| Driver          | `driver@demo.com`      | `Demo@123` |

> To re-seed the data, remove the `postgres_data` volume (`docker-compose down -v`) before re-running the deployment.

## Manual Docker Build

If you prefer to build and run manually:

### Build the Image

```bash
docker build \
  --build-arg NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
  --build-arg NEXTAUTH_URL="${NEXTAUTH_URL}" \
  --build-arg NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL}" \
  --build-arg JWT_SECRET="${JWT_SECRET}" \
  --build-arg REFRESH_TOKEN_SECRET="${REFRESH_TOKEN_SECRET}" \
  --build-arg GOOGLE_MAPS_API_KEY="${GOOGLE_MAPS_API_KEY}" \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="${NEXT_PUBLIC_FIREBASE_API_KEY}" \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}" \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID}" \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}" \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}" \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="${NEXT_PUBLIC_FIREBASE_APP_ID}" \
  --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}" \
  -f docker/Dockerfile \
  -t trucker-web:latest .

# Backend API image (optional when building manually)
docker build -f backend/Dockerfile -t trucker-api:latest ./backend
```

### Run the Container

```bash
docker run -d \
  --name trucker-web \
  -p 5002:5002 \
  -e NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
  -e NEXTAUTH_URL="${NEXTAUTH_URL}" \
  -e NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL}" \
  -e JWT_SECRET="${JWT_SECRET}" \
  -e REFRESH_TOKEN_SECRET="${REFRESH_TOKEN_SECRET}" \
  -e GOOGLE_MAPS_API_KEY="${GOOGLE_MAPS_API_KEY}" \
  -e NEXT_PUBLIC_FIREBASE_API_KEY="${NEXT_PUBLIC_FIREBASE_API_KEY}" \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}" \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID}" \
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}" \
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}" \
  -e NEXT_PUBLIC_FIREBASE_APP_ID="${NEXT_PUBLIC_FIREBASE_APP_ID}" \
  -e NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}" \
  --restart unless-stopped \
  trucker-web:latest
```

## Environment Variables

### Required Variables

All environment variables listed in `env/env.production.example` are required for the application to function properly.

**Application Variables:**
- `NEXTAUTH_SECRET` - NextAuth secret key (32+ characters)
- `NEXTAUTH_URL` - Public application URL
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `API_PORT` - Host port for the backend service (default: `5300`)
- `JWT_SECRET` - JWT signing secret
- `REFRESH_TOKEN_SECRET` - Refresh token secret
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- All Firebase configuration variables (8 variables)

**Database Variables:**
- `POSTGRES_DB` - Database name (default: `trucker_web`)
- `POSTGRES_USER` - Database user (default: `trucker_user`)
- `POSTGRES_PASSWORD` - Database password (**change in production!**)
- `POSTGRES_PORT` - Database port (default: `5432`)

**Important Notes:**
- `NEXT_PUBLIC_*` variables must be provided at **build time** as they are embedded into the client-side bundle
- Server-side variables can be provided at runtime
- Never commit `.env` files to version control
- Change all default passwords in production
- When running via Docker Compose, set `NEXT_PUBLIC_API_BASE_URL=http://trucker-api:5300` so the frontend talks to the internal API service. Swap to your public API URL only when exposing the backend outside the Docker network.

### Generating Secrets

For production, generate strong secrets:

```bash
# Generate NEXTAUTH_SECRET (32+ characters)
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32

# Generate REFRESH_TOKEN_SECRET
openssl rand -base64 32

# Generate PostgreSQL password
openssl rand -base64 24
```

## Services Included

The Docker Compose setup includes:

1. **trucker-web** – Next.js frontend
   - Port: 5002 (exposed to host for local access)
   - Health check: `/health-check`

2. **trucker-api** – Express backend API
   - Port: 5300 (exposed for local debugging)
   - Health check: `/health`
   - Issues JWT access/refresh tokens and talks to Postgres

3. **postgres** – PostgreSQL 16 database
   - Port: 5432 (exposed for admin tools)
   - Automatic schema + demo-data initialization
   - Persistent volume (`postgres_data`)

4. **redis** – Optional (commented out)
   - Uncomment in `docker-compose.yml` if you later add caching/session needs

## Docker Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f trucker-web
docker-compose logs -f trucker-api
docker-compose logs -f postgres
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart trucker-web
docker-compose restart postgres
```

### Update the Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or use the deployment script
./docker/deploy.sh
```

### Check Container Status

```bash
# List all services
docker-compose ps

# Detailed status
docker ps
```

### Health Checks

```bash
# Check application health
curl http://localhost:5002/health-check

# Check database health
docker exec trucker-postgres pg_isready -U trucker_user -d trucker_web

# Check container health status
docker inspect --format='{{.State.Health.Status}}' trucker-web
docker inspect --format='{{.State.Health.Status}}' trucker-postgres
```

## Database Management

### Connect to Database

```bash
# Using psql
docker exec -it trucker-postgres psql -U trucker_user -d trucker_web

# From host machine (if port is exposed)
psql -h localhost -p 5432 -U trucker_user -d trucker_web
```

### Database Commands

```bash
# List all tables
docker exec trucker-postgres psql -U trucker_user -d trucker_web -c "\dt"

# View table structure
docker exec trucker-postgres psql -U trucker_user -d trucker_web -c "\d table_name"

# Run SQL query
docker exec trucker-postgres psql -U trucker_user -d trucker_web -c "SELECT COUNT(*) FROM users;"
```

### Backup Database

```bash
# Create backup
docker exec trucker-postgres pg_dump -U trucker_user trucker_web > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
docker exec trucker-postgres pg_dump -U trucker_user -Fc trucker_web > backup.dump
```

### Restore Database

```bash
# Restore from SQL file
docker exec -i trucker-postgres psql -U trucker_user -d trucker_web < backup.sql

# Restore from dump file
docker exec -i trucker-postgres pg_restore -U trucker_user -d trucker_web < backup.dump
```

For more database information, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)

## Production Deployment

### Using Docker Compose

1. **Set up environment variables:**
```bash
cp env/env.production.example .env
# Edit .env with production values
# IMPORTANT: Set NEXTAUTH_URL to your public domain (e.g., https://your-domain.com)
```

2. **Build and start:**
   ```bash
   docker-compose up -d --build
   ```

3. **Set up Nginx Reverse Proxy:**
   - The Docker container exposes port 5002 internally only
   - Configure Nginx to proxy requests to the container
   - See [NGINX_SETUP.md](./NGINX_SETUP.md) for detailed instructions
   - For Nginx Proxy Manager: Use container name `trucker-web` and port `5002`
   - Configure SSL/TLS certificates
   - Set proper headers for Next.js

### Using Docker Swarm or Kubernetes

The Dockerfile is compatible with orchestration platforms. You'll need to:
- Configure secrets management
- Set up service discovery
- Configure load balancing
- Set up persistent storage if needed

## Troubleshooting

### Container won't start

1. Check logs:
   ```bash
   docker-compose logs trucker-web
   docker-compose logs postgres
   ```

2. Verify environment variables are set:
   ```bash
   docker-compose config
   ```

3. Check if ports are available:
   ```bash
   netstat -tuln | grep 5002
   netstat -tuln | grep 5432
   ```

## Backup & Recovery

Use the provided scripts inside the repository (run from the project root):

- Create backup: `./docker/backup.sh`
- Restore backup: `./docker/restore.sh <path-to-backup>`

Backups are written to the local `./backups` directory by default.

4. Check container status:
   ```bash
   docker-compose ps
   docker ps -a
   ```

### Build fails

1. Ensure all build arguments are provided
2. Check Docker has enough memory (recommended: 4GB+)
3. Clear Docker cache:
   ```bash
   docker builder prune
   ```

4. Check disk space:
   ```bash
   df -h
   docker system df
   ```

### Application errors

1. Check application logs:
   ```bash
   docker-compose logs -f trucker-web
   ```

2. Verify all environment variables are correct
3. Ensure the API backend is accessible from the container
4. Check Firebase configuration

### Database issues

1. Check database logs:
   ```bash
   docker-compose logs -f postgres
   ```

2. Verify database is running:
   ```bash
   docker exec trucker-postgres pg_isready -U trucker_user
   ```

3. Check database connection:
   ```bash
   docker exec -it trucker-postgres psql -U trucker_user -d trucker_web
   ```

4. Verify schema was initialized:
   ```bash
   docker exec trucker-postgres psql -U trucker_user -d trucker_web -c "\dt"
   ```

5. If schema is missing, re-run initialization:
   ```bash
   docker exec -i trucker-postgres psql -U trucker_user -d trucker_web < database/init.sql
   ```

## Security Considerations

1. **Never commit `.env` files**
2. **Use strong, unique secrets** for production
3. **Keep Docker images updated** with security patches
4. **Run containers as non-root user** (already configured)
5. **Use secrets management** in production (Docker Secrets, Kubernetes Secrets, etc.)
6. **Enable HTTPS** via reverse proxy
7. **Restrict network access** as needed

## Performance Optimization

1. **Use multi-stage builds** (already implemented)
2. **Enable Docker layer caching** for faster rebuilds
3. **Consider using a CDN** for static assets
4. **Monitor resource usage:**
   ```bash
   docker stats trucker-web
   ```

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

