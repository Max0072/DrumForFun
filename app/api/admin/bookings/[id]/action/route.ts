// app/api/admin/bookings/[id]/action/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { database } from '@/lib/database'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Проверяем авторизацию
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const { id: bookingId } = await params
    const { action, adminMessage, roomId, roomName } = await req.json()

    if (!bookingId) {
      return NextResponse.json(
        { error: 'ID заявки обязателен' },
        { status: 400 }
      )
    }

    if (!action || !['confirm', 'reject', 'cancel'].includes(action)) {
      return NextResponse.json(
        { error: 'Неверное действие' },
        { status: 400 }
      )
    }

    // Получаем заявку
    const booking = await database.getBooking(bookingId)
    if (!booking) {
      return NextResponse.json(
        { error: 'Заявка не найдена' },
        { status: 404 }
      )
    }

    let newStatus: 'confirmed' | 'rejected'
    let emailSubject: string
    let emailTemplate: any

    switch (action) {
      case 'confirm':
        if (booking.status !== 'pending') {
          return NextResponse.json(
            { error: 'Заявка уже обработана' },
            { status: 400 }
          )
        }
        newStatus = 'confirmed'
        emailTemplate = emailTemplates.bookingConfirmed(
          bookingId, 
          `${booking.date} в ${booking.time}`,
          roomName || 'Комната будет назначена',
          adminMessage
        )
        break
        
      case 'reject':
        if (booking.status !== 'pending') {
          return NextResponse.json(
            { error: 'Заявка уже обработана' },
            { status: 400 }
          )
        }
        newStatus = 'rejected'
        emailTemplate = emailTemplates.bookingRejected(
          bookingId,
          adminMessage || 'К сожалению, мы не можем подтвердить вашу заявку.'
        )
        break
        
      case 'cancel':
        if (booking.status !== 'confirmed') {
          return NextResponse.json(
            { error: 'Можно отменять только подтвержденные заявки' },
            { status: 400 }
          )
        }
        newStatus = 'rejected'
        emailTemplate = emailTemplates.bookingCancelled(
          bookingId,
          adminMessage || 'Ваше бронирование было отменено.'
        )
        break
        
      default:
        return NextResponse.json(
          { error: 'Неверное действие' },
          { status: 400 }
        )
    }

    // Обновляем статус в базе данных
    const updated = await database.updateBookingStatus(
      bookingId,
      newStatus,
      adminMessage,
      roomId,
      roomName
    )

    if (!updated) {
      return NextResponse.json(
        { error: 'Не удалось обновить заявку' },
        { status: 500 }
      )
    }

    // Отправляем email клиенту
    try {
      await sendEmail({
        to: booking.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      })
    } catch (emailError) {
      console.error('⚠️ Ошибка отправки email:', emailError)
      // Не прерываем выполнение, если email не отправился
    }

    const actionText = {
      confirm: 'подтверждена',
      reject: 'отклонена', 
      cancel: 'отменена'
    }

    return NextResponse.json({ 
      success: true,
      message: `Заявка ${actionText[action]}`
    })
  } catch (error) {
    console.error('Ошибка при обработке действия:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}