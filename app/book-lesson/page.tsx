"use client"

import type React from "react"
import { useState, useEffect, Suspense, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Clock, Star, Guitar, Drum, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Данные инструкторов
const instructors = {
  drums: [
    {
      id: "alex-drums",
      name: "Alex Rodriguez",
      instrument: "Drums",
      experience: "8 years",
      rating: 4.9,
      reviews: 127,
      specialties: ["Rock", "Jazz", "Funk", "Latin"],
      bio: "Professional drummer with experience in multiple bands and studio recordings.",
      image: "/placeholder.svg?height=100&width=100",
      availability: ["Monday", "Tuesday", "Wednesday", "Friday"],
      price: 45,
    },
    {
      id: "sarah-drums",
      name: "Sarah Chen",
      instrument: "Drums",
      experience: "6 years",
      rating: 4.8,
      reviews: 89,
      specialties: ["Pop", "Rock", "Electronic", "World Music"],
      bio: "Versatile drummer specializing in modern styles and electronic integration.",
      image: "/placeholder.svg?height=100&width=100",
      availability: ["Tuesday", "Thursday", "Saturday", "Sunday"],
      price: 40,
    },
  ],
  guitar: [
    {
      id: "mike-guitar",
      name: "Mike Johnson",
      instrument: "Guitar",
      experience: "12 years",
      rating: 4.9,
      reviews: 203,
      specialties: ["Classical", "Fingerstyle", "Blues", "Jazz"],
      bio: "Classically trained guitarist with expertise in multiple genres.",
      image: "/placeholder.svg?height=100&width=100",
      availability: ["Monday", "Wednesday", "Thursday", "Friday"],
      price: 50,
    },
    {
      id: "emma-guitar",
      name: "Emma Wilson",
      instrument: "Guitar",
      experience: "7 years",
      rating: 4.7,
      reviews: 156,
      specialties: ["Rock", "Pop", "Acoustic", "Songwriting"],
      bio: "Contemporary guitarist focused on popular music and songwriting techniques.",
      image: "/placeholder.svg?height=100&width=100",
      availability: ["Tuesday", "Thursday", "Saturday", "Sunday"],
      price: 45,
    },
  ],
}

const lessonTypes = [
  {
    id: "trial",
    name: "Trial Lesson",
    duration: "30 min",
    description: "Perfect for first-time students to try out lessons",
    discount: 50,
  },
  {
    id: "single",
    name: "Single Lesson",
    duration: "60 min",
    description: "One-time lesson for occasional practice",
    discount: 0,
  },
  {
    id: "package-4",
    name: "4-Lesson Package",
    duration: "60 min each",
    description: "Monthly package with weekly lessons",
    discount: 15,
  },
  {
    id: "package-12",
    name: "12-Lesson Package",
    duration: "60 min each",
    description: "Quarterly package for serious learners",
    discount: 25,
  },
]

const timeSlots = [
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

interface BookingData {
  instrument: string
  instructor: string
  lessonType: string
  date: Date | undefined
  time: string
  name: string
  email: string
  phone: string
  experience: string
  goals: string
  notes: string
}

function BookLessonForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const isInitializedRef = useRef(false)
  const isUpdatingUrlRef = useRef(false)

  const [bookingData, setBookingData] = useState<BookingData>({
    instrument: "drums",
    instructor: "",
    lessonType: "trial",
    date: undefined,
    time: "",
    name: "",
    email: "",
    phone: "",
    experience: "beginner",
    goals: "",
    notes: "",
  })

  // Инициализация из URL параметров только один раз
  useEffect(() => {
    if (isInitializedRef.current || isUpdatingUrlRef.current) return

    const instrumentParam = searchParams.get("instrument")
    const typeParam = searchParams.get("type")

    let needsUpdate = false
    const updates: Partial<BookingData> = {}

    // Проверяем инструмент
    if (instrumentParam && (instrumentParam === "guitar" || instrumentParam === "drums")) {
      if (bookingData.instrument !== instrumentParam) {
        updates.instrument = instrumentParam
        updates.instructor = "" // Сбрасываем инструктора при смене инструмента
        needsUpdate = true
      }
    }

    // Проверяем тип урока
    if (typeParam && ["trial", "single", "package-4", "package-12"].includes(typeParam)) {
      if (bookingData.lessonType !== typeParam) {
        updates.lessonType = typeParam
        needsUpdate = true
      }
    }

    if (needsUpdate) {
      setBookingData((prev) => ({ ...prev, ...updates }))
    }

    isInitializedRef.current = true
  }, [searchParams, bookingData.instrument, bookingData.lessonType])

  // Обновляем URL при изменении инструмента (только по действию пользователя)
  const handleInstrumentChange = useCallback(
    (instrument: string) => {
      if (isUpdatingUrlRef.current) return

      isUpdatingUrlRef.current = true

      // Обновляем состояние
      setBookingData((prev) => ({ ...prev, instrument, instructor: "" }))

      // Обновляем URL
      const params = new URLSearchParams(searchParams.toString())
      params.set("instrument", instrument)
      router.replace(`/book-lesson?${params.toString()}`, { scroll: false })

      // Сбрасываем флаг после небольшой задержки
      setTimeout(() => {
        isUpdatingUrlRef.current = false
      }, 100)
    },
    [router, searchParams],
  )

  const selectedInstructors = instructors[bookingData.instrument as keyof typeof instructors] || []
  const selectedInstructor = selectedInstructors.find((inst) => inst.id === bookingData.instructor)
  const selectedLessonType = lessonTypes.find((type) => type.id === bookingData.lessonType)

  const calculatePrice = useCallback(() => {
    if (!selectedInstructor || !selectedLessonType) return 0

    let basePrice = selectedInstructor.price
    if (selectedLessonType.id === "trial") {
      basePrice = basePrice * 0.5
    } else if (selectedLessonType.id === "package-4") {
      basePrice = basePrice * 4 * 0.85
    } else if (selectedLessonType.id === "package-12") {
      basePrice = basePrice * 12 * 0.75
    }

    return Math.round(basePrice)
  }, [selectedInstructor, selectedLessonType])

  const validateField = useCallback((name: string, value: any): boolean => {
    if (["name", "email", "phone", "instructor", "time"].includes(name)) {
      return value && value.toString().trim() !== ""
    }
    if (name === "date") {
      return value !== undefined
    }
    return true
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    const requiredFields = ["name", "email", "phone", "instructor", "date", "time"]

    requiredFields.forEach((field) => {
      const isFieldValid = validateField(field, bookingData[field as keyof BookingData])
      if (!isFieldValid) {
        newErrors[field] = true
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [bookingData, validateField])

  const handleChange = useCallback(
    (name: string, value: any) => {
      setBookingData((prev) => ({ ...prev, [name]: value }))

      // Очищаем ошибку для этого поля если оно стало валидным
      if (attemptedSubmit) {
        const isFieldValid = validateField(name, value)
        if (isFieldValid && errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: false }))
        }
      }
    },
    [attemptedSubmit, errors, validateField],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setAttemptedSubmit(true)

      if (!validateForm()) {
        toast({
          title: "Please fill in all required fields",
          description: "Complete the form to book your lesson.",
          variant: "destructive",
        })
        return
      }

      setIsSubmitting(true)

      toast({
        title: "Lesson Booked Successfully!",
        description: `Your ${selectedLessonType?.name} with ${selectedInstructor?.name} has been scheduled.`,
      })

      setTimeout(() => {
        setIsSubmitting(false)
        router.push("/")
      }, 2000)
    },
    [validateForm, toast, selectedLessonType, selectedInstructor, router],
  )

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Book Your {bookingData.instrument === "drums" ? "Drum" : "Guitar"} Lesson
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your instructor and lesson type to start your{" "}
          {bookingData.instrument === "drums" ? "drumming" : "guitar"} journey with us.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs value={bookingData.instrument} onValueChange={handleInstrumentChange} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="drums" className="flex items-center gap-2">
              <Drum className="h-4 w-4" />
              Drum Lessons
            </TabsTrigger>
            <TabsTrigger value="guitar" className="flex items-center gap-2">
              <Guitar className="h-4 w-4" />
              Guitar Lessons
            </TabsTrigger>
          </TabsList>

          <TabsContent value={bookingData.instrument} className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Левая колонка - Выбор инструктора и типа урока */}
              <div className="lg:col-span-2 space-y-6">
                {/* Выбор инструктора */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Choose Your Instructor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedInstructors.map((instructor) => (
                        <div
                          key={instructor.id}
                          className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-all",
                            bookingData.instructor === instructor.id
                              ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                              : "border-gray-200 hover:border-gray-300",
                            errors.instructor ? "border-red-500" : "",
                          )}
                          onClick={() => handleChange("instructor", instructor.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={instructor.image || "/placeholder.svg"} alt={instructor.name} />
                              <AvatarFallback>
                                {instructor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">{instructor.name}</h3>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {instructor.rating} ({instructor.reviews} reviews)
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{instructor.experience} experience</p>
                              <div className="flex flex-wrap gap-1">
                                {instructor.specialties.slice(0, 2).map((specialty) => (
                                  <Badge key={specialty} variant="secondary" className="text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-sm font-semibold text-yellow-600 mt-2">${instructor.price}/lesson</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Выбор типа урока */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Lesson Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lessonTypes.map((lessonType) => (
                        <div
                          key={lessonType.id}
                          className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-all",
                            bookingData.lessonType === lessonType.id
                              ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                              : "border-gray-200 hover:border-gray-300",
                          )}
                          onClick={() => handleChange("lessonType", lessonType.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{lessonType.name}</h3>
                            {lessonType.discount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                -{lessonType.discount}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{lessonType.duration}</p>
                          <p className="text-sm">{lessonType.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Дата и время */}
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Your Lesson</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !bookingData.date && "text-muted-foreground",
                                errors.date ? "border-red-500" : "",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {bookingData.date ? format(bookingData.date, "PPP") : "Select a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={bookingData.date}
                              onSelect={(date) => handleChange("date", date)}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Select value={bookingData.time} onValueChange={(value) => handleChange("time", value)}>
                          <SelectTrigger className={cn(errors.time ? "border-red-500" : "")}>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Личная информация */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          value={bookingData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className={cn(errors.name ? "border-red-500" : "")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={bookingData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={cn(errors.email ? "border-red-500" : "")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="Enter your phone"
                          value={bookingData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className={cn(errors.phone ? "border-red-500" : "")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select
                          value={bookingData.experience}
                          onValueChange={(value) => handleChange("experience", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="goals">Learning Goals</Label>
                        <Textarea
                          id="goals"
                          placeholder="What would you like to achieve? (e.g., learn specific songs, improve technique, etc.)"
                          value={bookingData.goals}
                          onChange={(e) => handleChange("goals", e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any special requirements or questions?"
                          value={bookingData.notes}
                          onChange={(e) => handleChange("notes", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Правая колонка - Сводка бронирования */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedInstructor && (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={selectedInstructor.image || "/placeholder.svg"}
                            alt={selectedInstructor.name}
                          />
                          <AvatarFallback>
                            {selectedInstructor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{selectedInstructor.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedInstructor.instrument} Instructor</p>
                        </div>
                      </div>
                    )}

                    {selectedLessonType && (
                      <div>
                        <p className="font-semibold">{selectedLessonType.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedLessonType.duration}</p>
                      </div>
                    )}

                    {bookingData.date && bookingData.time && (
                      <div>
                        <p className="font-semibold">{format(bookingData.date, "EEEE, MMMM d")}</p>
                        <p className="text-sm text-muted-foreground">at {bookingData.time}</p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-yellow-600">${calculatePrice()}</span>
                      </div>
                      {selectedLessonType?.discount && selectedLessonType.discount > 0 && (
                          <p className="text-sm text-green-600">{selectedLessonType.discount}% discount applied!</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSubmit}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Booking..." : "Book Lesson"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function BookLessonPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 px-4">Loading lesson booking...</div>}>
      <BookLessonForm />
    </Suspense>
  )
}
