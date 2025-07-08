import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const updatedCount = await database.updatePastBookingsToCompleted()
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} past bookings to completed status`,
      updatedCount
    })
  } catch (error) {
    console.error('Error updating past bookings:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update past bookings'
      },
      { status: 500 }
    )
  }
}