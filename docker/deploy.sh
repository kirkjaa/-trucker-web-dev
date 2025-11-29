#!/bin/bash

# Docker Deployment Script for Trucker Web
# This script helps deploy the complete application stack using Docker
# Includes: Next.js Frontend, PostgreSQL Database, and optional Redis

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     🚀 Trucker Web - Complete Docker Deployment           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# ============================================================================
# CLEANUP CHECK
# ============================================================================

echo -e "${YELLOW}⚠️  Do you want to perform a CLEAN deployment?${NC}"
echo "   This will STOP all services and WIPE ALL DATA (database reset)."
echo "   Use this if you are experiencing database issues or want a fresh start."
read -p "Perform clean deployment? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🧹 Cleaning up old resources...${NC}"
    if command -v docker compose &> /dev/null; then
        docker compose down -v
    elif command -v docker-compose &> /dev/null; then
        docker-compose down -v
    fi
    echo -e "${GREEN}✅ Cleanup complete. Starting fresh deployment.${NC}"
fi
echo ""

# ============================================================================
# PREREQUISITE CHECKS
# ============================================================================

echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"

# Check if Docker Compose is available
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    echo -e "${GREEN}✅ Docker Compose (v2) is available${NC}"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
    echo -e "${GREEN}✅ Docker Compose (v1) is available${NC}"
else
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose and try again.${NC}"
    exit 1
fi

# Check if .env file exists (check both current dir and project root)
ENV_FILE=""
if [ -f .env ]; then
    ENV_FILE=".env"
elif [ -f "$PROJECT_ROOT/.env" ]; then
    ENV_FILE="$PROJECT_ROOT/.env"
elif [ -f docker/.env ]; then
    echo -e "${YELLOW}⚠️  Found .env in docker/ directory${NC}"
    echo "   The .env file should be in the project root, not in docker/"
    read -p "Move .env to project root? (Y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        mv docker/.env "$PROJECT_ROOT/.env"
        ENV_FILE="$PROJECT_ROOT/.env"
        echo -e "${GREEN}✅ Moved .env to project root${NC}"
    else
        echo -e "${YELLOW}⚠️  Using .env from docker/ directory (not recommended)${NC}"
        ENV_FILE="docker/.env"
    fi
fi

if [ -z "$ENV_FILE" ] || [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found in project root${NC}"
    echo ""
    echo "The .env file should be located at: $PROJECT_ROOT/.env"
    echo ""
    echo "Creating .env file from template..."
    
    ENV_TEMPLATE="$PROJECT_ROOT/env/env.production.example"
    if [ -f "$ENV_TEMPLATE" ]; then
        cp "$ENV_TEMPLATE" "$PROJECT_ROOT/.env"
        echo -e "${GREEN}✅ Created .env from env/env.production.example${NC}"
        ENV_FILE="$PROJECT_ROOT/.env"
    else
        echo -e "${YELLOW}⚠️  No .env template found. Creating basic .env file...${NC}"
        cat > "$PROJECT_ROOT/.env" << EOF
# NextAuth Configuration
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:5002

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://trucker-api:5300
API_PORT=5300

# JWT Configuration
JWT_SECRET=
REFRESH_TOKEN_SECRET=
JWT_ACCESS_TOKEN_EXPIRES_IN=900
JWT_REFRESH_TOKEN_EXPIRES_IN=604800

# Google Maps API
GOOGLE_MAPS_API_KEY=

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# PostgreSQL Configuration
POSTGRES_DB=trucker_web
POSTGRES_USER=trucker_user
POSTGRES_PASSWORD=
POSTGRES_PORT=5432
EOF
    fi
    
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Please edit .env file and fill in all required values!${NC}"
    echo ""
    echo "You can generate secrets using:"
    echo "  openssl rand -base64 32  # For NEXTAUTH_SECRET, JWT_SECRET, etc."
    echo ""
    read -p "Press Enter to continue after editing .env file, or Ctrl+C to exit..."
    ENV_FILE="$PROJECT_ROOT/.env"
fi

# Ensure we're using the correct .env file path
if [ -z "$ENV_FILE" ]; then
    ENV_FILE="$PROJECT_ROOT/.env"
fi

# Display .env file location
if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ Using .env file: $ENV_FILE${NC}"
else
    echo -e "${RED}❌ .env file not found at: $ENV_FILE${NC}"
    echo "   Please create the .env file in the project root directory."
    exit 1
fi

# Validate critical environment variables
echo -e "${BLUE}🔍 Validating environment variables...${NC}"
# Source the .env file (handle both relative and absolute paths)
if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
else
    echo -e "${RED}❌ Cannot load .env file: $ENV_FILE${NC}"
    exit 1
fi

MISSING_VARS=()

# Check required variables
if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" = "" ]; then
    MISSING_VARS+=("NEXTAUTH_SECRET")
fi
if [ -z "$NEXTAUTH_URL" ] || [ "$NEXTAUTH_URL" = "" ]; then
    MISSING_VARS+=("NEXTAUTH_URL")
fi
if [ -z "$NEXT_PUBLIC_API_BASE_URL" ] || [ "$NEXT_PUBLIC_API_BASE_URL" = "" ]; then
    MISSING_VARS+=("NEXT_PUBLIC_API_BASE_URL")
fi
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "" ]; then
    MISSING_VARS+=("JWT_SECRET")
fi
if [ -z "$REFRESH_TOKEN_SECRET" ] || [ "$REFRESH_TOKEN_SECRET" = "" ]; then
    MISSING_VARS+=("REFRESH_TOKEN_SECRET")
fi
if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "" ] || [ "$POSTGRES_PASSWORD" = "change_this_password" ]; then
    MISSING_VARS+=("POSTGRES_PASSWORD")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing or invalid environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "   - ${RED}$var${NC}"
    done
    echo ""
    echo -e "${YELLOW}⚠️  Please update your .env file with valid values.${NC}"
    echo ""
    echo "Location: $ENV_FILE"
    echo ""
    echo "Quick fix - generate secrets:"
    echo "  NEXTAUTH_SECRET=$(openssl rand -base64 32)"
    echo "  JWT_SECRET=$(openssl rand -base64 32)"
    echo "  REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)"
    echo "  POSTGRES_PASSWORD=$(openssl rand -base64 24)"
    echo ""
    echo "Add these to your .env file, then run the script again."
    exit 1
fi

    echo -e "${GREEN}✅ Environment variables validated${NC}"

# Function to check if port is in use
check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo -e "${YELLOW}⚠️  Port $port is already in use${NC}"
        if [ -n "$service" ]; then
            echo -e "   This might conflict with $service"
        fi
        read -p "Do you want to continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Check ports
echo -e "${BLUE}🔍 Checking ports...${NC}"
check_port 5002 "Next.js application"
check_port 5300 "Backend API"
check_port 5432 "PostgreSQL database"
echo -e "${GREEN}✅ Ports available${NC}"

# ============================================================================
# DATABASE SETUP CHECK
# ============================================================================

echo ""
echo -e "${BLUE}🗄️  Checking database setup...${NC}"

# Check if database init script exists
if [ ! -f "database/init.sql" ]; then
    echo -e "${YELLOW}⚠️  Warning: database/init.sql not found${NC}"
    echo "   Database will be created but schema initialization may fail."
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Database schema file found${NC}"
fi

# ============================================================================
# DOCKER BUILD
# ============================================================================

echo ""
echo -e "${BLUE}📦 Building Docker images...${NC}"

# Build the application
if $DOCKER_COMPOSE_CMD build --no-cache 2>&1 | tee /tmp/docker-build.log; then
    echo -e "${GREEN}✅ Docker images built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    echo "Check the build log above for errors."
    exit 1
fi

# ============================================================================
# START SERVICES
# ============================================================================

echo ""
echo -e "${BLUE}🚀 Starting services...${NC}"

# Start services
if $DOCKER_COMPOSE_CMD up -d; then
    echo -e "${GREEN}✅ Services started${NC}"
else
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi

# ============================================================================
# HEALTH CHECKS
# ============================================================================

echo ""
echo -e "${BLUE}🏥 Waiting for services to be healthy...${NC}"

# Wait for PostgreSQL
echo -n "Waiting for PostgreSQL"
for i in {1..60}; do
    if docker exec trucker-postgres pg_isready -U ${POSTGRES_USER:-trucker_user} -d ${POSTGRES_DB:-trucker_web} >/dev/null 2>&1; then
        echo ""
        echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 60 ]; then
        echo ""
        echo -e "${RED}❌ PostgreSQL failed to start within 60 seconds${NC}"
        echo "Check logs with: docker-compose logs postgres"
        echo "Or: docker logs trucker-postgres"
        exit 1
    fi
done

# Wait for Next.js application
echo -n "Waiting for Next.js application"
for i in {1..60}; do
    if curl -f http://localhost:5002/health-check >/dev/null 2>&1 || \
       docker exec trucker-web node -e "require('http').get('http://localhost:5002/health-check', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" >/dev/null 2>&1; then
        echo ""
        echo -e "${GREEN}✅ Next.js application is ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
    if [ $i -eq 60 ]; then
        echo ""
        echo -e "${YELLOW}⚠️  Application may still be starting...${NC}"
        echo "   This is normal for first startup. Check logs if issues persist."
    fi
done

# ============================================================================
# DATABASE VERIFICATION
# ============================================================================

echo ""
echo -e "${BLUE}🔍 Verifying database setup...${NC}"

# Check if database was initialized
if docker exec trucker-postgres psql -U ${POSTGRES_USER:-trucker_user} -d ${POSTGRES_DB:-trucker_web} -c "\dt" >/dev/null 2>&1; then
    TABLE_COUNT=$(docker exec trucker-postgres psql -U ${POSTGRES_USER:-trucker_user} -d ${POSTGRES_DB:-trucker_web} -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    if [ "$TABLE_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ Database initialized with $TABLE_COUNT tables${NC}"
    else
        echo -e "${YELLOW}⚠️  Database connected but no tables found${NC}"
        echo "   Run: docker exec -i trucker-postgres psql -U ${POSTGRES_USER:-trucker_user} -d ${POSTGRES_DB:-trucker_web} < database/init.sql"
    fi
else
    echo -e "${YELLOW}⚠️  Could not verify database tables${NC}"
    echo "   Database may still be initializing..."
fi

# ============================================================================
# FINAL STATUS
# ============================================================================

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ Deployment Complete!                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Show service status
echo -e "${BLUE}📊 Service Status:${NC}"
$DOCKER_COMPOSE_CMD ps

# Get server IP address
SERVER_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || hostname -i 2>/dev/null || echo "localhost")

echo ""
echo -e "${BLUE}🌐 Access Information:${NC}"
echo -e "   Local Access:"
echo -e "     Frontend:     ${GREEN}http://localhost:5002${NC}"
echo -e "     Backend API:  ${GREEN}http://localhost:5300${NC}"
echo -e "     Health Check: ${GREEN}http://localhost:5002/health-check${NC}"
if [ "$SERVER_IP" != "localhost" ]; then
    echo -e "   Network Access:"
    echo -e "     Frontend:     ${GREEN}http://${SERVER_IP}:5002${NC}"
    echo -e "     Backend API:  ${GREEN}http://${SERVER_IP}:5300${NC}"
    echo -e "     Health Check: ${GREEN}http://${SERVER_IP}:5002/health-check${NC}"
fi
echo -e "   Database:"
echo -e "     Host:         ${GREEN}localhost${NC}"
echo -e "     Port:         ${GREEN}${POSTGRES_PORT:-5432}${NC}"
echo -e "     Database:     ${GREEN}${POSTGRES_DB:-trucker_web}${NC}"
echo -e "     Username:     ${GREEN}${POSTGRES_USER:-trucker_user}${NC}"

echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo -e "   View logs:        ${GREEN}$DOCKER_COMPOSE_CMD logs -f${NC}"
echo -e "   View app logs:    ${GREEN}$DOCKER_COMPOSE_CMD logs -f trucker-web${NC}"
echo -e "   View DB logs:     ${GREEN}$DOCKER_COMPOSE_CMD logs -f postgres${NC}"
echo -e "   Stop services:    ${GREEN}$DOCKER_COMPOSE_CMD down${NC}"
echo -e "   Restart services:  ${GREEN}$DOCKER_COMPOSE_CMD restart${NC}"
echo -e "   Service status:   ${GREEN}$DOCKER_COMPOSE_CMD ps${NC}"

echo ""
echo -e "${BLUE}🗄️  Database Commands:${NC}"
echo -e "   Connect to DB:     ${GREEN}docker exec -it trucker-postgres psql -U ${POSTGRES_USER:-trucker_user} -d ${POSTGRES_DB:-trucker_web}${NC}"
echo -e "   List tables:       ${GREEN}docker exec trucker-postgres psql -U ${POSTGRES_USER:-trucker_user} -d ${POSTGRES_DB:-trucker_web} -c \"\\dt\"${NC}"
echo -e "   Backup database:   ${GREEN}./docker/backup.sh${NC}"
echo -e "   Restore database:  ${GREEN}./docker/restore.sh <backup-file>${NC}"

echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo -e "   1. For production, configure Nginx reverse proxy (see NGINX_SETUP.md)"
echo -e "   2. Change all default passwords in .env file"
echo -e "   3. Set up automated database backups"
echo -e "   4. Configure SSL/TLS certificates"
echo -e "   5. Update NEXTAUTH_URL to your production domain"

echo ""
echo -e "${GREEN}✨ Deployment completed successfully!${NC}"
