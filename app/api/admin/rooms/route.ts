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

export async function POST(request: Request) {
  try {
    // Проверяем авторизацию
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Получаем данные из запроса
    const body = await request.json()
    const { id, name, type, capacity, description } = body

    // Валидация
    if (!id || !name || !type || !capacity) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    if (!['drums', 'guitar', 'universal'].includes(type)) {
      return NextResponse.json(
        { error: 'Неверный тип комнаты' },
        { status: 400 }
      )
    }

    if (capacity < 1 || capacity > 50) {
      return NextResponse.json(
        { error: 'Вместимость должна быть от 1 до 50 человек' },
        { status: 400 }
      )
    }

    // Создаем комнату
    await database.createRoom({
      id,
      name,
      type,
      capacity: parseInt(capacity),
      description,
      isVisible: true
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Комната успешно создана' 
    })
  } catch (error) {
    console.error('Ошибка при создании комнаты:', error)
    
    // Проверяем на дублирование ID
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Комната с таким ID уже существует' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    // Проверяем авторизацию
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Получаем данные из запроса
    const body = await request.json()
    const { roomId, action } = body

    if (!roomId) {
      return NextResponse.json(
        { error: 'ID комнаты не указан' },
        { status: 400 }
      )
    }

    if (action === 'toggle-visibility') {
      // Переключаем видимость комнаты
      await database.toggleRoomVisibility(roomId)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Видимость комнаты изменена' 
      })
    }

    return NextResponse.json(
      { error: 'Неизвестное действие' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Ошибка при обновлении комнаты:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Проверяем авторизацию
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // Получаем ID комнаты из параметров запроса
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('id')

    if (!roomId) {
      return NextResponse.json(
        { error: 'ID комнаты не указан' },
        { status: 400 }
      )
    }

    // Проверяем, есть ли активные бронирования на эту комнату
    const activeBookings = await database.getBookingsByRoom(roomId)
    const futureBookings = activeBookings.filter(booking => {
      const bookingDate = new Date(booking.date)
      const today = new Date()
      return bookingDate >= today && booking.status !== 'rejected'
    })

    if (futureBookings.length > 0) {
      return NextResponse.json(
        { error: `Нельзя удалить комнату: есть ${futureBookings.length} активных бронирований` },
        { status: 400 }
      )
    }

    // Удаляем комнату
    await database.deleteRoom(roomId)

    return NextResponse.json({ 
      success: true, 
      message: 'Комната успешно удалена' 
    })
  } catch (error) {
    console.error('Ошибка при удалении комнаты:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}