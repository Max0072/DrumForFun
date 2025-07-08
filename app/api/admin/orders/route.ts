import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { validateSession } from '@/lib/auth'

async function verifyAdmin() {
  return await validateSession()
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    if (!await verifyAdmin()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orders = await database.getAllOrders()

    return NextResponse.json({
      success: true,
      orders
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}