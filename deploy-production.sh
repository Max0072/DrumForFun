#!/bin/bash

echo "🚀 Production deployment of DrumForFun on ports 80/443..."

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Run the script as root or with sudo"
    echo "Usage: sudo ./deploy-production.sh"
    exit 1
fi

# Check for .env.production file
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "Create the file with environment variables"
    exit 1
fi

# Stop simple deployment if running
echo "🛑 Stopping previous containers..."
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Check and stop services on ports 80/443
echo "🔍 Checking ports 80 and 443..."
if lsof -i :80 >/dev/null 2>&1; then
    echo "⚠️  Port 80 is occupied. Stopping services..."
    systemctl stop nginx 2>/dev/null || true
    systemctl stop apache2 2>/dev/null || true
fi

if lsof -i :443 >/dev/null 2>&1; then
    echo "⚠️  Port 443 is occupied. Stopping services..."
    systemctl stop nginx 2>/dev/null || true
    systemctl stop apache2 2>/dev/null || true
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data ssl

# Check SSL certificates
if [ ! -f "ssl/fullchain.pem" ] || [ ! -f "ssl/privkey.pem" ]; then
    echo "🔒 SSL certificates not found!"
    echo "Run first: ./setup-ssl.sh"
    exit 1
fi

# Copy database if it exists
if [ -f "bookings.db" ]; then
    echo "📋 Copying database..."
    cp bookings.db data/bookings.db
fi

# Update environment variable for HTTPS
echo "⚙️ Updating configuration for HTTPS..."
sed -i 's|NEXT_PUBLIC_BASE_URL=http://|NEXT_PUBLIC_BASE_URL=https://|g' .env.production

# Remove pnpm-lock.yaml to avoid conflicts
rm -f pnpm-lock.yaml

# Build and run
echo "🔨 Building and starting production..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build

# Wait for startup
echo "⏳ Waiting for services to start..."
sleep 10

# Check status
echo "📊 Checking service status..."
docker-compose -f docker-compose.prod.yml --env-file .env.production ps

# Check availability
echo "🌐 Testing availability..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    echo "✅ HTTP port is working"
else
    echo "⚠️  HTTP port is not responding"
fi

if curl -s -k -o /dev/null -w "%{http_code}" https://localhost | grep -q "200"; then
    echo "✅ HTTPS port is working"
else
    echo "⚠️  HTTPS port is not responding"
fi

echo ""
echo "✅ Production deployment completed!"
echo ""
echo "🌐 Your site is available at:"
echo "   HTTP:  http://drum4fun.club (redirects to HTTPS)"
echo "   HTTPS: https://drum4fun.club"
echo "   Admin: https://drum4fun.club/admin/login"
echo ""
echo "📋 Useful commands:"
echo "   Logs:    docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f"
echo "   Restart: docker-compose -f docker-compose.prod.yml --env-file .env.production restart"
echo "   Stop:    docker-compose -f docker-compose.prod.yml --env-file .env.production down"
echo ""
echo "🔒 SSL certificates:"
echo "   Auto-renewal: add certbot renewal to crontab"
echo "   Monitoring: check certificate expiration dates"