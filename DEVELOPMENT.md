# Нюансы разработки системы бронирования

## Особенности работы с временными зонами

### Проблема
При разработке выявилась критическая проблема с обработкой времени - слоты показывались как недоступные для неправильного дня из-за конвертации в UTC.

### Решение
Система настроена на работу с часовым поясом Кипра (`Europe/Nicosia`):

```typescript
// Конвертация даты в кипрское время
const cyprusDate = new Date(selectedDate.toLocaleString("en-US", { timeZone: "Europe/Nicosia" }))
```

### Места применения
1. **Frontend форма** (`app/booking/page.tsx:142-146`) - при запросе доступных слотов
2. **Frontend отправка** (`app/booking/page.tsx:309-313`) - при отправке формы
3. **Backend API** (`app/api/booking/route.ts:133`) - создание временных меток
4. **База данных** (`lib/database.ts:187,238`) - все записи времени

## Архитектура системы комнат

### Логика подходящих комнат
```typescript
private isRoomSuitable(room: Room, bookingType: string): boolean {
  switch (bookingType) {
    case 'individual': return room.type === 'drums' || room.type === 'guitar' || room.type === 'universal'
    case 'band': return room.type === 'drums' || room.type === 'universal'
    case 'party': return true // Любая комната
  }
}
```

### Алгоритм проверки доступности
1. Получить все подтвержденные бронирования на дату
2. Для каждого временного слота:
   - Найти подходящие комнаты для типа бронирования
   - Проверить, есть ли хотя бы одна свободная комната
   - Если да - слот доступен

## Структура базы данных

### Таблица комнат
```sql
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'drums' | 'guitar' | 'universal'
  capacity INTEGER NOT NULL,
  description TEXT
)
```

### Таблица бронирований
```sql
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD в кипрском времени
  time TEXT NOT NULL, -- HH:MM
  duration TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'confirmed' | 'rejected'
  type TEXT NOT NULL, -- 'Individual Practice' | 'Band Rehearsal' | 'Birthday Party'
  createdAt TEXT NOT NULL, -- кипрское время
  roomId TEXT, -- назначается при подтверждении
  roomName TEXT
)
```

## Email интеграция

### Настройка Nodemailer
```typescript
// Для продакшена - настроить Gmail App Password
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
})
```

### Демо режим
При отсутствии настроек email система работает в демо режиме без реальной отправки.

## Особенности Next.js 15

### Асинхронные параметры
```typescript
// Правильный способ получения параметров в Next.js 15
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params // await обязателен!
}
```

## Динамические формы

### Управление полями по типу бронирования
```typescript
// Сброс и установка значений по умолчанию
setFormData((prev) => ({
  ...prev,
  // Сбрасываем все специфичные поля
  bandSize: undefined,
  guestCount: undefined,
  instrument: undefined,
  partyType: undefined,
  
  // Устанавливаем значения по умолчанию для нового типа
  ...(value === "band" && { bandSize: "4" }),
  ...(value === "party" && { guestCount: "10-15", partyType: "kids" }),
  ...(value === "individual" && { instrument: "drums" })
}))
```

## Валидация форм

### Условная валидация полей
```typescript
const validateField = (name: string, value: any): boolean => {
  // Пропускаем поля, которые не относятся к текущему типу бронирования
  if (key === "bandSize" && bookingType !== "band") return
  if (key === "guestCount" && bookingType !== "party") return
  // ... остальная валидация
}
```

## Отладка и логирование

### Отладочные сообщения
Система использует эмодзи для удобного чтения логов:
- 🇨🇾 - операции с кипрским временем
- 📱 - действия фронтенда
- 🔍 - поиск и проверки
- ✅ - успешные операции
- ❌ - ошибки

## Проблемы и их решения

### 1. Undefined дата/время в API
**Проблема**: Поля date и time передавались как undefined
**Решение**: Убедиться, что все поля включены в JSON.stringify при отправке

### 2. Неправильная проверка доступности
**Проблема**: Слоты показывались недоступными из-за UTC конвертации
**Решение**: Использование кипрского времени во всей системе

### 3. Ошибки создания таблиц SQLite
**Проблема**: Таблицы не создавались автоматически
**Решение**: Добавлена инициализация таблиц при подключении к БД

### 4. Nodemailer ошибки аутентификации
**Проблема**: Неправильный пароль Gmail
**Решение**: Использование App Password вместо обычного пароля

## Переменные окружения (.env.local)

```env
# Email настройки
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=admin@drumschool.com

# Админ-панель авторизация
ADMIN_LOGIN=admin
ADMIN_PASSWORD=secure_password_here
AUTH_SECRET=your-secret-key-for-sessions

# База данных (опционально для продакшена)
DATABASE_URL=file:./bookings.db
```

## Команды для разработки

```bash
# Запуск разработки
npm run dev

# Проверка типов (если настроено)
npm run typecheck

# Линтинг (если настроено)
npm run lint

# Открытие базы данных SQLite для отладки (macOS)
sqlite3 bookings.db
```

## Админ-панель

### Структура админ-панели
```
/admin/login - страница входа
/admin/ - главная панель с общей статистикой
/admin/bookings - управление заявками
/admin/rooms - управление комнатами (в разработке)
/admin/history - история всех операций (в разработке)
/admin/statistics - детальная статистика (в разработке)
```

### Система авторизации
- Простая авторизация через логин/пароль из .env
- Сессии сохраняются в httpOnly cookies на 24 часа
- Автоматическая проверка авторизации на всех админ страницах
- Защита всех API endpoints `requireAuth()`

### Функциональность
1. **Дашборд** - общая статистика и быстрые действия
2. **Управление заявками** - просмотр, поиск, фильтрация, подтверждение/отклонение
3. **Email уведомления** - автоматическая отправка при смене статуса
4. **Назначение комнат** - выбор комнаты при подтверждении заявки
5. **Отмена бронирований** - возможность отменить подтвержденные заявки

### Компоненты
- `AdminGuard` - проверка авторизации
- `AdminLayout` - базовый layout с навигацией
- Адаптивный дизайн для мобильных устройств

## Будущие улучшения

1. **Добавить миграции БД** для безопасного обновления схемы
2. **Настроить автоматические backup** базы данных
3. **Добавить rate limiting** для API endpoints
4. **Реализовать кеширование** доступных слотов
5. **Добавить валидацию на уровне БД** (constraints)
6. **Настроить мониторинг ошибок** (Sentry)
7. **Добавить тесты** для критических функций
8. **Реализовать soft delete** для бронирований
9. **Добавить аудит логи** для действий администратора
10. **Настроить CI/CD pipeline** для автоматического деплоя
11. **Добавить календарный вид** для комнат и расписаний
12. **Реализовать двухфакторную аутентификацию** для админ-панели
13. **Добавить экспорт данных** (CSV, Excel)
14. **Создать push-уведомления** для новых заявок
15. **Добавить шаблоны сообщений** для быстрого ответа клиентам

## Безопасность

- Никогда не коммитить `.env.local` файлы
- Использовать App Passwords для Gmail
- Валидировать все входящие данные
- Не логировать чувствительную информацию (пароли, токены)
- Использовать HTTPS в продакшене