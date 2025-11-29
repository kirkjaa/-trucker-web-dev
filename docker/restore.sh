#!/bin/bash

# Database Restore Script for Trucker Web
# This script restores a PostgreSQL database from a backup file

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
echo -e "${GREEN}║        🔄 Trucker Web - Database Restore                  ║${NC}"
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
    echo -e "${YELLOW}⚠️  PostgreSQL container is not running. Starting it...${NC}"
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

# Get backup file
if [ -n "$1" ]; then
    BACKUP_FILE="$1"
    # If relative path, check in backup directory
    if [ ! -f "$BACKUP_FILE" ] && [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
        BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    fi
else
    # List available backups
    echo -e "${BLUE}📁 Available backups:${NC}"
    if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR 2>/dev/null)" ]; then
        ls -lh "$BACKUP_DIR" | tail -10 | awk '{print "   " $9 " (" $5 ")"}'
        echo ""
        read -p "Enter backup filename: " BACKUP_FILE
        if [ ! -f "$BACKUP_FILE" ] && [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
            BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
        fi
    else
        echo -e "${YELLOW}⚠️  No backups found in $BACKUP_DIR${NC}"
        echo ""
        read -p "Enter full path to backup file: " BACKUP_FILE
    fi
fi

# Validate backup file
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

if [ ! -s "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file is empty: $BACKUP_FILE${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 Restore Configuration:${NC}"
echo -e "   Database:     ${GREEN}${POSTGRES_DB}${NC}"
echo -e "   User:         ${GREEN}${POSTGRES_USER}${NC}"
echo -e "   Backup File: ${GREEN}${BACKUP_FILE}${NC}"
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo -e "   Size:         ${GREEN}${BACKUP_SIZE}${NC}"
echo ""

# Warning
echo -e "${RED}⚠️  WARNING: This will replace all existing data in the database!${NC}"
echo -e "${YELLOW}   Make sure you have a current backup before proceeding.${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Restore cancelled.${NC}"
    exit 0
fi

# Check if database exists and has data
echo ""
echo -e "${BLUE}🔍 Checking current database state...${NC}"
TABLE_COUNT=$(docker exec trucker-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Database contains $TABLE_COUNT tables${NC}"
    read -p "Drop existing database and recreate? (yes/no): " DROP_DB
    if [ "$DROP_DB" = "yes" ]; then
        echo -e "${BLUE}🗑️  Dropping existing database...${NC}"
        docker exec trucker-postgres psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE IF EXISTS ${POSTGRES_DB};" >/dev/null 2>&1
        docker exec trucker-postgres psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE ${POSTGRES_DB};" >/dev/null 2>&1
        echo -e "${GREEN}✅ Database recreated${NC}"
    fi
fi

# Determine backup type (compressed or plain)
echo ""
echo -e "${BLUE}🔄 Restoring database...${NC}"

if [[ "$BACKUP_FILE" == *.gz ]]; then
    # Compressed backup
    echo -e "   Detected compressed backup (gzip)"
    if gunzip -c "$BACKUP_FILE" | docker exec -i trucker-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Database restored successfully!${NC}"
    else
        echo -e "${RED}❌ Restore failed!${NC}"
        echo "   Check the error messages above for details."
        exit 1
    fi
else
    # Plain SQL backup
    echo -e "   Detected plain SQL backup"
    if docker exec -i trucker-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$BACKUP_FILE" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Database restored successfully!${NC}"
    else
        echo -e "${RED}❌ Restore failed!${NC}"
        echo "   Check the error messages above for details."
        exit 1
    fi
fi

# Verify restore
echo ""
echo -e "${BLUE}🔍 Verifying restore...${NC}"
TABLE_COUNT=$(docker exec trucker-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Restore verified: $TABLE_COUNT tables found${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: No tables found after restore${NC}"
    echo "   The backup may be empty or the restore may have failed."
fi

echo ""
echo -e "${GREEN}✨ Restore completed!${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "   - Verify the data in the database"
echo -e "   - Restart the application if needed: docker-compose restart trucker-web"
echo -e "   - Test the application functionality"

