# Complete Deployment Guide

This is a comprehensive guide for deploying the Trucker Web application with all services.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Setup](#environment-setup)
4. [Deployment Methods](#deployment-methods)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Docker Engine** 20.10 or higher
- **Docker Compose** 2.0 or higher
- **Git** (for cloning repository)
- **Text Editor** (for editing .env file)

### System Requirements

- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 10GB+ free space
- **Network**: Internet connection for pulling images

### Verify Installation

```bash
# Check Docker
docker --version
docker info

# Check Docker Compose
docker compose version
# or
docker-compose --version
```

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd trucker-web-dev
```

### 2. Run Deployment Script

```bash
# Make script executable
chmod +x docker/deploy.sh

# Run deployment
./docker/deploy.sh
```

The script will guide you through the entire process!

### 3. Access Application

- **Frontend**: http://localhost:5002
- **Health Check**: http://localhost:5002/health-check
- **Database**: localhost:5432

### 4. Demo Accounts

The database seeds the following demo accounts the first time it starts:

| Role            | Username               | Password  |
|-----------------|------------------------|-----------|
| Super Admin     | `superadmin@demo.com`  | `Demo@123` |
| Factory Admin   | `factory@demo.com`     | `Demo@123` |
| Company Admin   | `company@demo.com`     | `Demo@123` |
| Driver          | `driver@demo.com`      | `Demo@123` |

> To regenerate demo data, remove the `postgres_data` volume before redeploying.

### 5. Backup & Recovery

- Create backup: `./docker/backup.sh`
- Restore backup: `./docker/restore.sh <backup-file>`

## Environment Setup

### Create .env File

```bash
# Copy template (if available)
cp env/env.production.example .env

# Or create manually
nano .env
```

### Required Environment Variables

```bash
# ============================================
# Authentication & Security
# ============================================
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-domain.com
JWT_SECRET=your_generated_secret_here
REFRESH_TOKEN_SECRET=your_generated_secret_here

# ============================================
# API Configuration
# ============================================
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com

# ============================================
# Database Configuration
# ============================================
POSTGRES_DB=trucker_web
POSTGRES_USER=trucker_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432

# ============================================
# Google Maps
# ============================================
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# ============================================
# Firebase Configuration
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Generate Secrets

```bash
# Generate all secrets at once
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)"
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24)"
```

## Deployment Methods

### Method 1: Automated Script (Recommended)

```bash
./docker/deploy.sh
```

**Advantages:**
- ✅ Automatic validation
- ✅ Health checks
- ✅ Error handling
- ✅ Status reporting

### Method 2: Docker Compose

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Method 3: Manual Docker Commands

See [DOCKER.md](./DOCKER.md) for manual build instructions.

## Post-Deployment

### 1. Verify Services

```bash
# Check all services are running
docker-compose ps

# Check application health
curl http://localhost:5002/health-check

# Check backend API health
curl http://localhost:8000/health

# Check database health
docker exec trucker-postgres pg_isready -U trucker_user
```

### 2. Configure Nginx Reverse Proxy

For production, set up Nginx reverse proxy:

1. See [NGINX_SETUP.md](./NGINX_SETUP.md) for detailed instructions
2. Configure SSL/TLS certificates
3. Update `NEXTAUTH_URL` in `.env` to your production domain

### 3. Database Initialization

The database schema is automatically initialized on first startup. Verify:

```bash
# Connect to database
docker exec -it trucker-postgres psql -U trucker_user -d trucker_web

# List tables
\dt

# Check table count
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
```

### 4. Set Up Backend API

The database is ready for your backend API. Choose your stack:

- **Node.js/Express** with Prisma, TypeORM, or Knex.js
- **Python** with SQLAlchemy or Django
- **Other**: Any framework that supports PostgreSQL

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for connection examples.

### 5. Configure Monitoring

Set up monitoring for:
- Application health
- Database performance
- Resource usage
- Error tracking

## Troubleshooting

### Common Issues

#### Services Won't Start

```bash
# Check logs
docker-compose logs

# Check port conflicts
netstat -tuln | grep -E '5002|5432'

# Restart services
docker-compose restart
```

#### Database Connection Issues

```bash
# Check database is running
docker ps | grep postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker exec trucker-postgres psql -U trucker_user -d trucker_web -c "SELECT 1;"
```

#### Application Errors

```bash
# Check application logs
docker-compose logs -f trucker-web

# Check environment variables
docker-compose config

# Restart application
docker-compose restart trucker-web
```

#### Build Failures

```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache

# Check disk space
df -h
docker system df
```

### Getting Help

1. Check logs: `docker-compose logs -f`
2. Review documentation:
   - [DOCKER.md](./DOCKER.md)
   - [DATABASE_SETUP.md](./DATABASE_SETUP.md)
   - [NGINX_SETUP.md](./NGINX_SETUP.md)
3. Verify environment variables
4. Check service health status

## Production Checklist

Before going to production:

- [ ] All environment variables configured
- [ ] Strong passwords and secrets generated
- [ ] Nginx reverse proxy configured
- [ ] SSL/TLS certificates installed
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Firewall rules configured
- [ ] Domain DNS configured
- [ ] Backend API deployed and connected
- [ ] Health checks verified
- [ ] Logging configured
- [ ] Error tracking set up

## Maintenance

### Regular Tasks

1. **Database Backups** (Daily)
   ```bash
   docker exec trucker-postgres pg_dump -U trucker_user trucker_web > backup_$(date +%Y%m%d).sql
   ```

2. **Update Images** (Weekly/Monthly)
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

3. **Monitor Logs** (Ongoing)
   ```bash
   docker-compose logs -f
   ```

4. **Check Resource Usage**
   ```bash
   docker stats
   ```

## Additional Resources

- [DOCKER.md](./DOCKER.md) - Docker deployment details
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database management
- [NGINX_SETUP.md](./NGINX_SETUP.md) - Reverse proxy setup
- [SERVICES_ANALYSIS.md](./SERVICES_ANALYSIS.md) - Services overview

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review service logs
3. Consult the documentation files
4. Verify configuration files

---

**Last Updated**: $(date)
**Version**: 1.0.0

