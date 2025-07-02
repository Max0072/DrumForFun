// app/api/admin/rooms/route.ts
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

    // Получаем все комнаты
    const rooms = await database.getAllRooms()

    return NextResponse.json({ 
      success: true, 
      rooms 
    })
  } catch (error) {
    console.error('Ошибка при получении комнат:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}