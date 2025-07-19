import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { validateSession } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

async function verifyAdmin() {
  return await validateSession()
}

async function sendStatusUpdateEmail(customerEmail: string, customerName: string, orderCode: string, status: string) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ready':
        return {
          title: 'Order Ready for Pickup',
          message: 'Great news! Your order is ready for pickup.',
          color: '#28a745',
          instructions: 'Please visit our music school with your pickup code to collect your items.'
        }
      case 'completed':
        return {
          title: 'Order Completed',
          message: 'Thank you! Your order has been successfully completed.',
          color: '#28a745',
          instructions: 'We hope you enjoy your purchase. Thank you for choosing our music school!'
        }
      case 'cancelled':
        return {
          title: 'Order Cancelled',
          message: 'We regret to inform you that your order has been cancelled.',
          color: '#dc3545',
          instructions: 'If you have any questions about this cancellation, please contact us.'
        }
      default:
        return {
          title: 'Order Status Update',
          message: 'Your order status has been updated.',
          color: '#6c757d',
          instructions: 'Please contact us if you have any questions.'
        }
    }
  }

  const statusInfo = getStatusInfo(status)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusInfo.color}; text-align: center;">${statusInfo.title}</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; margin-bottom: 10px;">Dear ${customerName},</p>
        <p style="font-size: 16px;">${statusInfo.message}</p>
      </div>

      <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order Code:</strong> <span style="font-size: 18px; color: ${statusInfo.color}; font-weight: bold;">${orderCode}</span></p>
        <p><strong>Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold; text-transform: capitalize;">${status}</span></p>
      </div>

      ${status === 'ready' ? `
      <div style="background: #d4edda; color: #155724; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">📍 Pickup Instructions</h3>
        <p><strong>Your pickup code: ${orderCode}</strong></p>
        <p>Please bring this code when collecting your order.</p>
        <p><strong>Address:</strong> [Music school address]</p>
        <p><strong>Opening hours:</strong> [Opening hours]</p>
      </div>
      ` : ''}

      ${status === 'completed' ? `
      <div style="background: #d1ecf1; color: #0c5460; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">✅ Order Completed</h3>
        <p>Your order has been successfully completed and picked up.</p>
        <p>Thank you for your business!</p>
      </div>
      ` : ''}

      <p style="margin-top: 20px;">${statusInfo.instructions}</p>

      <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
        If you have any questions, please contact us by email or phone.
      </p>
    </div>
  `

  await sendEmail({
    to: customerEmail,
    subject: `${statusInfo.title} - Order ${orderCode}`,
    html
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    if (!await verifyAdmin()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { status } = await request.json()
    const { id: orderId } = await params

    if (!status || !['pending', 'ready', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get order details before updating
    const order = await database.getOrderByCode(orderId) || await database.getAllOrders().then(orders => 
      orders.find(o => o.id === orderId)
    )

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    const success = await database.updateOrderStatus(orderId, status)

    if (success) {
      // Send email notification to customer if status changed to ready, completed or cancelled
      if (status === 'ready' || status === 'completed' || status === 'cancelled') {
        try {
          await sendStatusUpdateEmail(
            order.customerEmail,
            order.customerName,
            order.orderCode,
            status
          )
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError)
          // Continue anyway - status was updated successfully
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Order status updated successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to update order status' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}