# Nginx Proxy Manager Configuration for Trucker Apps

## Overview

This guide shows how to configure Nginx Proxy Manager (NPM) for both the desktop and mobile Trucker applications.

## Current Setup

| Service | Internal URL | External URL |
|---------|--------------|--------------|
| Desktop API | `http://91.98.172.75:5300` | `https://api.trw.q9.quest` |
| Desktop Web | `http://91.98.172.75:5002` | `https://trw.q9.quest` |
| **Mobile App** | `http://91.98.172.75:5003` | `https://m.trw.q9.quest` |

## Adding Mobile App to NPM

### Step 1: Add Proxy Host for Mobile App

1. Log into Nginx Proxy Manager admin panel
2. Go to **Proxy Hosts** → **Add Proxy Host**

### Step 2: Configure Details Tab

| Field | Value |
|-------|-------|
| **Domain Names** | `m.trw.q9.quest` |
| **Scheme** | `http` |
| **Forward Hostname / IP** | `91.98.172.75` |
| **Forward Port** | `5003` |
| **Cache Assets** | ✅ Enabled |
| **Block Common Exploits** | ✅ Enabled |
| **Websockets Support** | ✅ Enabled |

### Step 3: Configure SSL Tab

| Field | Value |
|-------|-------|
| **SSL Certificate** | Request a new SSL Certificate |
| **Force SSL** | ✅ Enabled |
| **HTTP/2 Support** | ✅ Enabled |
| **HSTS Enabled** | ✅ Enabled |
| **Email for Let's Encrypt** | your-email@example.com |

### Step 4: Advanced Tab (Optional)

Add custom Nginx configuration if needed:

```nginx
# Mobile app optimizations
location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Longer timeouts for API calls
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
}
```

### Step 5: Save and Test

1. Click **Save**
2. Wait for SSL certificate to be issued (may take a few minutes)
3. Test: `https://m.trw.q9.quest`

## DNS Configuration

Ensure you have an A record for the mobile subdomain:

```
m.trw.q9.quest    A    91.98.172.75
```

Or if using Cloudflare/DNS proxy:

```
m.trw.q9.quest    A    91.98.172.75    (Proxied or DNS only)
```

## Summary of All Proxy Hosts

After setup, you should have these proxy hosts in NPM:

| Domain | Forward To | SSL |
|--------|------------|-----|
| `api.trw.q9.quest` | `91.98.172.75:5300` | ✅ Let's Encrypt |
| `trw.q9.quest` | `91.98.172.75:5002` | ✅ Let's Encrypt |
| `m.trw.q9.quest` | `91.98.172.75:5003` | ✅ Let's Encrypt |

## Troubleshooting

### SSL Certificate Issues
- Ensure DNS is pointing to your server IP
- Wait a few minutes for DNS propagation
- Check that port 80 is accessible (for Let's Encrypt validation)

### Connection Refused
- Verify Docker container is running: `docker ps | grep trucker-mobile`
- Check container logs: `docker logs trucker-mobile`
- Ensure port 5003 is not blocked by firewall

### 502 Bad Gateway
- Container might still be starting up
- Check health endpoint: `curl http://91.98.172.75:5003/api/health`

