# Database Backup and Restore Guide

This guide explains how to backup and restore the PostgreSQL database for Trucker Web.

## Quick Start

### Create a Backup

```bash
# Make script executable (if not already)
chmod +x docker/backup.sh

# Run backup
./docker/backup.sh
```

### Restore from Backup

```bash
# Make script executable (if not already)
chmod +x docker/restore.sh

# Restore from backup
./docker/restore.sh [backup-file]
```

## Backup Script (`docker/backup.sh`)

### Features

- ✅ Automatic backup creation with timestamp
- ✅ Supports both SQL and compressed (gzip) formats
- ✅ Verifies backup integrity
- ✅ Lists recent backups
- ✅ Safe error handling

### Usage

```bash
./docker/backup.sh
```

The script will:
1. Check if Docker and PostgreSQL container are running
2. Load database configuration from `.env` file
3. Ask for backup format (SQL or compressed)
4. Create backup in `backups/` directory
5. Verify backup integrity
6. Display backup information

### Backup Location

Backups are stored in: `./backups/`

Format: `trucker_web_backup_YYYYMMDD_HHMMSS.sql` or `.sql.gz`

### Backup Formats

1. **SQL (Plain Text)**
   - Larger file size
   - Human-readable
   - Easy to inspect/edit

2. **Compressed (gzip)** - Recommended
   - Smaller file size (typically 70-90% reduction)
   - Faster to transfer
   - Same restore process

## Restore Script (`docker/restore.sh`)

### Features

- ✅ Interactive backup selection
- ✅ Supports both SQL and compressed backups
- ✅ Safety confirmation before restore
- ✅ Database recreation option
- ✅ Restore verification

### Usage

```bash
# Interactive mode (lists available backups)
./docker/restore.sh

# Direct mode (specify backup file)
./docker/restore.sh backups/trucker_web_backup_20240101_120000.sql.gz
```

### Restore Process

1. **Select Backup File**
   - Lists available backups in `backups/` directory
   - Or specify backup file path directly

2. **Safety Confirmation**
   - Warns about data replacement
   - Requires explicit "yes" confirmation

3. **Database State Check**
   - Checks if database has existing data
   - Option to drop and recreate database

4. **Restore Execution**
   - Automatically detects backup format (SQL or gzip)
   - Restores database from backup

5. **Verification**
   - Verifies tables were restored
   - Reports restore status

## Automated Backups

### Using Cron (Linux/Mac)

Add to crontab for daily backups at 2 AM:

```bash
crontab -e
```

Add this line:
```cron
0 2 * * * /path/to/trucker-web-dev/docker/backup.sh >> /var/log/trucker-backup.log 2>&1
```

### Using Task Scheduler (Windows)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (daily, weekly, etc.)
4. Set action: Start a program
5. Program: `bash` or `wsl`
6. Arguments: `-c "/path/to/docker/backup.sh"`

### Backup Retention

To keep only the last N backups, add this to your cron script:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
KEEP_BACKUPS=7  # Keep last 7 backups

# Run backup
/path/to/docker/backup.sh

# Remove old backups
cd "$BACKUP_DIR"
ls -t | tail -n +$((KEEP_BACKUPS + 1)) | xargs rm -f
```

## Manual Backup Commands

### Create Backup Manually

```bash
# Plain SQL backup
docker exec trucker-postgres pg_dump -U trucker_user trucker_web > backup.sql

# Compressed backup
docker exec trucker-postgres pg_dump -U trucker_user trucker_web | gzip > backup.sql.gz

# Custom format (smallest, fastest)
docker exec trucker-postgres pg_dump -U trucker_user -Fc trucker_web > backup.dump
```

### Restore Manually

```bash
# From SQL file
docker exec -i trucker-postgres psql -U trucker_user -d trucker_web < backup.sql

# From compressed SQL
gunzip -c backup.sql.gz | docker exec -i trucker-postgres psql -U trucker_user -d trucker_web

# From custom format
docker exec -i trucker-postgres pg_restore -U trucker_user -d trucker_web < backup.dump
```

## Backup Best Practices

### 1. Regular Backups

- **Production**: Daily backups (minimum)
- **Development**: Weekly backups
- **Before major changes**: Always backup first

### 2. Backup Storage

- ✅ Store backups in multiple locations
- ✅ Use cloud storage (S3, Google Drive, etc.)
- ✅ Keep backups off-site
- ✅ Encrypt sensitive backups

### 3. Backup Testing

- ✅ Test restore procedure regularly
- ✅ Verify backup integrity
- ✅ Document restore process
- ✅ Keep restore scripts updated

### 4. Backup Retention

- ✅ Keep daily backups for 7 days
- ✅ Keep weekly backups for 4 weeks
- ✅ Keep monthly backups for 12 months
- ✅ Keep yearly backups indefinitely

## Troubleshooting

### Backup Fails

**Error**: "Container not found"
- **Solution**: Start the application first: `./docker/deploy.sh`

**Error**: "Permission denied"
- **Solution**: Make script executable: `chmod +x docker/backup.sh`

**Error**: "Backup file is empty"
- **Solution**: Check database connection and container status
- **Solution**: Verify database name and user in `.env` file

### Restore Fails

**Error**: "Backup file not found"
- **Solution**: Check file path and permissions
- **Solution**: Use absolute path if relative path fails

**Error**: "Database connection failed"
- **Solution**: Ensure PostgreSQL container is running
- **Solution**: Verify database credentials in `.env` file

**Error**: "Restore verification failed"
- **Solution**: Check backup file integrity
- **Solution**: Try restoring to a new database first
- **Solution**: Check PostgreSQL logs: `docker logs trucker-postgres`

## Backup Scripts Location

- **Backup Script**: `docker/backup.sh`
- **Restore Script**: `docker/restore.sh`
- **Backup Directory**: `backups/` (created automatically)

## Environment Variables

The scripts use these variables from `.env`:

- `POSTGRES_DB` - Database name (default: `trucker_web`)
- `POSTGRES_USER` - Database user (default: `trucker_user`)
- `POSTGRES_PASSWORD` - Database password

## Security Considerations

1. **Backup File Permissions**
   ```bash
   chmod 600 backups/*.sql*
   ```

2. **Encrypt Backups**
   ```bash
   # Create encrypted backup
   docker exec trucker-postgres pg_dump -U trucker_user trucker_web | gzip | openssl enc -aes-256-cbc -salt -out backup.sql.gz.enc
   
   # Decrypt and restore
   openssl enc -d -aes-256-cbc -in backup.sql.gz.enc | gunzip | docker exec -i trucker-postgres psql -U trucker_user -d trucker_web
   ```

3. **Secure Backup Storage**
   - Use encrypted storage
   - Limit access to backup files
   - Rotate backup encryption keys

## Examples

### Daily Automated Backup

```bash
#!/bin/bash
# /etc/cron.daily/trucker-backup

cd /path/to/trucker-web-dev
./docker/backup.sh

# Upload to S3 (example)
aws s3 cp backups/*.sql.gz s3://my-backup-bucket/trucker-web/ --recursive --exclude "*" --include "*.sql.gz"
```

### Restore to Test Environment

```bash
# Stop application
docker-compose down

# Restore backup
./docker/restore.sh backups/trucker_web_backup_20240101_120000.sql.gz

# Restart application
docker-compose up -d
```

## Additional Resources

- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
- [Docker Backup Best Practices](https://docs.docker.com/storage/volumes/#backup-restore-or-migrate-data-volumes)

