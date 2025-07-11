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
  // Specific fields for different types
  bandSize?: string
  guestCount?: string
  instrument?: string
  partyType?: string
  // Meta information
  status: 'pending' | 'confirmed' | 'rejected' | 'completed'
  type: string
  createdAt: string
  updatedAt?: string
  adminMessage?: string
  // Room management
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

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: number
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface RentalItem {
  id: string
  name: string
  description: string
  pricePerDay: number
  category: string
  inStock: number
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface Order {
  id: string
  orderCode: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  notes?: string
  items: string // JSON string of cart items
  totalPrice: number
  status: 'pending' | 'ready' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt?: string
}

class Database {
  private db: sqlite3.Database | null = null
  private dbPath: string
  private isInitialized: boolean = false

  constructor() {
    // Database path - check if running in Docker or locally
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('sqlite:')) {
      this.dbPath = process.env.DATABASE_URL.replace('sqlite:', '')
    } else {
      // Fallback to project root for local development
      this.dbPath = path.join(process.cwd(), 'bookings.db')
    }
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

    // Create bookings table
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

    // Create rooms table
    const createRoomsTable = `
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        description TEXT
      )
    `

    // Create products table
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        inStock INTEGER NOT NULL DEFAULT 0,
        imageUrl TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT
      )
    `

    // Create rental table
    const createRentalTable = `
      CREATE TABLE IF NOT EXISTS rental_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        pricePerDay REAL NOT NULL,
        category TEXT NOT NULL,
        inStock INTEGER NOT NULL DEFAULT 0,
        imageUrl TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT
      )
    `

    // Create orders table
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        orderCode TEXT NOT NULL UNIQUE,
        customerName TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        customerPhone TEXT NOT NULL,
        customerAddress TEXT NOT NULL,
        notes TEXT,
        items TEXT NOT NULL,
        totalPrice REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        createdAt TEXT NOT NULL,
        updatedAt TEXT
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

      await new Promise<void>((resolve, reject) => {
        this.db!.run(createProductsTable, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      await new Promise<void>((resolve, reject) => {
        this.db!.run(createRentalTable, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      await new Promise<void>((resolve, reject) => {
        this.db!.run(createOrdersTable, (err) => {
          if (err) reject(err)
          else resolve()
        })
      })

      console.log('✅ Tables ready')
    } catch (err) {
      console.error('❌ Error creating tables:', err)
      throw err
    }
  }

  private async initializeRooms() {
    // Check if rooms table is empty
    const roomsCount = await new Promise<number>((resolve, reject) => {
      this.db!.get('SELECT COUNT(*) as count FROM rooms', (err, row: any) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })

    // Only initialize default rooms if table is completely empty
    if (roomsCount === 0) {
      console.log('🏢 Initializing default rooms...')
      const rooms: Room[] = [
        { id: 'drums1', name: 'Big studio #1', type: 'drums', capacity: 6, description: 'Big drum room' },
        { id: 'drums2', name: 'Upper-medium #2', type: 'drums', capacity: 4, description: 'Upper medium drum room' },
        { id: 'guitar1', name: 'Upper-small #3', type: 'guitar', capacity: 8, description: 'Upper small drum-guitar room' }
      ]

      for (const room of rooms) {
        await new Promise<void>((resolve, reject) => {
          this.db!.run(
            'INSERT INTO rooms (id, name, type, capacity, description) VALUES (?, ?, ?, ?, ?)',
            [room.id, room.name, room.type, room.capacity, room.description],
            (err) => {
              if (err) reject(err)
              else resolve()
            }
          )
        })
      }
      console.log('✅ Default rooms initialized')
    } else {
      console.log(`🏢 Found ${roomsCount} existing rooms, skipping initialization`)
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

  async createBooking(booking: Omit<BookingData, 'updatedAt'>): Promise<boolean> {
    return this.saveBooking(booking)
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

  async getBookingById(id: string): Promise<BookingData | null> {
    return this.getBooking(id)
  }

  async deleteBooking(id: string): Promise<boolean> {
    await this.connect()
    
    const query = 'DELETE FROM bookings WHERE id = ?'

    return new Promise((resolve, reject) => {
      this.db!.run(query, [id], function(err) {
        if (err) {
          console.error('❌ Error deleting booking:', err)
          reject(err)
        } else {
          console.log('✅ Booking deleted:', id)
          resolve(this.changes > 0)
        }
      })
    })
  }

  async updateBookingStatus(
    id: string, 
    status: 'confirmed' | 'rejected' | 'completed', 
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
    
    // All possible slots
    const allSlots = [
      "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
      "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
    ]

    console.log(`🔍 Checking availability for date: ${date}, type: ${bookingType}`)

    // Get all confirmed bookings for this date
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

        console.log(`📋 Found ${bookings.length} confirmed bookings for ${date}:`, bookings)

        try {
          const rooms = await this.getAllRooms()
          console.log(`🏢 Total rooms: ${rooms.length}`, rooms.map(r => `${r.name} (${r.type})`))
          
          const availableSlots: string[] = []

          // If no rooms exist, no slots are available
          if (rooms.length === 0) {
            console.log('🚫 No rooms available - all slots unavailable')
            resolve(availableSlots)
            return
          }

          for (const slot of allSlots) {
            const slotHour = parseInt(slot.split(':')[0])
            let hasAvailableRoom = false

            // Get suitable rooms for this booking type
            const suitableRooms = rooms.filter(room => this.isRoomSuitable(room, bookingType))
            console.log(`🎯 Suitable rooms for ${bookingType} at ${slot}:`, suitableRooms.map(r => r.name))

            // If no suitable rooms for this booking type, skip this slot
            if (suitableRooms.length === 0) {
              console.log(`🚫 No suitable rooms for ${bookingType} at ${slot}`)
              continue
            }

            // Check each suitable room
            for (const room of suitableRooms) {
              // Check if room is occupied at this time
              const isRoomOccupied = bookings.some(booking => {
                if (booking.roomId !== room.id) return false
                
                const bookingStart = parseInt(booking.time.split(':')[0])
                const bookingEnd = bookingStart + parseInt(booking.duration)
                
                const isOccupied = slotHour >= bookingStart && slotHour < bookingEnd
                if (isOccupied) {
                  console.log(`❌ Room ${room.name} is occupied at ${slot} (booking from ${booking.time} for ${booking.duration}h)`)
                }
                return isOccupied
              })

              if (!isRoomOccupied) {
                console.log(`✅ Room ${room.name} is free at ${slot}`)
                hasAvailableRoom = true
                break
              }
            }

            if (hasAvailableRoom) {
              availableSlots.push(slot)
            } else {
              console.log(`🚫 Slot ${slot} unavailable - all suitable rooms occupied`)
            }
          }

          console.log(`✅ Total available slots: ${availableSlots.join(', ')}`)
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
        return true // Parties can be held in any room
      default:
        return true
    }
  }

  async checkBookingConflicts(date: string, startTime: string, duration: string, bookingType: string): Promise<string[]> {
    await this.connect()
    
    const startHour = parseInt(startTime.split(':')[0])
    const durationHours = parseInt(duration)
    const endHour = startHour + durationHours
    
    console.log(`🔍 Checking booking conflicts for date: ${date}, startTime: ${startTime}, duration: ${duration}h, type: ${bookingType}`)

    // Get all confirmed bookings for this date
    const query = `
      SELECT time, duration, roomId 
      FROM bookings 
      WHERE date = ? AND status = 'confirmed'
    `

    return new Promise((resolve, reject) => {
      this.db!.all(query, [date], async (err, bookings: any[]) => {
        if (err) {
          console.error('❌ Error fetching bookings for conflict check:', err)
          reject(err)
          return
        }

        console.log(`📋 Found ${bookings.length} confirmed bookings for ${date}:`, bookings)

        try {
          const rooms = await this.getAllRooms()
          const suitableRooms = rooms.filter(room => this.isRoomSuitable(room, bookingType))
          
          console.log(`🏢 Suitable rooms for ${bookingType}:`, suitableRooms.map(r => r.name))
          
          const conflictingSlots: string[] = []

          // Generate all time slots that would be occupied by this booking
          const requestedSlots: string[] = []
          for (let hour = startHour; hour < endHour; hour++) {
            requestedSlots.push(`${hour.toString().padStart(2, '0')}:00`)
          }

          console.log(`⏰ Requested time slots:`, requestedSlots)

          // Check each requested slot for conflicts
          for (const slot of requestedSlots) {
            const slotHour = parseInt(slot.split(':')[0])
            let hasAvailableRoom = false

            // Check each suitable room for this slot
            for (const room of suitableRooms) {
              // Check if room is occupied at this time
              const isRoomOccupied = bookings.some(booking => {
                if (booking.roomId !== room.id) return false
                
                const bookingStart = parseInt(booking.time.split(':')[0])
                const bookingEnd = bookingStart + parseInt(booking.duration)
                
                const isOccupied = slotHour >= bookingStart && slotHour < bookingEnd
                if (isOccupied) {
                  console.log(`❌ Room ${room.name} is occupied at ${slot} (booking from ${booking.time} for ${booking.duration}h)`)
                }
                return isOccupied
              })

              if (!isRoomOccupied) {
                console.log(`✅ Room ${room.name} is free at ${slot}`)
                hasAvailableRoom = true
                break
              }
            }

            // If no room is available for this slot, it's a conflict
            if (!hasAvailableRoom) {
              console.log(`🚫 Conflict detected at ${slot} - no suitable rooms available`)
              conflictingSlots.push(slot)
            }
          }

          console.log(`⚠️ Total conflicting slots: ${conflictingSlots.join(', ')}`)
          resolve(conflictingSlots)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  async getAvailableRooms(date: string, time: string, duration: number, bookingType: string): Promise<Room[]> {
    await this.connect()
    
    const timeHour = parseInt(time.split(':')[0])
    const endHour = timeHour + duration

    // Get all rooms
    const rooms = await this.getAllRooms()
    const availableRooms: Room[] = []

    // Get occupied rooms for this time
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
          // Check if room is suitable for booking type
          if (!this.isRoomSuitable(room, bookingType)) continue

          // Check if room is not occupied
          const isOccupied = bookings.some(booking => {
            if (booking.roomId !== room.id) return false
            
            const bookingStart = parseInt(booking.time.split(':')[0])
            const bookingEnd = bookingStart + parseInt(booking.duration)
            
            // Check time overlap
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
    completed: number
    byType: { type: string; count: number }[]
    recent: BookingData[]
  }> {
    await this.connect()
    
    return new Promise((resolve, reject) => {
      // Get general statistics
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
        FROM bookings
      `
      
      this.db!.get(statsQuery, [], (err, stats: any) => {
        if (err) {
          reject(err)
          return
        }
        
        // Get statistics by type
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
          
          // Get recent requests
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
              completed: stats.completed || 0,
              byType: types || [],
              recent: recent || []
            })
          })
        })
      })
    })
  }

  // Product management methods
  async getAllProducts(): Promise<Product[]> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      this.db!.all('SELECT * FROM products ORDER BY createdAt DESC', (err, rows: any[]) => {
        if (err) {
          console.error('Error fetching products:', err)
          reject(err)
        } else {
          const products = rows.map(row => ({
            ...row,
            isActive: Boolean(row.isActive)
          }))
          resolve(products)
        }
      })
    })
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      const id = 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const createdAt = new Date().toISOString()
      
      const query = `
        INSERT INTO products (id, name, description, price, category, inStock, imageUrl, isActive, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      
      this.db!.run(
        query,
        [id, product.name, product.description, product.price, product.category, 
         product.inStock, product.imageUrl, product.isActive ? 1 : 0, createdAt],
        function(err) {
          if (err) {
            console.error('Error creating product:', err)
            reject(err)
          } else {
            console.log('✅ Product created:', id)
            resolve(id)
          }
        }
      )
    })
  }

  async updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<boolean> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      const updatedAt = new Date().toISOString()
      const fields = []
      const values = []
      
      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          fields.push(`${key} = ?`)
          if (key === 'isActive') {
            values.push(value ? 1 : 0)
          } else {
            values.push(value)
          }
        }
      })
      
      if (fields.length === 0) {
        resolve(true)
        return
      }
      
      fields.push('updatedAt = ?')
      values.push(updatedAt)
      values.push(id)
      
      const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`
      
      this.db!.run(query, values, function(err) {
        if (err) {
          console.error('Error updating product:', err)
          reject(err)
        } else {
          console.log('✅ Product updated:', id)
          resolve(this.changes > 0)
        }
      })
    })
  }

  async deleteProduct(id: string): Promise<boolean> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      this.db!.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Error deleting product:', err)
          reject(err)
        } else {
          console.log('✅ Product deleted:', id)
          resolve(this.changes > 0)
        }
      })
    })
  }

  // Rental management methods
  async getAllRentalItems(): Promise<RentalItem[]> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      this.db!.all('SELECT * FROM rental_items ORDER BY createdAt DESC', (err, rows: any[]) => {
        if (err) {
          console.error('Error fetching rental items:', err)
          reject(err)
        } else {
          const items = rows.map(row => ({
            ...row,
            isActive: Boolean(row.isActive)
          }))
          resolve(items)
        }
      })
    })
  }

  async createRentalItem(item: Omit<RentalItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      const id = 'rental_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const createdAt = new Date().toISOString()
      
      const query = `
        INSERT INTO rental_items (id, name, description, pricePerDay, category, inStock, imageUrl, isActive, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      
      this.db!.run(
        query,
        [id, item.name, item.description, item.pricePerDay, item.category, 
         item.inStock, item.imageUrl, item.isActive ? 1 : 0, createdAt],
        function(err) {
          if (err) {
            console.error('Error creating rental item:', err)
            reject(err)
          } else {
            console.log('✅ Rental item created:', id)
            resolve(id)
          }
        }
      )
    })
  }

  async updateRentalItem(id: string, updates: Partial<Omit<RentalItem, 'id' | 'createdAt'>>): Promise<boolean> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      const updatedAt = new Date().toISOString()
      const fields = []
      const values = []
      
      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          fields.push(`${key} = ?`)
          if (key === 'isActive') {
            values.push(value ? 1 : 0)
          } else {
            values.push(value)
          }
        }
      })
      
      if (fields.length === 0) {
        resolve(true)
        return
      }
      
      fields.push('updatedAt = ?')
      values.push(updatedAt)
      values.push(id)
      
      const query = `UPDATE rental_items SET ${fields.join(', ')} WHERE id = ?`
      
      this.db!.run(query, values, function(err) {
        if (err) {
          console.error('Error updating rental item:', err)
          reject(err)
        } else {
          console.log('✅ Rental item updated:', id)
          resolve(this.changes > 0)
        }
      })
    })
  }

  async deleteRentalItem(id: string): Promise<boolean> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      this.db!.run('DELETE FROM rental_items WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('Error deleting rental item:', err)
          reject(err)
        } else {
          console.log('✅ Rental item deleted:', id)
          resolve(this.changes > 0)
        }
      })
    })
  }

  // Order management methods
  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      const id = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const createdAt = new Date().toISOString()
      
      const query = `
        INSERT INTO orders (id, orderCode, customerName, customerEmail, customerPhone, customerAddress, notes, items, totalPrice, status, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      
      this.db!.run(
        query,
        [id, order.orderCode, order.customerName, order.customerEmail, order.customerPhone, 
         order.customerAddress, order.notes, order.items, order.totalPrice, order.status, createdAt],
        function(err) {
          if (err) {
            console.error('Error creating order:', err)
            reject(err)
          } else {
            console.log('✅ Order created:', id)
            resolve(id)
          }
        }
      )
    })
  }

  async getOrderByCode(orderCode: string): Promise<Order | null> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      this.db!.get('SELECT * FROM orders WHERE orderCode = ?', [orderCode], (err, row: any) => {
        if (err) {
          console.error('Error fetching order:', err)
          reject(err)
        } else {
          resolve(row || null)
        }
      })
    })
  }

  async getAllOrders(): Promise<Order[]> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      this.db!.all('SELECT * FROM orders ORDER BY createdAt DESC', (err, rows: any[]) => {
        if (err) {
          console.error('Error fetching orders:', err)
          reject(err)
        } else {
          resolve(rows || [])
        }
      })
    })
  }

  async updateOrderStatus(id: string, status: 'pending' | 'ready' | 'completed' | 'cancelled'): Promise<boolean> {
    if (!this.db) await this.connect()
    
    return new Promise((resolve, reject) => {
      const updatedAt = new Date().toISOString()
      
      this.db!.run(
        'UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?',
        [status, updatedAt, id],
        function(err) {
          if (err) {
            console.error('Error updating order status:', err)
            reject(err)
          } else {
            console.log('✅ Order status updated:', id, status)
            resolve(this.changes > 0)
          }
        }
      )
    })
  }

  async updatePastBookingsToCompleted(): Promise<number> {
    await this.connect()
    
    const now = new Date()
    const currentDate = now.toISOString().split('T')[0] // YYYY-MM-DD format
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
    
    return new Promise((resolve, reject) => {
      // Find all confirmed bookings that are in the past
      const query = `
        UPDATE bookings 
        SET status = 'completed', updatedAt = ?
        WHERE status = 'confirmed' 
        AND (
          date < ? 
          OR (date = ? AND time < ?)
        )
      `
      
      const updatedAt = new Date().toLocaleString("en-US", { timeZone: "Europe/Nicosia" })
      
      this.db!.run(query, [updatedAt, currentDate, currentDate, currentTime], function(err) {
        if (err) {
          console.error('❌ Error updating past bookings:', err)
          reject(err)
        } else {
          console.log(`✅ Updated ${this.changes} past bookings to completed status`)
          resolve(this.changes)
        }
      })
    })
  }

  async getBookingsByRoom(roomId: string): Promise<BookingData[]> {
    await this.connect()
    
    const query = `
      SELECT * FROM bookings 
      WHERE roomId = ?
      ORDER BY date DESC, time DESC
    `
    
    return new Promise((resolve, reject) => {
      this.db!.all(query, [roomId], (err, rows: any[]) => {
        if (err) {
          console.error('❌ Error fetching bookings by room:', err)
          reject(err)
        } else {
          resolve(rows || [])
        }
      })
    })
  }

  async createRoom(roomData: Room): Promise<void> {
    await this.connect()
    
    const query = `
      INSERT INTO rooms (id, name, type, capacity, description)
      VALUES (?, ?, ?, ?, ?)
    `
    
    return new Promise((resolve, reject) => {
      this.db!.run(query, [
        roomData.id,
        roomData.name,
        roomData.type,
        roomData.capacity,
        roomData.description || null
      ], function(err) {
        if (err) {
          console.error('❌ Error creating room:', err)
          reject(err)
        } else {
          console.log(`✅ Room ${roomData.id} created successfully`)
          resolve()
        }
      })
    })
  }

  async deleteRoom(roomId: string): Promise<void> {
    await this.connect()
    
    const query = `DELETE FROM rooms WHERE id = ?`
    
    return new Promise((resolve, reject) => {
      this.db!.run(query, [roomId], function(err) {
        if (err) {
          console.error('❌ Error deleting room:', err)
          reject(err)
        } else {
          console.log(`✅ Room ${roomId} deleted successfully`)
          resolve()
        }
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

// Export single database instance
export const database = new Database()