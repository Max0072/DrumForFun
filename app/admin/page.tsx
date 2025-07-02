"use client"

import { useEffect, useState } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Music,
  Gift
} from "lucide-react"
import Link from 'next/link'

interface BookingStats {
  total: number
  pending: number
  confirmed: number
  rejected: number
  byType: { type: string; count: number }[]
  recent: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<BookingStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const result = await response.json()
        
        if (result.success) {
          setStats(result.stats)
        }
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    if (type.includes('Birthday')) return <Gift className="h-4 w-4" />
    if (type.includes('Band')) return <Users className="h-4 w-4" />
    return <Music className="h-4 w-4" />
  }

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </AdminLayout>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
            <p className="mt-1 text-sm text-gray-600">
              Обзор активности и управление заявками
            </p>
          </div>

          {/* Карточки статистики */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  За все время
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ожидают рассмотрения</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Требуют действий
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Подтверждены</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats?.confirmed || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Активные бронирования
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Отклонены</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats?.rejected || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Отклоненные заявки
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Статистика по типам */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Популярные типы бронирований
                </CardTitle>
                <CardDescription>
                  Распределение заявок по типам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.byType.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        <span className="text-sm font-medium">{item.type}</span>
                      </div>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                  {(!stats?.byType || stats.byType.length === 0) && (
                    <p className="text-sm text-gray-500">Пока нет данных</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Недавние заявки */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Недавние заявки
                </CardTitle>
                <CardDescription>
                  Последние 5 заявок
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.recent.map((booking, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{booking.name}</span>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {booking.date} в {booking.time} • {booking.type}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!stats?.recent || stats.recent.length === 0) && (
                    <p className="text-sm text-gray-500">Пока нет заявок</p>
                  )}
                </div>
                {stats?.recent && stats.recent.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/bookings">
                        Посмотреть все заявки
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Быстрые действия */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>
                Основные функции управления
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Link href="/admin/bookings">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Заявки ({stats?.pending || 0})
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/rooms">
                    <Calendar className="mr-2 h-4 w-4" />
                    Комнаты
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/history">
                    <Clock className="mr-2 h-4 w-4" />
                    История
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}