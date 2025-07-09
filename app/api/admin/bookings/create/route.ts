import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { database } from '@/lib/database'

export async function POST(req: NextRequest) {
  try {
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { roomId, roomName, date, time, duration, description, type } = body

    if (!roomId || !roomName || !date || !time || !duration || !description) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      )
    }

    const bookingId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const bookingData = {
      id: bookingId,
      name: description,
      email: 'admin@drumschool.com',
      phone: '+000-000-0000',
      date,
      time,
      duration,
      notes: description,
      lessonType: 'admin',
      bandSize: undefined,
      guestCount: undefined,
      instrument: undefined,
      partyType: undefined,
      status: 'confirmed' as const,
      type: 'Admin Block',
      roomId,
      roomName,
      adminMessage: description,
      createdAt: new Date().toISOString()
    }

    await database.createBooking(bookingData)

    return NextResponse.json({
      success: true,
      booking: bookingData
    })

  } catch (error) {
    console.error('Ошибка при создании админ бронирования:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании бронирования' },
      { status: 500 }
    )
  }
}