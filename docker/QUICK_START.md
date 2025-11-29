# Quick Start Guide

## Common Issues & Solutions

### Issue: ".env file not found" or "Missing environment variables"

**Problem**: The `.env` file is in the wrong location or missing required values.

**Solution**:

1. **Ensure .env is in project root** (not in `docker/` directory):
   ```bash
   # From project root
   ls -la .env
   
   # Should show: .env in current directory
   # NOT: docker/.env
   ```

2. **Create .env file in project root**:
   ```bash
   cd ~/trucker-web-dev/trucker-web-dev  # Go to project root
   nano .env  # Or use your preferred editor
   ```

3. **Add required variables**:
   ```bash
   # Generate secrets
   openssl rand -base64 32  # Copy this for NEXTAUTH_SECRET
   openssl rand -base64 32  # Copy this for JWT_SECRET
   openssl rand -base64 32  # Copy this for REFRESH_TOKEN_SECRET
   openssl rand -base64 24  # Copy this for POSTGRES_PASSWORD
   ```

4. **Minimum .env file content**:
   ```bash
   NEXTAUTH_SECRET=<paste-generated-secret>
   NEXTAUTH_URL=http://localhost:5002
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   JWT_SECRET=<paste-generated-secret>
   REFRESH_TOKEN_SECRET=<paste-generated-secret>
   POSTGRES_PASSWORD=<paste-generated-secret>
   POSTGRES_DB=trucker_web
   POSTGRES_USER=trucker_user
   POSTGRES_PORT=5432
   GOOGLE_MAPS_API_KEY=your-key-here
   # Add Firebase variables...
   ```

### Issue: Running script from wrong directory

**Problem**: Running `./deploy.sh` from `docker/` directory.

**Solution**:

```bash
# Option 1: Run from project root
cd ~/trucker-web-dev/trucker-web-dev
./docker/deploy.sh

# Option 2: Run with full path
~/trucker-web-dev/trucker-web-dev/docker/deploy.sh
```

### Issue: "Permission denied" when running script

**Solution**:
```bash
chmod +x docker/deploy.sh
./docker/deploy.sh
```

## Step-by-Step Deployment

### 1. Navigate to Project Root

```bash
cd ~/trucker-web-dev/trucker-web-dev
```

### 2. Create .env File

```bash
# Create .env file
nano .env

# Or copy from template if available
cp env/env.production.example .env
nano .env
```

### 3. Generate and Add Secrets

```bash
# Generate all secrets at once
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)"
echo "POSTGRES_PASSWORD=$(openssl rand -base64 24)"
```

Copy the output and add to your `.env` file.

### 4. Run Deployment

```bash
# Make sure you're in project root
pwd  # Should show: .../trucker-web-dev/trucker-web-dev

# Run deployment
./docker/deploy.sh
```

## File Structure

```
trucker-web-dev/
├── .env                    ← Should be HERE (project root)
├── docker/
│   ├── deploy.sh
│   ├── Dockerfile
│   └── README.md
├── database/
│   └── init.sql
├── docker-compose.yml
└── ...
```

**NOT**:
```
trucker-web-dev/
├── docker/
│   ├── .env               ← WRONG LOCATION
│   └── deploy.sh
```

## Verification

After deployment, verify:

```bash
# Check services are running
docker-compose ps

# Check application
curl http://localhost:5002/health-check

# Check backend API
curl http://localhost:8000/health

# Check database
docker exec trucker-postgres pg_isready -U trucker_user
```

## Demo Accounts

The database automatically seeds demo data the first time it starts (passwords are `Demo@123`):

- Super Admin – `superadmin@demo.com`
- Factory Admin – `factory@demo.com`
- Company Admin – `company@demo.com`
- Driver – `driver@demo.com`

> To reseed, remove the `postgres_data` volume (`docker-compose down -v`) before redeploying.

## Backup & Recovery

- Create backup: `./docker/backup.sh`
- Restore backup: `./docker/restore.sh <backup-file>`

## Need Help?

1. Check logs: `docker-compose logs`
2. Verify .env location: `ls -la .env` (should be in project root)
3. Check script location: Run from project root, not docker/ directory

