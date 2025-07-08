#!/bin/bash

echo "🔄 Restoring database with correct room setup..."

# Остановить контейнер
echo "⏹️ Stopping container..."
docker-compose -f docker-compose.dev.yml down

# Удалить старую базу если есть
echo "🗑️ Removing old database..."
rm -f ./data/bookings.db*

# Создать директорию data с правильными правами
echo "📁 Ensuring data directory..."
mkdir -p ./data
chmod 777 ./data

echo "✅ Database reset completed!"
echo "🚀 Starting container with fresh database..."

# Перезапустить контейнер - база создастся автоматически
docker-compose -f docker-compose.dev.yml up