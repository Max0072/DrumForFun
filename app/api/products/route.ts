import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET() {
  try {
    const products = await database.getAllProducts()
    
    // Фильтруем только активные товары с наличием > 0
    const activeProducts = products.filter(product => 
      product.isActive && product.inStock > 0
    )

    return NextResponse.json({ 
      success: true, 
      products: activeProducts 
    })
  } catch (error) {
    console.error('Ошибка при получении товаров:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}