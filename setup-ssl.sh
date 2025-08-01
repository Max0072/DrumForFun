#!/bin/bash

echo "🔒 Setting up SSL certificates for drum4fun.club..."

# Create SSL directory
mkdir -p ssl

# Check if certificates already exist
if [ -f "ssl/fullchain.pem" ] && [ -f "ssl/privkey.pem" ]; then
    echo "✅ SSL certificates are already installed"
    exit 0
fi

echo "📋 Choose SSL certificate method:"
echo "1) Let's Encrypt (free, automatic)"
echo "2) Self-signed certificate (for testing)"
read -p "Enter number (1 or 2): " choice

case $choice in
    1)
        echo "📦 Installing Certbot..."
        
        # Install Certbot
        sudo apt update
        sudo apt install -y certbot
        
        echo "🛑 Stop nginx/apache if they are running:"
        sudo systemctl stop nginx 2>/dev/null || true
        sudo systemctl stop apache2 2>/dev/null || true
        
        echo "🔒 Getting SSL certificate..."
        sudo certbot certonly --standalone \
            -d drum4fun.club \
            -d www.drum4fun.club \
            --email admin@drum4fun.club \
            --agree-tos \
            --non-interactive
        
        if [ $? -eq 0 ]; then
            echo "✅ Certificate obtained! Copying files..."
            sudo cp /etc/letsencrypt/live/drum4fun.club/fullchain.pem ./ssl/
            sudo cp /etc/letsencrypt/live/drum4fun.club/privkey.pem ./ssl/
            sudo chown $USER:$USER ./ssl/*
            chmod 644 ./ssl/fullchain.pem
            chmod 600 ./ssl/privkey.pem
            
            echo "✅ SSL certificates are ready!"
            echo "📅 Auto-renewal: add to crontab:"
            echo "0 2 * * * certbot renew --quiet && docker-compose -f docker-compose.prod.yml restart nginx"
        else
            echo "❌ Error obtaining certificate"
            exit 1
        fi
        ;;
    2)
        echo "🔧 Creating self-signed certificate..."
        openssl req -x509 -nodes -days 365 \
            -newkey rsa:2048 \
            -keyout ssl/privkey.pem \
            -out ssl/fullchain.pem \
            -subj "/C=CY/ST=Limassol/L=Limassol/O=DrumForFun/CN=drum4fun.club"
        
        echo "⚠️  Self-signed certificate created"
        echo "⚠️  Browsers will show security warnings"
        echo "✅ For production use Let's Encrypt (option 1)"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ SSL setup completed!"
echo "🚀 You can now run production deployment"