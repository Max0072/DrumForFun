# 🥁 DrumForFun - Drum School Booking System

Web application for booking drum school lessons with admin panel.

## 🚀 Quick VPS Deployment

### 1. Clone the project
```bash
git clone https://github.com/your-username/drum-for-fun.git
cd drum-for-fun
```

### 2. Configure environment variables
```bash
# Copy the example file
cp .env.example .env.production

# Edit the file with your data
nano .env.production
```

### 3. Automatic deployment
```bash
# Run the deployment script
chmod +x deploy-vps.sh
./deploy-vps.sh
```

### 4. Check deployment
```bash
# Service status
docker-compose ps

# Logs
docker-compose logs -f

# Your site will be available at:
# https://yourdomain.com
```

## 🔧 Local Development

### Install dependencies
```bash
npm install
```

### Run in development mode
```bash
# Regular start
npm run dev

# Or with Docker
./docker-run.sh
```

### Build project
```bash
npm run build
npm start
```

## 🗄️ Database

### Production (recommended)
- PostgreSQL in Docker container
- Automatic initialization and migrations

### Development
- SQLite in file `./data/bookings.db`

## 🔐 Admin Panel

Access: `https://yourdomain.com/admin/login`

Login credentials are configured in `.env.production`:
- `ADMIN_LOGIN` - administrator username
- `ADMIN_PASSWORD` - administrator password

## 📧 Email Notifications

Configure Gmail App Password in `.env.production`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
```

## 🐳 Docker Commands

```bash
# Run production version
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Connect to database
docker-compose exec db psql -U drumschool -d drumschool
```

## 🔒 Security

1. **Change all passwords** in `.env.production`
2. **Configure SSL** - deployment script will help with Let's Encrypt
3. **Configure firewall**:
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

## 📁 Project Structure

```
drum-for-fun/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── admin/             # Admin panel
│   └── ...                # Public pages
├── components/            # React components
├── lib/                   # Utilities and configuration
├── docker-compose.yml     # Production Docker
├── deploy-vps.sh         # Deployment script
└── README.md             # This file
```

## 🆘 Support

If you encounter problems:
1. Check logs: `docker-compose logs -f`
2. Make sure ports 80 and 443 are open
3. Check DNS settings for your domain

## 📝 License

MIT License
