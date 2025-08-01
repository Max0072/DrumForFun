// app/api/rooms/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const time = searchParams.get('time')
    const duration = parseInt(searchParams.get('duration') || '1')
    const bookingType = searchParams.get('type') || 'individual'

    // Если все параметры есть, возвращаем доступные комнаты для конкретного времени
    if (date && time) {
      const availableRooms = await database.getAvailableRooms(date, time, duration, bookingType)
      return NextResponse.json({ 
        success: true, 
        rooms: availableRooms 
      })
    }

    // Иначе возвращаем все комнаты
    const allRooms = await database.getAllRooms()
    return NextResponse.json({ 
      success: true, 
      rooms: allRooms 
    })
  } catch (err) {
    console.error('Ошибка при получении комнат:', err)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}