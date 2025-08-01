#!/bin/bash

echo "🚀 Simple VPS deployment with SQLite..."

# Stop and clean existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.simple.yml down 2>/dev/null || true

# Remove pnpm-lock.yaml to avoid conflicts
echo "🧹 Cleaning conflicting files..."
rm -f pnpm-lock.yaml

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data
mkdir -p ssl

# Copy database if it exists
if [ -f "bookings.db" ]; then
    echo "📋 Copying existing database..."
    cp bookings.db data/bookings.db
fi

# Build and run
echo "🔨 Building and starting containers..."
docker-compose -f docker-compose.simple.yml --env-file .env.production up -d --build

# Check status
echo "📊 Checking status..."
docker-compose -f docker-compose.simple.yml  --env-file .env.production ps

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🌐 Site available at: http://164.92.208.159:3000"
echo "🔧 Admin panel: http://164.92.208.159:3000/admin/login"
echo ""
echo "📋 Useful commands:"
echo "   Logs:    docker-compose -f docker-compose.prod.yml --env-file .env.production logs -f"
echo "   Restart: docker-compose -f docker-compose.prod.yml --env-file .env.production restart"
echo "   Stop:    docker-compose -f docker-compose.prod.yml --env-file .env.production down"
echo ""