#!/bin/bash

echo "🔧 Fixing SQLite database permissions for Docker..."

# Остановить контейнер
echo "⏹️ Stopping container..."
docker-compose -f docker-compose.dev.yml down

# Создать директорию data с правильными правами
echo "📁 Creating data directory..."
mkdir -p ./data
chmod 777 ./data

# Если база данных существует в корне, переместить её
if [ -f "./bookings.db" ]; then
    echo "📦 Moving existing database..."
    mv ./bookings.db ./data/bookings.db
fi

# Установить права на базу данных
if [ -f "./data/bookings.db" ]; then
    chmod 666 ./data/bookings.db
fi

echo "✅ Database permissions fixed!"
echo "🚀 Starting container..."

# Перезапустить контейнер
docker-compose -f docker-compose.dev.yml up