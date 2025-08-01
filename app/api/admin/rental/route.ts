import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { database } from '@/lib/database'

export async function GET() {
  try {
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const items = await database.getAllRentalItems()

    return NextResponse.json({ 
      success: true, 
      items 
    })
  } catch (error) {
    console.error('Ошибка при получении товаров для аренды:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

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
    const { name, description, pricePerDay, category, inStock, imageUrl, isActive } = body

    if (!name || !description || pricePerDay === undefined || !category || inStock === undefined) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    const itemId = await database.createRentalItem({
      name,
      description,
      pricePerDay: parseFloat(pricePerDay),
      category,
      inStock: parseInt(inStock),
      imageUrl: imageUrl || null,
      isActive: isActive !== false
    })

    return NextResponse.json({ 
      success: true, 
      itemId,
      message: 'Товар для аренды успешно создан' 
    })
  } catch (error) {
    console.error('Ошибка при создании товара для аренды:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}