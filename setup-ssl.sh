#!/bin/bash

echo "🔒 Настройка SSL сертификатов для drum4fun.club..."

# Создаем директорию для SSL
mkdir -p ssl

# Проверяем есть ли уже сертификаты
if [ -f "ssl/fullchain.pem" ] && [ -f "ssl/privkey.pem" ]; then
    echo "✅ SSL сертификаты уже установлены"
    exit 0
fi

echo "📋 Выберите способ получения SSL сертификатов:"
echo "1) Let's Encrypt (бесплатный, автоматический)"
echo "2) Самоподписанный сертификат (для тестирования)"
read -p "Введите номер (1 или 2): " choice

case $choice in
    1)
        echo "📦 Устанавливаем Certbot..."
        
        # Устанавливаем Certbot
        sudo apt update
        sudo apt install -y certbot
        
        echo "🛑 Остановите nginx/apache если они запущены:"
        sudo systemctl stop nginx 2>/dev/null || true
        sudo systemctl stop apache2 2>/dev/null || true
        
        echo "🔒 Получаем SSL сертификат..."
        sudo certbot certonly --standalone \
            -d drum4fun.club \
            -d www.drum4fun.club \
            --email admin@drum4fun.club \
            --agree-tos \
            --non-interactive
        
        if [ $? -eq 0 ]; then
            echo "✅ Сертификат получен! Копируем файлы..."
            sudo cp /etc/letsencrypt/live/drum4fun.club/fullchain.pem ./ssl/
            sudo cp /etc/letsencrypt/live/drum4fun.club/privkey.pem ./ssl/
            sudo chown $USER:$USER ./ssl/*
            chmod 644 ./ssl/fullchain.pem
            chmod 600 ./ssl/privkey.pem
            
            echo "✅ SSL сертификаты готовы!"
            echo "📅 Автообновление: добавьте в crontab:"
            echo "0 2 * * * certbot renew --quiet && docker-compose -f docker-compose.prod.yml restart nginx"
        else
            echo "❌ Ошибка получения сертификата"
            exit 1
        fi
        ;;
    2)
        echo "🔧 Создаем самоподписанный сертификат..."
        openssl req -x509 -nodes -days 365 \
            -newkey rsa:2048 \
            -keyout ssl/privkey.pem \
            -out ssl/fullchain.pem \
            -subj "/C=CY/ST=Limassol/L=Limassol/O=DrumForFun/CN=drum4fun.club"
        
        echo "⚠️  Самоподписанный сертификат создан"
        echo "⚠️  Браузеры будут показывать предупреждение безопасности"
        echo "✅ Для production используйте Let's Encrypt (вариант 1)"
        ;;
    *)
        echo "❌ Неверный выбор"
        exit 1
        ;;
esac

echo ""
echo "✅ SSL настройка завершена!"
echo "🚀 Теперь можно запускать production деплой"