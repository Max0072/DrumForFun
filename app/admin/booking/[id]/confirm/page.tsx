"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BookingData {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  duration: string
  type: string
  status: string
  notes?: string
  bandSize?: string
  guestCount?: string
  instrument?: string
  partyType?: string
  createdAt: string
  roomId?: string
  roomName?: string
}

interface Room {
  id: string
  name: string
  type: string
  capacity: number
  description?: string
}

export default function BookingConfirmPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [adminMessage, setAdminMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string>("")

  const bookingId = params.id as string

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/booking/${bookingId}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Ошибка при загрузке заявки')
        }

        setBooking(result.booking)
        
        // Загружаем доступные комнаты для этого времени
        if (result.booking && result.booking.status === 'pending') {
          await fetchAvailableRooms(result.booking)
        }
      } catch (error: any) {
        toast({
          title: 'Ошибка',
          description: error.message,
          variant: 'destructive',
          duration: 5000
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId, toast])

  const fetchAvailableRooms = async (bookingData: BookingData) => {
    try {
      const bookingType = bookingData.type.toLowerCase().includes('individual') ? 'individual' :
                         bookingData.type.toLowerCase().includes('band') ? 'band' : 'party'
      
      const response = await fetch(
        `/api/rooms?date=${bookingData.date}&time=${bookingData.time}&duration=${bookingData.duration}&type=${bookingType}`
      )
      const result = await response.json()

      if (response.ok) {
        setAvailableRooms(result.rooms || [])
      }
    } catch (error) {
      console.error('Ошибка при загрузке комнат:', error)
    }
  }

  const handleConfirm = async (status: 'confirmed' | 'rejected') => {
    // Если подтверждаем заявку, проверяем что выбрана комната
    if (status === 'confirmed' && !selectedRoom) {
      toast({
        title: 'Выберите комнату',
        description: 'Для подтверждения заявки необходимо выбрать комнату',
        variant: 'destructive',
        duration: 5000
      })
      return
    }

    setIsProcessing(true)
    
    try {
      const selectedRoomData = availableRooms.find(room => room.id === selectedRoom)
      
      const response = await fetch('/api/booking/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status,
          adminMessage: adminMessage.trim() || undefined,
          roomId: status === 'confirmed' ? selectedRoom : undefined,
          roomName: status === 'confirmed' ? selectedRoomData?.name : undefined
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка при обработке заявки')
      }

      toast({
        title: status === 'confirmed' ? 'Заявка подтверждена' : 'Заявка отклонена',
        description: `Заявка #${bookingId} успешно ${status === 'confirmed' ? 'подтверждена' : 'отклонена'}`,
        duration: 3000
      })

      // Перенаправляем на главную страницу админки
      setTimeout(() => {
        router.push('/admin')
      }, 2000)

    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
        duration: 5000
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <p>Загрузка заявки...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <p>Заявка не найдена</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAlreadyProcessed = booking.status !== 'pending'

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Подтверждение заявки</CardTitle>
          <CardDescription>
            Заявка #{bookingId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Детали заявки:</h4>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {booking.id}</p>
              <p><strong>Тип:</strong> {booking.type}</p>
              <p><strong>Статус:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status === 'pending' ? 'Ожидает подтверждения' :
                   booking.status === 'confirmed' ? 'Подтверждена' : 'Отклонена'}
                </span>
              </p>
              <p><strong>Имя:</strong> {booking.name}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Телефон:</strong> {booking.phone}</p>
              <p><strong>Дата:</strong> {new Date(booking.date).toLocaleDateString('ru-RU')}</p>
              <p><strong>Время:</strong> {booking.time}</p>
              <p><strong>Длительность:</strong> {booking.duration} час(а/ов)</p>
              
              {booking.instrument && (
                <p><strong>Инструмент:</strong> {booking.instrument}</p>
              )}
              {booking.bandSize && (
                <p><strong>Размер группы:</strong> {booking.bandSize}</p>
              )}
              {booking.guestCount && (
                <p><strong>Количество гостей:</strong> {booking.guestCount}</p>
              )}
              {booking.partyType && (
                <p><strong>Тип праздника:</strong> {booking.partyType}</p>
              )}
              {booking.notes && (
                <p><strong>Заметки:</strong> {booking.notes}</p>
              )}
              
              <p><strong>Создана:</strong> {new Date(booking.createdAt).toLocaleString('ru-RU')}</p>
            </div>
          </div>

          {isAlreadyProcessed ? (
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600">
                Эта заявка уже была {booking.status === 'confirmed' ? 'подтверждена' : 'отклонена'}
              </p>
              {booking.roomName && (
                <p className="text-sm text-gray-500 mt-2">
                  Комната: {booking.roomName}
                </p>
              )}
            </div>
          ) : (
            <>
              {availableRooms.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="roomSelect">Выберите комнату для подтверждения</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger id="roomSelect">
                      <SelectValue placeholder="Выберите комнату" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{room.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {room.description} • до {room.capacity} чел.
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRoom && (
                    <p className="text-xs text-muted-foreground">
                      {availableRooms.find(r => r.id === selectedRoom)?.description}
                    </p>
                  )}
                </div>
              )}

              {availableRooms.length === 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">⚠️ Нет доступных комнат</p>
                  <p className="text-red-600 text-sm mt-1">
                    На выбранное время все подходящие комнаты заняты. 
                    Рассмотрите возможность отклонения заявки или предложите другое время.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="adminMessage">Сообщение клиенту (необязательно)</Label>
                <Textarea
                  id="adminMessage"
                  placeholder="Дополнительная информация для клиента..."
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => handleConfirm('confirmed')}
                  disabled={isProcessing || (availableRooms.length > 0 && !selectedRoom)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isProcessing ? 'Обработка...' : 'Подтвердить'}
                </Button>
                
                <Button
                  onClick={() => handleConfirm('rejected')}
                  disabled={isProcessing}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {isProcessing ? 'Обработка...' : 'Отклонить'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}