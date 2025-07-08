"use client"

import type React from "react"

import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Users, Gift, Music } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const allTimeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

// Интерфейс для формы бронирования
interface BookingFormData {
  name: string
  email: string
  phone: string
  date: Date | undefined
  time: string
  duration: string
  notes: string
  bandSize?: string
  guestCount?: string
  instrument?: string
  partyType?: string
}

// Интерфейс для ошибок валидации
interface FormErrors {
  name?: boolean
  email?: boolean
  phone?: boolean
  date?: boolean
  time?: boolean
  duration?: boolean
  bandSize?: boolean
  guestCount?: boolean
  instrument?: boolean
  partyType?: boolean
}

function BookingForm() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const searchParams = useSearchParams()
  const [bookingType, setBookingType] = useState("individual")
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const initialRenderRef = useRef(true)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(allTimeSlots)
  const [timeSlotConflicts, setTimeSlotConflicts] = useState<string[]>([])
  const [bookingWarning, setBookingWarning] = useState('')

  // Состояние формы
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    date: undefined,
    time: "",
    duration: "1",
    notes: "",
    // Специфичные поля будут устанавливаться только при нужном типе
    bandSize: undefined,
    guestCount: undefined,
    instrument: undefined,
    partyType: undefined,
  })

  // Обновляем тип бронирования при изменении параметров URL
  useEffect(() => {
    const typeParam = searchParams.get("type")
    if (typeParam === "party" || typeParam === "band" || typeParam === "individual") {
      setBookingType(typeParam)
      // Устанавливаем значения по умолчанию для типа из URL
      setFormData((prev) => ({
        ...prev,
        // Сбрасываем все специфичные поля
        bandSize: undefined,
        guestCount: undefined,
        instrument: undefined,
        partyType: undefined,
        
        // Устанавливаем значения по умолчанию для нового типа
        ...(typeParam === "band" && { bandSize: "4" }),
        ...(typeParam === "party" && { guestCount: "10-15", partyType: "kids" }),
        ...(typeParam === "individual" && { instrument: "drums" })
      }))
    } else {
      // Если нет параметра в URL, устанавливаем значения по умолчанию для individual
      setFormData((prev) => ({
        ...prev,
        instrument: "drums"
      }))
    }

    // Прокручиваем страницу вверх ТОЛЬКО при первом рендере или при переходе с другой страницы
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0)
      }
    }
  }, [searchParams])

  // Обновляем дату в форме при изменении даты в календаре
  useEffect(() => {
    setFormData((prev) => ({ ...prev, date }))
    
    // Загружаем доступные слоты времени при выборе даты
    if (date) {
      fetchAvailableTimeSlots(date, bookingType)
    }
  }, [date, bookingType])

  // Check for conflicts when time or duration changes
  useEffect(() => {
    if (date && formData.time && formData.duration) {
      checkTimeSlotConflicts(date, formData.time, formData.duration, bookingType)
    }
  }, [date, formData.time, formData.duration, bookingType])

  // Function to check for conflicts when selecting duration > 1
  const checkTimeSlotConflicts = async (selectedDate: Date, startTime: string, duration: string, type: string) => {
    if (!selectedDate || !startTime || parseInt(duration) <= 1) {
      setTimeSlotConflicts([])
      setBookingWarning('')
      return
    }

    try {
      const cyprusDate = new Date(selectedDate.toLocaleString("en-US", { timeZone: "Europe/Nicosia" }))
      const year = cyprusDate.getFullYear()
      const month = String(cyprusDate.getMonth() + 1).padStart(2, '0')
      const day = String(cyprusDate.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      const response = await fetch(`/api/availability?date=${dateString}&type=${type}&startTime=${startTime}&duration=${duration}`)
      const result = await response.json()

      if (response.ok && result.conflicts) {
        setTimeSlotConflicts(result.conflicts)
        if (result.conflicts.length > 0) {
          setBookingWarning(`Warning: Your ${duration}-hour booking starting at ${startTime} conflicts with existing reservations at: ${result.conflicts.join(', ')}`)
        } else {
          setBookingWarning(`✓ No conflicts detected for ${duration}-hour booking starting at ${startTime}`)
        }
      } else {
        setTimeSlotConflicts([])
        setBookingWarning('')
      }
    } catch (error) {
      console.error('Error checking conflicts:', error)
      setTimeSlotConflicts([])
      setBookingWarning('')
    }
  }

  const fetchAvailableTimeSlots = async (selectedDate: Date, type: string) => {
    try {
      // Конвертируем дату в кипрское время
      const cyprusDate = new Date(selectedDate.toLocaleString("en-US", { timeZone: "Europe/Nicosia" }))
      const year = cyprusDate.getFullYear()
      const month = String(cyprusDate.getMonth() + 1).padStart(2, '0')
      const day = String(cyprusDate.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      console.log(`🇨🇾 Форма: запрашиваем слоты для ${dateString} (кипрское время), тип: ${type}`)
      
      const response = await fetch(`/api/availability?date=${dateString}&type=${type}`)
      const result = await response.json()

      console.log(`📱 Форма: получили ответ:`, result)

      if (response.ok) {
        setAvailableTimeSlots(result.availableSlots || allTimeSlots)
        console.log(`✅ Форма: установили слоты:`, result.availableSlots)
      } else {
        setAvailableTimeSlots(allTimeSlots)
        console.log(`❌ Форма: ошибка API, используем все слоты`)
      }
    } catch (error) {
      console.error('Ошибка при загрузке доступных слотов:', error)
      setAvailableTimeSlots(allTimeSlots)
    }
  }

  // Функция валидации поля
  const validateField = (name: string, value: any): boolean => {
    if (name === "name" && (!value || value.trim() === "")) {
      return false
    }

    if (name === "email") {
      if (!value || value.trim() === "") return false
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    }

    if (name === "phone" && (!value || value.trim() === "")) {
      return false
    }

    if (name === "date" && !value) {
      return false
    }

    if (name === "time" && (!value || value.trim() === "")) {
      return false
    }

    if (name === "duration" && (!value || value.trim() === "")) {
      return false
    }

    if (bookingType === "band" && name === "bandSize" && (!value || value.trim() === "")) {
      return false
    }

    if (bookingType === "party" && name === "guestCount" && (!value || value.trim() === "")) {
      return false
    }

    if (bookingType === "individual" && name === "instrument" && (!value || value.trim() === "")) {
      return false
    }

    if (bookingType === "party" && name === "partyType" && (!value || value.trim() === "")) {
      return false
    }

    return true
  }

  // Функция валидации всей формы
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Валидация общих полей
    Object.entries(formData).forEach(([key, value]) => {
      // Пропускаем необязательные поля и поля, которые не относятся к текущему типу бронирования
      if (key === "notes") return
      if (key === "bandSize" && bookingType !== "band") return
      if (key === "guestCount" && bookingType !== "party") return
      if (key === "instrument" && bookingType !== "individual") return
      if (key === "partyType" && bookingType !== "party") return

      const isFieldValid = validateField(key, value)
      if (!isFieldValid) {
        newErrors[key as keyof FormErrors] = true
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // Обработчик изменения полей формы
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear warnings when user changes time or duration
    if (name === 'time' || name === 'duration') {
      setBookingWarning('')
      setTimeSlotConflicts([])
    }

    // Если уже была попытка отправки, валидируем поле при изменении
    if (attemptedSubmit) {
      const isFieldValid = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: !isFieldValid }))
    }
  }

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault() // Предотвращаем стандартное поведение формы
  //   setAttemptedSubmit(true)
  //
  //   // Валидируем форму перед отправкой
  //   if (!validateForm()) {
  //     toast({
  //       title: "Please fill in all required fields",
  //       description: "All fields must be completed before booking.",
  //       variant: "destructive",
  //       duration: 5000, // 5 секунд
  //     })
  //     return // Просто выходим, не делая никаких дополнительных действий
  //   }
  //
  //   setIsSubmitting(true)
  //
  //   toast({
  //     title: "Booking Submitted",
  //     description: "We'll confirm your booking shortly.",
  //     duration: 3000, // 3 секунды
  //   })
  //
  //   // In a real app, you would submit to an API here
  //   setTimeout(() => {
  //     setIsSubmitting(false)
  //     router.push("/")
  //   }, 2000)
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAttemptedSubmit(true)

    if (!validateForm()) {
      toast({
        title: "Please fill in all required fields",
        description: "All fields must be completed before booking.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date ? (() => {
            // Конвертируем дату в кипрское время
            const cyprusDate = new Date(formData.date.toLocaleString("en-US", { timeZone: "Europe/Nicosia" }))
            const year = cyprusDate.getFullYear()
            const month = String(cyprusDate.getMonth() + 1).padStart(2, '0')
            const day = String(cyprusDate.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
          })() : null,
          time: formData.time,
          duration: formData.duration,
          notes: formData.notes,
          bandSize: formData.bandSize,
          guestCount: formData.guestCount,
          instrument: formData.instrument,
          partyType: formData.partyType,
          lessonType: formData.instrument || formData.partyType || "individual",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Unknown error")
      }

      toast({
        title: "Заявка отправлена",
        description: `Ваша заявка #${result.bookingId} принята к рассмотрению. Мы свяжемся с вами в ближайшее время.`,
        duration: 5000,
      })

      setTimeout(() => {
        setIsSubmitting(false)
        router.push("/")
      }, 2000)

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      })
      setIsSubmitting(false)
    }
  }




  // Обработчик изменения типа бронирования
  const handleBookingTypeChange = (value: string) => {
    setBookingType(value)
    
    // Сбрасываем специфичные поля и устанавливаем значения по умолчанию
    setFormData((prev) => ({
      ...prev,
      // Сбрасываем все специфичные поля
      bandSize: undefined,
      guestCount: undefined,
      instrument: undefined,
      partyType: undefined,
      
      // Устанавливаем значения по умолчанию для нового типа
      ...(value === "band" && { bandSize: "4" }),
      ...(value === "party" && { guestCount: "10-15", partyType: "kids" }),
      ...(value === "individual" && { instrument: "drums" })
    }))
    
    // Сбрасываем ошибки для полей, которые больше не актуальны
    setErrors((prev) => ({
      ...prev,
      bandSize: false,
      guestCount: false,
      instrument: false,
      partyType: false
    }))
    
    // Обновляем доступные слоты времени для нового типа бронирования
    if (date) {
      fetchAvailableTimeSlots(date, value)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Book Your Session</h1>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Whether you need a space for individual practice, band rehearsal, or a birthday party, we've got you covered.
        Select the type of booking below and choose your preferred date and time.
      </p>

      <Tabs value={bookingType} onValueChange={handleBookingTypeChange} className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span className="hidden sm:inline">Individual Practice</span>
            <span className="sm:hidden">Individual</span>
          </TabsTrigger>
          <TabsTrigger value="band" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Band Rehearsal</span>
            <span className="sm:hidden">Band</span>
          </TabsTrigger>
          <TabsTrigger value="party" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Birthday Party</span>
            <span className="sm:hidden">Party</span>
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>
              {bookingType === "individual" && "Individual Practice"}
              {bookingType === "band" && "Band Rehearsal"}
              {bookingType === "party" && "Birthday Party"}
            </CardTitle>
            <CardDescription>
              {bookingType === "individual" && "Book a private room for your individual practice session."}
              {bookingType === "band" && "Reserve a spacious room for your band's rehearsal."}
              {bookingType === "party" && "Book our venue for a music-themed birthday celebration."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={cn(errors.name ? "border-red-500" : "")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={cn(errors.email ? "border-red-500" : "")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={cn(errors.phone ? "border-red-500" : "")}
                  />
                </div>

                {bookingType === "band" && (
                  <div className="space-y-2">
                    <Label htmlFor="bandSize">Number of Band Members</Label>
                    <Select value={formData.bandSize} onValueChange={(value) => handleChange("bandSize", value)}>
                      <SelectTrigger id="bandSize" className={cn(errors.bandSize ? "border-red-500" : "")}>
                        <SelectValue placeholder="Select band size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 members</SelectItem>
                        <SelectItem value="3">3 members</SelectItem>
                        <SelectItem value="4">4 members</SelectItem>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="6+">6+ members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {bookingType === "party" && (
                  <div className="space-y-2">
                    <Label htmlFor="guestCount">Number of Guests</Label>
                    <Select value={formData.guestCount} onValueChange={(value) => handleChange("guestCount", value)}>
                      <SelectTrigger id="guestCount" className={cn(errors.guestCount ? "border-red-500" : "")}>
                        <SelectValue placeholder="Select guest count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">5-10 guests</SelectItem>
                        <SelectItem value="10-15">10-15 guests</SelectItem>
                        <SelectItem value="15-20">15-20 guests</SelectItem>
                        <SelectItem value="20-30">20-30 guests</SelectItem>
                        <SelectItem value="30+">30+ guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                          errors.date ? "border-red-500" : "",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">
                    Time Slot 
                    {date && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({availableTimeSlots.length} доступно)
                      </span>
                    )}
                  </Label>
                  <Select value={formData.time} onValueChange={(value) => handleChange("time", value)}>
                    <SelectTrigger id="time" className={cn(errors.time ? "border-red-500" : "")}>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          Нет доступных слотов на выбранную дату
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {bookingType === "individual" && (
                  <div className="space-y-2">
                    <Label htmlFor="instrument">Instrument</Label>
                    <Select value={formData.instrument} onValueChange={(value) => handleChange("instrument", value)}>
                      <SelectTrigger id="instrument" className={cn(errors.instrument ? "border-red-500" : "")}>
                        <SelectValue placeholder="Select instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drums">Drums</SelectItem>
                        <SelectItem value="guitar">Guitar</SelectItem>
                        <SelectItem value="bass">Bass</SelectItem>
                        <SelectItem value="keyboard">Keyboard</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {bookingType === "party" && (
                  <div className="space-y-2">
                    <Label htmlFor="partyType">Party Type</Label>
                    <Select value={formData.partyType} onValueChange={(value) => handleChange("partyType", value)}>
                      <SelectTrigger id="partyType" className={cn(errors.partyType ? "border-red-500" : "")}>
                        <SelectValue placeholder="Select party type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kids">Kids Birthday</SelectItem>
                        <SelectItem value="teen">Teen Birthday</SelectItem>
                        <SelectItem value="adult">Adult Birthday</SelectItem>
                        <SelectItem value="other">Other Celebration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or information we should know about"
                  className="min-h-[100px]"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => handleChange("duration", value)}>
                  <SelectTrigger id="duration" className={cn(errors.duration ? "border-red-500" : "")}>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="5">5 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="7">7 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                  </SelectContent>
                </Select>
                {bookingWarning && (
                  <div className={cn(
                    "p-3 rounded-lg border text-sm",
                    timeSlotConflicts.length > 0 
                      ? "bg-yellow-50 border-yellow-200 text-yellow-800" 
                      : "bg-green-50 border-green-200 text-green-800"
                  )}>
                    {timeSlotConflicts.length > 0 && (
                      <span className="font-medium">⚠️ </span>
                    )}
                    {timeSlotConflicts.length === 0 && parseInt(formData.duration) > 1 && (
                      <span className="font-medium">✓ </span>
                    )}
                    {bookingWarning}
                    {timeSlotConflicts.length > 0 && (
                      <div className="mt-2 text-xs">
                        Note: Your booking may still be possible if rooms become available or if you choose a different time.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              form="booking-form"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Book Now"}
            </Button>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 px-4">Loading booking form...</div>}>
      <BookingForm />
    </Suspense>
  )
}
