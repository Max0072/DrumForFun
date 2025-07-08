// app/api/booking/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(req: NextRequest) {
    try {
        const { bookingId, status, adminMessage, roomId, roomName } = await req.json()

        if (!bookingId || !status) {
            return NextResponse.json(
                { error: 'Booking ID и статус обязательны' },
                { status: 400 }
            )
        }

        if (!['confirmed', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Неверный статус' },
                { status: 400 }
            )
        }

        // Получаем данные бронирования из базы данных
        const booking = await database.getBooking(bookingId)
        
        if (!booking) {
            return NextResponse.json(
                { error: 'Заявка не найдена' },
                { status: 404 }
            )
        }

        if (booking.status !== 'pending') {
            return NextResponse.json(
                { error: 'Заявка уже обработана' },
                { status: 400 }
            )
        }

        // Обновляем статус в базе данных
        await database.updateBookingStatus(
            bookingId, 
            status, 
            adminMessage || undefined, 
            roomId || undefined, 
            roomName || undefined
        )

        // Отправляем email клиенту с результатом
        if (status === 'confirmed') {
            const bookingDateTime = `${booking.date} ${booking.time}`
            const template = emailTemplates.bookingConfirmed(
                bookingId, 
                bookingDateTime, 
                roomName || 'Not assigned', 
                adminMessage || undefined
            )
            await sendEmail({
                to: booking.email,
                subject: template.subject,
                html: template.html
            })
        } else if (status === 'rejected') {
            const template = emailTemplates.bookingRejected(bookingId, adminMessage || undefined)
            await sendEmail({
                to: booking.email,
                subject: template.subject,
                html: template.html
            })
        }

        console.log(`📋 Заявка ${bookingId} ${status === 'confirmed' ? 'подтверждена' : 'отклонена'}`)

        return NextResponse.json({ 
            success: true, 
            message: `Заявка ${status === 'confirmed' ? 'подтверждена' : 'отклонена'}` 
        })
    } catch (err) {
        console.error('Ошибка при подтверждении заявки:', err)
        return NextResponse.json(
            { error: 'Ошибка сервера' },
            { status: 500 }
        )
    }
}