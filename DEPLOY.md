# Деплой сайта школы барабанов

## 🚀 Быстрый деплой на Vercel + Supabase

### Подготовка проекта

1. **Создайте репозиторий на GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: drum school booking system"
git remote add origin https://github.com/ваш-username/drum-school.git
git push -u origin main
```

2. **Создайте production переменные окружения**

### Шаг 1: Настройка базы данных (Supabase)

1. Зайдите на https://supabase.com
2. Создайте новый проект
3. В разделе Settings > Database получите строку подключения
4. Создайте таблицы:

```sql
-- Создание таблицы комнат
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  description TEXT
);

-- Создание таблицы бронирований
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration TEXT NOT NULL,
  notes TEXT,
  lessonType TEXT NOT NULL,
  bandSize TEXT,
  guestCount TEXT,
  instrument TEXT,
  partyType TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  type TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT,
  adminMessage TEXT,
  roomId TEXT,
  roomName TEXT
);

-- Добавление комнат
INSERT INTO rooms (id, name, type, capacity, description) VALUES 
('drums1', 'Барабанная #1', 'drums', 6, 'Основная барабанная комната'),
('drums2', 'Барабанная #2', 'drums', 4, 'Малая барабанная комната'),
('guitar1', 'Гитарная #1', 'guitar', 8, 'Гитарная/универсальная комната');
```

### Шаг 2: Настройка Vercel

1. Зайдите на https://vercel.com
2. Подключите GitHub репозиторий
3. Добавьте переменные окружения:

```env
# База данных
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Email настройки
EMAIL_USER=ваш-email@gmail.com
EMAIL_APP_PASSWORD=ваш-app-password
EMAIL_FROM=noreply@вашдомен.com
ADMIN_EMAIL=admin@вашдомен.com

# Админ-панель
ADMIN_LOGIN=ваш_логин
ADMIN_PASSWORD=ваш_безопасный_пароль
AUTH_SECRET=ваш_секретный_ключ_64_символа

# URL сайта
NEXT_PUBLIC_BASE_URL=https://ваш-домен.vercel.app
```

4. Нажмите Deploy

### Шаг 3: Обновление кода для PostgreSQL

Замените SQLite на PostgreSQL в `lib/database.ts`:

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})
```

## 🛠️ Альтернативные варианты

### Railway (проще для SQLite)

1. Зайдите на https://railway.app
2. Подключите GitHub репозиторий
3. Добавьте переменные окружения
4. SQLite файл сохранится автоматически

### Render

1. Зайдите на https://render.com
2. Создайте Web Service
3. Подключите репозиторий
4. Настройте переменные окружения

## 📧 Настройка email для продакшена

### Gmail для продакшена:
1. Включите 2FA в аккаунте Gmail
2. Создайте App Password
3. Используйте в EMAIL_APP_PASSWORD

### Альтернативы:
- SendGrid (бесплатно до 100 писем/день)
- Mailgun
- AWS SES

## 🔒 Безопасность в продакшене

1. **Смените все пароли:**
```env
ADMIN_LOGIN=prod_admin_secure_2024
ADMIN_PASSWORD=новый_очень_длинный_и_безопасный_пароль_без_спецсимволов
AUTH_SECRET=новый_секретный_ключ_128_символов_для_продакшена
```

2. **Настройте домен:**
- Купите домен (например, drumschool-cyprus.com)
- Настройте в Vercel Custom Domain

3. **Настройте SSL:**
- Vercel автоматически предоставляет SSL
- Убедитесь, что все ссылки используют HTTPS

## 🧪 Тестирование после деплоя

1. Проверьте форму бронирования
2. Протестируйте админ-панель
3. Проверьте отправку email
4. Тестируйте на мобильных устройствах

## 📊 Мониторинг

- Vercel Analytics для посещаемости
- Vercel Functions для мониторинга API
- Настройте уведомления об ошибках

## 💰 Стоимость

### Бесплатные планы:
- **Vercel:** 100GB bandwidth, serverless functions
- **Supabase:** 500MB база данных, 2GB bandwidth
- **Railway:** $5 кредит каждый месяц

### При росте нагрузки:
- Vercel Pro: $20/месяц
- Supabase Pro: $25/месяц
- Railway: от $5/месяц

## 🚨 Важные заметки

1. **Backup:** Настройте автоматический backup БД
2. **Логи:** Мониторьте логи на наличие ошибок
3. **Обновления:** Регулярно обновляйте зависимости
4. **SSL:** Всегда используйте HTTPS в продакшене