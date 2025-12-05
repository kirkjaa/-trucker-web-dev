# Trucker Mobile App Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Shared Database](#shared-database)
4. [Login Credentials](#login-credentials)
5. [Deployment](#deployment)
6. [API Reference](#api-reference)

---

## Overview

Trucker Mobile is the mobile web application companion to the Trucker Web desktop application. It provides a mobile-optimized interface for drivers and logistics personnel to manage jobs, view deliveries, track finances, and communicate with teams.

### Tech Stack
- **Frontend**: React 19.1 with TypeScript + Vite
- **Backend**: Express.js 5.x with TypeScript
- **Database**: PostgreSQL (shared with desktop app) via Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: TailwindCSS 4.1

### Key Features
- 📱 Mobile-optimized UI
- 🚚 Job tracking and status updates
- 💬 Chat with customers and dispatch
- 💰 Revenue and expense tracking
- 🔔 Real-time notifications
- 🌍 Multi-language support (Thai, English, Korean)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production URLs                          │
│   Desktop:    https://trw.q9.quest                         │
│   Mobile:     https://m.trw.q9.quest                       │
│   API:        https://api.trw.q9.quest                     │
└─────────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  trucker-web    │ │ trucker-mobile  │ │  trucker-api    │
│  (Next.js)      │ │ (Vite+Express)  │ │  (Express)      │
│  Port: 5002     │ │  Port: 5003     │ │  Port: 5300     │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┴───────────────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │  trucker-postgres   │
                  │  (Shared Database)  │
                  │  Port: 5432         │
                  └─────────────────────┘
```

---

## Shared Database

**Important**: The mobile app shares the **same PostgreSQL database** as the desktop app.

### What This Means:
- ✅ Same user accounts work on both platforms
- ✅ Jobs, routes, orders are visible on both
- ✅ Chat messages sync between desktop and mobile
- ✅ Financial data (revenues, orders) shared
- ✅ Organizations (factories, companies) shared

### Database Tables Used:
| Table | Purpose |
|-------|---------|
| `users` | User authentication and profiles |
| `organizations` | Factories and companies (customers) |
| `factory_routes` | Job/route definitions |
| `master_routes` | Route templates with origin/destination |
| `orders` | Active orders assigned to drivers |
| `trucks` | Vehicle/fleet information |
| `drivers` | Driver profiles and status |
| `bids` | Job bidding system |
| `chat_rooms` | Chat conversations |
| `chat_messages` | Chat message history |

---

## Login Credentials

**Both desktop and mobile use the SAME credentials.**

### Quick Reference

| Role | Email | Password | Best For |
|------|-------|----------|----------|
| **Admin** | `superadmin@demo.com` | `Demo@123` | Full system access |
| **Factory** | `factory@demo.com` | `Demo@123` | Factory management |
| **Company** | `company@demo.com` | `Demo@123` | Company operations |
| **Driver** | `driver@demo.com` | `Demo@123` | **Main mobile use case** |

### Role Mapping

The mobile app maps desktop roles to mobile-friendly names:

| Desktop Role | Mobile Role | Description |
|--------------|-------------|-------------|
| `SUPERADMIN` | `admin` | Full system access |
| `ORGANIZATION` | `company` | Factory/Company users |
| `DRIVER` | `shipping` | Driver workspace |

See [LOGIN_CREDENTIALS.md](../LOGIN_CREDENTIALS.md) for the complete list of 130+ demo accounts.

---

## Deployment

### With Docker (Recommended)

The mobile app is deployed automatically as part of the main Docker deployment:

```bash
# From project root
./docker/deploy.sh
```

This will:
1. Build the mobile app Docker image
2. Start the service on port 5003
3. Connect to the shared PostgreSQL database
4. Verify health checks

### Standalone Development

```bash
cd trucker-mobile

# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Or run frontend only
npm run dev:frontend

# Or run backend only
npm run dev:backend
```

### Environment Variables

The mobile app uses these environment variables (set in docker-compose.yml):

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5003` |
| `NODE_ENV` | Environment | `production` |
| `DATABASE_URL` | PostgreSQL connection string | (from .env) |
| `JWT_SECRET` | JWT signing secret | (from .env) |

---

## API Reference

The mobile app has its own Express backend that queries the shared database.

### Authentication

```
POST /api/auth/login
Body: { "username": "driver@demo.com", "password": "Demo@123" }
Response: { "token": "...", "user": { ... } }
```

### Jobs/Routes

```
GET /api/jobs              # List available jobs
GET /api/jobs/my-jobs      # Jobs assigned to current driver
GET /api/jobs/:id          # Get job details
```

### Dashboard

```
GET /api/dashboard/stats      # Overall statistics
GET /api/dashboard/my-stats   # Current user's statistics
GET /api/dashboard/recent-jobs # Recent job activity
```

### Chat

```
GET /api/chat                  # List conversations
GET /api/chat/:id              # Get conversation details
GET /api/chat/:id/messages     # Get messages
POST /api/chat/:id/messages    # Send message
```

### Bids

```
GET /api/bids                  # List all bids
GET /api/bids/open             # Open bids for bidding
POST /api/bids/:id/submit      # Submit a bid
```

### Customers

```
GET /api/customers             # List organizations
GET /api/customers/:id         # Get organization details
```

### Vehicles

```
GET /api/vehicles              # List trucks
GET /api/vehicles/:id          # Get truck details
```

### Health Check

```
GET /api/health                # Returns 200 OK if server is running
```

---

## Multi-Language Support

The mobile app supports 3 languages:
- 🇹🇭 **Thai** (ไทย) - Default
- 🇺🇸 **English**
- 🇰🇷 **Korean** (한국어)

Language can be changed from:
- Login screen (top right corner)
- Settings screen

Translation files are located in:
- `src/i18n/locales/th.json`
- `src/i18n/locales/en.json`
- `src/i18n/locales/ko.json`

---

## Troubleshooting

### "Invalid credentials" on login
- Verify you're using the correct email format (e.g., `driver@demo.com`)
- Password is `Demo@123` (case-sensitive)
- User must have `ACTIVE` status

### Data not showing
- Ensure the PostgreSQL container is healthy
- Check that seed data was loaded: `docker exec trucker-postgres psql -U trucker_user -d trucker_web -c "\dt"`
- Verify the user has appropriate permissions

### Container won't start
- Check logs: `docker logs trucker-mobile`
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running first

---

*Last updated: December 2024*
