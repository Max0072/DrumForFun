# Booking System Development Notes

## Time Zone Handling Issues

### The Problem
During development, a critical issue was identified with time handling - slots were showing as unavailable for the wrong day due to UTC conversion.

### The Solution
The system is configured to work with Cyprus time zone (`Europe/Nicosia`):

```typescript
// Convert date to Cyprus time
const cyprusDate = new Date(selectedDate.toLocaleString("en-US", { timeZone: "Europe/Nicosia" }))
```

### Implementation Areas
1. **Frontend form** (`app/booking/page.tsx:142-146`) - when requesting available slots
2. **Frontend submission** (`app/booking/page.tsx:309-313`) - when submitting the form
3. **Backend API** (`app/api/booking/route.ts:133`) - creating timestamps
4. **Database** (`lib/database.ts:187,238`) - all time records

### Key Points
- All dates are stored in Cyprus local time format
- No UTC conversion on the frontend
- Database stores readable time strings
- Availability checks use Cyprus time zone

## Database Schema Evolution

### Initial Structure
```sql
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  -- ... other fields
)
```

### Added Fields Over Time
- `status` - for booking confirmation workflow
- `adminMessage` - for admin comments to clients
- `roomId` and `roomName` - for room assignment
- `updatedAt` - for tracking changes

## Email System Evolution

### Phase 1: Basic SMTP
- Used nodemailer with Gmail SMTP
- Simple text emails

### Phase 2: HTML Templates
- Rich HTML email templates
- Separate templates for different actions
- Admin message integration

### Phase 3: Template System
- Centralized email templates in `lib/email.ts`
- Conditional content based on booking status
- Responsive email design

## Admin Panel Development

### Authentication Strategy
- Session-based auth (not JWT)
- HTTP-only cookies for security
- Simple username/password from env vars
- 24-hour session expiry

### UI Evolution
1. **Phase 1**: Basic table with actions
2. **Phase 2**: Added search and filtering
3. **Phase 3**: Responsive design with sidebar
4. **Phase 4**: Modern UI with shadcn/ui components

## Performance Optimizations

### Database Queries
- Added indexes on frequently queried fields
- Optimized booking status queries
- Efficient room availability checks

### Frontend Optimizations
- Client-side caching of room data
- Debounced search functionality
- Lazy loading of booking details

## Security Considerations

### Input Validation
- Server-side validation for all inputs
- Email format validation
- Phone number sanitization
- XSS prevention in admin messages

### Session Security
- HTTP-only cookies
- Secure cookie flags in production
- CSRF protection via SameSite cookies
- Session rotation on sensitive actions

## Testing Strategy

### Manual Testing Checklist
1. Book each lesson type (Individual, Band, Party)
2. Test all admin actions (confirm, reject, cancel)
3. Verify email delivery and content
4. Check mobile responsiveness
5. Test search and filtering
6. Verify time zone handling

### Edge Cases Tested
- Duplicate booking attempts
- Invalid email formats
- Missing required fields
- Admin session expiry
- Email delivery failures

## Deployment Considerations

### Environment Variables
```env
# Required for production
DATABASE_URL=...           # PostgreSQL in production
EMAIL_USER=...            # SMTP credentials
ADMIN_LOGIN=...           # Strong admin credentials
AUTH_SECRET=...           # Cryptographically secure
NEXT_PUBLIC_BASE_URL=...  # Production URL
```

### Database Migration
- SQLite for development
- PostgreSQL for production
- Migration scripts in `lib/database.ts`

## Known Limitations

1. **Single Admin**: Only one admin account supported
2. **No Bulk Actions**: Admin must handle bookings individually
3. **Basic Search**: Simple text search, no advanced filters
4. **No Calendar View**: List-only booking display
5. **Limited Room Management**: Rooms are hardcoded

## Future Improvements

### Priority 1 (Essential)
- Multiple admin accounts with roles
- Calendar view for bookings
- Advanced search and filtering
- Bulk booking actions

### Priority 2 (Nice to Have)
- Real-time notifications
- Email template editor
- Booking analytics dashboard
- Customer booking history

### Priority 3 (Future)
- Payment integration
- Automated reminders
- Booking cancellation by customers
- Multi-language support

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Set up `.env.local` with required variables
4. Run development server: `npm run dev`
5. Access admin panel at `/admin/login`

### Code Organization
```
lib/               # Core business logic
  ├── database.ts  # Database operations
  ├── email.ts     # Email templates and sending
  └── auth.ts      # Authentication logic

app/api/          # API endpoints
  ├── booking/    # Public booking APIs
  └── admin/      # Admin-only APIs

app/admin/        # Admin interface pages
components/       # Reusable UI components
```

### Debugging Tips
1. Check browser console for frontend errors
2. Monitor server logs for API issues
3. Verify email delivery in spam folders
4. Use database browser for data inspection
5. Test time zone handling with different dates