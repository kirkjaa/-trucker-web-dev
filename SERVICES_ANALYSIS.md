# Services Analysis & Docker Configuration

## Updated Service Topology

The repository now deploys a complete stack with Docker Compose:

1. **`postgres`** – Stores all application data. Seeded automatically via `database/init.sql` and `database/demo_seed.sql`.
2. **`trucker-api`** – Lightweight Express API that exposes the `/v1/**` endpoints expected by the frontend and talks directly to Postgres.
3. **`trucker-web`** – Next.js frontend that consumes `trucker-api` via `NEXT_PUBLIC_API_BASE_URL`.

Optional services (Nginx reverse proxy, Redis, etc.) remain outside the default compose file.

## Architecture

```
┌─────────────────┐
│   Internet      │
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│ Nginx / Reverse    │  (Port 80/443)
│ Proxy (optional)   │
└────────┬───────────┘
         │
         ▼
┌────────────┬──────────────┐
│  trucker-web (Next.js)    │  Port 5002
│  (talks to internal API)  │
└────────────┬──────────────┘
             │
             ▼
┌────────────┴──────────────┐
│  trucker-api (Express)    │  Port 5300
│  REST endpoints / JWT     │
└────────────┬──────────────┘
             │
             ▼
┌────────────┴──────────────┐
│  postgres                 │  Port 5432
│  (seeded demo data)       │
└───────────────────────────┘
```

## Compose Configuration Highlights

- **Internal network**: `trucker-network` connects all services.
- **Health checks**: Postgres and the API service expose health endpoints used by Compose.
- **Environment propagation**: `deploy.sh` ensures the root `.env` provides secrets for both frontend and backend.
- **Ports**: Frontend exposed on `5002`, backend on `5300` (both can be proxied by Nginx in production).

## Environment Variables

All variables live in the project root `.env` (template: `env/env.production.example`):

```bash
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_BASE_URL=http://trucker-api:5300

JWT_SECRET=...
REFRESH_TOKEN_SECRET=...
JWT_ACCESS_TOKEN_EXPIRES_IN=900
JWT_REFRESH_TOKEN_EXPIRES_IN=604800

POSTGRES_DB=trucker_web
POSTGRES_USER=trucker_user
POSTGRES_PASSWORD=...
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
```

> The backend also accepts `DATABASE_URL` if you prefer a single connection string.

## Deployment Checklist

- [ ] `.env` created from `env/env.production.example` and secrets filled in
- [ ] `docker/deploy.sh` (or `docker compose up -d --build`) runs successfully
- [ ] `trucker-web` reachable on `http://localhost:5002`
- [ ] `trucker-api` reachable on `http://localhost:5300/health`
- [ ] Postgres seeded the demo accounts (see README for credentials)
- [ ] Optional: Nginx reverse proxy configured for production domains

## Notes on Optional Services

- **Firebase**: Still optional. The frontend disables FCM until valid Firebase credentials are provided.
- **Redis**: Not required because authentication uses JWTs exclusively.
- **Nginx**: Recommended for HTTPS termination but not included by default—see `NGINX_SETUP.md`.

## Summary

- ✅ Docker now ships the **frontend**, **backend API**, and **Postgres** together.
- ✅ `deploy.sh` orchestrates builds, env validation, seeding, and health checks.
- 🛠  Bring your own reverse proxy / SSL termination as needed.
- 🔐 Secrets for both the frontend (NextAuth) and backend JWTs are centrally managed in `.env`.
