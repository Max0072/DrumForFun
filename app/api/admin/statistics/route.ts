import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { database } from '@/lib/database'
import { subDays, subWeeks, subMonths, format, getDay } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const isAuthenticated = await requireAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || 'month'

    // Определяем диапазон дат на основе периода
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'week':
        startDate = subWeeks(now, 1)
        break
      case 'month':
        startDate = subMonths(now, 1)
        break
      case 'quarter':
        startDate = subMonths(now, 3)
        break
      case 'year':
        startDate = subMonths(now, 12)
        break
      default:
        startDate = subMonths(now, 1)
    }

    // Получаем все бронирования и комнаты
    const allBookings = await database.getAllBookings()
    const allRooms = await database.getAllRooms()

    // Фильтруем бронирования по периоду
    const periodBookings = allBookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= startDate && bookingDate <= now
    })

    // Базовые статистики
    const totalBookings = periodBookings.length
    const confirmedBookings = periodBookings.filter(b => b.status === 'confirmed').length
    const pendingBookings = periodBookings.filter(b => b.status === 'pending').length
    const rejectedBookings = periodBookings.filter(b => b.status === 'rejected').length

    // Статистика по типам
    const bookingsByType: { [key: string]: number } = {}
    periodBookings.forEach(booking => {
      bookingsByType[booking.type] = (bookingsByType[booking.type] || 0) + 1
    })

    // Статистика по статусам
    const bookingsByStatus: { [key: string]: number } = {}
    periodBookings.forEach(booking => {
      bookingsByStatus[booking.status] = (bookingsByStatus[booking.status] || 0) + 1
    })

    // Статистика по времени
    const bookingsByTime: { [key: string]: number } = {}
    periodBookings.forEach(booking => {
      bookingsByTime[booking.time] = (bookingsByTime[booking.time] || 0) + 1
    })

    // Популярные временные слоты
    const popularTimeSlots = Object.entries(bookingsByTime)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => b.count - a.count)

    // Статистика по комнатам
    const bookingsByRoom: { [key: string]: number } = {}
    periodBookings.forEach(booking => {
      if (booking.roomId) {
        const room = allRooms.find(r => r.id === booking.roomId)
        const roomName = room ? room.name : 'Неизвестная комната'
        bookingsByRoom[roomName] = (bookingsByRoom[roomName] || 0) + 1
      }
    })

    // Загруженность комнат
    const roomUtilization = allRooms.map(room => {
      const roomBookings = periodBookings.filter(b => b.roomId === room.id && b.status === 'confirmed')
      const totalBookings = roomBookings.length
      
      // Примерный расчет загруженности (можно улучшить)
      // Предполагаем 12 временных слотов в день и количество дней в периоде
      const daysInPeriod = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const maxPossibleBookings = daysInPeriod * 12 // 12 слотов в день
      const utilizationRate = maxPossibleBookings > 0 ? (totalBookings / maxPossibleBookings) * 100 : 0

      return {
        roomName: room.name,
        totalBookings,
        utilizationRate: Math.min(utilizationRate, 100)
      }
    })

    // Статистика по дням недели (начиная с понедельника)
    const bookingsByDay: { [key: string]: number } = {
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0,
      'Sunday': 0
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    periodBookings.forEach(booking => {
      const bookingDate = new Date(booking.date)
      const dayIndex = getDay(bookingDate)
      const dayName = dayNames[dayIndex]
      bookingsByDay[dayName]++
    })

    // Средние показатели
    const daysInPeriod = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const averageBookingsPerDay = daysInPeriod > 0 ? totalBookings / daysInPeriod : 0

    // Тренды роста
    const halfPeriodDate = new Date((startDate.getTime() + now.getTime()) / 2)
    const firstHalfBookings = periodBookings.filter(b => new Date(b.createdAt) < halfPeriodDate).length
    const secondHalfBookings = periodBookings.filter(b => new Date(b.createdAt) >= halfPeriodDate).length
    
    const weeklyGrowth = firstHalfBookings > 0 ? ((secondHalfBookings - firstHalfBookings) / firstHalfBookings) * 100 : 0

    // Месячный рост (сравнение с предыдущим периодом)
    const prevPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()))
    const prevPeriodBookings = allBookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= prevPeriodStart && bookingDate < startDate
    }).length

    const monthlyGrowth = prevPeriodBookings > 0 ? ((totalBookings - prevPeriodBookings) / prevPeriodBookings) * 100 : 0

    const statistics = {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      rejectedBookings,
      bookingsByType,
      bookingsByStatus,
      bookingsByTime,
      bookingsByRoom,
      bookingsByDay,
      averageBookingsPerDay,
      popularTimeSlots,
      roomUtilization,
      recentTrends: {
        weeklyGrowth,
        monthlyGrowth
      }
    }

    return NextResponse.json({ 
      success: true, 
      statistics 
    })
  } catch (error) {
    console.error('Ошибка при получении статистики:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}