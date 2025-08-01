import { NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function GET() {
  try {
    const rentalItems = await database.getAllRentalItems()
    
    // Фильтруем только активные товары с наличием > 0
    const activeItems = rentalItems.filter(item => 
      item.isActive && item.inStock > 0
    )

    return NextResponse.json({ 
      success: true, 
      items: activeItems 
    })
  } catch (error) {
    console.error('Ошибка при получении товаров для аренды:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}