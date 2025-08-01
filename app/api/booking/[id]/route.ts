// app/api/booking/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID обязателен' },
        { status: 400 }
      )
    }

    // Получаем заявку из базы данных
    const booking = await database.getBooking(bookingId)

    if (!booking) {
      return NextResponse.json(
        { error: 'Заявка не найдена' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, booking })
  } catch (err) {
    console.error('Ошибка при получении заявки:', err)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}