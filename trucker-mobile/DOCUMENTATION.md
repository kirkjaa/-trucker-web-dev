# Trucker CMS Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Demo Data](#demo-data)
4. [Deployment Guide](#deployment-guide)
5. [API Reference](#api-reference)

---

## Overview

Trucker CMS is a comprehensive trucking and logistics management platform built with modern web technologies. It provides tools for managing jobs, customers, vehicles, finances, chat, and bidding operations.

### Tech Stack
- **Frontend**: React 19.1 with TypeScript
- **Backend**: Express.js 5.x with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: TailwindCSS 4.1

---

## Features

### User Management & Authentication
- Role-based access control (Admin, Company, Customer, Shipping)
- Secure JWT authentication with token expiration
- User profiles with customizable settings

### Job Management
- Create, assign, and track delivery jobs
- Job status tracking (pending, assigned, in-progress, completed, cancelled)
- Multi-stop job support with check-in/check-out
- Job history and analytics

### Customer Management
- Full customer database with contact information
- Order history tracking per customer
- Revenue analytics by customer
- Search and filter capabilities

### Product Catalog
- Product inventory management
- Category-based organization
- Pricing and stock tracking
- Product search functionality

### Fleet Management
- Vehicle registration and tracking
- Driver assignments
- Vehicle status monitoring (available, in-use, maintenance)
- Maintenance scheduling

### Financial Management
- Expense tracking by job and category
- Revenue recording and invoicing
- Monthly/yearly financial reports
- Profit/loss analytics
- 18 months of historical data

### Bid Management
- Create and manage job bids
- Bid status tracking (open, submitted, won, lost, expired)
- Price submissions and negotiations

### Chat System
- Private messaging between users
- Group conversations
- Real-time message history
- Conversation management

### Dashboard
- Overview statistics
- Recent job activity
- Revenue charts
- Quick action buttons

---

## Demo Data

The application comes pre-seeded with comprehensive demo data for testing and demonstration purposes.

### User Accounts

All demo accounts use password: `12345`

| Username | Role | Description |
|----------|------|-------------|
| `admin` | Admin | Full system access |
| `admin2` | Admin | Full system access |
| `admin3` | Admin | Full system access |
| `company` | Company | Company operations |
| `company2` | Company | Company operations |
| `company3` | Company | Company operations |
| `customer` | Customer | Customer workspace |
| `customer2` | Customer | Customer workspace |
| `customer3` | Customer | Customer workspace |
| `shipping` | Shipping | Driver/shipping workspace |
| `shipping2` | Shipping | Driver/shipping workspace |
| `shipping3` | Shipping | Driver/shipping workspace |
| `shipping4` | Shipping | Driver/shipping workspace |
| `shipping5` | Shipping | Driver/shipping workspace |
| `shipping6` | Shipping | Driver/shipping workspace |

### Data Volume

| Entity | Count | Description |
|--------|-------|-------------|
| Users | 15 | Across all roles |
| Jobs | 65 | Various statuses with stops |
| Customers | 150 | With contact and order history |
| Products | 90 | Across multiple categories |
| Vehicles | 45 | With driver assignments |
| Expenses | 263 | Across multiple jobs |
| Revenues | 42 | Payment records |
| Bids | 40 | Various bid states |
| Chat Conversations | 20 | With message history |
| Financial Records | 18 months | Historical data |

### Data Categories

**Products are organized into categories:**
- Electronics
- Machinery
- Textiles
- Food & Beverages
- Chemicals
- Construction Materials
- Automotive Parts
- Agricultural Products
- Medical Supplies

**Expense categories include:**
- Fuel
- Maintenance
- Tolls
- Food
- Accommodation
- Repairs
- Insurance
- Permits

---

## Deployment Guide

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (provided by Replit)
- JWT_SECRET environment variable configured

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing (32+ characters) |
| `NODE_ENV` | Auto | Set to "production" in deployment |
| `PORT` | No | Server port (defaults to 5003) |

### Build Process

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```
   This creates optimized production files in the `dist/` directory.

3. **Start production server:**
   ```bash
   npm run start
   ```

### Deployment Configuration

The application is configured for **Autoscale** deployment on Replit:

- **Build Command**: `npm run build`
- **Run Command**: `npm run start`
- **Port**: 5003 (internal) mapped to port 80 (external)

### Database Setup

For a fresh deployment:

1. **Push database schema:**
   ```bash
   npm run db:push
   ```

2. **Seed demo data (optional):**
   ```bash
   npm run db:seed
   ```

### Security Notes

- JWT_SECRET must be set in production (app will fail without it)
- Registration creates customer-role accounts only
- Admin accounts must be created via database or seed script
- All API endpoints (except login) require authentication

### Publishing Steps

1. Ensure `JWT_SECRET` is set in your Secrets
2. Verify the build succeeds: `npm run build`
3. Click the "Publish" button in Replit
4. Select "Autoscale" deployment type
5. Configure your custom domain (optional)
6. Click "Publish" to deploy

### Post-Deployment Verification

1. Visit your deployed URL
2. Login with demo credentials (e.g., admin/12345)
3. Navigate through main features
4. Check API health: `https://your-domain.com/api/health`

---

## API Reference

### Authentication

#### Login
```
POST /api/auth/login
Body: { "username": string, "password": string }
Response: { "token": string, "user": object }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: User object
```

### Jobs

```
GET    /api/jobs              - List all jobs
GET    /api/jobs/:id          - Get job details
POST   /api/jobs              - Create job
PATCH  /api/jobs/:id          - Update job
DELETE /api/jobs/:id          - Delete job
POST   /api/jobs/:id/stops    - Add stop to job
PATCH  /api/jobs/:id/stops/:stopId - Update stop
```

### Customers

```
GET    /api/customers         - List customers (with pagination)
GET    /api/customers/:id     - Get customer details
POST   /api/customers         - Create customer
PATCH  /api/customers/:id     - Update customer
DELETE /api/customers/:id     - Delete customer
```

### Products

```
GET    /api/products          - List products (with filters)
GET    /api/products/:id      - Get product details
POST   /api/products          - Create product
PATCH  /api/products/:id      - Update product
DELETE /api/products/:id      - Delete product
```

### Vehicles

```
GET    /api/vehicles          - List vehicles
GET    /api/vehicles/:id      - Get vehicle details
POST   /api/vehicles          - Create vehicle
PATCH  /api/vehicles/:id      - Update vehicle
DELETE /api/vehicles/:id      - Delete vehicle
```

### Expenses

```
GET    /api/expenses          - List expenses (with filters)
GET    /api/expenses/summary  - Get expense summary
GET    /api/expenses/:id      - Get expense details
POST   /api/expenses          - Create expense
PATCH  /api/expenses/:id      - Update expense
DELETE /api/expenses/:id      - Delete expense
```

### Revenues

```
GET    /api/revenues          - List revenues
GET    /api/revenues/summary  - Get revenue summary
GET    /api/revenues/:id      - Get revenue details
POST   /api/revenues          - Create revenue
PATCH  /api/revenues/:id      - Update revenue
DELETE /api/revenues/:id      - Delete revenue
```

### Bids

```
GET    /api/bids              - List bids
GET    /api/bids/:id          - Get bid details
POST   /api/bids              - Create bid
POST   /api/bids/:id/submit   - Submit bid price
PATCH  /api/bids/:id          - Update bid
DELETE /api/bids/:id          - Delete bid
```

### Chat

```
GET    /api/chat              - List conversations
GET    /api/chat/:id          - Get conversation
GET    /api/chat/:id/messages - Get messages
POST   /api/chat              - Create conversation
POST   /api/chat/:id/messages - Send message
POST   /api/chat/:id/participants - Add participant
DELETE /api/chat/:id          - Delete conversation
```

### Dashboard

```
GET    /api/dashboard/stats        - Get dashboard statistics
GET    /api/dashboard/recent-jobs  - Get recent jobs
GET    /api/dashboard/revenue-chart - Get revenue chart data
```

---

## Support

For issues or questions, please contact the development team or refer to the codebase documentation in `replit.md`.
