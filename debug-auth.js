// Простой скрипт для проверки переменных окружения
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Проверка переменных окружения:')
console.log('ADMIN_LOGIN:', process.env.ADMIN_LOGIN || 'НЕ НАЙДЕН')
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD || 'НЕ НАЙДЕН')
console.log('AUTH_SECRET:', process.env.AUTH_SECRET ? 'НАЙДЕН (скрыт)' : 'НЕ НАЙДЕН')

console.log('\n🧪 Тест валидации:')
const testLogin = 'drumschool_admin_2024'
const testPassword = 'K8mN#vX9$qR7@pL3!zF6&wJ2^tY5*uE8'

console.log('Тестовый логин:', testLogin)
console.log('Совпадает с env:', testLogin === process.env.ADMIN_LOGIN)
console.log('Тестовый пароль совпадает с env:', testPassword === process.env.ADMIN_PASSWORD)

if (process.env.ADMIN_PASSWORD) {
  console.log('Длина пароля в env:', process.env.ADMIN_PASSWORD.length)
  console.log('Первые 10 символов:', process.env.ADMIN_PASSWORD.substring(0, 10))
}