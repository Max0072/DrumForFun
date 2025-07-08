"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { useLanguage } from '@/components/admin/LanguageProvider'
import { 
  History,
  Search, 
  Filter,
  CalendarIcon,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { cn } from "@/lib/utils"

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  duration: string
  notes?: string
  type: string
  status: 'pending' | 'confirmed' | 'rejected'
  createdAt: string
  updatedAt?: string
  adminMessage?: string
  roomName?: string
}

export default function AdminHistoryContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<Date | undefined>(startOfMonth(subMonths(new Date(), 1)))
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date())
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const { t } = useLanguage()

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter, typeFilter, dateFrom, dateTo])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings')
      const result = await response.json()
      
      if (result.success) {
        // Sort by creation date (newest first)
        const sortedBookings = result.bookings.sort((a: Booking, b: Booking) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setBookings(sortedBookings)
      }
    } catch (error) {
      console.error(t.history.loadError, error)
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // Text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.name.toLowerCase().includes(term) ||
        booking.email.toLowerCase().includes(term) ||
        booking.id.toLowerCase().includes(term) ||
        booking.phone.includes(term)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.type === typeFilter)
    }

    // Date filter
    if (dateFrom) {
      filtered = filtered.filter(booking => 
        new Date(booking.createdAt) >= dateFrom
      )
    }

    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter(booking => 
        new Date(booking.createdAt) <= endDate
      )
    }

    setFilteredBookings(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return t.bookings.pending
      case 'confirmed': return t.bookings.confirmed
      case 'rejected': return t.bookings.rejected
      default: return status
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', t.history.customer, 'Email', 'Phone', t.history.date, 'Time', t.history.type, t.history.status, 'Room', 'Created']
    const data = filteredBookings.map(booking => [
      booking.id,
      booking.name,
      booking.email,
      booking.phone,
      booking.date,
      booking.time,
      booking.type,
      getStatusLabel(booking.status),
      booking.roomName || '-',
      format(new Date(booking.createdAt), 'dd.MM.yyyy HH:mm')
    ])

    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `bookings_history_${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setTypeFilter('all')
    setDateFrom(startOfMonth(subMonths(new Date(), 1)))
    setDateTo(new Date())
  }

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage)

  const uniqueTypes = [...new Set(bookings.map(b => b.type))]

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.history.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.history.description}
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {t.history.exportData}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t.history.searchAndFilters}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>{t.history.searchLabel}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.history.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>{t.history.statusLabel}</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.allStatuses}</SelectItem>
                  <SelectItem value="pending">{t.bookings.pending}</SelectItem>
                  <SelectItem value="confirmed">{t.bookings.confirmed}</SelectItem>
                  <SelectItem value="rejected">{t.bookings.rejected}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>{t.history.typeLabel}</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.allTypes}</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>{t.history.dateRange}</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal flex-1",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd.MM") : t.history.from}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal flex-1",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd.MM") : t.history.to}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{t.history.recordsFound}: {filteredBookings.length}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearFilters}
            >
              {t.history.clearFilters}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-4">
        {paginatedBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t.history.noRecordsFound}</p>
            </CardContent>
          </Card>
        ) : (
          paginatedBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{booking.name}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{getStatusLabel(booking.status)}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">#{booking.id}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{booking.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{booking.date} {t.dashboard.at} {booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{booking.duration}h</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{booking.type}</span>
                      </div>
                      {booking.roomName && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{t.bookings.room} {booking.roomName}</span>
                        </div>
                      )}
                    </div>
                    
                    {booking.notes && (
                      <div className="text-sm text-foreground">
                        <strong>{t.bookings.notes}</strong> {booking.notes}
                      </div>
                    )}
                    
                    {booking.adminMessage && (
                      <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded p-3 text-sm">
                        <strong className="text-foreground">{t.bookings.adminMessage}</strong> <span className="text-foreground">{booking.adminMessage}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{t.bookings.createdDate} {format(new Date(booking.createdAt), 'dd.MM.yyyy HH:mm')}</div>
                    {booking.updatedAt && (
                      <div>Updated: {format(new Date(booking.updatedAt), 'dd.MM.yyyy HH:mm')}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-sm">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}