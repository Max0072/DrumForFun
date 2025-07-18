"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useLanguage } from '@/components/admin/LanguageProvider'
import { translateRoomName } from '@/lib/room-translations'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock,
  User,
  Calendar,
  Phone,
  Mail,
  Music,
  MessageSquare,
  Filter,
  Search,
  Trash2
} from "lucide-react"

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
  status: 'pending' | 'confirmed' | 'rejected' | 'completed'
  createdAt: string
  roomName?: string
  adminMessage?: string
}

export default function AdminBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [actionDialog, setActionDialog] = useState<{open: boolean, action: 'confirm' | 'reject' | 'cancel' | 'delete' | null}>({open: false, action: null})
  const [adminMessage, setAdminMessage] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [rooms, setRooms] = useState<{id: string, name: string}[]>([])
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()
  const { t, language } = useLanguage()


  useEffect(() => {
    // Update past bookings to completed status first, then fetch all bookings
    updatePastBookings().then(() => {
      fetchBookings()
    })
    // Don't fetch all rooms initially - we'll fetch available rooms when needed
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, selectedStatus, selectedType, searchTerm])

  const updatePastBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings/update-past', {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success && result.updatedCount > 0) {
        console.log(`Updated ${result.updatedCount} past bookings to completed status`)
      }
    } catch (error) {
      console.error('Error updating past bookings:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings')
      const result = await response.json()
      
      if (result.success) {
        setBookings(result.bookings)
      } else {
        toast({
          title: t.common.error,
          description: t.bookings.loadErrorDesc,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(t.bookings.loadError, error)
      toast({
        title: t.common.error,
        description: t.bookings.loadErrorDesc,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/admin/rooms')
      const result = await response.json()
      
      if (result.success) {
        setRooms(result.rooms || [])
      }
    } catch (error) {
      console.error('Error loading rooms:', error)
    }
  }

  const filterBookings = () => {
    // Only show pending and confirmed bookings
    let filtered = bookings.filter(booking => 
      booking.status === 'pending' || booking.status === 'confirmed'
    )

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(booking => booking.type === selectedType)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.name.toLowerCase().includes(term) ||
        booking.email.toLowerCase().includes(term) ||
        booking.id.toLowerCase().includes(term)
      )
    }

    // Sort bookings: pending first, then confirmed
    // Within each status group, sort by booking date/time (earliest first - most urgent)
    filtered.sort((a, b) => {
      // First, sort by status priority (pending before confirmed)
      if (a.status === 'pending' && b.status === 'confirmed') return -1
      if (a.status === 'confirmed' && b.status === 'pending') return 1
      
      // Within same status, sort by booking date/time (chronological - earliest first)
      const aDateTime = new Date(`${a.date}T${a.time}:00`)
      const bDateTime = new Date(`${b.date}T${b.time}:00`)
      return aDateTime.getTime() - bDateTime.getTime()
    })

    setFilteredBookings(filtered)
  }

  const handleAction = async (action: 'confirm' | 'reject' | 'cancel' | 'delete') => {
    if (!selectedBooking) return

    setProcessing(true)
    
    try {
      let response
      let result

      if (action === 'delete') {
        // Handle delete action separately
        response = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
          method: 'DELETE'
        })
        result = await response.json()
      } else {
        // Handle other actions
        response = await fetch(`/api/admin/bookings/${selectedBooking.id}/action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action,
            adminMessage: adminMessage.trim() || undefined,
            roomId: selectedRoom || undefined,
            roomName: rooms.find(r => r.id === selectedRoom)?.name || undefined
          }),
        })
        result = await response.json()
      }

      if (response.ok) {
        let description = ''
        switch (action) {
          case 'confirm': description = t.bookings.approveSuccess; break
          case 'reject': description = t.bookings.rejectSuccess; break
          case 'cancel': description = 'Booking cancelled successfully'; break
          case 'delete': description = 'Booking deleted successfully'; break
        }

        toast({
          title: t.common.success,
          description,
        })
        
        await fetchBookings()
        setActionDialog({open: false, action: null})
        setSelectedBooking(null)
        setAdminMessage('')
        setSelectedRoom('')
      } else {
        toast({
          title: t.common.error,
          description: result.error || t.bookings.statusChangeError,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.bookings.statusChangeError,
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const openActionDialog = (booking: Booking, action: 'confirm' | 'reject' | 'cancel' | 'delete') => {
    setSelectedBooking(booking)
    setActionDialog({open: true, action})
    setAdminMessage('')
    setSelectedRoom('')
    
    // If confirming, fetch available rooms for this specific booking
    if (action === 'confirm') {
      fetchAvailableRoomsForBooking(booking)
    }
  }

  const fetchAvailableRoomsForBooking = async (booking: Booking) => {
    setLoadingRooms(true)
    try {
      // Determine booking type based on the lesson type
      const bookingType = booking.type.toLowerCase().includes('individual') ? 'individual' :
                         booking.type.toLowerCase().includes('band') ? 'band' : 'party'
      
      const response = await fetch(
        `/api/rooms?date=${booking.date}&time=${booking.time}&duration=${booking.duration}&type=${bookingType}`
      )
      const result = await response.json()

      if (response.ok) {
        setRooms(result.rooms || [])
      } else {
        // If no available rooms, show empty list
        setRooms([])
      }
    } catch (error) {
      console.error('Error loading available rooms:', error)
      setRooms([])
    } finally {
      setLoadingRooms(false)
    }
  }

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return t.bookings.pending
      case 'confirmed': return t.bookings.confirmed
      case 'rejected': return t.bookings.rejected
      case 'completed': return 'Completed'
      default: return status
    }
  }

  const bookingTypes = [...new Set(bookings.map(booking => booking.type))].filter(Boolean)

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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Active Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage pending and confirmed bookings
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t.bookings.searchAndFilters}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t.bookings.searchLabel}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.bookings.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.bookings.statusLabel}</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">{t.bookings.pending}</SelectItem>
                  <SelectItem value="confirmed">{t.bookings.confirmed}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.bookings.typeLabel}</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.bookings.allTypes}</SelectItem>
                  {bookingTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {t.bookings.bookingsFound}: {filteredBookings.length}
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">{t.bookings.noBookingsFound}</p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
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
                      <span className="text-sm text-muted-foreground">{t.bookings.bookingNumber}{booking.id}</span>
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
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{booking.date} {t.dashboard.at} {booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{t.bookings.duration} {booking.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{t.bookings.lessonType} {booking.type}</span>
                      </div>
                      {booking.roomName && (
                        <div className="text-green-600 dark:text-green-400 font-medium">
                          {t.bookings.room} {translateRoomName(booking.roomName, language)}
                        </div>
                      )}
                    </div>
                    
                    {booking.notes && booking.type !== 'Admin Block' && (
                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-foreground">{t.bookings.notes} {booking.notes}</span>
                      </div>
                    )}
                    
                    {booking.adminMessage && (
                      <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded p-3 text-sm">
                        <strong className="text-foreground">{t.bookings.adminMessage}</strong> <span className="text-foreground">{booking.adminMessage}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-auto lg:flex-row">
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => openActionDialog(booking, 'confirm')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {t.bookings.approve}
                        </Button>
                        <Button
                          onClick={() => openActionDialog(booking, 'reject')}
                          variant="destructive"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          {t.bookings.reject}
                        </Button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button
                        onClick={() => openActionDialog(booking, 'cancel')}
                        variant="destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {t.common.cancel}
                      </Button>
                    )}
                    {(booking.status === 'rejected' || booking.status === 'completed') && (
                      <Button
                        onClick={() => openActionDialog(booking, 'delete')}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => {
        setActionDialog({open, action: null})
        if (!open) {
          setRooms([])
          setSelectedRoom('')
          setAdminMessage('')
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'confirm' && t.bookings.approve}
              {actionDialog.action === 'reject' && t.bookings.reject}
              {actionDialog.action === 'cancel' && t.common.cancel}
              {actionDialog.action === 'delete' && 'Delete Booking'}
            </DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <>
                  {t.bookings.customerInfo}
                  <br />
                  {selectedBooking.name} - {selectedBooking.date} {t.dashboard.at} {selectedBooking.time}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {actionDialog.action === 'delete' && (
              <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-medium mb-2">
                  ⚠️ Warning: This action cannot be undone
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Are you sure you want to permanently delete this booking? All booking data will be lost.
                </p>
              </div>
            )}
            {actionDialog.action === 'confirm' && (
              <div className="space-y-2">
                <Label>{t.bookings.selectRoom}</Label>
                {loadingRooms ? (
                  <div className="p-3 text-center text-sm text-muted-foreground">
                    {t.common.loading}
                  </div>
                ) : rooms.length === 0 ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">⚠️ {t.bookings.noAvailableRooms}</p>
                    <p className="text-red-600 text-sm mt-1">
                      {t.bookings.noAvailableRoomsDesc}
                    </p>
                  </div>
                ) : (
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.bookings.noRoomSelected} />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {translateRoomName(room.name, language)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
            
            {actionDialog.action !== 'delete' && (
              <div className="space-y-2">
                <Label>{t.bookings.adminMessage}</Label>
                <Textarea
                  placeholder={t.bookings.adminMessage}
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionDialog({open: false, action: null})}
              disabled={processing}
            >
              {t.common.cancel}
            </Button>
            <Button
              onClick={() => actionDialog.action && handleAction(actionDialog.action)}
              disabled={processing || loadingRooms || (actionDialog.action === 'confirm' && (!selectedRoom || rooms.length === 0))}
              className={
                actionDialog.action === 'confirm' 
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {processing ? t.common.loading : 
                actionDialog.action === 'confirm' ? t.bookings.approve :
                actionDialog.action === 'reject' ? t.bookings.reject : 
                actionDialog.action === 'delete' ? 'Delete Permanently' : t.common.cancel
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}