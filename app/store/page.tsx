"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Search, Filter, SlidersHorizontal } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useScrollPosition } from "@/hooks/use-scroll-position"

// Mock product data
const products = [
  {
    id: "drum-sticks-1",
    name: "Professional Drum Sticks",
    price: 19.99,
    category: "accessories",
    image: "https://images.pexels.com/photos/8412414/pexels-photo-8412414.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "High-quality hickory drum sticks for professional drummers.",
  },
  {
    id: "practice-pad-1",
    name: "Silent Practice Pad",
    price: 34.99,
    category: "accessories",
    image: "https://images.pexels.com/photos/7095517/pexels-photo-7095517.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "Double-sided practice pad for quiet drumming practice.",
  },
  {
    id: "drum-kit-beginner",
    name: "Beginner Drum Kit",
    price: 399.99,
    category: "drums",
    image: "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "Complete 5-piece drum kit perfect for beginners.",
  },
  {
    id: "drum-kit-pro",
    name: "Professional Drum Kit",
    price: 1299.99,
    category: "drums",
    image: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=300",
    description: "Premium 7-piece drum kit with hardware and cymbals.",
  },
  {
    id: "acoustic-guitar-1",
    name: "Acoustic Guitar",
    price: 249.99,
    category: "guitars",
    image: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=compress&cs=tinysrgb&w=300",
    description: "Full-size acoustic guitar with solid spruce top.",
  },
  {
    id: "electric-guitar-1",
    name: "Electric Guitar",
    price: 399.99,
    category: "guitars",
    image: "https://images.pexels.com/photos/5089118/pexels-photo-5089118.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "Versatile electric guitar for various music styles.",
  },
  {
    id: "guitar-strings-1",
    name: "Guitar String Set",
    price: 12.99,
    category: "accessories",
    image: "https://images.pexels.com/photos/5089152/pexels-photo-5089152.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "Premium light gauge guitar strings for acoustic guitars.",
  },
  {
    id: "guitar-picks-1",
    name: "Guitar Pick Set",
    price: 7.99,
    category: "accessories",
    image: "https://images.pexels.com/photos/8412414/pexels-photo-8412414.jpeg?auto=compress&cs=tinysrgb&w=300",
    description: "Set of 12 guitar picks in various thicknesses.",
  },
]

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("featured")
  const { addItem } = useCart()
  const { toast } = useToast()
  const { saveScrollPosition } = useScrollPosition()

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || product.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-low") return a.price - b.price
    if (sortOrder === "price-high") return b.price - a.price
    if (sortOrder === "name-asc") return a.name.localeCompare(b.name)
    // Default: featured - no specific sorting
    return 0
  })

  const handleAddToCart = (product: (typeof products)[0]) => {
    // Сохраняем позицию прокрутки перед добавлением товара
    saveScrollPosition()

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      type: "product",
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Music Store</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Filter products by category and price range</SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={activeCategory === "all" ? "default" : "outline"}
                      onClick={() => setActiveCategory("all")}
                      className={activeCategory === "all" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                    >
                      All
                    </Button>
                    <Button
                      variant={activeCategory === "drums" ? "default" : "outline"}
                      onClick={() => setActiveCategory("drums")}
                      className={activeCategory === "drums" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                    >
                      Drums
                    </Button>
                    <Button
                      variant={activeCategory === "guitars" ? "default" : "outline"}
                      onClick={() => setActiveCategory("guitars")}
                      className={activeCategory === "guitars" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                    >
                      Guitars
                    </Button>
                    <Button
                      variant={activeCategory === "accessories" ? "default" : "outline"}
                      onClick={() => setActiveCategory("accessories")}
                      className={activeCategory === "accessories" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                    >
                      Accessories
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-price" className="text-xs">
                        Min Price
                      </Label>
                      <Input id="min-price" type="number" placeholder="$0" />
                    </div>
                    <div>
                      <Label htmlFor="max-price" className="text-xs">
                        Max Price
                      </Label>
                      <Input id="max-price" type="number" placeholder="$2000" />
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Sort By</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="drums">Drums</TabsTrigger>
          <TabsTrigger value="guitars">Guitars</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
        </TabsList>
      </Tabs>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setActiveCategory("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              saveScrollPosition={saveScrollPosition}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({
  product,
  onAddToCart,
  saveScrollPosition,
}: {
  product: (typeof products)[0]
  onAddToCart: () => void
  saveScrollPosition: () => void
}) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
      </div>
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{product.name}</h3>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
        <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/store/${product.id}`} onClick={() => saveScrollPosition()}>
            Details
          </Link>
        </Button>
        <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={onAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}
