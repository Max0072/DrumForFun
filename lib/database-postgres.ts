// lib/database-postgres.ts - PostgreSQL адаптер для продакшена
import { Pool } from 'pg'

export interface BookingData {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  duration: string
  notes?: string
  lessonType: string
  bandSize?: string
  guestCount?: string
  instrument?: string
  partyType?: string
  status: 'pending' | 'confirmed' | 'rejected'
  type: string
  createdAt: string
  updatedAt?: string
  adminMessage?: string
  roomId?: string
  roomName?: string
}

export interface Room {
  id: string
  name: string
  type: 'drums' | 'guitar' | 'universal'
  capacity: number
  description?: string
}

class PostgreSQLDatabase {
  private pool: Pool

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
  }

  async connect() {
    // Проверяем подключение
    try {
      await this.pool.query('SELECT NOW()')
      console.log('✅ Connected to PostgreSQL database')
    } catch (error) {
      console.error('❌ PostgreSQL connection error:', error)
      throw error
    }
  }

  async saveBooking(booking: Omit<BookingData, 'updatedAt'>): Promise<boolean> {
    const query = `
      INSERT INTO bookings (
        id, name, email, phone, date, time, duration, notes, lessonType,
        bandSize, guestCount, instrument, partyType, status, type, createdAt,
        roomId, roomName
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    `

    try {
      await this.pool.query(query, [
        booking.id,
        booking.name,
        booking.email,
        booking.phone,
        booking.date,
        booking.time,
        booking.duration,
        booking.notes,
        booking.lessonType,
        booking.bandSize,
        booking.guestCount,
        booking.instrument,
        booking.partyType,
        booking.status,
        booking.type,
        booking.createdAt,
        booking.roomId,
        booking.roomName
      ])
      console.log('✅ Booking saved with ID:', booking.id)
      return true
    } catch (error) {
      console.error('❌ Error saving booking:', error)
      throw error
    }
  }

  async getBooking(id: string): Promise<BookingData | null> {
    const query = 'SELECT * FROM bookings WHERE id = $1'
    
    try {
      const result = await this.pool.query(query, [id])
      return result.rows[0] || null
    } catch (error) {
      console.error('❌ Error fetching booking:', error)
      throw error
    }
  }

  async updateBookingStatus(
    id: string, 
    status: 'confirmed' | 'rejected', 
    adminMessage?: string,
    roomId?: string,
    roomName?: string
  ): Promise<boolean> {
    const query = `
      UPDATE bookings 
      SET status = $1, adminMessage = $2, updatedAt = $3, roomId = $4, roomName = $5
      WHERE id = $6
    `

    try {
      const result = await this.pool.query(query, [
        status,
        adminMessage || null,
        new Date().toLocaleString("en-US", { timeZone: "Europe/Nicosia" }),
        roomId || null,
        roomName || null,
        id
      ])
      console.log('✅ Booking status updated:', id, status)
      return (result.rowCount ?? 0) > 0
    } catch (error) {
      console.error('❌ Error updating booking:', error)
      throw error
    }
  }

  async getAllRooms(): Promise<Room[]> {
    try {
      const result = await this.pool.query('SELECT * FROM rooms ORDER BY name')
      return result.rows || []
    } catch (error) {
      console.error('❌ Error fetching rooms:', error)
      throw error
    }
  }

  async getAvailableTimeSlots(date: string, bookingType: string): Promise<string[]> {
    const allSlots = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
      "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
    ]

    console.log(`🔍 Проверяем доступность для даты: ${date}, тип: ${bookingType}`)

    // Получаем все подтвержденные бронирования на эту дату
    const query = `
      SELECT time, duration, roomId 
      FROM bookings 
      WHERE date = $1 AND status = 'confirmed'
    `

    try {
      const bookingsResult = await this.pool.query(query, [date])
      const bookings = bookingsResult.rows

      console.log(`📋 Найдено ${bookings.length} подтвержденных бронирований на ${date}:`, bookings)

      const rooms = await this.getAllRooms()
      console.log(`🏢 Всего комнат: ${rooms.length}`, rooms.map(r => `${r.name} (${r.type})`))
      
      const availableSlots: string[] = []

      for (const slot of allSlots) {
        const slotHour = parseInt(slot.split(':')[0])
        let hasAvailableRoom = false

        // Получаем подходящие комнаты для этого типа бронирования
        const suitableRooms = rooms.filter(room => this.isRoomSuitable(room, bookingType))
        console.log(`🎯 Подходящие комнаты для ${bookingType} в ${slot}:`, suitableRooms.map(r => r.name))

        // Проверяем каждую подходящую комнату
        for (const room of suitableRooms) {
          // Проверяем, занята ли комната в это время
          const isRoomOccupied = bookings.some(booking => {
            if (booking.roomid !== room.id) return false
            
            const bookingStart = parseInt(booking.time.split(':')[0])
            const bookingEnd = bookingStart + parseInt(booking.duration)
            
            const isOccupied = slotHour >= bookingStart && slotHour < bookingEnd
            if (isOccupied) {
              console.log(`❌ Комната ${room.name} занята в ${slot} (бронирование с ${booking.time} на ${booking.duration}ч)`)
            }
            return isOccupied
          })

          if (!isRoomOccupied) {
            console.log(`✅ Комната ${room.name} свободна в ${slot}`)
            hasAvailableRoom = true
            break
          }
        }

        if (hasAvailableRoom) {
          availableSlots.push(slot)
        } else {
          console.log(`🚫 Слот ${slot} недоступен - все подходящие комнаты заняты`)
        }
      }

      console.log(`✅ Итого доступных слотов: ${availableSlots.join(', ')}`)
      return availableSlots
    } catch (error) {
      console.error('❌ Error checking availability:', error)
      throw error
    }
  }

  private isRoomSuitable(room: Room, bookingType: string): boolean {
    switch (bookingType) {
      case 'individual':
        return room.type === 'drums' || room.type === 'guitar' || room.type === 'universal'
      case 'band':
        return room.type === 'drums' || room.type === 'universal'
      case 'party':
        return true // Вечеринки могут проходить в любой комнате
      default:
        return true
    }
  }

  async getAvailableRooms(date: string, time: string, duration: number, bookingType: string): Promise<Room[]> {
    const timeHour = parseInt(time.split(':')[0])
    const endHour = timeHour + duration

    // Получаем все комнаты
    const rooms = await this.getAllRooms()
    const availableRooms: Room[] = []

    // Получаем занятые комнаты на это время
    const query = `
      SELECT roomId, time, duration 
      FROM bookings 
      WHERE date = $1 AND status = 'confirmed' AND roomId IS NOT NULL
    `

    try {
      const result = await this.pool.query(query, [date])
      const bookings = result.rows

      for (const room of rooms) {
        // Проверяем, подходит ли комната для типа бронирования
        if (!this.isRoomSuitable(room, bookingType)) continue

        // Проверяем, не занята ли комната
        const isOccupied = bookings.some(booking => {
          if (booking.roomid !== room.id) return false
          
          const bookingStart = parseInt(booking.time.split(':')[0])
          const bookingEnd = bookingStart + parseInt(booking.duration)
          
          // Проверяем пересечение времени
          return (timeHour < bookingEnd && endHour > bookingStart)
        })

        if (!isOccupied) {
          availableRooms.push(room)
        }
      }

      return availableRooms
    } catch (error) {
      console.error('❌ Error fetching room availability:', error)
      throw error
    }
  }

  async getAllBookings(status?: string): Promise<BookingData[]> {
    let query = 'SELECT * FROM bookings ORDER BY createdAt DESC'
    const params: any[] = []
    
    if (status) {
      query = 'SELECT * FROM bookings WHERE status = $1 ORDER BY createdAt DESC'
      params.push(status)
    }

    try {
      const result = await this.pool.query(query, params)
      return result.rows || []
    } catch (error) {
      console.error('❌ Error fetching bookings:', error)
      throw error
    }
  }

  async getBookingStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    rejected: number
    byType: { type: string; count: number }[]
    recent: BookingData[]
  }> {
    try {
      // Получаем общую статистику
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM bookings
      `
      
      const statsResult = await this.pool.query(statsQuery)
      const stats = statsResult.rows[0]
      
      // Получаем статистику по типам
      const typeQuery = `
        SELECT type, COUNT(*) as count 
        FROM bookings 
        GROUP BY type 
        ORDER BY count DESC
      `
      
      const typeResult = await this.pool.query(typeQuery)
      const types = typeResult.rows
      
      // Получаем недавние заявки
      const recentQuery = `
        SELECT * FROM bookings 
        ORDER BY createdAt DESC 
        LIMIT 5
      `
      
      const recentResult = await this.pool.query(recentQuery)
      const recent = recentResult.rows

      return {
        total: parseInt(stats.total) || 0,
        pending: parseInt(stats.pending) || 0,
        confirmed: parseInt(stats.confirmed) || 0,
        rejected: parseInt(stats.rejected) || 0,
        byType: types || [],
        recent: recent || []
      }
    } catch (error) {
      console.error('❌ Error fetching booking stats:', error)
      throw error
    }
  }

  async close() {
    await this.pool.end()
    console.log('✅ PostgreSQL connection closed')
  }
}

// Экспортируем единственный экземпляр базы данных
export const database = new PostgreSQLDatabase()