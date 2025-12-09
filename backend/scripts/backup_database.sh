#!/bin/bash
# Database Backup Script
# Run with: ./backup_database.sh

set -e

# Configuration
BACKUP_DIR="/app/backend/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_FILE="/app/backend/imtiaz_trading.db"
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.db"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating backup: $BACKUP_FILE"
cp "$DB_FILE" "$BACKUP_FILE"

# Compress backup
echo "Compressing backup..."
gzip "$BACKUP_FILE"

# Keep only last 7 backups
echo "Cleaning old backups..."
ls -t "$BACKUP_DIR"/backup_*.db.gz | tail -n +8 | xargs -r rm

echo "Backup completed: $BACKUP_FILE.gz"

# Optional: Upload to cloud storage
# aws s3 cp "$BACKUP_FILE.gz" s3://your-bucket/backups/
# gcloud storage cp "$BACKUP_FILE.gz" gs://your-bucket/backups/
