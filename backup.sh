#!/bin/bash
# backup.sh - Автоматический backup базы данных

BACKUP_DIR="/root/backups"
DATE=$(date +"%Y%m%d_%H%M%S")

# Создаем директорию для backup
mkdir -p $BACKUP_DIR

# Backup базы данных
docker-compose exec -T db pg_dump -U drumschool drumschool > $BACKUP_DIR/drumschool_$DATE.sql

# Архивируем
tar -czf $BACKUP_DIR/drumschool_$DATE.tar.gz $BACKUP_DIR/drumschool_$DATE.sql
rm $BACKUP_DIR/drumschool_$DATE.sql

# Удаляем backup старше 30 дней
find $BACKUP_DIR -name "drumschool_*.tar.gz" -mtime +30 -delete

echo "✅ Backup создан: drumschool_$DATE.tar.gz"