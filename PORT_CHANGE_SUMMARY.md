# Port Change Summary: 3000 → 5002

## Changes Made

The application port has been iteratively migrated from **3000** → **6000** and now to **5002** for Docker deployment.

## Files Updated

### Configuration Files
- ✅ `docker-compose.yml` - Port environment variable, expose, health check
- ✅ `docker/Dockerfile` - PORT env var, EXPOSE directive, default NEXTAUTH_URL
- ✅ `next.config.ts` - Default NEXTAUTH_URL

### Scripts
- ✅ `docker/deploy.sh` - Port checks, health check URLs, access information

### Nginx Configuration
- ✅ `nginx/trucker-web.conf` - Upstream server port

### Documentation
- ✅ `DOCKER.md` - All port references
- ✅ `NGINX_SETUP.md` - All port references
- ✅ `README.md` - Access URLs
- ✅ `DEPLOYMENT_GUIDE.md` - Port references
- ✅ `docker/QUICK_START.md` - Port references

## Port Configuration

### Application
- **Internal Port**: 5002 (inside container)
- **External Port**: 5002 (if exposed to host)
- **Nginx Proxy**: Points to `trucker-web:5002`

### Database
- **Port**: 5432 (unchanged)

## Important Notes

1. **Update Nginx Configuration**: If you've already configured Nginx, update the upstream port to 5002
2. **Update .env File**: Set `NEXTAUTH_URL` to use port 5002 if accessing directly:
   ```bash
   NEXTAUTH_URL=http://localhost:5002
   ```
3. **Firewall Rules**: Update firewall rules if you had specific rules for port 3000
4. **Health Checks**: All health check endpoints now use port 5002

## Verification

After deployment, verify the application is accessible:

```bash
# Check if port 5002 is listening
netstat -tuln | grep 5002

# Test health check
curl http://localhost:5002/health-check

# Check container logs
docker-compose logs trucker-web
```

## Nginx Proxy Manager Update

If using Nginx Proxy Manager, update:
- **Forward Port**: Change from `3000`/`6000` to `5002`
- Container name remains: `trucker-web`

---

**Status**: ✅ All port references updated to 5002

