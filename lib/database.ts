// lib/database.ts
import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import path from 'path'

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
  // Специфичные поля для разных типов
  bandSize?: string
  guestCount?: string
  instrument?: string
  partyType?: string
  // Мета информация
  status: 'pending' | 'confirmed' | 'rejected'
  type: string
  createdAt: string
  updatedAt?: string
  adminMessage?: string
  // Управление комнатами
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

class Database {
  private db: sqlite3.Database | null = null
  private dbPath: string
  private isInitialized: boolean = false

  constructor() {
    // База данных будет создана в корне проекта
    this.dbPath = path.join(process.cwd(), 'bookings.db')
  }

  async connect() {
    if (this.db && this.isInitialized) return this.db

    return new Promise<sqlite3.Database>((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, async (err) => {
        if (err) {
          console.error('❌ Database connection error:', err)
          reject(err)
        } else {
          console.log('✅ Connected to SQLite database')
          try {
            if (!this.isInitialized) {
              await this.initializeTables()
              this.isInitialized = true
            }
            resolve(this.db!)
          } catch (initErr) {
            reject(initErr)
          }
        }
      })
    })
  }

  private async initializeTables() {
    if (!this.db) return

    // Создаем таблицу бронирований
    const createBookingsTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        duration TEXT NOT NULL,
        notes TEXT,
        lessonType TEXT NOT NULL,
        bandSize TEXT,
        guestCount TEXT,
        instrument TEXT,
        partyType TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        type TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT,
        adminMessage TEXT,
        roomId TEXT,
        roomName TEXT
      )
    `

    // Создаем таблицу комнат
    const createRoomsTable = `
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        description TEXT
      )
    `

    try {
      await new Promise<void>((resolve, reject) => {
        this.db!.run(createBookingsTable, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      await new Promise<void>((resolve, reject) => {
        this.db!.run(createRoomsTable, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      // Добавляем комнаты если их нет
      await this.initializeRooms()
      console.log('✅ Tables ready')
    } catch (err) {
      console.error('❌ Error creating tables:', err)
      throw err
    }
  }

  private async initializeRooms() {
    const rooms: Room[] = [
      { id: 'drums1', name: 'Барабанная #1', type: 'drums', capacity: 6, description: 'Основная барабанная комната' },
      { id: 'drums2', name: 'Барабанная #2', type: 'drums', capacity: 4, description: 'Малая барабанная комната' },
      { id: 'guitar1', name: 'Гитарная #1', type: 'guitar', capacity: 8, description: 'Гитарная/универсальная комната' }
    ]

    for (const room of rooms) {
      await new Promise<void>((resolve, reject) => {
        this.db!.run(
          'INSERT OR IGNORE INTO rooms (id, name, type, capacity, description) VALUES (?, ?, ?, ?, ?)',
          [room.id, room.name, room.type, room.capacity, room.description],
          (err) => {
            if (err) reject(err)
            else resolve()
          }
        )
      })
    }
  }

  async saveBooking(booking: Omit<BookingData, 'updatedAt'>): Promise<boolean> {
    await this.connect()
    
    const query = `
      INSERT INTO bookings (
        id, name, email, phone, date, time, duration, notes, lessonType,
        bandSize, guestCount, instrument, partyType, status, type, createdAt,
        roomId, roomName
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    return new Promise((resolve, reject) => {
      this.db!.run(query, [
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
        new Date().toLocaleString("en-US", { timeZone: "Europe/Nicosia" }),
        booking.roomId,
        booking.roomName
      ], function(err) {
        if (err) {
          console.error('❌ Error saving booking:', err)
          reject(err)
        } else {
          console.log('✅ Booking saved with ID:', booking.id)
          resolve(true)
        }
      })
    })
  }

  async getBooking(id: string): Promise<BookingData | null> {
    await this.connect()
    
    const query = 'SELECT * FROM bookings WHERE id = ?'

    return new Promise((resolve, reject) => {
      this.db!.get(query, [id], (err, row: any) => {
        if (err) {
          console.error('❌ Error fetching booking:', err)
          reject(err)
        } else {
          resolve(row || null)
        }
      })
    })
  }

  async updateBookingStatus(
    id: string, 
    status: 'confirmed' | 'rejected', 
    adminMessage?: string,
    roomId?: string,
    roomName?: string
  ): Promise<boolean> {
    await this.connect()
    
    const query = `
      UPDATE bookings 
      SET status = ?, adminMessage = ?, updatedAt = ?, roomId = ?, roomName = ?
      WHERE id = ?
    `

    return new Promise((resolve, reject) => {
      this.db!.run(query, [
        status,
        adminMessage || null,
        new Date().toLocaleString("en-US", { timeZone: "Europe/Nicosia" }),
        roomId || null,
        roomName || null,
        id
      ], function(err) {
        if (err) {
          console.error('❌ Error updating booking:', err)
          reject(err)
        } else {
          console.log('✅ Booking status updated:', id, status)
          resolve(this.changes > 0)
        }
      })
    })
  }

  async getAllRooms(): Promise<Room[]> {
    await this.connect()
    
    return new Promise((resolve, reject) => {
      this.db!.all('SELECT * FROM rooms ORDER BY name', (err, rows: any[]) => {
        if (err) {
          console.error('❌ Error fetching rooms:', err)
          reject(err)
        } else {
          resolve(rows || [])
        }
      })
    })
  }

  async getAvailableTimeSlots(date: string, bookingType: string): Promise<string[]> {
    await this.connect()
    
    // Все возможные слоты
    const allSlots = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
      "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
    ]

    console.log(`🔍 Проверяем доступность для даты: ${date}, тип: ${bookingType}`)

    // Получаем все подтвержденные бронирования на эту дату
    const query = `
      SELECT time, duration, roomId 
      FROM bookings 
      WHERE date = ? AND status = 'confirmed'
    `

    return new Promise((resolve, reject) => {
      this.db!.all(query, [date], async (err, bookings: any[]) => {
        if (err) {
          console.error('❌ Error fetching bookings:', err)
          reject(err)
          return
        }

        console.log(`📋 Найдено ${bookings.length} подтвержденных бронирований на ${date}:`, bookings)

        try {
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
                if (booking.roomId !== room.id) return false
                
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
          resolve(availableSlots)
        } catch (error) {
          reject(error)
        }
      })
    })
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
    await this.connect()
    
    const timeHour = parseInt(time.split(':')[0])
    const endHour = timeHour + duration

    // Получаем все комнаты
    const rooms = await this.getAllRooms()
    const availableRooms: Room[] = []

    // Получаем занятые комнаты на это время
    const query = `
      SELECT roomId, time, duration 
      FROM bookings 
      WHERE date = ? AND status = 'confirmed' AND roomId IS NOT NULL
    `

    return new Promise((resolve, reject) => {
      this.db!.all(query, [date], (err, bookings: any[]) => {
        if (err) {
          console.error('❌ Error fetching room availability:', err)
          reject(err)
          return
        }

        for (const room of rooms) {
          // Проверяем, подходит ли комната для типа бронирования
          if (!this.isRoomSuitable(room, bookingType)) continue

          // Проверяем, не занята ли комната
          const isOccupied = bookings.some(booking => {
            if (booking.roomId !== room.id) return false
            
            const bookingStart = parseInt(booking.time.split(':')[0])
            const bookingEnd = bookingStart + parseInt(booking.duration)
            
            // Проверяем пересечение времени
            return (timeHour < bookingEnd && endHour > bookingStart)
          })

          if (!isOccupied) {
            availableRooms.push(room)
          }
        }

        resolve(availableRooms)
      })
    })
  }

  async getAllBookings(status?: string): Promise<BookingData[]> {
    await this.connect()
    
    let query = 'SELECT * FROM bookings ORDER BY createdAt DESC'
    const params: any[] = []
    
    if (status) {
      query = 'SELECT * FROM bookings WHERE status = ? ORDER BY createdAt DESC'
      params.push(status)
    }

    return new Promise((resolve, reject) => {
      this.db!.all(query, params, (err, rows: any[]) => {
        if (err) {
          console.error('❌ Error fetching bookings:', err)
          reject(err)
        } else {
          resolve(rows || [])
        }
      })
    })
  }

  async getBookingStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    rejected: number
    byType: { type: string; count: number }[]
    recent: BookingData[]
  }> {
    await this.connect()
    
    return new Promise((resolve, reject) => {
      // Получаем общую статистику
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM bookings
      `
      
      this.db!.get(statsQuery, [], (err, stats: any) => {
        if (err) {
          reject(err)
          return
        }
        
        // Получаем статистику по типам
        const typeQuery = `
          SELECT type, COUNT(*) as count 
          FROM bookings 
          GROUP BY type 
          ORDER BY count DESC
        `
        
        this.db!.all(typeQuery, [], (err, types: any[]) => {
          if (err) {
            reject(err)
            return
          }
          
          // Получаем недавние заявки
          const recentQuery = `
            SELECT * FROM bookings 
            ORDER BY createdAt DESC 
            LIMIT 5
          `
          
          this.db!.all(recentQuery, [], (err, recent: any[]) => {
            if (err) {
              reject(err)
              return
            }
            
            resolve({
              total: stats.total || 0,
              pending: stats.pending || 0,
              confirmed: stats.confirmed || 0,
              rejected: stats.rejected || 0,
              byType: types || [],
              recent: recent || []
            })
          })
        })
      })
    })
  }

  async close() {
    if (this.db) {
      return new Promise<void>((resolve, reject) => {
        this.db!.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err)
            reject(err)
          } else {
            console.log('✅ Database connection closed')
            this.db = null
            resolve()
          }
        })
      })
    }
  }
}

// Экспортируем единственный экземпляр базы данных
export const database = new Database()