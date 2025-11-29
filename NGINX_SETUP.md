# Nginx Reverse Proxy Setup for Trucker Web

This guide explains how to configure Nginx Reverse Proxy Manager (or standard Nginx) to work with the Trucker Web Docker container.

## Architecture Overview

```
Internet → Nginx Reverse Proxy (Port 80/443) → Docker Container (Port 5002, internal)
```

The Docker container runs on an internal network and is not directly exposed to the internet. Nginx handles:
- SSL/TLS termination
- Load balancing (if multiple instances)
- Static file caching
- Security headers
- Request routing

## Prerequisites

- Docker container running and accessible on internal network
- Nginx or Nginx Proxy Manager installed
- Domain name pointing to your VPS
- SSL certificate (Let's Encrypt recommended)

## Option 1: Using Nginx Proxy Manager (Recommended)

Nginx Proxy Manager provides a web UI for managing reverse proxies.

### Step 1: Add Proxy Host

1. Log into Nginx Proxy Manager web interface
2. Click **Proxy Hosts** → **Add Proxy Host**

### Step 2: Configure Details Tab

- **Domain Names**: `your-domain.com`, `www.your-domain.com`
- **Scheme**: `http`
- **Forward Hostname/IP**: `trucker-web` (Docker container name)
- **Forward Port**: `5002`
- **Cache Assets**: ✅ Enabled
- **Block Common Exploits**: ✅ Enabled
- **Websockets Support**: ✅ Enabled (for real-time features)

### Step 3: Configure SSL Tab

- **SSL Certificate**: Select or request a new Let's Encrypt certificate
- **Force SSL**: ✅ Enabled
- **HTTP/2 Support**: ✅ Enabled
- **HSTS Enabled**: ✅ Enabled
- **HSTS Subdomains**: ✅ Enabled (if using subdomains)

### Step 4: Advanced Tab (Optional)

Paste the following custom configuration:

```nginx
# Increase body size for file uploads
client_max_body_size 50M;

# Static files caching
location /_next/static {
    proxy_cache_valid 200 60m;
    add_header Cache-Control "public, immutable";
}

location /images {
    proxy_cache_valid 200 30m;
    add_header Cache-Control "public";
}

location /icons {
    proxy_cache_valid 200 60m;
    add_header Cache-Control "public, immutable";
}
```

### Step 5: Connect to Docker Network

If Nginx Proxy Manager is running in Docker, ensure it's on the same network:

```bash
# Check if trucker-web network exists
docker network ls | grep trucker

# Connect Nginx Proxy Manager to the network
docker network connect trucker-network <nginx-proxy-manager-container-name>
```

Or update your docker-compose.yml to use an external network:

```yaml
networks:
  trucker-network:
    external: true
    name: nginxproxymanager_default  # Or your nginx network name
```

## Option 2: Using Standard Nginx

### Step 1: Install Nginx Configuration

Copy the nginx configuration file:

```bash
sudo cp nginx/trucker-web.conf /etc/nginx/sites-available/trucker-web
```

### Step 2: Update Configuration

Edit the configuration file:

```bash
sudo nano /etc/nginx/sites-available/trucker-web
```

Update these values:
- `server_name`: Your domain name
- `upstream server`: Docker container name or IP
- SSL certificate paths (if using SSL)

### Step 3: Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/trucker-web /etc/nginx/sites-enabled/
```

### Step 4: Test Configuration

```bash
sudo nginx -t
```

### Step 5: Reload Nginx

```bash
sudo systemctl reload nginx
```

### Step 6: Connect to Docker Network

If Nginx is running on the host (not in Docker), you can:

**Option A**: Expose container port to host (not recommended for production)
```yaml
ports:
  - "127.0.0.1:5002:5002"  # Only accessible from localhost
```

**Option B**: Use Docker network IP
```bash
# Get container IP
docker inspect trucker-web | grep IPAddress

# Use this IP in nginx upstream instead of container name
```

**Option C**: Use host.docker.internal (if Nginx is in Docker)
```nginx
upstream trucker_web {
    server host.docker.internal:5002;
}
```

## Docker Compose Update for Nginx

Update your `docker-compose.yml` to work with Nginx:

```yaml
services:
  trucker-web:
    # ... existing configuration ...
    expose:
      - "5002"  # Expose internally only
    networks:
      - trucker-network
      - nginx-network  # Add nginx network if needed

networks:
  trucker-network:
    driver: bridge
  nginx-network:
    external: true  # If nginx is in separate compose file
```

## Environment Variables for Nginx

Update your `.env` file:

```bash
# Set NEXTAUTH_URL to your public domain
NEXTAUTH_URL=https://your-domain.com

# API base URL (should be accessible from browser)
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
```

## Testing the Setup

1. **Check container is running**:
   ```bash
   docker ps | grep trucker-web
   ```

2. **Test internal connection**:
   ```bash
   docker exec trucker-web wget -qO- http://localhost:5002/health-check
   ```

3. **Test through Nginx**:
   ```bash
   curl -I http://your-domain.com/health-check
   ```

4. **Check SSL** (if configured):
   ```bash
   curl -I https://your-domain.com/health-check
   ```

## Troubleshooting

### 502 Bad Gateway

**Cause**: Nginx can't reach the Docker container

**Solutions**:
1. Verify container is running: `docker ps`
2. Check container name matches nginx config
3. Ensure networks are connected: `docker network inspect trucker-network`
4. Test direct connection: `docker exec <nginx-container> wget http://trucker-web:5002`

### 504 Gateway Timeout

**Cause**: Application is slow or not responding

**Solutions**:
1. Check application logs: `docker logs trucker-web`
2. Increase nginx timeouts in configuration
3. Check if health check endpoint works: `curl http://your-domain.com/health-check`

### SSL Certificate Issues

**Solutions**:
1. Verify certificate is valid: `openssl x509 -in certificate.crt -text -noout`
2. Check certificate expiration
3. Ensure domain DNS is correctly configured
4. For Let's Encrypt, verify ACME challenge is accessible

### Static Files Not Loading

**Solutions**:
1. Check `/_next/static` path is proxied correctly
2. Verify file permissions in container
3. Check nginx cache settings
4. Clear browser cache

## Security Recommendations

1. **Enable SSL/TLS**: Always use HTTPS in production
2. **Security Headers**: Already configured in nginx config
3. **Rate Limiting**: Add rate limiting to prevent abuse:
   ```nginx
   limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
   limit_req zone=api_limit burst=20;
   ```

4. **Firewall**: Only expose ports 80 and 443, block 5002 from internet
5. **DDoS Protection**: Consider Cloudflare or similar service

## Performance Optimization

1. **Enable Caching**: Static files are cached as configured
2. **Gzip Compression**: Already enabled in nginx config
3. **HTTP/2**: Enable in SSL configuration
4. **CDN**: Consider using a CDN for static assets

## Monitoring

Monitor your setup:

```bash
# Container logs
docker logs -f trucker-web

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# Container resource usage
docker stats trucker-web
```

## Additional Resources

- [Nginx Proxy Manager Documentation](https://nginxproxymanager.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

