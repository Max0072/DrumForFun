// app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const bookingType = searchParams.get('type') || 'individual'
    const startTime = searchParams.get('startTime')
    const duration = searchParams.get('duration')

    if (!date) {
      return NextResponse.json(
        { error: 'Дата обязательна' },
        { status: 400 }
      )
    }

    console.log(`🔍 Проверяем доступность на ${date} для типа ${bookingType}`)

    // If checking for conflicts with a specific time and duration
    if (startTime && duration) {
      console.log(`🔍 Проверяем конфликты для ${startTime} длительностью ${duration}ч`)
      
      const conflicts = await database.checkBookingConflicts(date, startTime, duration, bookingType)
      
      console.log(`⚠️ Найдено конфликтов: ${conflicts.length}`)
      
      return NextResponse.json({ 
        success: true, 
        conflicts,
        hasConflicts: conflicts.length > 0
      })
    }

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