# Trucker-web

A logistics and transportation management platform for SSL Logistic, built with Next.js 15, TypeScript, and Tailwind CSS.

## Development Setup

First, install package:

```bash
pnpm install
# or
pnpm i
```

Second, run the development server:

```bash
pnpm dev
```

## Docker Deployment

For production deployment using Docker, see the [Docker Deployment Guide](./DOCKER.md).

### Quick Start with Docker

#### Option 1: Automated Deployment (Recommended)

Use the provided deployment script for a complete setup:

```bash
# Make script executable (Linux/Mac)
chmod +x docker/deploy.sh

# Run deployment
./docker/deploy.sh
```

The script will handle:
- ✅ Prerequisites checking
- ✅ Environment variable validation
- ✅ Docker image building
- ✅ Database initialization
- ✅ Service health checks
- ✅ Status verification

#### Option 2: Manual Deployment

1. Create a `.env` file with all required environment variables
   ```bash
   # Copy template
   cp env/env.production.example .env

   # Generate secrets (if needed)
   openssl rand -base64 32  # For NEXTAUTH_SECRET, JWT_SECRET, etc.
   ```
   > When running the frontend outside Docker, update `NEXT_PUBLIC_API_BASE_URL` to `http://localhost:5300`.

2. Build and run:
   ```bash
   docker-compose up -d --build
   ```

3. Access the applications:
   - **Desktop Web**: `http://localhost:5002`
   - **Mobile Web**: `http://localhost:5003`
   - Backend API: `http://localhost:5300`
   - Health Check: `http://localhost:5002/health-check`
   - Database: `localhost:5432`

4. Demo accounts (auto-seeded) - **Same for Desktop & Mobile**:
   - **Super Admin** – `superadmin@demo.com` / `Demo@123`
   - **Factory Admin** – `factory@demo.com` / `Demo@123`
   - **Company Admin** – `company@demo.com` / `Demo@123`
   - **Driver** – `driver@demo.com` / `Demo@123` (main mobile use case)
   
   See [LOGIN_CREDENTIALS.md](./LOGIN_CREDENTIALS.md) for full list of demo accounts.

5. Backup & restore:
   - Create backup: `./docker/backup.sh`
   - Restore backup: `./docker/restore.sh`

### What's Included

The Docker setup includes:
- **Desktop Web (`trucker-web`)** – Next.js frontend on port 5002
- **Mobile Web (`trucker-mobile`)** – Vite/React frontend on port 5003
- **Express Backend API (`trucker-api`)** – `/v1/**` endpoints on port 5300
- **PostgreSQL Database** – Shared between desktop & mobile, seeded with demo data
- **Automatic Initialization** – Seed + health checks handled by `deploy.sh`

> **Note**: Desktop and Mobile apps share the same PostgreSQL database. User accounts, jobs, chat, etc. are accessible from both platforms.

### Documentation

- [DOCKER.md](./DOCKER.md) - Complete Docker deployment guide
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database setup and management
- [NGINX_SETUP.md](./NGINX_SETUP.md) - Nginx reverse proxy configuration
- [SERVICES_ANALYSIS.md](./SERVICES_ANALYSIS.md) - Services overview

### Backend API (`backend/`)

- Built with Express + TypeScript and lives in the `backend/` directory.
- Shares the same `.env` file (or `DATABASE_URL`) for database connectivity and JWT secrets.
- Local development:
  ```bash
  cd backend
  npm install
  npm run dev
  ```
- Production is handled automatically via the `trucker-api` service in `docker-compose.yml`.
- Currently ships the `/v1/auth/login`, `/v1/auth/refresh`, and `/v1/users/me` endpoints needed for the demo login flow—extend as you add more features.
