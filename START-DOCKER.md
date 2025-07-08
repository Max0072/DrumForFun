# 🚀 Быстрый запуск DrumForFun в Docker

## Простые шаги для запуска:

### 1. Откройте терминал в папке проекта
```bash
cd /Users/max0072/Desktop/drum-for-fun
```

### 2. Сделайте скрипты исполняемыми
```bash
chmod +x docker-run.sh docker-stop.sh docker-logs.sh
```

### 3. Запустите приложение
```bash
./docker-run.sh
```

### 4. Откройте браузер
Перейдите на: **http://localhost:3000**

### 5. Доступ к админ панели
- URL: **http://localhost:3000/admin/login**
- Логин: **admin**
- Пароль: **admin123**

## Управление:

- **Остановить**: `./docker-stop.sh`
- **Логи**: `./docker-logs.sh`

## Если что-то не работает:

1. Убедитесь, что Docker запущен
2. Проверьте, что порт 3000 свободен
3. Пересоберите: `docker-compose -f docker-compose.dev.yml build --no-cache`

---

**Готово! 🎉 Ваше приложение работает в Docker!**