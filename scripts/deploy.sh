#!/bin/bash

echo "🚀 Подготовка к деплою сайта школы барабанов..."

# Создаем .gitignore если его нет
if [ ! -f .gitignore ]; then
    echo "📝 Создаем .gitignore..."
    cat > .gitignore << EOF
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# database
*.db
*.db-journal

# development scripts
debug-auth.js
EOF
fi

# Проверяем, что все необходимые файлы готовы
echo "🔍 Проверяем готовность проекта..."

if [ ! -f "package.json" ]; then
    echo "❌ package.json не найден!"
    exit 1
fi

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local не найден! Создайте его на основе .env.example"
    exit 1
fi

# Устанавливаем зависимости для продакшена
echo "📦 Устанавливаем PostgreSQL зависимость для продакшена..."
npm install pg @types/pg

# Создаем production env файл
echo "📄 Создаем шаблон production переменных..."
cat > .env.production.example << EOF
# Production Environment Variables for Vercel

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Email Configuration
EMAIL_USER=your-production-email@gmail.com
EMAIL_APP_PASSWORD=your-production-app-password
EMAIL_FROM=noreply@your-domain.com
ADMIN_EMAIL=admin@your-domain.com

# Admin Panel Authentication (CHANGE THESE!)
ADMIN_LOGIN=prod_admin_secure_2024
ADMIN_PASSWORD=your_very_secure_production_password_here
AUTH_SECRET=your_production_secret_key_128_characters_long

# Application URL
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# Node Environment
NODE_ENV=production
EOF

# Создаем Vercel конфигурацию
echo "⚙️ Создаем vercel.json..."
cat > vercel.json << EOF
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
EOF

# Инициализируем Git если нужно
if [ ! -d ".git" ]; then
    echo "🔧 Инициализируем Git репозиторий..."
    git init
    git add .
    git commit -m "Initial commit: Drum School booking system

Features:
- Next.js 15 booking system
- Admin panel with authentication
- Email notifications
- Room management
- SQLite for development, PostgreSQL ready for production
- Responsive design with shadcn/ui"
    
    echo "📂 Git репозиторий создан!"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Создайте репозиторий на GitHub"
    echo "2. Добавьте удаленный репозиторий:"
    echo "   git remote add origin https://github.com/ваш-username/drum-school.git"
    echo "3. Отправьте код:"
    echo "   git push -u origin main"
else
    echo "📂 Git репозиторий уже существует"
fi

echo ""
echo "✅ Проект готов к деплою!"
echo ""
echo "🚀 Варианты деплоя:"
echo ""
echo "1️⃣  VERCEL + SUPABASE (Рекомендуется):"
echo "   • Зайдите на vercel.com"
echo "   • Подключите GitHub репозиторий"
echo "   • Создайте базу данных на supabase.com"
echo "   • Добавьте переменные из .env.production.example"
echo ""
echo "2️⃣  RAILWAY (Проще для SQLite):"
echo "   • Зайдите на railway.app"
echo "   • Подключите репозиторий"
echo "   • Добавьте переменные окружения"
echo ""
echo "3️⃣  RENDER:"
echo "   • Зайдите на render.com"
echo "   • Создайте Web Service"
echo "   • Настройте PostgreSQL"
echo ""
echo "📖 Подробная инструкция в файле DEPLOY.md"
echo ""
echo "🔒 ВАЖНО: Не забудьте изменить пароли в продакшене!"
EOF