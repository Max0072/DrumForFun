"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from '@/components/admin/LanguageProvider'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Music,
  Guitar,
  MapPin,
  Calendar,
  Star,
  Activity,
  PieChart,
  DollarSign,
  XCircle,
  CheckCircle
} from "lucide-react"
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from "date-fns"

interface Statistics {
  totalBookings: number
  confirmedBookings: number
  pendingBookings: number
  rejectedBookings: number
  bookingsByType: { [key: string]: number }
  bookingsByStatus: { [key: string]: number }
  bookingsByTime: { [key: string]: number }
  bookingsByRoom: { [key: string]: number }
  bookingsByDay: { [key: string]: number }
  averageBookingsPerDay: number
  popularTimeSlots: Array<{ time: string; count: number }>
  roomUtilization: Array<{ roomName: string; utilizationRate: number; totalBookings: number }>
  recentTrends: {
    weeklyGrowth: number
    monthlyGrowth: number
  }
}

export default function AdminStatisticsContent() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<string>('month')
  const { t } = useLanguage()

  useEffect(() => {
    fetchStatistics()
  }, [period])

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/admin/statistics?period=${period}`)
      const result = await response.json()
      
      if (result.success) {
        setStatistics(result.statistics)
      }
    } catch (error) {
      console.error(t.statistics.loadError, error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <Users className="h-4 w-4" />
      case 'band': return <Music className="h-4 w-4" />
      case 'party': return <Star className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
      case 'band': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      case 'party': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600 dark:text-green-400'
    if (growth < 0) return 'text-red-600 dark:text-red-400'
    return 'text-muted-foreground'
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const getGrowthLabel = (growth: number) => {
    return growth > 0 ? t.statistics.growth : t.statistics.decline
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return t.bookings.pending
      case 'confirmed': return t.bookings.confirmed
      case 'rejected': return t.bookings.rejected
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
      case 'confirmed': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
      case 'rejected': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getDayName = (day: string) => {
    // Return day names in English
    return day
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return 'Last Week'
      case 'month': return 'Last Month'
      case 'quarter': return 'Last 3 Months'
      case 'year': return 'Last Year'
      default: return period
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t.statistics.loadErrorDesc}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.statistics.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.statistics.description}
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">{getPeriodLabel('week')}</SelectItem>
            <SelectItem value="month">{getPeriodLabel('month')}</SelectItem>
            <SelectItem value="quarter">{getPeriodLabel('quarter')}</SelectItem>
            <SelectItem value="year">{getPeriodLabel('year')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.statistics.totalBookings}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{statistics.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {t.statistics.avgBookingValue} {statistics.averageBookingsPerDay.toFixed(1)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.bookings.confirmed}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">
              {((statistics.confirmedBookings / statistics.totalBookings) * 100).toFixed(1)}% {t.statistics.totalRevenue.toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.bookings.pending}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statistics.pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              {t.dashboard.requireAction}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statistics.rejectedBookings}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.totalBookings > 0 ? ((statistics.rejectedBookings / statistics.totalBookings) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.totalBookings - statistics.pendingBookings - statistics.confirmedBookings - statistics.rejectedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Completed sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            {getGrowthIcon(statistics.recentTrends.weeklyGrowth)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGrowthColor(statistics.recentTrends.weeklyGrowth)}`}>
              {statistics.recentTrends.weeklyGrowth > 0 ? '+' : ''}{statistics.recentTrends.weeklyGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Weekly trend
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {t.statistics.typeDistribution}
            </CardTitle>
            <CardDescription>{t.dashboard.distributionByType}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statistics.bookingsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(type)}>
                      {getTypeIcon(type)}
                      <span className="ml-1">{type}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{count}</div>
                    <div className="text-sm text-muted-foreground">
                      {((count / statistics.totalBookings) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t.statistics.popularTimes}
            </CardTitle>
            <CardDescription>{t.statistics.popularTimes}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.popularTimeSlots.slice(0, 6).map((slot, index) => (
                <div key={slot.time} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-semibold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span className="font-medium text-foreground">{slot.time}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{slot.count}</div>
                    <div className="text-sm text-muted-foreground">{t.statistics.bookings.toLowerCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Room Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t.statistics.roomUtilization}
            </CardTitle>
            <CardDescription>{t.statistics.roomUtilization}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.roomUtilization.map((room) => (
                <div key={room.roomName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{room.roomName}</span>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{room.totalBookings}</div>
                      <div className="text-sm text-muted-foreground">
                        {room.utilizationRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(room.utilizationRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t.statistics.overview}
            </CardTitle>
            <CardDescription>{t.statistics.overview}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                const count = statistics.bookingsByDay[day] || 0
                const maxCount = Math.max(...Object.values(statistics.bookingsByDay))
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="font-medium w-24 text-foreground">{getDayName(day)}</span>
                    <div className="flex items-center gap-4 flex-1 ml-4">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold w-8 text-right text-foreground">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}