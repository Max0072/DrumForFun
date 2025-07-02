// app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const bookingType = searchParams.get('type') || 'individual'

    if (!date) {
      return NextResponse.json(
        { error: 'Дата обязательна' },
        { status: 400 }
      )
    }

    console.log(`🔍 Проверяем доступность на ${date} для типа ${bookingType}`)

    // Получаем доступные временные слоты
    const availableSlots = await database.getAvailableTimeSlots(date, bookingType)

    console.log(`✅ Доступные слоты: ${availableSlots.join(', ')}`)

    return NextResponse.json({ 
      success: true, 
      availableSlots 
    })
  } catch (err) {
    console.error('Ошибка при получении доступных слотов:', err)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}