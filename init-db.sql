-- init-db.sql - Инициализация PostgreSQL базы данных
-- Создание таблицы комнат
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  description TEXT
);

-- Создание таблицы бронирований
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
  adminMessage TEXT,
  roomId TEXT,
  roomName TEXT
);

-- Добавление комнат
INSERT INTO rooms (id, name, type, capacity, description) VALUES 
('drums1', 'Барабанная #1', 'drums', 6, 'Основная барабанная комната'),
('drums2', 'Барабанная #2', 'drums', 4, 'Малая барабанная комната'),
('guitar1', 'Гитарная #1', 'guitar', 8, 'Гитарная/универсальная комната')
ON CONFLICT (id) DO NOTHING;