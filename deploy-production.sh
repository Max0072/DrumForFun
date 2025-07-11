#!/bin/bash

echo "🚀 Production деплой DrumForFun на порты 80/443..."

# Проверяем что запускаем от root или с sudo
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Запустите скрипт от root или с sudo"
    echo "Использование: sudo ./deploy-production.sh"
    exit 1
fi

# Проверяем наличие .env.production
if [ ! -f ".env.production" ]; then
    echo "❌ Файл .env.production не найден!"
    echo "Создайте файл с переменными окружения"
    exit 1
fi

# Останавливаем простой деплой если запущен
echo "🛑 Останавливаем предыдущие контейнеры..."
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Проверяем и останавливаем сервисы на портах 80/443
echo "🔍 Проверяем порты 80 и 443..."
if lsof -i :80 >/dev/null 2>&1; then
    echo "⚠️  Порт 80 занят. Останавливаем сервисы..."
    systemctl stop nginx 2>/dev/null || true
    systemctl stop apache2 2>/dev/null || true
fi

if lsof -i :443 >/dev/null 2>&1; then
    echo "⚠️  Порт 443 занят. Останавливаем сервисы..."
    systemctl stop nginx 2>/dev/null || true
    systemctl stop apache2 2>/dev/null || true
fi

# Создаем необходимые директории
echo "📁 Создаем директории..."
mkdir -p data ssl

# Проверяем SSL сертификаты
if [ ! -f "ssl/fullchain.pem" ] || [ ! -f "ssl/privkey.pem" ]; then
    echo "🔒 SSL сертификаты не найдены!"
    echo "Запустите сначала: ./setup-ssl.sh"
    exit 1
fi

# Копируем базу данных если она есть
if [ -f "bookings.db" ]; then
    echo "📋 Копируем базу данных..."
    cp bookings.db data/bookings.db
fi

# Обновляем переменную окружения для HTTPS
echo "⚙️ Обновляем конфигурацию для HTTPS..."
sed -i 's|NEXT_PUBLIC_BASE_URL=http://|NEXT_PUBLIC_BASE_URL=https://|g' .env.production

# Удаляем pnpm-lock.yaml для избежания конфликтов
rm -f pnpm-lock.yaml

# Собираем и запускаем
echo "🔨 Собираем и запускаем production..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Ждем запуска
echo "⏳ Ждем запуска сервисов..."
sleep 10

# Проверяем статус
echo "📊 Проверяем статус сервисов..."
docker-compose -f docker-compose.prod.yml --env-file .env.production ps

# Проверяем доступность
echo "🌐 Тестируем доступность..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    echo "✅ HTTP порт работает"
else
    echo "⚠️  HTTP порт не отвечает"
fi

if curl -s -k -o /dev/null -w "%{http_code}" https://localhost | grep -q "200"; then
    echo "✅ HTTPS порт работает"
else
    echo "⚠️  HTTPS порт не отвечает"
fi

echo ""
echo "✅ Production деплой завершен!"
echo ""
echo "🌐 Ваш сайт доступен по адресам:"
echo "   HTTP:  http://drum4fun.club (перенаправляется на HTTPS)"
echo "   HTTPS: https://drum4fun.club"
echo "   Админ: https://drum4fun.club/admin/login"
echo ""
echo "📋 Полезные команды:"
echo "   Логи:     docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f"
echo "   Рестарт:  docker-compose -f docker-compose.prod.yml --env-file .env.production restart"
echo "   Стоп:     docker-compose -f docker-compose.prod.yml --env-file .env.production down"
echo ""
echo "🔒 SSL сертификаты:"
echo "   Автообновление: добавьте в crontab обновление certbot"
echo "   Мониторинг: проверяйте срок действия сертификатов"