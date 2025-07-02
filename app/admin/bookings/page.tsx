"use client"

import { useEffect, useState } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
  Search
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
  status: 'pending' | 'confirmed' | 'rejected'
  createdAt: string
  roomName?: string
  adminMessage?: string
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [actionDialog, setActionDialog] = useState<{open: boolean, action: 'confirm' | 'reject' | 'cancel' | null}>({open: false, action: null})
  const [adminMessage, setAdminMessage] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [rooms, setRooms] = useState<{id: string, name: string}[]>([])
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
    fetchRooms()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, selectedStatus, searchTerm])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings')
      const result = await response.json()
      
      if (result.success) {
        setBookings(result.bookings)
      }
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
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
      console.error('Ошибка загрузки комнат:', error)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // Фильтр по статусу
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === selectedStatus)
    }

    // Поиск по имени, email или ID
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(booking => 
        booking.name.toLowerCase().includes(term) ||
        booking.email.toLowerCase().includes(term) ||
        booking.id.toLowerCase().includes(term)
      )
    }

    setFilteredBookings(filtered)
  }

  const handleAction = async (action: 'confirm' | 'reject' | 'cancel') => {
    if (!selectedBooking) return

    setProcessing(true)
    
    try {
      const response = await fetch(`/api/admin/bookings/${selectedBooking.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          adminMessage: adminMessage.trim() || undefined,
          roomId: selectedRoom || undefined,
          roomName: rooms.find(r => r.id === selectedRoom)?.name
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Успешно",
          description: result.message,
        })
        
        // Обновляем список заявок
        await fetchBookings()
        
        // Закрываем диалог
        setActionDialog({open: false, action: null})
        setSelectedBooking(null)
        setAdminMessage('')
        setSelectedRoom('')
      } else {
        toast({
          title: "Ошибка",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить действие",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const openActionDialog = (booking: Booking, action: 'confirm' | 'reject' | 'cancel') => {
    setSelectedBooking(booking)
    setActionDialog({open: true, action})
    setAdminMessage('')
    setSelectedRoom('')
  }

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

  if (loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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
            <h1 className="text-2xl font-bold text-gray-900">Управление заявками</h1>
            <p className="mt-1 text-sm text-gray-600">
              Просмотр и управление всеми заявками на бронирование
            </p>
          </div>

          {/* Фильтры и поиск */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Фильтры
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Поиск по имени, email или ID</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Введите для поиска..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Статус</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все заявки</SelectItem>
                      <SelectItem value="pending">Ожидают рассмотрения</SelectItem>
                      <SelectItem value="confirmed">Подтверждены</SelectItem>
                      <SelectItem value="rejected">Отклонены</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Список заявок */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">Заявки не найдены</p>
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
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                          <span className="text-sm text-gray-500">#{booking.id}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{booking.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{booking.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{booking.date} в {booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{booking.duration} час(а/ов)</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-gray-400" />
                            <span>{booking.type}</span>
                          </div>
                          {booking.roomName && (
                            <div className="text-green-600 font-medium">
                              Комната: {booking.roomName}
                            </div>
                          )}
                        </div>
                        
                        {booking.notes && (
                          <div className="flex items-start gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-600">{booking.notes}</span>
                          </div>
                        )}
                        
                        {booking.adminMessage && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                            <strong>Сообщение администратора:</strong> {booking.adminMessage}
                          </div>
                        )}
                      </div>
                      
                      {/* Действия */}
                      <div className="flex flex-col gap-2 lg:w-auto lg:flex-row">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => openActionDialog(booking, 'confirm')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Подтвердить
                            </Button>
                            <Button
                              onClick={() => openActionDialog(booking, 'reject')}
                              variant="destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Отклонить
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            onClick={() => openActionDialog(booking, 'cancel')}
                            variant="destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Отменить
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Диалог действий */}
          <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({open, action: null})}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {actionDialog.action === 'confirm' && 'Подтвердить заявку'}
                  {actionDialog.action === 'reject' && 'Отклонить заявку'}
                  {actionDialog.action === 'cancel' && 'Отменить бронирование'}
                </DialogTitle>
                <DialogDescription>
                  {selectedBooking && (
                    <>
                      Заявка #{selectedBooking.id} от {selectedBooking.name}
                      <br />
                      {selectedBooking.date} в {selectedBooking.time}
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {actionDialog.action === 'confirm' && (
                  <div className="space-y-2">
                    <Label>Выберите комнату</Label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите комнату" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Сообщение клиенту (необязательно)</Label>
                  <Textarea
                    placeholder={
                      actionDialog.action === 'confirm' 
                        ? "Дополнительная информация для клиента..."
                        : actionDialog.action === 'reject'
                        ? "Причина отклонения..."
                        : "Причина отмены..."
                    }
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setActionDialog({open: false, action: null})}
                  disabled={processing}
                >
                  Отмена
                </Button>
                <Button
                  onClick={() => actionDialog.action && handleAction(actionDialog.action)}
                  disabled={processing || (actionDialog.action === 'confirm' && !selectedRoom)}
                  className={
                    actionDialog.action === 'confirm' 
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {processing ? "Обработка..." : 
                    actionDialog.action === 'confirm' ? "Подтвердить" :
                    actionDialog.action === 'reject' ? "Отклонить" : "Отменить"
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}