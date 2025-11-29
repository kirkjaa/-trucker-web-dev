# Database Setup

This directory contains the PostgreSQL database schema and initialization scripts for the Trucker Web application.

## Files

- `init.sql` - Complete database schema with all tables, indexes, and triggers
- `migrations/` - Directory for database migration files
- `.env.example` - Example environment variables for database configuration

## Database Schema Overview

The database includes the following main entities:

### Core Entities
- **Users** - System users (admin, organization users, drivers)
- **Organizations** - Factories and Companies
- **Drivers** - Driver profiles and information
- **Trucks** - Vehicle information and tracking

### Business Logic
- **RFQs** - Request for Quotations from factories
- **Bids** - Bids submitted by companies
- **Quotations** - Approved quotations/contracts
- **Orders** - Shipping orders
- **Routes** - Master routes and factory-specific routes

### Supporting Entities
- **Packages** - Subscription packages
- **Coins** - Transaction/coin system
- **Notifications** - User notifications
- **Chat** - Messaging system
- **Master Data** - Provinces, districts, business types, etc.

## Quick Start

### Using Docker Compose

The database is automatically initialized when you run:

```bash
docker-compose up -d
```

The `init.sql` file will be executed automatically on first startup.

### Manual Setup

1. **Create database:**
   ```bash
   docker exec -it trucker-postgres psql -U trucker_user -d postgres
   CREATE DATABASE trucker_web;
   \q
   ```

2. **Run initialization script:**
   ```bash
   docker exec -i trucker-postgres psql -U trucker_user -d trucker_web < database/init.sql
   ```

## Environment Variables

Add these to your `.env` file:

```bash
# PostgreSQL Configuration
POSTGRES_DB=trucker_web
POSTGRES_USER=trucker_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432

# Database Connection String
DATABASE_URL=postgresql://trucker_user:your_secure_password_here@postgres:5432/trucker_web
```

## Database Connection

### From Application Container

```bash
docker exec -it trucker-web sh
# Then use your database client or connection string
```

### From Host Machine

```bash
# Using psql
psql -h localhost -p 5432 -U trucker_user -d trucker_web

# Using connection string
psql postgresql://trucker_user:password@localhost:5432/trucker_web
```

## Database Management

### Backup

```bash
# Backup database
docker exec trucker-postgres pg_dump -U trucker_user trucker_web > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
docker exec trucker-postgres pg_dump -U trucker_user -Fc trucker_web > backup_$(date +%Y%m%d_%H%M%S).dump
```

### Restore

```bash
# Restore from SQL file
docker exec -i trucker-postgres psql -U trucker_user -d trucker_web < backup.sql

# Restore from dump file
docker exec -i trucker-postgres pg_restore -U trucker_user -d trucker_web < backup.dump
```

### Access Database

```bash
# Connect to PostgreSQL
docker exec -it trucker-postgres psql -U trucker_user -d trucker_web

# List all tables
\dt

# Describe a table
\d table_name

# Run a query
SELECT * FROM users LIMIT 10;
```

## Migrations

For production deployments, use a migration tool like:
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [TypeORM Migrations](https://typeorm.io/migrations)
- [Knex.js Migrations](https://knexjs.org/#Migrations)
- [Flyway](https://flywaydb.org/)

The `migrations/` directory is provided for custom migration scripts.

## Performance Tuning

The Docker Compose configuration includes optimized PostgreSQL settings:
- Shared buffers: 256MB
- Max connections: 200
- Effective cache size: 1GB
- Work memory: 4MB

Adjust these based on your server resources.

## Security

1. **Change default passwords** in production
2. **Use strong passwords** for database users
3. **Limit network access** - database is only accessible from Docker network
4. **Regular backups** - implement automated backup strategy
5. **Monitor logs** - check for suspicious activity

## Troubleshooting

### Database won't start

```bash
# Check logs
docker logs trucker-postgres

# Check if port is in use
netstat -tuln | grep 5432
```

### Connection refused

1. Verify database is running: `docker ps | grep postgres`
2. Check network connectivity: `docker network inspect trucker-network`
3. Verify credentials in `.env` file

### Schema errors

1. Check init.sql syntax
2. Verify PostgreSQL version compatibility
3. Check logs for specific error messages

## Schema Documentation

For detailed schema documentation, see the comments in `init.sql`. Each table includes:
- Column definitions with types
- Foreign key relationships
- Indexes for performance
- Triggers for automatic updates

## Next Steps

1. **Set up ORM/Query Builder**: Choose Prisma, TypeORM, or Knex.js
2. **Create API Backend**: Build REST/GraphQL API to interact with database
3. **Implement Authentication**: Connect NextAuth to database
4. **Add Seed Data**: Create scripts to populate master data
5. **Set up Monitoring**: Configure database monitoring and alerts

