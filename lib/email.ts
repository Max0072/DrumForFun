// lib/email.ts
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Initialize MailerSend
let mailerSend: MailerSend | null = null

if (process.env.MAILERSEND_API_TOKEN) {
  mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_TOKEN,
  })
} else {
  console.warn('⚠️ MAILERSEND_API_TOKEN not found in environment variables')
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // Если MAILERSEND_API_TOKEN не настроен, просто логируем без отправки
    if (!mailerSend || !process.env.MAILERSEND_API_TOKEN || process.env.MAILERSEND_API_TOKEN === 'your-mailersend-api-token') {
      console.log('📧 Email (demo mode):', { to, subject })
      console.log('📧 Content:', html.substring(0, 200) + '...')
      return { success: true, messageId: 'demo-' + Date.now() }
    }

    // Prepare email parameters
    const sentFrom = new Sender(
      process.env.MAILERSEND_FROM_EMAIL || 'noreply@drumschool.com',
      'Drum School'
    )

    const recipients = [new Recipient(to, to)]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html)
      .setText(text || html.replace(/<[^>]*>/g, '')) // простое удаление HTML тегов для text версии

    const response = await mailerSend.email.send(emailParams)
    
    console.log('📧 Email sent via MailerSend:', response.statusCode)
    return { success: true, messageId: response.body?.message_id || 'mailersend-' + Date.now() }
  } catch (error: any) {
    console.error('❌ MailerSend email error:', error)
    
    // MailerSend specific error handling
    if (error.response) {
      console.error('MailerSend error body:', error.response.body)
      return { 
        success: false, 
        error: error.response.body?.message || error.message 
      }
    }
    
    return { success: false, error: error.message }
  }
}

// Шаблоны email
export const emailTemplates = {
  adminNotification: (bookingId: string, bookingDetails: string) => ({
    subject: `Новая заявка на бронирование #${bookingId}`,
    html: `
      <h2>Новая заявка на бронирование</h2>
      <p><strong>ID заявки:</strong> ${bookingId}</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${bookingDetails}</pre>
      </div>
      
      <p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/booking/${bookingId}/confirm" 
           style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Подтвердить/Отклонить заявку
        </a>
      </p>
      
      <p><small>Это автоматическое уведомление от системы бронирования школы барабанов</small></p>
    `
  }),

  clientConfirmation: (bookingId: string, bookingDetails: string) => ({
    subject: `Заявка на бронирование #${bookingId} получена`,
    html: `
      <h2>Спасибо за заявку!</h2>
      <p>Ваша заявка <strong>#${bookingId}</strong> успешно получена и передана на рассмотрение.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3>Детали вашей заявки:</h3>
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${bookingDetails}</pre>
      </div>
      
      <p>Мы свяжемся с вами в ближайшее время для подтверждения.</p>
      
      <p>С уважением,<br>Команда школы барабанов</p>
    `
  }),

  bookingConfirmed: (bookingId: string, bookingDateTime: string, roomName: string, adminMessage?: string) => ({
    subject: `Заявка #${bookingId} подтверждена! 🎉`,
    html: `
      <h2 style="color: #28a745;">Отличные новости!</h2>
      <p>Ваша заявка <strong>#${bookingId}</strong> подтверждена!</p>
      
      <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h4>Детали бронирования:</h4>
        <p><strong>Дата и время:</strong> ${bookingDateTime}</p>
        <p><strong>Комната:</strong> ${roomName}</p>
      </div>
      
      ${adminMessage ? `
        <div style="background: #e7f3ff; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0;">
          <h4>Сообщение от администратора:</h4>
          <p>${adminMessage}</p>
        </div>
      ` : ''}
      
      <p>Мы ждем вас в назначенное время!</p>
      
      <p>С уважением,<br>Команда школы барабанов</p>
    `
  }),

  bookingRejected: (bookingId: string, adminMessage?: string) => ({
    subject: `Заявка #${bookingId} отклонена`,
    html: `
      <h2 style="color: #dc3545;">К сожалению...</h2>
      <p>Ваша заявка <strong>#${bookingId}</strong> была отклонена.</p>
      
      ${adminMessage ? `
        <div style="background: #ffe6e6; padding: 15px; border-left: 4px solid #dc3545; margin: 15px 0;">
          <h4>Причина:</h4>
          <p>${adminMessage}</p>
        </div>
      ` : ''}
      
      <p>Вы можете подать новую заявку на другое время через наш сайт.</p>
      
      <p>С уважением,<br>Команда школы барабанов</p>
    `
  }),

  bookingCancelled: (bookingId: string, adminMessage?: string) => ({
    subject: `Бронирование #${bookingId} отменено`,
    html: `
      <h2 style="color: #dc3545;">Бронирование отменено</h2>
      <p>Ваше бронирование <strong>#${bookingId}</strong> было отменено.</p>
      
      ${adminMessage ? `
        <div style="background: #ffe6e6; padding: 15px; border-left: 4px solid #dc3545; margin: 15px 0;">
          <h4>Причина отмены:</h4>
          <p>${adminMessage}</p>
        </div>
      ` : ''}
      
      <p>Если у вас есть вопросы, свяжитесь с нами.</p>
      <p>Вы можете забронировать другое время через наш сайт.</p>
      
      <p>С уважением,<br>Команда школы барабанов</p>
    `
  })
}