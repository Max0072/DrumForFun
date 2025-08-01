# Настройка системы бронирования

## 🚀 Что добавлено

1. **База данных SQLite** для хранения заявок
2. **Email уведомления** через Nodemailer
3. **Система подтверждения заявок** через админ панель
4. **API для работы с заявками**

## 📋 Установка и настройка

### 1. Установка зависимостей (уже выполнено)
```bash
npm install nodemailer sqlite3 @types/nodemailer
```

### 2. Настройка email

#### Вариант A: Gmail (рекомендуется для разработки)

1. Включите двухфакторную аутентификацию в Gmail
2. Создайте "Пароль приложения":
   - Google Account → Security → App passwords
   - Выберите "Mail" и "Other" (введите "Drum School")
   - Скопируйте сгенерированный пароль

3. Отредактируйте `.env.production`:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password-from-step-2
EMAIL_FROM=noreply@drumschool.com
ADMIN_EMAIL=your-admin@gmail.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### Вариант B: Другой SMTP провайдер

Обновите `lib/email.ts` для production:
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

### 3. Запуск

```bash
npm run dev
```

## 🎯 Как работает система

### 1. Клиент подает заявку
- Заходит на `/booking`
- Выбирает тип: Individual, Band, или Party
- Заполняет форму и отправляет

### 2. Система обрабатывает заявку
- Генерируется уникальный ID (например: `A1B2C3D4`)
- Данные сохраняются в базу `bookings.db`
- Отправляется email администратору с ссылкой для подтверждения
- Отправляется email клиенту о получении заявки

### 3. Администратор подтверждает/отклоняет
- Переходит по ссылке из email: `/admin/booking/{ID}/confirm`
- Видит все детали заявки
- Может добавить комментарий
- Нажимает "Подтвердить" или "Отклонить"

### 4. Клиент получает финальный ответ
- Email с подтверждением или отклонением
- Комментарий администратора (если есть)

## 📁 Структура файлов

```
lib/
├── email.ts          # Конфигурация и шаблоны email
└── database.ts       # Работа с SQLite базой данных

app/api/booking/
├── route.ts          # POST /api/booking - создание заявки
├── [id]/route.ts     # GET /api/booking/{id} - получение заявки
└── confirm/route.ts  # POST /api/booking/confirm - подтверждение

app/admin/
├── page.tsx                        # Главная админ панели
└── booking/[id]/confirm/page.tsx   # Страница подтверждения
```

## 🎨 Шаблоны email

В `lib/email.ts` есть готовые шаблоны:
- `adminNotification` - уведомление администратору
- `clientConfirmation` - подтверждение клиенту
- `bookingConfirmed` - заявка подтверждена
- `bookingRejected` - заявка отклонена

## 🔧 Кастомизация

### Изменить поля формы
1. Обновите `BookingFormData` в `app/booking/page.tsx`
2. Обновите `BookingData` в `lib/database.ts`
3. Добавьте поля в таблицу БД

### Изменить email шаблоны
Редактируйте функции в `lib/email.ts`

### Добавить валидацию
Обновите `validateField` в `app/booking/page.tsx`

## 🚀 Production

1. Замените SQLite на PostgreSQL:
```bash
npm install pg @types/pg
```

2. Обновите `lib/database.ts` для PostgreSQL

3. Используйте профессиональный email сервис:
   - SMTP (Gmail, Yandex, Mail.ru)
   - Amazon SES
   - Mailgun

4. Добавьте аутентификацию в админ панель

## 🐛 Отладка

### Проверить email отправку
1. Логи в консоли: `📧 Email sent: {messageId}`
2. Проверьте `.env.local`
3. Для Gmail проверьте пароль приложения

### Проверить базу данных
База создается автоматически в `bookings.db`
```bash
sqlite3 bookings.db
.tables
SELECT * FROM bookings;
```

### Тестирование
1. Заполните форму на `/booking`
2. Проверьте консоль на наличие логов
3. Проверьте email (может попасть в спам)
4. Перейдите по ссылке для подтверждения