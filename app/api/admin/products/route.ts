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

    const products = await database.getAllProducts()

    return NextResponse.json({ 
      success: true, 
      products 
    })
  } catch (error) {
    console.error('Ошибка при получении товаров:', error)
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
    const { name, description, price, category, inStock, imageUrl, isActive } = body

    if (!name || !description || price === undefined || !category || inStock === undefined) {
      return NextResponse.json(
        { error: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    const productId = await database.createProduct({
      name,
      description,
      price: parseFloat(price),
      category,
      inStock: parseInt(inStock),
      imageUrl: imageUrl || null,
      isActive: isActive !== false
    })

    return NextResponse.json({ 
      success: true, 
      productId,
      message: 'Товар успешно создан' 
    })
  } catch (error) {
    console.error('Ошибка при создании товара:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}