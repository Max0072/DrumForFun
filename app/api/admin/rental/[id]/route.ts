import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { database } from '@/lib/database'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()

    const success = await database.updateRentalItem(id, body)

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Товар для аренды успешно обновлен' 
      })
    } else {
      return NextResponse.json(
        { error: 'Товар для аренды не найден' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Ошибка при обновлении товара для аренды:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const { id } = await params
    const success = await database.deleteRentalItem(id)

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Товар для аренды успешно удален' 
      })
    } else {
      return NextResponse.json(
        { error: 'Товар для аренды не найден' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Ошибка при удалении товара для аренды:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}