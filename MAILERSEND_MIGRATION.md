# MailerSend Migration Guide

This document describes the migration to MailerSend for email sending in the Drum School application.

## What Was Changed

### 1. Dependencies
- **Removed**: `@sendgrid/mail`
- **Added**: `mailersend` (v2.6.0)

### 2. Core Email Service (`lib/email.ts`)
- Replaced SendGrid client with MailerSend SDK
- Updated email sending logic to use MailerSend API
- Maintained all existing email templates
- Added better error handling for MailerSend responses

### 3. API Routes Updated
All API routes now use the centralized MailerSend service:

- **`app/api/booking/route.ts`**: Booking confirmation emails
- **`app/api/admin/bookings/[id]/action/route.ts`**: Booking status update emails
- **`app/api/admin/bookings/[id]/cancel/route.ts`**: Booking cancellation emails
- **`app/api/checkout/route.ts`**: E-commerce order confirmation emails
- **`app/api/admin/orders/[id]/route.ts`**: Order status update emails

### 4. Environment Variables
**New MailerSend variables:**
```env
MAILERSEND_API_TOKEN=your-mailersend-api-token
MAILERSEND_FROM_EMAIL=noreply@drumschool.com
ADMIN_EMAIL=admin@drumschool.com
```

## Setting Up MailerSend

### 1. Create MailerSend Account
1. Go to [MailerSend](https://www.mailersend.com/)
2. Sign up for a free account (3,000 emails/month free)
3. Verify your account

### 2. Get API Token
1. In MailerSend dashboard, go to Domains > API Tokens
2. Create a new API Token with "Full access" or specific permissions
3. Copy the API token (starts with `mlsn.`)

### 3. Add and Verify Domain
1. Go to Domains in MailerSend dashboard
2. Add your domain (e.g., `drumschool.com`)
3. Follow DNS verification instructions
4. Wait for verification (usually takes a few minutes)

### 4. Update Environment Variables
Create/update your `.env` file:
```env
MAILERSEND_API_TOKEN=mlsn.your-actual-token-here
MAILERSEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

## Email Templates Maintained

All existing email templates remain the same:
- Booking system emails (admin notifications, confirmations, status updates)
- E-commerce emails (order confirmations, status updates, pickup instructions)
- Admin notifications

## Error Handling

The system includes graceful error handling:
- Email failures don't break core functionality (bookings/orders still succeed)
- Detailed error logging for debugging
- Demo mode when MailerSend is not configured (logs emails to console instead of sending)

## Testing

### Demo Mode
If `MAILERSEND_API_TOKEN` is not set or equals `'your-mailersend-api-token'`, the system runs in demo mode:
- Emails are logged to console instead of being sent
- All core functionality continues to work
- No actual emails are sent

### Production Testing
1. Set up MailerSend properly with real API token
2. Verify your domain in MailerSend
3. Test booking creation (should send admin notification and customer confirmation)
4. Test booking status changes (should send status update emails)
5. Test order creation and status updates
6. Check MailerSend Activity dashboard for delivery status

## Benefits of MailerSend

1. **Free Tier**: 3,000 emails per month free (vs SendGrid's 100)
2. **Reliability**: Good deliverability rates
3. **User-Friendly**: Simple dashboard and setup
4. **Features**: Email analytics, webhooks, templates
5. **Developer-Friendly**: Good API documentation and SDKs

## MailerSend vs SendGrid Comparison

| Feature | MailerSend | SendGrid |
|---------|------------|----------|
| Free emails/month | 3,000 | 100 |
| Setup complexity | Easy | Moderate |
| API complexity | Simple | Complex |
| Dashboard | Modern, intuitive | Feature-rich but complex |
| Domain verification | Fast | Slower |
| Template management | Built-in | Advanced |

## API Usage Example

```typescript
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_TOKEN,
})

const sentFrom = new Sender('noreply@drumschool.com', 'Drum School')
const recipients = [new Recipient('user@example.com', 'User Name')]

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setSubject('Test Email')
  .setHtml('<h1>Hello from MailerSend!</h1>')

const response = await mailerSend.email.send(emailParams)
```

## Migration from SendGrid

If migrating from SendGrid:
1. Replace `SENDGRID_API_KEY` with `MAILERSEND_API_TOKEN`
2. Replace `SENDGRID_FROM_EMAIL` with `MAILERSEND_FROM_EMAIL`
3. Update code imports from `@sendgrid/mail` to `mailersend`
4. The API structure is different but functionality remains the same

## Rollback Plan

If needed, you can rollback by:
1. `npm uninstall mailersend && npm install @sendgrid/mail`
2. Restore the SendGrid version of `lib/email.ts`
3. Update environment variables back to SendGrid format
4. Revert any API route changes

## Future Enhancements

With MailerSend, you can now easily add:
- Email templates in MailerSend dashboard
- Webhook integration for email events
- Email analytics and tracking
- Bulk email operations
- SMS sending capabilities (MailerSend also supports SMS)