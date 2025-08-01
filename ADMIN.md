# Booking System Admin Panel

## Overview

The admin panel provides complete control over the drum school booking system. Includes booking management, statistics, email notifications, and room assignment.

## Features

### ✅ **Authentication System**
- Simple login via username/password from environment variables
- Secure HTTP-only cookies valid for 24 hours
- Automatic authorization check on all pages
- Protection for all API endpoints

### ✅ **Main Dashboard** (`/admin`)
- **General statistics**: total bookings, pending, confirmed, rejected
- **Type statistics**: distribution of bookings by type
- **Recent bookings**: last 5 bookings with quick access
- **Quick actions**: navigation to main functions

### ✅ **Booking Management** (`/admin/bookings`)
- **View all bookings** with complete client information
- **Search**: by name, email, or booking ID
- **Filter**: by status (all, pending, confirmed, rejected)
- **Confirm bookings**: with room selection and client message
- **Reject bookings**: with rejection reason
- **Cancel bookings**: cancel already confirmed bookings

### ✅ **Email Notifications**
- Automatic email sending when booking status changes
- Beautiful HTML templates with booking details
- Admin messages are passed to the client
- Confirmation notifications with room assignment

### ✅ **Responsive Design**
- Fully responsive admin panel for all devices
- Convenient navigation with slide-out sidebar menu
- Modern UI using shadcn/ui components

## Installation and Setup

### 1. Environment Variables Setup

Add to `.env.local`:

```env
# Admin panel authentication
ADMIN_LOGIN=admin
ADMIN_PASSWORD=your_secure_password_here
AUTH_SECRET=your_secret_key_for_sessions

# Email settings (for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=admin@drumschool.com
```

### 2. Start the System

```bash
npm run dev
```

### 3. Access Admin Panel

Go to: **http://localhost:3000/admin/login**

## Usage

### System Login

1. Open `/admin/login`
2. Enter username and password from `.env.local`
3. Click "Login"

### View Statistics

On the main page `/admin` you will see:
- Total number of bookings
- Number of bookings by status
- Popular booking types
- Recent bookings

### Booking Management

On the `/admin/bookings` page:

#### **Confirm Booking:**
1. Find a booking with "pending" status
2. Click the "Confirm" button
3. Select a room from the list
4. Add a message to the client (optional)
5. Click "Confirm"

#### **Reject Booking:**
1. Click the "Reject" button for the desired booking
2. Specify the rejection reason
3. Click "Reject"

#### **Cancel Booking:**
1. For confirmed bookings, the "Cancel" button is available
2. Specify the cancellation reason
3. Click "Cancel"

### Search and Filtering

- **Search**: enter name, email, or booking ID in the search field
- **Status filter**: select the desired status from the dropdown
- Results update automatically

## Admin Panel Structure

```
/admin/login        - Login page
/admin/             - Main panel with general statistics
/admin/bookings     - Booking management
/admin/rooms        - Room management (in development)
/admin/history      - History of all operations (in development)
/admin/statistics   - Detailed statistics (in development)
```

## API Endpoints

### Authentication
- `POST /api/admin/login` - System login
- `POST /api/admin/logout` - System logout
- `GET /api/admin/auth-check` - Authorization check

### Data
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/bookings` - Get booking list
- `GET /api/admin/rooms` - Get room list
- `POST /api/admin/bookings/[id]/action` - Booking actions

## Email Templates

The system automatically sends email notifications:

### When confirming a booking:
- Subject: "Booking #ID confirmed! 🎉"
- Contains: date/time, assigned room, admin message

### When rejecting a booking:
- Subject: "Booking #ID rejected"
- Contains: rejection reason

### When canceling a booking:
- Subject: "Booking #ID canceled"
- Contains: cancellation reason

## Security

- All admin pages are protected by authentication
- API endpoints check admin session
- Passwords are not stored in code, only in environment variables
- Sessions have limited validity (24 hours)
- HTTP-only cookies for XSS protection

## Mobile Version

The admin panel is fully adapted for mobile devices:
- Slide-out sidebar menu on smartphones
- Responsive tables and cards
- Convenient touch screen management

## Planned Features

- 📅 **Calendar view** of room schedules
- 📊 **Detailed statistics** with charts
- 📂 **Operation history** with all admin actions
- 🏠 **Room management** (add, edit)
- 📱 **Push notifications** for new bookings
- 📄 **Data export** to CSV/Excel
- 🔐 **Two-factor authentication**
- 📝 **Message templates** for quick responses

## Support

If you encounter problems:

1. Check environment variables in `.env.local`
2. Make sure the database is created and accessible
3. Check logs in browser console and terminal
4. Make sure email settings are correct (if used)

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite (local)
- **UI Library**: shadcn/ui
- **Email**: Nodemailer
- **Authentication**: Session-based with HTTP-only cookies
- **Styling**: Tailwind CSS