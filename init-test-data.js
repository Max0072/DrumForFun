// init-test-data.js - Скрипт для создания тестовых данных
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'bookings.db');

console.log('🔄 Инициализация тестовых данных...');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к базе:', err);
    return;
  }
  console.log('✅ Подключение к базе данных установлено');
});

// Добавляем тестовые товары в магазин
const testProducts = [
  {
    id: 'prod_1',
    name: 'Барабанные палочки Vic Firth 5A',
    description: 'Классические барабанные палочки из гикори',
    price: 25.99,
    category: 'Accessories',
    inStock: 50,
    imageUrl: '/placeholder.svg',
    isActive: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_2', 
    name: 'Тарелка Zildjian A Custom Crash 16"',
    description: 'Профессиональная crash тарелка',
    price: 289.99,
    category: 'Cymbals',
    inStock: 15,
    imageUrl: '/placeholder.svg',
    isActive: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_3',
    name: 'Малый барабан Pearl Sensitone',
    description: 'Стальной малый барабан 14x5"',
    price: 199.99,
    category: 'Drums',
    inStock: 8,
    imageUrl: '/placeholder.svg',
    isActive: 1,
    createdAt: new Date().toISOString()
  }
];

// Добавляем тестовые товары для аренды
const testRentalItems = [
  {
    id: 'rental_1',
    name: 'Электронная барабанная установка Roland TD-17KVX',
    description: 'Полная электронная установка для репетиций',
    pricePerDay: 45.00,
    category: 'Electronic Drums',
    inStock: 3,
    imageUrl: '/placeholder.svg',
    isActive: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rental_2',
    name: 'Микрофон Shure SM57',
    description: 'Динамический микрофон для записи',
    pricePerDay: 15.00,
    category: 'Microphones',
    inStock: 10,
    imageUrl: '/placeholder.svg',
    isActive: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rental_3',
    name: 'Усилитель Marshall DSL40CR',
    description: 'Ламповый гитарный усилитель 40W',
    pricePerDay: 35.00,
    category: 'Amplifiers',
    inStock: 5,
    imageUrl: '/placeholder.svg',
    isActive: 1,
    createdAt: new Date().toISOString()
  }
];

// Добавляем тестовое бронирование
const testBooking = {
  id: 'booking_test_1',
  name: 'Иван Петров',
  email: 'ivan@example.com',
  phone: '+7-999-123-4567',
  date: '2024-12-25',
  time: '14:00',
  duration: '2',
  notes: 'Первое занятие по барабанам',
  lessonType: 'individual',
  type: 'Индивидуальный урок барабанов',
  status: 'pending',
  createdAt: new Date().toISOString(),
  roomId: null,
  roomName: null
};

// Функции для вставки данных
function insertProducts() {
  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (id, name, description, price, category, inStock, imageUrl, isActive, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  testProducts.forEach(product => {
    insertProduct.run([
      product.id, product.name, product.description, product.price,
      product.category, product.inStock, product.imageUrl, product.isActive, product.createdAt
    ]);
  });

  insertProduct.finalize();
  console.log('✅ Добавлено товаров в магазин:', testProducts.length);
}

function insertRentalItems() {
  const insertRental = db.prepare(`
    INSERT OR REPLACE INTO rental_items (id, name, description, pricePerDay, category, inStock, imageUrl, isActive, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  testRentalItems.forEach(item => {
    insertRental.run([
      item.id, item.name, item.description, item.pricePerDay,
      item.category, item.inStock, item.imageUrl, item.isActive, item.createdAt
    ]);
  });

  insertRental.finalize();
  console.log('✅ Добавлено товаров для аренды:', testRentalItems.length);
}

function insertTestBooking() {
  const insertBooking = db.prepare(`
    INSERT OR REPLACE INTO bookings (
      id, name, email, phone, date, time, duration, notes, lessonType,
      bandSize, guestCount, instrument, partyType, status, type, createdAt,
      roomId, roomName
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBooking.run([
    testBooking.id, testBooking.name, testBooking.email, testBooking.phone,
    testBooking.date, testBooking.time, testBooking.duration, testBooking.notes,
    testBooking.lessonType, null, null, null, null, testBooking.status,
    testBooking.type, testBooking.createdAt, testBooking.roomId, testBooking.roomName
  ]);

  insertBooking.finalize();
  console.log('✅ Добавлено тестовое бронирование');
}

// Выполняем инициализацию
setTimeout(() => {
  insertProducts();
  insertRentalItems();
  insertTestBooking();
  
  db.close((err) => {
    if (err) {
      console.error('❌ Ошибка при закрытии базы:', err);
    } else {
      console.log('🎉 Тестовые данные успешно добавлены!');
      console.log('📍 Теперь можно:');
      console.log('  - Проверить магазин: http://localhost:3000/store');
      console.log('  - Проверить аренду: http://localhost:3000/rental');
      console.log('  - Войти в админку: http://localhost:3000/admin/login');
    }
  });
}, 1000);