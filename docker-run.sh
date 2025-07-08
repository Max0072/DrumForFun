#!/bin/bash

echo "🐳 Starting DrumForFun in Docker..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

# Собираем образ
echo "📦 Building Docker image..."
docker-compose -f docker-compose.dev.yml build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке образа"
    exit 1
fi

# Запускаем контейнер
echo "🚀 Starting container..."
docker-compose -f docker-compose.dev.yml up

echo "✅ Приложение запущено на http://localhost:3000"