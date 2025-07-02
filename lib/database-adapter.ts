// lib/database-adapter.ts - Универсальный адаптер БД
// Автоматически выбирает SQLite для разработки или PostgreSQL для продакшена

import { BookingData, Room } from './database'

// Динамический импорт базы данных в зависимости от окружения
export const createDatabase = async () => {
  // Если есть DATABASE_URL (PostgreSQL), используем PostgreSQL
  if (process.env.DATABASE_URL) {
    console.log('🐘 Using PostgreSQL database for production')
    const { database } = await import('./database-postgres')
    await database.connect()
    return database
  } else {
    console.log('💾 Using SQLite database for development') 
    const { database } = await import('./database')
    return database
  }
}

// Экспортируем универсальный экземпляр
let databaseInstance: any = null

export const getDatabase = async () => {
  if (!databaseInstance) {
    databaseInstance = await createDatabase()
  }
  return databaseInstance
}

// Экспортируем database для обратной совместимости
export const database = {
  async saveBooking(booking: Omit<BookingData, 'updatedAt'>): Promise<boolean> {
    const db = await getDatabase()
    return db.saveBooking(booking)
  },

  async getBooking(id: string): Promise<BookingData | null> {
    const db = await getDatabase()
    return db.getBooking(id)
  },

  async updateBookingStatus(
    id: string,
    status: 'confirmed' | 'rejected',
    adminMessage?: string,
    roomId?: string,
    roomName?: string
  ): Promise<boolean> {
    const db = await getDatabase()
    return db.updateBookingStatus(id, status, adminMessage, roomId, roomName)
  },

  async getAllRooms(): Promise<Room[]> {
    const db = await getDatabase()
    return db.getAllRooms()
  },

  async getAvailableTimeSlots(date: string, bookingType: string): Promise<string[]> {
    const db = await getDatabase()
    return db.getAvailableTimeSlots(date, bookingType)
  },

  async getAvailableRooms(date: string, time: string, duration: number, bookingType: string): Promise<Room[]> {
    const db = await getDatabase()
    return db.getAvailableRooms(date, time, duration, bookingType)
  },

  async getAllBookings(status?: string): Promise<BookingData[]> {
    const db = await getDatabase()
    return db.getAllBookings(status)
  },

  async getBookingStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    rejected: number
    byType: { type: string; count: number }[]
    recent: BookingData[]
  }> {
    const db = await getDatabase()
    return db.getBookingStats()
  }
}