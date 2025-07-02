// lib/auth.ts
import { cookies } from 'next/headers'
import crypto from 'crypto'

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const AUTH_SECRET = process.env.AUTH_SECRET || 'your-secret-key-change-in-production'

// Простое хеширование пароля
function hashPassword(password: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(password).digest('hex')
}

// Генерация токена сессии
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Проверка учетных данных
export function validateCredentials(login: string, password: string): boolean {
  return login === ADMIN_LOGIN && password === ADMIN_PASSWORD
}

// Создание сессии
export async function createSession(): Promise<string> {
  const token = generateSessionToken()
  const cookieStore = await cookies()
  
  // Устанавливаем cookie на 24 часа
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 часа
  })
  
  return token
}

// Проверка сессии
export async function validateSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')
    
    return !!sessionToken?.value
  } catch (error) {
    console.error('Ошибка валидации сессии:', error)
    return false
  }
}

// Удаление сессии
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

// Middleware для защиты админ роутов
export async function requireAuth(): Promise<boolean> {
  const isAuthenticated = await validateSession()
  return isAuthenticated
}