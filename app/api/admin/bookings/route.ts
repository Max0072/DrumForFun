// app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { database } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // pending, confirmed, rejected или все

    // Получаем все заявки или фильтруем по статусу
    const bookings = await database.getAllBookings(status || undefined)

    return NextResponse.json({ 
      success: true, 
      bookings 
    })
  } catch (error) {
    console.error('Ошибка при получении заявок:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}