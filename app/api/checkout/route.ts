import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import nodemailer from 'nodemailer'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  type: 'product' | 'rental'
}

interface CheckoutData {
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    notes: string
  }
  items: CartItem[]
  totalPrice: number
  orderDate: string
}

function generateOrderCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function sendCustomerEmail(customerEmail: string, customerName: string, orderCode: string, items: CartItem[], totalPrice: number) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.name} ${item.type === 'rental' ? '(Rental)' : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Your order ${orderCode} - Drum School`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Thank you for your order!</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Order Details</h3>
          <p><strong>Order Code:</strong> <span style="font-size: 18px; color: #28a745; font-weight: bold;">${orderCode}</span></p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
        </div>

        <h3 style="color: #333;">Ordered Items:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #e9ecef;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr style="background: #f8f9fa; font-weight: bold;">
              <td style="padding: 15px;" colspan="2">Total:</td>
              <td style="padding: 15px; text-align: right; font-size: 18px; color: #28a745;">$${totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0066cc; margin-top: 0;">Pickup Information</h3>
          <p><strong>Your pickup code: ${orderCode}</strong></p>
          <p>Present this code when collecting your order at our music school.</p>
          <p>Address: [Music school address]</p>
          <p>Opening hours: [Opening hours]</p>
        </div>

        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          If you have any questions, please contact us by email or phone.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

async function sendAdminEmail(orderCode: string, customerInfo: any, items: CartItem[], totalPrice: number) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.name} ${item.type === 'rental' ? '(Rental)' : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('')

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New order ${orderCode} - Preparation required`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545; text-align: center;">New order for preparation</h2>
        
        <div style="background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">⚠️ Action required</h3>
          <p><strong>Order code:</strong> ${orderCode}</p>
          <p>Prepare items for customer pickup.</p>
        </div>

        <h3 style="color: #333;">Customer information:</h3>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
          <p><strong>Name:</strong> ${customerInfo.name}</p>
          <p><strong>Email:</strong> ${customerInfo.email}</p>
          <p><strong>Phone:</strong> ${customerInfo.phone}</p>
          <p><strong>Address:</strong> ${customerInfo.address}</p>
          ${customerInfo.notes ? `<p><strong>Comments:</strong> ${customerInfo.notes}</p>` : ''}
        </div>

        <h3 style="color: #333;">Ordered items:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #e9ecef;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr style="background: #f8f9fa; font-weight: bold;">
              <td style="padding: 15px;" colspan="2">Total:</td>
              <td style="padding: 15px; text-align: right; font-size: 18px; color: #28a745;">$${totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #d1ecf1; color: #0c5460; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Next steps:</h3>
          <ol>
            <li>Prepare all items from the list</li>
            <li>Pack for pickup</li>
            <li>Wait for customer with code: <strong>${orderCode}</strong></li>
            <li>Hand over order and mark as completed in admin panel</li>
          </ol>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutData = await request.json()
    const { customerInfo, items, totalPrice } = body

    // Validation
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Generate unique order code
    let orderCode: string
    let codeExists = true
    let attempts = 0
    
    do {
      orderCode = generateOrderCode()
      const existingOrder = await database.getOrderByCode(orderCode)
      codeExists = existingOrder !== null
      attempts++
    } while (codeExists && attempts < 10)

    if (codeExists) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique order code' },
        { status: 500 }
      )
    }

    // Create order in database
    const orderId = await database.createOrder({
      orderCode,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      notes: customerInfo.notes || undefined,
      items: JSON.stringify(items),
      totalPrice,
      status: 'pending'
    })

    // Send emails
    try {
      await Promise.all([
        sendCustomerEmail(customerInfo.email, customerInfo.name, orderCode, items, totalPrice),
        sendAdminEmail(orderCode, customerInfo, items, totalPrice)
      ])
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Continue anyway - order is still created
    }

    return NextResponse.json({
      success: true,
      orderCode,
      orderId,
      message: 'Order placed successfully'
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while processing the order' },
      { status: 500 }
    )
  }
}