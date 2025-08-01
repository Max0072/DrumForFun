// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { database } from '@/lib/database'

export async function GET() {
  try {
    // Проверяем авторизацию
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Получаем статистику
    const stats = await database.getBookingStats()

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Ошибка при получении статистики:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}