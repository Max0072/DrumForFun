"use client"

import { useEffect, useState } from 'react'
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
  completed: number
  byType: { type: string; count: number }[]
  recent: any[]
}

export default function AdminDashboardContent() {
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
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
      case 'confirmed': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
      case 'rejected': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      case 'completed': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
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
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Control Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Activity overview and request management
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending review</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              Require action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.confirmed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.rejected || 0}</div>
            <p className="text-xs text-muted-foreground">
              Rejected requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Completed sessions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistics by type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular booking types
            </CardTitle>
            <CardDescription>
              Distribution by type
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
                <p className="text-sm text-muted-foreground">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent requests
            </CardTitle>
            <CardDescription>
              Last requests
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
                    <p className="text-xs text-muted-foreground">
                      {booking.date} at {booking.time} • {booking.type}
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.recent || stats.recent.length === 0) && (
                <p className="text-sm text-muted-foreground">No requests yet</p>
              )}
            </div>
            {stats?.recent && stats.recent.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/bookings">
                    View all requests
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>
            Main functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link href="/admin/bookings">
                <AlertCircle className="mr-2 h-4 w-4" />
                Requests ({stats?.pending || 0})
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/rooms">
                <Calendar className="mr-2 h-4 w-4" />
                Rooms
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/history">
                <Clock className="mr-2 h-4 w-4" />
                History
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}