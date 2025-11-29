#!/bin/bash

# Database Backup Script for Trucker Web
# This script creates a backup of the PostgreSQL database

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

# Change to project root
cd "$PROJECT_ROOT"

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          🗄️  Trucker Web - Database Backup               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if container exists
if ! docker ps -a --format '{{.Names}}' | grep -q "^trucker-postgres$"; then
    echo -e "${RED}❌ PostgreSQL container 'trucker-postgres' not found.${NC}"
    echo "   Please start the application first using: ./docker/deploy.sh"
    exit 1
fi

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^trucker-postgres$"; then
    echo -e "${RED}❌ PostgreSQL container is not running.${NC}"
    echo "   Starting container..."
    docker-compose up -d postgres
    sleep 5
fi

# Load environment variables
ENV_FILE=""
if [ -f .env ]; then
    ENV_FILE=".env"
elif [ -f "$PROJECT_ROOT/.env" ]; then
    ENV_FILE="$PROJECT_ROOT/.env"
fi

if [ -n "$ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
fi

# Set defaults
POSTGRES_DB=${POSTGRES_DB:-trucker_web}
POSTGRES_USER=${POSTGRES_USER:-trucker_user}
BACKUP_DIR="${PROJECT_ROOT}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/trucker_web_backup_${TIMESTAMP}.sql"
BACKUP_FILE_COMPRESSED="${BACKUP_FILE}.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo -e "${BLUE}📋 Backup Configuration:${NC}"
echo -e "   Database:     ${GREEN}${POSTGRES_DB}${NC}"
echo -e "   User:         ${GREEN}${POSTGRES_USER}${NC}"
echo -e "   Backup File:  ${GREEN}${BACKUP_FILE}${NC}"
echo ""

# Ask for backup type
echo -e "${BLUE}Select backup format:${NC}"
echo "  1) SQL (plain text, larger file)"
echo "  2) Compressed (gzip, recommended)"
read -p "Enter choice [1-2] (default: 2): " BACKUP_TYPE
BACKUP_TYPE=${BACKUP_TYPE:-2}

echo ""
echo -e "${BLUE}🔄 Creating backup...${NC}"

# Create backup
if [ "$BACKUP_TYPE" = "1" ]; then
    # Plain SQL backup
    if docker exec trucker-postgres pg_dump -U "$POSTGRES_USER" -F p "$POSTGRES_DB" > "$BACKUP_FILE" 2>/dev/null; then
        BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        echo -e "${GREEN}✅ Backup created successfully!${NC}"
        echo -e "   File: ${GREEN}${BACKUP_FILE}${NC}"
        echo -e "   Size: ${GREEN}${BACKUP_SIZE}${NC}"
    else
        echo -e "${RED}❌ Backup failed!${NC}"
        rm -f "$BACKUP_FILE"
        exit 1
    fi
else
    # Compressed backup
    if docker exec trucker-postgres pg_dump -U "$POSTGRES_USER" -F p "$POSTGRES_DB" | gzip > "$BACKUP_FILE_COMPRESSED" 2>/dev/null; then
        BACKUP_SIZE=$(du -h "$BACKUP_FILE_COMPRESSED" | cut -f1)
        echo -e "${GREEN}✅ Backup created successfully!${NC}"
        echo -e "   File: ${GREEN}${BACKUP_FILE_COMPRESSED}${NC}"
        echo -e "   Size: ${GREEN}${BACKUP_SIZE}${NC}"
    else
        echo -e "${RED}❌ Backup failed!${NC}"
        rm -f "$BACKUP_FILE_COMPRESSED"
        exit 1
    fi
fi

# Verify backup
echo ""
echo -e "${BLUE}🔍 Verifying backup...${NC}"
if [ "$BACKUP_TYPE" = "1" ]; then
    if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
        echo -e "${GREEN}✅ Backup file is valid${NC}"
    else
        echo -e "${RED}❌ Backup file is invalid or empty${NC}"
        exit 1
    fi
else
    if [ -f "$BACKUP_FILE_COMPRESSED" ] && [ -s "$BACKUP_FILE_COMPRESSED" ]; then
        echo -e "${GREEN}✅ Backup file is valid${NC}"
    else
        echo -e "${RED}❌ Backup file is invalid or empty${NC}"
        exit 1
    fi
fi

# List recent backups
echo ""
echo -e "${BLUE}📁 Recent backups:${NC}"
ls -lh "$BACKUP_DIR" | tail -5 | awk '{print "   " $9 " (" $5 ")"}'

echo ""
echo -e "${GREEN}✨ Backup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "   - Store backups in a safe location"
echo -e "   - Set up automated backups using cron"
echo -e "   - Test restore procedure regularly"
echo -e "   - Keep multiple backup copies"

