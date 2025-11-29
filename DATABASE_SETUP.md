# Database Setup Guide

## Overview

This guide explains the PostgreSQL database setup that has been added to the Docker deployment. The database schema is designed to support the full Trucker Web application backend.

## ⚠️ Important Note

**The current Next.js frontend does NOT connect directly to the database.** The database is provided for:
1. **Backend API Development**: When you build the backend API that serves this frontend
2. **Future Integration**: If you plan to migrate from external API to integrated backend
3. **Complete Stack**: For a full-stack deployment with backend included

## Database Services Included

### ✅ PostgreSQL (Required for Backend)

- **Image**: `postgres:16-alpine`
- **Port**: 5432 (internal only, exposed to host for management)
- **Volume**: Persistent data storage
- **Initialization**: Automatic schema creation on first startup

### ⚠️ Redis (Optional - Commented Out)

Redis is included as an optional service but commented out. Uncomment if you need:
- **Caching**: API response caching
- **Session Storage**: If switching from JWT to database sessions
- **Rate Limiting**: Request rate limiting
- **Real-time Features**: Pub/sub for real-time notifications
- **Queue Management**: Background job processing

## Quick Start

### 1. Update Environment Variables

Add to your `.env` file:

```bash
# PostgreSQL Configuration
POSTGRES_DB=trucker_web
POSTGRES_USER=trucker_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432

# Database Connection String (for backend API)
DATABASE_URL=postgresql://trucker_user:your_secure_password_here@postgres:5432/trucker_web
```

### 2. Start Services

```bash
docker-compose up -d
```

The database will automatically:
- Create the database
- Run the initialization script (`database/init.sql`)
- Set up all tables, indexes, and triggers

### 3. Verify Database

```bash
# Check if database is running
docker ps | grep postgres

# Check database logs
docker logs trucker-postgres

# Connect to database
docker exec -it trucker-postgres psql -U trucker_user -d trucker_web

# List tables
\dt

# Exit
\q
```

## Database Schema

The database includes comprehensive tables for:

### Core Entities
- **users** - System users (admin, organization users, drivers)
- **organizations** - Factories and Companies
- **drivers** - Driver profiles
- **trucks** - Vehicle information

### Business Logic
- **rfqs** - Request for Quotations
- **bids** - Company bids on RFQs
- **quotations** - Approved quotations/contracts
- **orders** - Shipping orders
- **factory_routes** - Route definitions
- **master_routes** - Master route templates

### Supporting
- **packages** - Subscription packages
- **coins** - Transaction/coin system
- **notifications** - User notifications
- **chat_rooms** & **chat_messages** - Messaging
- **provinces**, **districts**, **subdistricts** - Location master data
- **business_types**, **user_positions** - Master data

See `database/init.sql` for complete schema documentation.

## Connecting Backend API

### Option 1: Node.js/Express with Prisma

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Use the DATABASE_URL from .env
# Generate Prisma client from schema
npx prisma generate
```

### Option 2: Node.js/Express with TypeORM

```typescript
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "postgres",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [/* your entities */],
  synchronize: false, // Use migrations in production
});
```

### Option 3: Node.js/Express with Knex.js

```javascript
const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});
```

## Enabling Redis (Optional)

If you need Redis, uncomment the Redis service in `docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: trucker-redis
  command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-change_this_password}
  volumes:
    - redis_data:/data
  ports:
    - "${REDIS_PORT:-6379}:6379"
  restart: unless-stopped
  networks:
    - trucker-network
```

Add to `.env`:
```bash
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

## Database Management

### Backup

```bash
# Create backup
docker exec trucker-postgres pg_dump -U trucker_user trucker_web > backup_$(date +%Y%m%d).sql

# Backup with compression
docker exec trucker-postgres pg_dump -U trucker_user -Fc trucker_web > backup.dump
```

### Restore

```bash
# Restore from SQL
docker exec -i trucker-postgres psql -U trucker_user -d trucker_web < backup.sql

# Restore from dump
docker exec -i trucker-postgres pg_restore -U trucker_user -d trucker_web < backup.dump
```

### Access Database

```bash
# Connect via Docker
docker exec -it trucker-postgres psql -U trucker_user -d trucker_web

# Connect from host (if port is exposed)
psql -h localhost -p 5432 -U trucker_user -d trucker_web
```

## Migration Strategy

### For New Backend Development

1. **Use Prisma Migrate** (Recommended):
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Use TypeORM Migrations**:
   ```bash
   npm run typeorm migration:run
   ```

3. **Manual Migrations**: Use files in `database/migrations/`

### For Existing Backend

If you have an existing backend API:
1. Review the schema in `database/init.sql`
2. Create migration scripts to match your existing schema
3. Or adapt the provided schema to match your needs

## Performance Tuning

The Docker Compose includes optimized PostgreSQL settings. Adjust based on your server:

```yaml
command: >
  postgres
  -c shared_buffers=256MB      # 25% of RAM for small servers
  -c max_connections=200        # Adjust based on expected load
  -c effective_cache_size=1GB  # 50-75% of RAM
  -c work_mem=4MB              # Per connection
```

## Security Considerations

1. **Change Default Passwords**: Never use default passwords in production
2. **Network Isolation**: Database is only accessible from Docker network
3. **Backup Strategy**: Implement automated backups
4. **Connection Encryption**: Use SSL for production connections
5. **Access Control**: Limit database user permissions

## Troubleshooting

### Database Won't Start

```bash
# Check logs
docker logs trucker-postgres

# Check if port is in use
netstat -tuln | grep 5432

# Check volume permissions
docker volume inspect trucker-web-dev_postgres_data
```

### Connection Issues

```bash
# Verify database is healthy
docker exec trucker-postgres pg_isready -U trucker_user

# Test connection
docker exec trucker-postgres psql -U trucker_user -d trucker_web -c "SELECT 1;"
```

### Schema Errors

```bash
# Check initialization logs
docker logs trucker-postgres | grep -i error

# Re-run initialization (WARNING: This will drop existing data)
docker-compose down -v
docker-compose up -d
```

## Next Steps

1. **Build Backend API**: Create REST/GraphQL API using the database
2. **Update Frontend**: Point `NEXT_PUBLIC_API_BASE_URL` to your new backend
3. **Implement Authentication**: Connect NextAuth to database
4. **Add Seed Data**: Populate master data (provinces, districts, etc.)
5. **Set Up Monitoring**: Configure database monitoring

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeORM Documentation](https://typeorm.io/)
- [Database README](./database/README.md)

