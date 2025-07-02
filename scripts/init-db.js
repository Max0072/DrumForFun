// scripts/init-db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(process.cwd(), 'bookings.db');

console.log('🔧 Инициализация базы данных...');
console.log('📂 Путь к базе:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к базе данных:', err);
    process.exit(1);
  }
  console.log('✅ Подключение к SQLite успешно');
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS bookings (
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
    adminMessage TEXT
  )
`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error('❌ Ошибка создания таблицы:', err);
    process.exit(1);
  }
  console.log('✅ Таблица bookings создана успешно');
  
  // Проверяем таблицу
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('❌ Ошибка проверки таблиц:', err);
    } else {
      console.log('📋 Таблицы в базе данных:', tables.map(t => t.name));
    }
    
    db.close((err) => {
      if (err) {
        console.error('❌ Ошибка закрытия базы данных:', err);
      } else {
        console.log('✅ База данных инициализирована успешно');
      }
    });
  });
});