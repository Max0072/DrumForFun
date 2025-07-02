// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json()

    if (!login || !password) {
      return NextResponse.json(
        { error: 'Логин и пароль обязательны' },
        { status: 400 }
      )
    }

    // Отладочная информация
    console.log('🔍 Debug авторизации:')
    console.log('Полученный логин:', login)
    console.log('Полученный пароль (первые 10 символов):', password.substring(0, 10))
    console.log('ADMIN_LOGIN из env:', process.env.ADMIN_LOGIN)
    console.log('ADMIN_PASSWORD из env (первые 10 символов):', process.env.ADMIN_PASSWORD?.substring(0, 10))
    console.log('Логин совпадает:', login === process.env.ADMIN_LOGIN)
    console.log('Пароль совпадает:', password === process.env.ADMIN_PASSWORD)

    // Проверяем учетные данные
    if (!validateCredentials(login, password)) {
      console.log('❌ Валидация не прошла')
      return NextResponse.json(
        { error: 'Неверные учетные данные' },
        { status: 401 }
      )
    }

    console.log('✅ Валидация прошла успешно')

    // Создаем сессию
    await createSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка при входе в админ-панель:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}