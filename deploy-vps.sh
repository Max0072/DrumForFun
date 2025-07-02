#!/bin/bash
# deploy-vps.sh - Скрипт деплоя на VPS

echo "🚀 Деплой школы барабанов на VPS..."

# Проверяем, что Docker установлен
if ! command -v docker &> /dev/null; then
    echo "📦 Устанавливаем Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker установлен"
fi

# Проверяем, что Docker Compose установлен
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Устанавливаем Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose установлен"
fi

# Создаем директории
echo "📁 Создаем необходимые директории..."
mkdir -p ssl

# Настройка SSL (Let's Encrypt)
echo "🔒 Настройка SSL сертификатов..."
if [ ! -f "ssl/fullchain.pem" ]; then
    echo "📋 Для получения SSL сертификата выполните:"
    echo "sudo apt install certbot"
    echo "sudo certbot certonly --standalone -d вашдомен.com -d www.вашдомен.com"
    echo "sudo cp /etc/letsencrypt/live/вашдомен.com/fullchain.pem ./ssl/"
    echo "sudo cp /etc/letsencrypt/live/вашдомен.com/privkey.pem ./ssl/"
    echo "sudo chown \$USER:docker ./ssl/*"
    echo ""
    echo "Или создайте самоподписанный сертификат для тестирования:"
    echo "openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/privkey.pem -out ssl/fullchain.pem"
fi

# Проверяем переменные окружения
if [ ! -f ".env.production" ]; then
    echo "❌ Файл .env.production не найден!"
    echo "Скопируйте .env.production.example и настройте переменные"
    exit 1
fi

# Обновляем Next.js конфигурацию для Docker
echo "⚙️ Настраиваем Next.js для Docker..."
if ! grep -q "output: 'standalone'" next.config.mjs; then
    cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

export default nextConfig
EOF
fi

# Собираем и запускаем контейнеры
echo "🔨 Собираем Docker образы..."
docker-compose --env-file .env.production build

echo "🚀 Запускаем сервисы..."
docker-compose --env-file .env.production up -d

echo "📊 Проверяем статус сервисов..."
docker-compose ps

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "🌐 Ваш сайт доступен по адресу:"
echo "   HTTP:  http://вашдомен.com"
echo "   HTTPS: https://вашдомен.com"
echo "   Админ: https://вашдомен.com/admin/login"
echo ""
echo "📋 Полезные команды:"
echo "   Логи:        docker-compose logs -f"
echo "   Рестарт:     docker-compose restart"
echo "   Остановка:   docker-compose down"
echo "   Обновление:  git pull && docker-compose up -d --build"
echo ""
echo "🔒 Не забудьте:"
echo "   1. Настроить DNS записи для домена"
echo "   2. Получить SSL сертификаты"
echo "   3. Настроить firewall (порты 80, 443, 22)"
echo "   4. Настроить автоматические backup"