#!/bin/bash
# Database Restore Script
# Run with: ./restore_database.sh backup_file.db.gz

set -e

if [ -z "$1" ]; then
    echo "Usage: ./restore_database.sh <backup_file.db.gz>"
    exit 1
fi

BACKUP_FILE="$1"
DB_FILE="/app/backend/imtiaz_trading.db"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Create backup of current database
echo "Creating backup of current database..."
cp "$DB_FILE" "${DB_FILE}.pre-restore.$(date +%Y%m%d_%H%M%S)"

# Decompress and restore
echo "Restoring from: $BACKUP_FILE"
gunzip -c "$BACKUP_FILE" > "$DB_FILE"

echo "Restore completed successfully!"
echo "Previous database backed up with .pre-restore suffix"
