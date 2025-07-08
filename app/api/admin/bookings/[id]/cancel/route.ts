import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { database } from '@/lib/database'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { isAdminBooking } = body

    const booking = await database.getBookingById(id)
    if (!booking) {
      return NextResponse.json(
        { error: 'Бронирование не найдено' },
        { status: 404 }
      )
    }

    await database.deleteBooking(id)

    if (!isAdminBooking && booking.email) {
      try {
        await sendEmail({
          to: booking.email,
          subject: 'Отмена бронирования - Drum School',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #dc2626;">Бронирование отменено</h1>
              <p>Здравствуйте, ${booking.name}!</p>
              <p>К сожалению, ваше бронирование было отменено администратором:</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Дата:</strong> ${booking.date}</p>
                <p><strong>Время:</strong> ${booking.time}</p>
                <p><strong>Длительность:</strong> ${booking.duration} час(а)</p>
                <p><strong>Комната:</strong> ${booking.roomName || 'Не указана'}</p>
                <p><strong>Тип урока:</strong> ${booking.type}</p>
              </div>
              <p>Мы приносим извинения за неудобства. Если у вас есть вопросы, свяжитесь с нами.</p>
              <p style="margin-top: 30px;">
                С уважением,<br>
                <strong>Drum School</strong>
              </p>
            </div>
          `
        })
      } catch (emailError) {
        console.error('Ошибка отправки email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: isAdminBooking ? 'Админ бронирование отменено' : 'Бронирование отменено, email отправлен'
    })

  } catch (error) {
    console.error('Ошибка при отмене бронирования:', error)
    return NextResponse.json(
      { error: 'Ошибка при отмене бронирования' },
      { status: 500 }
    )
  }
}