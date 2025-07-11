# 🥁 DrumForFun - Система бронирования школы барабанов

Веб-приложение для бронирования занятий в школе барабанов с админ-панелью.

## 🚀 Быстрый деплой на VPS

### 1. Клонирование проекта
```bash
git clone https://github.com/your-username/drum-for-fun.git
cd drum-for-fun
```

### 2. Настройка переменных окружения
```bash
# Скопируйте пример файла
cp .env.example .env.production

# Отредактируйте файл с вашими данными
nano .env.production
```

### 3. Автоматический деплой
```bash
# Запустите скрипт деплоя
chmod +x deploy-vps.sh
./deploy-vps.sh
```

### 4. Проверка работы
```bash
# Статус сервисов
docker-compose ps

# Логи
docker-compose logs -f

# Ваш сайт будет доступен по адресу:
# https://yourdomain.com
```

## 🔧 Локальная разработка

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
# Обычный запуск
npm run dev

# Или с Docker
./docker-run.sh
```

### Сборка проекта
```bash
npm run build
npm start
```

## 🗄️ База данных

### Продакшен (рекомендуется)
- PostgreSQL в Docker контейнере
- Автоматическая инициализация и миграции

### Разработка
- SQLite в файле `./data/bookings.db`

## 🔐 Админ-панель

Доступ: `https://yourdomain.com/admin/login`

Данные для входа настраиваются в `.env.production`:
- `ADMIN_LOGIN` - логин администратора
- `ADMIN_PASSWORD` - пароль администратора

## 📧 Email уведомления

Настройте Gmail App Password в `.env.production`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
```

## 🐳 Docker команды

```bash
# Запуск продакшен версии
docker-compose up -d

# Остановка
docker-compose down

# Логи
docker-compose logs -f

# Подключение к базе данных
docker-compose exec db psql -U drumschool -d drumschool
```

## 🔒 Безопасность

1. **Смените все пароли** в `.env.production`
2. **Настройте SSL** - скрипт деплоя поможет с Let's Encrypt
3. **Настройте firewall**:
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

## 📁 Структура проекта

```
drum-for-fun/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── admin/             # Админ-панель
│   └── ...                # Публичные страницы
├── components/            # React компоненты
├── lib/                   # Утилиты и конфигурация
├── docker-compose.yml     # Продакшен Docker
├── deploy-vps.sh         # Скрипт деплоя
└── README.md             # Этот файл
```

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs -f`
2. Убедитесь, что порты 80 и 443 открыты
3. Проверьте настройки DNS для вашего домена

## 📝 Лицензия

MIT License# Test commit to check Vercel deployment trigger
# Second test commit to verify Vercel is disabled
