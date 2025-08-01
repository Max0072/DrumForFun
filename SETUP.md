# Booking System Setup

## 🚀 What's Added

1. **SQLite Database** for storing booking requests
2. **Email Notifications** via Nodemailer
3. **Booking Confirmation System** through admin panel
4. **API for booking management**

## 📋 Installation and Setup

### 1. Install Dependencies (already done)
```bash
npm install nodemailer sqlite3 @types/nodemailer
```

### 2. Email Configuration

#### Option A: Gmail (recommended for development)

1. Enable two-factor authentication in Gmail
2. Create an "App Password":
   - Google Account → Security → App passwords
   - Select "Mail" and "Other" (enter "Drum School")
   - Copy the generated password

3. Edit `.env.production`:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password-from-step-2
EMAIL_FROM=noreply@drumschool.com
ADMIN_EMAIL=your-admin@gmail.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

#### Option B: Other SMTP Provider

Update `lib/email.ts` for production:
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

### 3. Start the Application

```bash
npm run dev
```

## 🎯 How the System Works

### 1. Client Submits a Request
- Goes to `/booking`
- Selects type: Individual, Band, or Party
- Fills out and submits the form

### 2. System Processes the Request
- Generates unique ID (e.g., `A1B2C3D4`)
- Saves data to `bookings.db` database
- Sends email to admin with confirmation link
- Sends confirmation email to client

### 3. Admin Confirms/Rejects
- Follows link from email: `/admin/booking/{ID}/confirm`
- Views all request details
- Can add comments
- Clicks "Confirm" or "Reject"

### 4. Client Receives Final Response
- Email with confirmation or rejection
- Admin comment (if provided)

## 📁 File Structure

```
lib/
├── email.ts          # Email configuration and templates
└── database.ts       # SQLite database operations

app/api/booking/
├── route.ts          # POST /api/booking - create request
├── [id]/route.ts     # GET /api/booking/{id} - get request
└── confirm/route.ts  # POST /api/booking/confirm - confirmation

app/admin/
├── page.tsx                        # Admin panel home
└── booking/[id]/confirm/page.tsx   # Confirmation page
```

## 🎨 Email Templates

In `lib/email.ts` there are ready templates:
- `adminNotification` - admin notification
- `clientConfirmation` - client confirmation
- `bookingConfirmed` - booking confirmed
- `bookingRejected` - booking rejected

## 🔧 Customization

### Change Form Fields
1. Update `BookingFormData` in `app/booking/page.tsx`
2. Update `BookingData` in `lib/database.ts`
3. Add fields to database table

### Change Email Templates
Edit functions in `lib/email.ts`

### Add Validation
Update `validateField` in `app/booking/page.tsx`

## 🚀 Production

1. Replace SQLite with PostgreSQL:
```bash
npm install pg @types/pg
```

2. Update `lib/database.ts` for PostgreSQL

3. Use professional email service:
   - SMTP (Gmail, Yandex, Mail.ru)
   - Amazon SES
   - Mailgun

4. Add authentication to admin panel

## 🐛 Debugging

### Check Email Sending
1. Console logs: `📧 Email sent: {messageId}`
2. Check `.env.local`
3. For Gmail, verify app password

### Check Database
Database is created automatically in `bookings.db`
```bash
sqlite3 bookings.db
.tables
SELECT * FROM bookings;
```

### Testing
1. Fill out form at `/booking`
2. Check console for logs
3. Check email (may go to spam)
4. Follow confirmation link