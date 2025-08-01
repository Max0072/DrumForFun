// lib/email.ts
import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Initialize SMTP transporter
let transporter: nodemailer.Transporter | null = null

function createTransporter() {
  if (!transporter) {
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_APP_PASSWORD,
      },
    }
    
    transporter = nodemailer.createTransporter(smtpConfig)
  }
  
  return transporter
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER && !process.env.EMAIL_USER) {
      console.log('📧 Email (demo mode):', { to, subject })
      console.log('📧 Content:', html.substring(0, 200) + '...')
      return { success: true, messageId: 'demo-' + Date.now() }
    }

    const transporter = createTransporter()
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_FROM || 'noreply@drumschool.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Simple HTML tag removal for text version
    }

    const result = await transporter.sendMail(mailOptions)
    
    console.log('📧 Email sent via SMTP:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error: any) {
    console.error('❌ SMTP email error:', error)
    return { success: false, error: error.message }
  }
}

// Email templates
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