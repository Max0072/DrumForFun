#!/bin/bash

echo "🚀 Простой деплой на VPS с SQLite..."

# Остановка и очистка существующих контейнеров
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# Удаляем pnpm-lock.yaml чтобы избежать конфликтов
echo "🧹 Очищаем конфликтующие файлы..."
rm -f pnpm-lock.yaml

# Создаем необходимые директории
echo "📁 Создаем директории..."
mkdir -p data
mkdir -p ssl

# Копируем базу данных если она есть
if [ -f "bookings.db" ]; then
    echo "📋 Копируем существующую базу данных..."
    cp bookings.db data/bookings.db
fi

# Собираем и запускаем
echo "🔨 Собираем и запускаем контейнеры..."
docker-compose -f docker-compose.simple.yml --env-file .env.production up -d --build

# Проверяем статус
echo "📊 Проверяем статус..."
docker-compose -f docker-compose.simple.yml  --env-file .env.production ps

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "🌐 Сайт доступен по адресу: http://164.92.208.159:3000"
echo "🔧 Админ панель: http://164.92.208.159:3000/admin/login"
echo ""
echo "📋 Полезные команды:"
echo "   Логи:     docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f"
echo "   Рестарт:  docker-compose -f docker-compose.prod.yml --env-file .env.production restart"
echo "   Стоп:     docker-compose -f docker-compose.prod.yml --env-file .env.production down"
echo ""