"use client"

import { useState } from "react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, CalendarIcon, X, Copy } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"

// Mock rental equipment data
const rentalEquipment = [
  {
    id: "drum-kit-rental",
    name: "Professional Drum Kit",
    price: 75,
    category: "drums",
    image: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "Complete 7-piece drum kit with hardware and cymbals.",
  },
  {
    id: "electronic-kit-rental",
    name: "Electronic Drum Kit",
    price: 60,
    category: "drums",
    image: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=300",
    description: "Professional electronic drum kit with headphones.",
  },
  {
    id: "acoustic-guitar-rental",
    name: "Acoustic Guitar",
    price: 25,
    category: "guitars",
    image: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=300",
    description: "Full-size acoustic guitar with case.",
  },
  {
    id: "electric-guitar-rental",
    name: "Electric Guitar",
    price: 35,
    category: "guitars",
    image: "https://images.pexels.com/photos/5089118/pexels-photo-5089118.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "Electric guitar with amplifier and accessories.",
  },
  {
    id: "bass-guitar-rental",
    name: "Bass Guitar",
    price: 30,
    category: "guitars",
    image: "https://images.pexels.com/photos/5089152/pexels-photo-5089152.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "4-string bass guitar with amplifier.",
  },
  {
    id: "pa-system-rental",
    name: "PA System",
    price: 100,
    category: "sound",
    image: "https://images.pexels.com/photos/8412414/pexels-photo-8412414.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "Complete PA system with speakers, mixer, and microphones.",
  },
  {
    id: "keyboard-rental",
    name: "Professional Keyboard",
    price: 45,
    category: "keyboards",
    image: "https://images.pexels.com/photos/7095517/pexels-photo-7095517.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "88-key weighted keyboard with stand.",
  },
  {
    id: "dj-equipment-rental",
    name: "DJ Equipment",
    price: 120,
    category: "sound",
    image: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=300",
    description: "Complete DJ setup with controller, speakers, and lights.",
  },
]

type SelectedEquipment = {
  equipment: (typeof rentalEquipment)[0]
  dates: Date[]
}

export default function RentalPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState<SelectedEquipment[]>([])
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const { addItem } = useCart()
  const { toast } = useToast()

  const filteredEquipment = rentalEquipment.filter((item) => {
    return activeCategory === "all" || item.category === activeCategory
  })

  const handleEquipmentToggle = (equipment: (typeof rentalEquipment)[0], checked: boolean) => {
    if (checked) {
      setSelectedEquipment((prev) => [...prev, { equipment, dates: [...selectedDates] }])
    } else {
      setSelectedEquipment((prev) => prev.filter((item) => item.equipment.id !== equipment.id))
    }
  }

  const handleDateSelection = (dates: Date[] | undefined) => {
    const newDates = dates || []
    setSelectedDates(newDates)

    // Обновляем даты для всех выбранных товаров
    setSelectedEquipment((prev) => prev.map((item) => ({ ...item, dates: [...newDates] })))
  }

  const handleIndividualDateChange = (equipmentId: string, dates: Date[]) => {
    setSelectedEquipment((prev) => prev.map((item) => (item.equipment.id === equipmentId ? { ...item, dates } : item)))
  }

  const copyDatesToAll = (dates: Date[]) => {
    setSelectedDates(dates)
    setSelectedEquipment((prev) => prev.map((item) => ({ ...item, dates: [...dates] })))
  }

  const removeEquipment = (equipmentId: string) => {
    setSelectedEquipment((prev) => prev.filter((item) => item.equipment.id !== equipmentId))
  }

  const handleAddToCart = () => {
    if (selectedEquipment.length === 0) {
      toast({
        title: "No equipment selected",
        description: "Please select at least one piece of equipment.",
        variant: "destructive",
      })
      return
    }

    let hasEmptyDates = false
    selectedEquipment.forEach((item) => {
      if (item.dates.length === 0) {
        hasEmptyDates = true
      }
    })

    if (hasEmptyDates) {
      toast({
        title: "Missing dates",
        description: "Please select dates for all equipment.",
        variant: "destructive",
      })
      return
    }

    // Добавляем каждый товар в корзину
    selectedEquipment.forEach((item) => {
      const totalDays = item.dates.length
      const totalPrice = item.equipment.price * totalDays

      addItem({
        id: `${item.equipment.id}-${item.dates.map((d) => d.toISOString()).join("-")}`,
        name: `${item.equipment.name} (${totalDays} day${totalDays > 1 ? "s" : ""})`,
        price: totalPrice,
        quantity: 1,
        image: item.equipment.image,
        type: "rental",
      })
    })

    toast({
      title: "Added to cart",
      description: `${selectedEquipment.length} item${selectedEquipment.length > 1 ? "s" : ""} added to your cart.`,
    })

    // Сброс выбора
    setSelectedEquipment([])
    setSelectedDates([])
  }

  const isEquipmentSelected = (equipmentId: string) => {
    return selectedEquipment.some((item) => item.equipment.id === equipmentId)
  }

  const getTotalPrice = () => {
    return selectedEquipment.reduce((total, item) => {
      return total + item.equipment.price * item.dates.length
    }, 0)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Equipment Rental</h1>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Select multiple pieces of equipment and choose specific dates for your rental. Perfect for events, practice
        sessions, or performances.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="w-full grid grid-cols-4 md:grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="drums">Drums</TabsTrigger>
              <TabsTrigger value="guitars">Guitars</TabsTrigger>
              <TabsTrigger value="sound">Sound</TabsTrigger>
              <TabsTrigger value="keyboards">Keyboards</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEquipment.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "transition-all",
                  isEquipmentSelected(item.id) ? "border-yellow-500 shadow-md bg-yellow-50 dark:bg-yellow-950/20" : "",
                )}
              >
                <div className="relative aspect-video">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Checkbox
                      checked={isEquipmentSelected(item.id)}
                      onCheckedChange={(checked) => handleEquipmentToggle(item, checked as boolean)}
                      className="bg-white border-2"
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="font-bold">${item.price}/day</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Общий выбор дат */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Rental Dates
              </CardTitle>
              <CardDescription>Choose specific dates when you need the equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={handleDateSelection}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
              {selectedDates.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Selected dates:</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedDates.map((date, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {format(date, "MMM dd")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Выбранное оборудование */}
          {selectedEquipment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Equipment</CardTitle>
                <CardDescription>Manage dates for each item individually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedEquipment.map((item, index) => (
                  <div key={item.equipment.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 overflow-hidden rounded">
                          <Image
                            src={item.equipment.image || "/placeholder.svg"}
                            alt={item.equipment.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.equipment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${item.equipment.price}/day × {item.dates.length} days = $
                            {item.equipment.price * item.dates.length}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyDatesToAll(item.dates)}
                          className="h-8 w-8 p-0"
                          title="Copy dates to all items"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeEquipment(item.equipment.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.dates.map((date, dateIndex) => (
                        <Badge key={dateIndex} variant="outline" className="text-xs">
                          {format(date, "MMM dd")}
                        </Badge>
                      ))}
                    </div>

                    {index < selectedEquipment.length - 1 && <Separator />}
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">${getTotalPrice()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={handleAddToCart}
                  disabled={selectedEquipment.length === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add All to Cart
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-16 bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Select Equipment</h3>
            <p className="text-sm text-muted-foreground">Choose multiple items using checkboxes</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Pick Dates</h3>
            <p className="text-sm text-muted-foreground">Select specific dates when you need the equipment</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Add to Cart</h3>
            <p className="text-sm text-muted-foreground">Review and add everything to your cart at once</p>
          </div>
        </div>
      </div>
    </div>
  )
}
