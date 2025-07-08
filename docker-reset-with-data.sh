#!/bin/bash

echo "🔄 Complete database reset with test data..."

# Остановить контейнер
echo "⏹️ Stopping container..."
docker-compose -f docker-compose.dev.yml down

# Удалить старую базу
echo "🗑️ Removing old database..."
rm -rf ./data
mkdir -p ./data
chmod 777 ./data

echo "🚀 Starting container to create fresh database..."
# Запустить контейнер в фоне
docker-compose -f docker-compose.dev.yml up -d

# Подождать пока база создастся
echo "⏳ Waiting for database to initialize..."
sleep 10

# Остановить контейнер
echo "⏹️ Stopping container temporarily..."
docker-compose -f docker-compose.dev.yml down

# Добавить тестовые данные
echo "📦 Adding test data..."
if command -v node &> /dev/null; then
    node init-test-data.js
else
    echo "⚠️ Node.js not found locally, skipping test data"
fi

echo "🚀 Starting container with data..."
docker-compose -f docker-compose.dev.yml up