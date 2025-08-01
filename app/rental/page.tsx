"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ShoppingCart, CalendarIcon, X, Copy, Search, Package } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"

interface RentalItem {
  id: string
  name: string
  description: string
  pricePerDay: number
  category: string
  inStock: number
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

type SelectedEquipment = {
  equipment: RentalItem
  dates: Date[]
}

export default function RentalPage() {
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState<SelectedEquipment[]>([])
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    fetchRentalItems()
  }, [])

  const fetchRentalItems = async () => {
    try {
      const response = await fetch('/api/rental-items')
      const result = await response.json()
      
      if (result.success) {
        setRentalItems(result.items)
      } else {
        toast({
          title: "Error",
          description: "Failed to load rental items",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading rental items:', error)
      toast({
        title: "Error",
        description: "An error occurred while loading rental items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredEquipment = rentalItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Получаем уникальные категории из товаров
  const categories = [...new Set(rentalItems.map(item => item.category))].filter(Boolean)

  const handleEquipmentToggle = (equipment: RentalItem, checked: boolean) => {
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
        description: "Please select at least one item for rental.",
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
        title: "No dates selected",
        description: "Please select dates for all equipment.",
        variant: "destructive",
      })
      return
    }

    // Добавляем каждый товар в корзину
    selectedEquipment.forEach((item) => {
      const totalDays = item.dates.length
      const totalPrice = item.equipment.pricePerDay * totalDays

      addItem({
        id: `${item.equipment.id}-${item.dates.map((d) => d.toISOString()).join("-")}`,
        name: `${item.equipment.name} (${totalDays} ${totalDays === 1 ? "day" : "days"})`,
        price: totalPrice,
        quantity: 1,
        image: item.equipment.imageUrl || "/placeholder.svg",
        type: "rental",
      })
    })

    toast({
      title: "Added to cart",
      description: `${selectedEquipment.length} ${selectedEquipment.length === 1 ? "item" : "items"} added to cart.`,
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
      return total + item.equipment.pricePerDay * item.dates.length
    }, 0)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Equipment Rental</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Card className="animate-pulse">
              <div className="h-64 bg-gray-200"></div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Equipment Rental</h1>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Select multiple pieces of equipment and specify rental dates. Perfect for events, rehearsals,
        or performances.
      </p>

      {/* Поиск */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search equipment..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="w-full max-w-fit mx-auto grid" style={{gridTemplateColumns: `repeat(${categories.length + 1}, minmax(0, 1fr))`}}>
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {filteredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Equipment not found</h2>
              <p className="text-muted-foreground mb-4">Try changing your search criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEquipment.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg",
                    isEquipmentSelected(item.id) 
                      ? "border-yellow-500 shadow-md bg-yellow-50 dark:bg-yellow-950/20 ring-2 ring-yellow-200" 
                      : "hover:border-gray-300",
                    item.inStock === 0 && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (item.inStock > 0) {
                      handleEquipmentToggle(item, !isEquipmentSelected(item.id))
                    }
                  }}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 pointer-events-none">
                      <Checkbox
                        checked={isEquipmentSelected(item.id)}
                        className="bg-white border-2 pointer-events-none"
                        disabled={item.inStock === 0}
                      />
                    </div>
                    {item.inStock <= 2 && item.inStock > 0 && (
                      <Badge className="absolute top-2 left-2 bg-orange-500">
                        {item.inStock} left
                      </Badge>
                    )}
                    {item.inStock === 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Out of stock
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${item.pricePerDay}/day</p>
                        <Badge variant="secondary" className="text-xs">
                          In stock: {item.inStock}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Общий выбор дат */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select rental dates
              </CardTitle>
              <CardDescription>Specify the dates when you need the equipment</CardDescription>
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
                        {format(date, "dd MMM")}
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
                <CardTitle>Selected equipment</CardTitle>
                <CardDescription>Manage dates for each item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedEquipment.map((item, index) => (
                  <div key={item.equipment.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 overflow-hidden rounded">
                          <Image
                            src={item.equipment.imageUrl || "/placeholder.svg"}
                            alt={item.equipment.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.equipment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${item.equipment.pricePerDay}/day × {item.dates.length} {item.dates.length === 1 ? "day" : "days"} = $
                            {item.equipment.pricePerDay * item.dates.length}
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
                          {format(date, "dd MMM")}
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
                  Add all to cart
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-16 bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Select equipment</h3>
            <p className="text-sm text-muted-foreground">Choose multiple items using checkboxes</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Specify dates</h3>
            <p className="text-sm text-muted-foreground">Select specific dates when you need the equipment</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Add to cart</h3>
            <p className="text-sm text-muted-foreground">Review and add all items to cart simultaneously</p>
          </div>
        </div>
      </div>
    </div>
  )
}
