// app/api/admin/schedule/route.ts
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
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Дата обязательна' },
        { status: 400 }
      )
    }

    // Получаем все комнаты
    const rooms = await database.getAllRooms()
    
    // Получаем все бронирования на указанную дату
    const allBookings = await database.getAllBookings()
    const dateBookings = allBookings.filter(booking => booking.date === date)

    // Группируем бронирования по комнатам
    const schedule = rooms.map(room => {
      const roomBookings = dateBookings.filter(booking => 
        booking.roomId === room.id && booking.status === 'confirmed'
      )

      return {
        roomId: room.id,
        roomName: room.name,
        bookings: roomBookings.map(booking => ({
          id: booking.id,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          time: booking.time,
          duration: booking.duration,
          type: booking.type,
          status: booking.status,
          notes: booking.notes,
          adminMessage: booking.adminMessage
        }))
      }
    })

    return NextResponse.json({ 
      success: true, 
      schedule 
    })
  } catch (error) {
    console.error('Ошибка при получении расписания:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}