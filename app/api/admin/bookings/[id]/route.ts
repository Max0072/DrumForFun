import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { requireAuth } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // First, get the booking to check its status
    const bookings = await database.getAllBookings()
    const booking = bookings.find(b => b.id === id)

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of rejected or completed bookings
    if (booking.status !== 'rejected' && booking.status !== 'completed') {
      return NextResponse.json(
        { error: 'Only rejected or completed bookings can be deleted' },
        { status: 400 }
      )
    }

    const success = await database.deleteBooking(id)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Booking deleted successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete booking' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}