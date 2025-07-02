// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { database, type BookingData } from '@/lib/database'
import { sendEmail, emailTemplates } from '@/lib/email'

interface BookingFormData {
    name: string
    email: string
    phone: string
    date: string
    time: string
    duration: string
    notes?: string
    lessonType: string
    // Специфичные поля для разных типов
    bandSize?: string
    guestCount?: string
    instrument?: string
    partyType?: string
}

function generateBookingId(): string {
    return crypto.randomBytes(8).toString('hex').toUpperCase()
}

function formatBookingType(data: BookingFormData): string {
    if (data.instrument) return 'Individual Practice'
    if (data.bandSize) return 'Band Rehearsal'
    if (data.partyType) return 'Birthday Party'
    return 'Unknown'
}

function formatBookingDetails(data: BookingFormData): string {
    const bookingType = formatBookingType(data)
    const bookingDate = new Date(data.date).toLocaleDateString('ru-RU')
    
    let details = `📅 Тип бронирования: ${bookingType}
👤 Имя: ${data.name}
📧 Email: ${data.email}
📞 Телефон: ${data.phone}
📅 Дата: ${bookingDate}
⏰ Время: ${data.time}
⏱️ Длительность: ${data.duration} час(а/ов)`

    if (data.instrument) {
        details += `\n🎵 Инструмент: ${data.instrument}`
    }
    
    if (data.bandSize) {
        details += `\n👥 Количество участников группы: ${data.bandSize}`
    }
    
    if (data.guestCount) {
        details += `\n🎉 Количество гостей: ${data.guestCount}`
    }
    
    if (data.partyType) {
        details += `\n🎂 Тип праздника: ${data.partyType}`
    }
    
    if (data.notes) {
        details += `\n📝 Дополнительные заметки: ${data.notes}`
    }

    return details
}

async function sendNotificationEmails(bookingId: string, data: BookingFormData) {
    const bookingDetails = formatBookingDetails(data)
    
    // Email администратору
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@drumschool.com'
    const adminTemplate = emailTemplates.adminNotification(bookingId, bookingDetails)
    
    await sendEmail({
        to: adminEmail,
        subject: adminTemplate.subject,
        html: adminTemplate.html
    })
    
    // Email клиенту
    const clientTemplate = emailTemplates.clientConfirmation(bookingId, bookingDetails)
    
    await sendEmail({
        to: data.email,
        subject: clientTemplate.subject,
        html: clientTemplate.html
    })
}

export async function POST(req: NextRequest) {
    try {
        const data: BookingFormData = await req.json()

        // Валидация обязательных полей
        if (!data.name || !data.email || !data.phone || !data.date || !data.time) {
            return NextResponse.json(
                { error: 'Заполните все обязательные поля' },
                { status: 400 }
            )
        }

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
            return NextResponse.json(
                { error: 'Некорректный email адрес' },
                { status: 400 }
            )
        }

        // Генерируем уникальный ID для заявки
        const bookingId = generateBookingId()

        // Создаем запись о бронировании для базы данных
        const booking: Omit<BookingData, 'updatedAt'> = {
            id: bookingId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            date: data.date,
            time: data.time,
            duration: data.duration,
            notes: data.notes,
            lessonType: data.lessonType,
            bandSize: data.bandSize,
            guestCount: data.guestCount,
            instrument: data.instrument,
            partyType: data.partyType,
            status: 'pending' as const,
            type: formatBookingType(data),
            createdAt: new Date().toLocaleString("en-US", { timeZone: "Europe/Nicosia" })
        }

        console.log('📥 Новая заявка на бронирование:', booking)

        // Сохраняем в базу данных
        await database.saveBooking(booking)

        // Отправляем уведомления (не блокируем выполнение при ошибках email)
        try {
            await sendNotificationEmails(bookingId, data)
        } catch (emailError) {
            console.error('⚠️ Email отправка не удалась, но заявка сохранена:', emailError)
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Заявка принята', 
            bookingId 
        })
    } catch (err) {
        console.error('Ошибка при обработке заявки:', err)
        return NextResponse.json(
            { error: 'Ошибка сервера' },
            { status: 500 }
        )
    }
}