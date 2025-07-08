# 🐳 Docker Setup для DrumForFun

Это руководство поможет вам запустить приложение DrumForFun в Docker контейнере.

## Предварительные требования

- Docker (версия 20.10 или выше)
- Docker Compose (версия 2.0 или выше)

## Быстрый старт

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd drum-for-fun
```

### 2. Настройка переменных окружения
Скопируйте и отредактируйте файл с переменными окружения:
```bash
cp .env.docker .env.local
```

Отредактируйте `.env.local` при необходимости:
- `ADMIN_LOGIN` и `ADMIN_PASSWORD` - учетные данные администратора
- `EMAIL_USER` и `EMAIL_APP_PASSWORD` - настройки электронной почты (необязательно для разработки)

### 3. Запуск приложения

#### Автоматический запуск (рекомендуется)
```bash
chmod +x docker-run.sh
./docker-run.sh
```

#### Ручной запуск
```bash
# Сборка образа
docker-compose -f docker-compose.dev.yml build

# Запуск контейнера
docker-compose -f docker-compose.dev.yml up
```

### 4. Доступ к приложению
Откройте браузер и перейдите по адресу: http://localhost:3000

## Управление контейнерами

### Остановка приложения
```bash
chmod +x docker-stop.sh
./docker-stop.sh
```

### Просмотр логов
```bash
chmod +x docker-logs.sh
./docker-logs.sh
```

### Пересборка образа (при изменении кода)
```bash
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up
```

## Доступ к админ панели

1. Перейдите на http://localhost:3000/admin/login
2. Введите учетные данные:
   - **Логин**: admin (или значение из `ADMIN_LOGIN`)
   - **Пароль**: admin123 (или значение из `ADMIN_PASSWORD`)

## База данных

В режиме разработки используется SQLite база данных:
- Файл базы: `./bookings.db`
- База автоматически создается при первом запуске
- Данные сохраняются между перезапусками контейнера

## Структура файлов

```
drum-for-fun/
├── Dockerfile.dev          # Dockerfile для разработки
├── docker-compose.dev.yml  # Docker Compose для разработки
├── .env.docker             # Пример переменных окружения
├── docker-run.sh           # Скрипт запуска
├── docker-stop.sh          # Скрипт остановки
├── docker-logs.sh          # Скрипт просмотра логов
└── DOCKER.md               # Это руководство
```

## Решение проблем

### Порт 3000 уже используется
```bash
# Остановите другие сервисы на порту 3000
lsof -ti:3000 | xargs kill -9

# Или измените порт в docker-compose.dev.yml:
# ports:
#   - "3001:3000"  # Использовать порт 3001 вместо 3000
```

### Проблемы с правами доступа к файлам
```bash
# Убедитесь, что у пользователя есть права на запись в директорию
chmod 755 .
```

### Очистка Docker кэша
```bash
docker system prune -f
docker-compose -f docker-compose.dev.yml build --no-cache
```

## Продакшен

Для продакшена используйте:
- `Dockerfile` - оптимизированный образ для продакшена
- `docker-compose.yml` - с PostgreSQL и Nginx
- Настройте SSL сертификаты и переменные окружения

```bash
# Продакшен запуск
docker-compose up -d
```

## Поддержка

Если у вас возникли проблемы:
1. Проверьте логи: `./docker-logs.sh`
2. Убедитесь, что Docker запущен
3. Проверьте доступность порта 3000
4. Пересоберите образ с `--no-cache`