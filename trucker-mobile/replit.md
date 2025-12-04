# Trucker CMS

## Overview
This is a full-stack Trucker Content Management System built with React, TypeScript, Express.js, and PostgreSQL. The application provides a comprehensive trucking and logistics management platform with features for job management, chat, shipping, customer tracking, financial management, and more.

## Project Information
- **Name**: trucker-cms
- **Type**: Full-Stack Application
- **Frontend**: React 19.1.1 with TypeScript
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite (using rolldown-vite@7.1.14)
- **Styling**: TailwindCSS 4.1.17

## Architecture

### Tech Stack
- **Frontend**: React 19.1.1 with TypeScript
- **Backend**: Express.js 5.x with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with bcryptjs
- **Build Tool**: Vite 7.1.14 (rolldown variant)
- **Styling**: TailwindCSS 4.1.17 with PostCSS
- **Runtime**: Node.js with tsx

### Project Structure
```
/
├── public/              # Static assets
│   └── assets/
│       ├── icons/       # SVG icons
│       ├── images/      # Images
│       └── shipping/    # Shipping-related graphics
├── server/              # Backend API
│   ├── db/
│   │   ├── schema.ts    # Drizzle database schema
│   │   ├── index.ts     # Database connection
│   │   └── seed.ts      # Demo data seeder
│   ├── routes/          # API route handlers
│   │   ├── auth.ts      # Authentication
│   │   ├── jobs.ts      # Job management
│   │   ├── customers.ts # Customer CRUD
│   │   ├── products.ts  # Product CRUD
│   │   ├── vehicles.ts  # Vehicle management
│   │   ├── expenses.ts  # Expense tracking
│   │   ├── revenues.ts  # Revenue tracking
│   │   ├── bids.ts      # Bid management
│   │   ├── chat.ts      # Chat/messaging
│   │   └── dashboard.ts # Dashboard stats
│   ├── middleware/
│   │   └── auth.ts      # JWT authentication
│   └── index.ts         # Server entry point
├── src/                 # Frontend React app
│   ├── api/             # API client
│   ├── components/      # React components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── App.tsx          # Main application
│   └── main.tsx         # Entry point
├── drizzle.config.ts    # Drizzle ORM config
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

## Development

### Running Locally
The dev server runs both backend and frontend:
```bash
npm run dev
```
- Frontend: http://localhost:5003
- Backend API: http://localhost:3001

### Database Commands
```bash
npm run db:push      # Push schema to database
npm run db:seed      # Seed demo data
npm run db:generate  # Generate migrations
```

### Building for Production
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job
- `PATCH /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Customers, Products, Vehicles
Full CRUD endpoints available at:
- `/api/customers`
- `/api/products`
- `/api/vehicles`

### Finance
- `/api/expenses` - Expense tracking
- `/api/revenues` - Revenue management

### Other
- `/api/bids` - Bid management
- `/api/chat` - Messaging system
- `/api/dashboard` - Dashboard statistics

## Demo Data
The database is seeded with comprehensive demo data:
- **15 users** (admins, companies, customers, shipping)
- **65 jobs** with various statuses
- **150 customers** with order history
- **90 products** across categories
- **45 vehicles** with driver assignments
- **263 expenses** across jobs
- **42 revenue** records
- **40 bids** in various states
- **20 chat conversations** with messages
- **18 months** of financial records

### Default Login Credentials
All users have password: `12345`
- `admin` / `admin2` / `admin3` - Admin role
- `company` / `company2` / `company3` - Company role  
- `customer` / `customer2` / `customer3` - Customer role
- `shipping` / `shipping2` - `shipping6` - Shipping/Driver role

## User Roles
- **Admin**: Full system access, all features
- **Company**: Company operations, job management
- **Customer**: Customer workspace, order tracking
- **Shipping**: Driver workspace, delivery management

## Features
- User authentication with role-based access
- Job management (create, assign, track, complete)
- Job stops with check-in/check-out
- Real-time chat (private and group)
- Shipping dashboard with statistics
- Revenue and expense tracking
- Customer and product management
- Bid management system
- Vehicle fleet management
- Profile and settings management
- Partial delivery tracking

## Environment Variables
Required environment variables (automatically configured):
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

## Responsive Design
The application was originally designed as a 375x812px phone mockup from Figma. It now supports:

### Desktop View
- Shows phone mockup preview (centered, with shadow)
- Original Figma design preserved

### Mobile View (< 480px)
- Full-screen, native mobile experience
- No phone frame/mockup
- Safe area support for notched devices
- Touch-friendly tap targets (min 44px)
- Fixed bottom navigation with safe area padding
- Single-column layouts for forms
- Optimized spacing and typography

### Tablet View (481px - 768px)
- Responsive grid layouts
- Centered container with max-width

Key CSS files:
- `src/index.css` - Global responsive overrides
- `src/App.css` - Component-level responsive styles (end of file)

## Recent Changes
- **2025-11-28**: Chat interface redesign
  - Refactored Chat.jsx, PrivateChat.jsx, GroupChat.jsx components
  - Added semantic CSS classes using design token system
  - New message bubble styles (chat-bubble--incoming/outgoing)
  - New chat input area with modern styling
  - Conversation header with status indicators
  - Dropdown menu for group chat actions
  - Typing indicator animation
  - Touch-friendly 44px minimum tap targets
  - Collapsible conversation sections

- **2025-11-28**: Mobile responsive design implementation
  - Added CSS media queries for mobile devices
  - Full-screen layout on mobile (removes phone mockup frame)
  - Safe area insets for notched devices
  - Touch-optimized UI elements
  - Single-column forms on small screens
  - Fixed navigation with proper spacing

- **2025-11-28**: Full-stack backend implementation
  - Added Express.js backend with TypeScript
  - Created PostgreSQL database schema with Drizzle ORM
  - Implemented all CRUD API endpoints
  - Created comprehensive seed data
  - Integrated frontend with backend API
  - Configured JWT authentication

## Documentation
For comprehensive documentation including deployment guide, demo data details, and full API reference, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## Notes
- API runs on port 3001, proxied through Vite on port 5003
- All API requests require JWT authentication (except login/register)
- Database uses PostgreSQL with Drizzle ORM for type-safe queries
- Frontend uses Vite proxy for API requests in development
