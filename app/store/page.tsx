"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingCart, Search, Filter, SlidersHorizontal, Package } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useScrollPosition } from "@/hooks/use-scroll-position"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: number
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("featured")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const { addItem } = useCart()
  const { toast } = useToast()
  const { saveScrollPosition } = useScrollPosition()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.products)
      } else {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error)
      toast({
        title: "Error",
        description: "An error occurred while loading products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || product.category === activeCategory
    
    // Фильтрация по цене
    const min = minPrice ? parseFloat(minPrice) : 0
    const max = maxPrice ? parseFloat(maxPrice) : Infinity
    const matchesPrice = product.price >= min && product.price <= max

    return matchesSearch && matchesCategory && matchesPrice
  })

  // Получаем уникальные категории из товаров
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "price-low") return a.price - b.price
    if (sortOrder === "price-high") return b.price - a.price
    if (sortOrder === "name-asc") return a.name.localeCompare(b.name)
    // Default: featured - no specific sorting
    return 0
  })

  const handleAddToCart = (product: Product) => {
    // Сохраняем позицию прокрутки перед добавлением товара
    saveScrollPosition()

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.imageUrl || "/placeholder.svg",
      type: "product",
    })

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart.`,
    })
  }

  const applyPriceFilter = () => {
    // Фильтрация уже происходит автоматически через filteredProducts
    toast({
      title: "Filters applied",
      description: "Products filtered by selected criteria",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Music Store</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
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
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={activeCategory === category ? "default" : "outline"}
                        onClick={() => setActiveCategory(category)}
                        className={activeCategory === category ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-price" className="text-xs">
                        Min. price
                      </Label>
                      <Input 
                        id="min-price" 
                        type="number" 
                        placeholder="$0" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-price" className="text-xs">
                        Max. price
                      </Label>
                      <Input 
                        id="max-price" 
                        type="number" 
                        placeholder="$2000" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={applyPriceFilter}
                >
                  Apply Filters
                </Button>
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
        <TabsList className="w-full max-w-fit mx-auto grid" style={{gridTemplateColumns: `repeat(${categories.length + 1}, minmax(0, 1fr))`}}>
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-4">Try changing your search or filter criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setActiveCategory("all")
              setMinPrice("")
              setMaxPrice("")
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
  product: Product
  onAddToCart: () => void
  saveScrollPosition: () => void
}) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square">
        <Image 
          src={product.imageUrl || "/placeholder.svg"} 
          alt={product.name} 
          fill 
          className="object-cover" 
        />
        {product.inStock <= 5 && product.inStock > 0 && (
          <Badge className="absolute top-2 right-2 bg-orange-500">
            {product.inStock} left
          </Badge>
        )}
        {product.inStock === 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            Out of stock
          </Badge>
        )}
      </div>
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{product.name}</h3>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
          <Badge variant="secondary" className="text-xs">
            In stock: {product.inStock}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/store/${product.id}`} onClick={() => saveScrollPosition()}>
            Details
          </Link>
        </Button>
        <Button 
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black" 
          onClick={onAddToCart}
          disabled={product.inStock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock === 0 ? 'Out of stock' : 'Add to cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
