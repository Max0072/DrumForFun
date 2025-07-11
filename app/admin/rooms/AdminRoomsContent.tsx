"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { 
  CalendarIcon,
  Users, 
  Music,
  Guitar,
  Clock,
  MapPin,
  BarChart3,
  Plus,
  Trash2,
  Mail,
  User,
  Edit,
  X,
  Eye,
  EyeOff
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Room {
  id: string
  name: string
  type: 'drums' | 'guitar' | 'universal'
  capacity: number
  description?: string
  isVisible: boolean
}

interface RoomSchedule {
  roomId: string
  roomName: string
  bookings: {
    id: string
    name: string
    email?: string
    phone?: string
    time: string
    duration: string
    type: string
    status: string
    notes?: string
    adminMessage?: string
  }[]
}

interface SlotDialogData {
  isOpen: boolean
  room: Room | null
  timeSlot: string
  date: Date
  booking: RoomSchedule['bookings'][0] | null
  isAdminBooking: boolean
}

export default function AdminRoomsContent() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [schedule, setSchedule] = useState<RoomSchedule[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    room: Room | null;
  }>({ isOpen: false, room: null })
  const [createDialog, setCreateDialog] = useState(false)
  const [newRoom, setNewRoom] = useState({
    id: '',
    name: '',
    type: 'drums' as 'drums' | 'guitar' | 'universal',
    capacity: 4,
    description: '',
    isVisible: true
  })
  const [slotDialog, setSlotDialog] = useState<SlotDialogData>({
    isOpen: false,
    room: null,
    timeSlot: '',
    date: new Date(),
    booking: null,
    isAdminBooking: false
  })
  const [adminDescription, setAdminDescription] = useState('')
  const [adminDuration, setAdminDuration] = useState('1')
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRooms()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchSchedule(selectedDate)
    }
  }, [selectedDate])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/admin/rooms')
      const result = await response.json()
      
      if (result.success) {
        setRooms(result.rooms)
      }
    } catch (error) {
      console.error('Error loading rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSchedule = async (date: Date) => {
    try {
      const dateString = format(date, 'yyyy-MM-dd')
      const response = await fetch(`/api/admin/schedule?date=${dateString}`)
      const result = await response.json()
      
      if (result.success) {
        setSchedule(result.schedule)
      }
    } catch (error) {
      console.error('Error loading schedule:', error)
    }
  }

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'drums': return <Music className="h-4 w-4" />
      case 'guitar': return <Guitar className="h-4 w-4" />
      case 'universal': return <Users className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'drums': return 'bg-red-100 text-red-800'
      case 'guitar': return 'bg-blue-100 text-blue-800' 
      case 'universal': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case 'drums': return 'Drums'
      case 'guitar': return 'Guitar'
      case 'universal': return 'Universal'
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed'
      case 'pending': return 'Pending'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ]

  const handleSlotClick = (room: Room, timeSlot: string, booking: RoomSchedule['bookings'][0] | null) => {
    setSlotDialog({
      isOpen: true,
      room,
      timeSlot,
      date: selectedDate,
      booking,
      isAdminBooking: booking ? booking.type.includes('Admin') : false
    })
    setAdminDescription('')
    setAdminDuration('1')
  }

  const closeDialog = () => {
    setSlotDialog({
      isOpen: false,
      room: null,
      timeSlot: '',
      date: new Date(),
      booking: null,
      isAdminBooking: false
    })
    setAdminDescription('')
    setAdminDuration('1')
  }

  const createAdminBooking = async () => {
    if (!slotDialog.room || !adminDescription.trim()) {
      toast({
        title: 'Error',
        description: "Description is required",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      const response = await fetch('/api/admin/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: slotDialog.room.id,
          roomName: slotDialog.room.name,
          date: format(slotDialog.date, 'yyyy-MM-dd'),
          time: slotDialog.timeSlot,
          duration: adminDuration,
          description: adminDescription.trim(),
          type: 'Admin Block'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: "Admin booking created successfully",
        })
        closeDialog()
        fetchSchedule(selectedDate)
      } else {
        throw new Error(result.error || 'Failed to create booking')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: "Failed to create booking",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const checkTimeSlotConflicts = (startTime: string, duration: string, roomId: string) => {
    const startHour = parseInt(startTime.split(':')[0])
    const durationHours = parseInt(duration)
    const roomSchedule = schedule.find(s => s.roomId === roomId)
    
    if (!roomSchedule) return []
    
    const conflicts = []
    for (let i = 0; i < durationHours; i++) {
      const checkHour = startHour + i
      const checkTime = `${checkHour.toString().padStart(2, '0')}:00`
      
      const conflict = roomSchedule.bookings.find(booking => {
        const bookingStart = parseInt(booking.time.split(':')[0])
        const bookingEnd = bookingStart + parseInt(booking.duration)
        return checkHour >= bookingStart && checkHour < bookingEnd
      })
      
      if (conflict && conflict.time !== startTime) {
        conflicts.push(`${checkTime} - ${conflict.name}`)
      }
    }
    
    return conflicts
  }

  const cancelBooking = async () => {
    if (!slotDialog.booking) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/bookings/${slotDialog.booking.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAdminBooking: slotDialog.isAdminBooking
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: slotDialog.isAdminBooking ? "Admin booking cancelled" : "Booking cancelled and email sent",
        })
        closeDialog()
        fetchSchedule(selectedDate)
      } else {
        throw new Error(result.error || 'Failed to cancel booking')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: "Failed to cancel booking",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteRoom = async () => {
    if (!deleteDialog.room) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/rooms?id=${deleteDialog.room.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: "Room deleted successfully",
        })
        setDeleteDialog({ isOpen: false, room: null })
        fetchRooms()
        fetchSchedule(selectedDate)
      } else {
        throw new Error(result.error || 'Failed to delete room')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : "Failed to delete room",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleToggleVisibility = async (room: Room) => {
    setProcessing(true)
    try {
      const response = await fetch('/api/admin/rooms', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: room.id,
          action: 'toggle-visibility'
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Room ${room.isVisible ? 'hidden' : 'made visible'} successfully`,
        })
        fetchRooms()
        fetchSchedule(selectedDate)
      } else {
        throw new Error(result.error || 'Failed to toggle visibility')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : "Failed to toggle visibility",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleCreateRoom = async () => {
    if (!newRoom.id || !newRoom.name || !newRoom.type || !newRoom.capacity) {
      toast({
        title: 'Error',
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      const response = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoom),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: "Room created successfully",
        })
        setCreateDialog(false)
        setNewRoom({
          id: '',
          name: '',
          type: 'drums',
          capacity: 4,
          description: '',
          isVisible: true
        })
        fetchRooms()
        fetchSchedule(selectedDate)
      } else {
        throw new Error(result.error || 'Failed to create room')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : "Failed to create room",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Room Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View room availability and manage bookings
        </p>
      </div>

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Availability Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : 'Select Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Badge variant="secondary">
              {schedule.filter(roomSchedule => 
                rooms.find(room => room.id === roomSchedule.roomId)?.isVisible
              ).reduce((total, room) => total + room.bookings.length, 0)} bookings
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Rooms Overview</h2>
          <div className="flex items-center gap-2">
            {editMode && (
              <Button
                variant="default"
                onClick={() => setCreateDialog(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Room
              </Button>
            )}
            <Button
              variant={editMode ? "destructive" : "outline"}
              onClick={() => setEditMode(!editMode)}
              className="gap-2"
            >
              {editMode ? (
                <>
                  <X className="h-4 w-4" />
                  Exit Edit Mode
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Manage Rooms
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className={cn(
              "transition-all duration-200",
              !room.isVisible && "opacity-60 border-dashed"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={cn(
                    "text-lg flex items-center gap-2",
                    !room.isVisible && "text-gray-500"
                  )}>
                    {room.name}
                    {!room.isVisible && (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoomTypeColor(room.type)}>
                      {getRoomTypeIcon(room.type)}
                      <span className="ml-1">{getRoomTypeLabel(room.type)}</span>
                    </Badge>
                    {editMode && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(room)}
                          className={cn(
                            "h-8 w-8 p-0",
                            !room.isVisible
                              ? "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                              : "text-green-500 hover:text-green-700 hover:bg-green-50"
                          )}
                        >
                          {!room.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteDialog({ isOpen: true, room })}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <CardDescription>{room.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {room.capacity} people</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-medium mb-2">{format(selectedDate, "dd.MM")}:</div>
                  <div className="space-y-1">
                    {schedule.find(s => s.roomId === room.id)?.bookings.length ? (
                      schedule.find(s => s.roomId === room.id)?.bookings.map((booking, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span>{booking.time} ({booking.duration}h)</span>
                          <Badge className={getStatusColor(booking.status)} variant="secondary">
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground">Available time slots</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Booking Schedule - {format(selectedDate, "dd MMMM yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {rooms.filter(room => room.isVisible).map((room) => {
              const roomSchedule = schedule.find(s => s.roomId === room.id)
              return (
                <div key={room.id} className="border border-border bg-card rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={getRoomTypeColor(room.type)}>
                      {getRoomTypeIcon(room.type)}
                      <span className="ml-1">{room.name}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {roomSchedule?.bookings.length || 0} bookings
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {timeSlots.map((time) => {
                      // Check if this time slot is occupied by any booking
                      const currentHour = parseInt(time.split(':')[0])
                      const booking = roomSchedule?.bookings.find(b => {
                        const bookingStart = parseInt(b.time.split(':')[0])
                        const bookingEnd = bookingStart + parseInt(b.duration)
                        return currentHour >= bookingStart && currentHour < bookingEnd
                      })
                      
                      // Determine if this is the start time of the booking (to show details)
                      const isStartTime = booking && booking.time === time
                      
                      return (
                        <div
                          key={time}
                          onClick={() => handleSlotClick(room, time, booking || null)}
                          className={cn(
                            "p-2 rounded border text-center text-xs cursor-pointer transition-colors hover:shadow-sm",
                            booking ? (
                              isStartTime 
                                ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50" 
                                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            ) : "bg-muted border-border hover:bg-accent/50"
                          )}
                        >
                          <div className="font-medium">{time}</div>
                          {booking ? (
                            <div className="mt-1">
                              {isStartTime ? (
                                <>
                                  <div className="font-medium text-blue-800 dark:text-blue-200">{booking.name}</div>
                                  <div className="text-blue-600 dark:text-blue-300">{booking.type}</div>
                                  <div className="text-xs text-blue-500 dark:text-blue-400">
                                    {booking.time} - {parseInt(booking.time.split(':')[0]) + parseInt(booking.duration)}:00
                                  </div>
                                  <Badge className={cn("mt-1", getStatusColor(booking.status))} variant="secondary">
                                    {getStatusLabel(booking.status)}
                                  </Badge>
                                </>
                              ) : (
                                <div className="text-blue-600 dark:text-blue-300 font-medium text-xs">
                                  ← {booking.name}
                                  <div className="text-xs opacity-75">continues</div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-muted-foreground mt-1 text-xs">
                              <div>Click to book</div>
                              <div className="text-xs opacity-75">Available</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          {rooms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load room information
            </div>
          )}
          {rooms.length > 0 && rooms.filter(room => room.isVisible).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <EyeOff className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">All rooms are hidden</p>
              <p className="text-sm">Use "Manage Rooms" to make rooms visible for booking</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slot Management Dialog */}
      <Dialog open={slotDialog.isOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {slotDialog.booking ? (
                <>
                  <Clock className="h-5 w-5" />
                  Booking Details
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Create Admin Booking
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {slotDialog.room && (
                <>
                  {slotDialog.room.name} • {slotDialog.timeSlot} • {format(slotDialog.date, "dd.MM.yyyy")}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {slotDialog.booking ? (
              // Existing booking information
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{slotDialog.booking.name}</span>
                      <Badge className={cn("ml-auto", getStatusColor(slotDialog.booking.status))}>
                        {getStatusLabel(slotDialog.booking.status)}
                      </Badge>
                    </div>
                    {slotDialog.booking.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{slotDialog.booking.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{slotDialog.booking.time} ({slotDialog.booking.duration}h)</span>
                    </div>
                    <div className="text-sm">
                      <strong>Lesson Type:</strong> {slotDialog.booking.type}
                    </div>
                    {slotDialog.booking.notes && (
                      <div className="text-sm">
                        <strong>Notes:</strong> {slotDialog.booking.notes}
                      </div>
                    )}
                    {slotDialog.booking.adminMessage && (
                      <div className="text-sm">
                        <strong>Admin Message:</strong> {slotDialog.booking.adminMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Create admin booking
              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    This time slot is currently available. You can create an admin booking to block this time or reserve it for special purposes.
                  </p>
                </div>
                {slotDialog.room && adminDuration && parseInt(adminDuration) > 1 && (
                  (() => {
                    const conflicts = checkTimeSlotConflicts(slotDialog.timeSlot, adminDuration, slotDialog.room.id)
                    return conflicts.length > 0 ? (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800 font-medium mb-2">
                          ⚠️ Warning: Booking conflicts detected
                        </p>
                        <p className="text-sm text-yellow-700">
                          The following time slots are already booked:
                        </p>
                        <ul className="text-sm text-yellow-700 mt-1 ml-4">
                          {conflicts.map((conflict, index) => (
                            <li key={index}>• {conflict}</li>
                          ))}
                        </ul>
                        <p className="text-sm text-yellow-700 mt-2">
                          This booking will overlap with existing reservations.
                        </p>
                      </div>
                    ) : parseInt(adminDuration) > 1 ? (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          ✓ No conflicts detected for {adminDuration} hour booking starting at {slotDialog.timeSlot}
                        </p>
                      </div>
                    ) : null
                  })()
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminDesc">Booking Description</Label>
                    <Textarea
                      id="adminDesc"
                      placeholder="Enter a description for this admin booking (e.g., 'Maintenance', 'Private event', etc.)"
                      value={adminDescription}
                      onChange={(e) => setAdminDescription(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Select value={adminDuration} onValueChange={setAdminDuration}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={processing}>
              Cancel
            </Button>
            {slotDialog.booking ? (
              <Button
                onClick={cancelBooking}
                disabled={processing}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {processing ? 'Loading...' : 'Cancel Booking'}
              </Button>
            ) : (
              <Button
                onClick={createAdminBooking}
                disabled={processing || !adminDescription.trim()}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {processing ? 'Loading...' : 'Create Booking'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Room Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={() => setDeleteDialog({ isOpen: false, room: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Room
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteDialog.room && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-red-900">{deleteDialog.room.name}</div>
                    <Badge className={getRoomTypeColor(deleteDialog.room.type)}>
                      {getRoomTypeIcon(deleteDialog.room.type)}
                      <span className="ml-1">{getRoomTypeLabel(deleteDialog.room.type)}</span>
                    </Badge>
                  </div>
                  <div className="text-sm text-red-700">
                    Capacity: {deleteDialog.room.capacity} people
                  </div>
                  {deleteDialog.room.description && (
                    <div className="text-sm text-red-700">
                      {deleteDialog.room.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This room will be permanently deleted. 
                  Any future bookings for this room will be affected.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ isOpen: false, room: null })}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRoom}
              disabled={processing}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {processing ? 'Deleting...' : 'Delete Room'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Room Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Room
            </DialogTitle>
            <DialogDescription>
              Add a new room to your drum school facility.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomId">Room ID *</Label>
                <Input
                  id="roomId"
                  placeholder="e.g., drums3"
                  value={newRoom.id}
                  onChange={(e) => setNewRoom({ ...newRoom, id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Type *</Label>
                <Select value={newRoom.type} onValueChange={(value: 'drums' | 'guitar' | 'universal') => setNewRoom({ ...newRoom, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drums">Drums</SelectItem>
                    <SelectItem value="guitar">Guitar</SelectItem>
                    <SelectItem value="universal">Universal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name *</Label>
              <Input
                id="roomName"
                placeholder="e.g., Professional Studio #3"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomCapacity">Capacity *</Label>
              <Select value={newRoom.capacity.toString()} onValueChange={(value) => setNewRoom({ ...newRoom, capacity: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 person</SelectItem>
                  <SelectItem value="2">2 people</SelectItem>
                  <SelectItem value="3">3 people</SelectItem>
                  <SelectItem value="4">4 people</SelectItem>
                  <SelectItem value="5">5 people</SelectItem>
                  <SelectItem value="6">6 people</SelectItem>
                  <SelectItem value="8">8 people</SelectItem>
                  <SelectItem value="10">10 people</SelectItem>
                  <SelectItem value="12">12 people</SelectItem>
                  <SelectItem value="15">15 people</SelectItem>
                  <SelectItem value="20">20 people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomDescription">Description</Label>
              <Textarea
                id="roomDescription"
                placeholder="Optional description of the room..."
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Preview:</strong> {newRoom.name || 'Room Name'} ({newRoom.type || 'type'}) - {newRoom.capacity} people
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRoom}
              disabled={processing || !newRoom.id || !newRoom.name}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {processing ? 'Creating...' : 'Create Room'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}