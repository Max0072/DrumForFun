"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Store,
  Plus, 
  Search, 
  Edit,
  Trash2,
  Package,
  DollarSign,
  Image as ImageIcon,
  Eye,
  EyeOff
} from "lucide-react"
import { useLanguage } from '@/components/admin/LanguageProvider'

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

export default function AdminStoreContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()
  const { t } = useLanguage()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    inStock: '',
    imageUrl: '',
    isActive: true
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, categoryFilter, statusFilter])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.products)
      } else {
        toast({
          title: t.common.error,
          description: t.store.loadErrorDesc,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(t.store.loadError, error)
      toast({
        title: t.common.error,
        description: t.store.loadErrorDesc,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => 
        statusFilter === 'active' ? product.isActive : !product.isActive
      )
    }

    setFilteredProducts(filtered)
  }

  const categories = [...new Set(products.map(product => product.category))].filter(Boolean)

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price.toString(),
        inStock: product.inStock.toString(),
        imageUrl: product.imageUrl || '',
        isActive: product.isActive
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        inStock: '',
        imageUrl: '',
        isActive: true
      })
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      inStock: '',
      imageUrl: '',
      isActive: true
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      inStock: parseInt(formData.inStock),
      imageUrl: formData.imageUrl || undefined,
      isActive: formData.isActive
    }

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: t.common.success,
          description: editingProduct 
            ? t.store.updateSuccess
            : t.store.addSuccess,
        })
        closeDialog()
        fetchProducts()
      } else {
        toast({
          title: t.common.error,
          description: result.error || t.store.saveError,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.store.saveErrorDesc,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm(t.store.deleteConfirm)) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: t.common.success,
          description: t.store.deleteSuccess,
        })
        fetchProducts()
      } else {
        toast({
          title: t.common.error,
          description: result.error || t.store.deleteError,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.store.deleteErrorDesc,
        variant: "destructive",
      })
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: t.common.success,
          description: t.store.statusChangeSuccess.replace('{status}', !currentStatus ? t.store.activated : t.store.deactivated),
        })
        fetchProducts()
      } else {
        toast({
          title: t.common.error,
          description: t.store.statusChangeError,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.store.statusChangeError,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.store.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.store.description}
          </p>
        </div>
        <Button onClick={() => openDialog()} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="mr-2 h-4 w-4" />
          {t.store.addProduct}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t.store.searchAndFilters}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t.store.searchLabel}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.store.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.store.categoryLabel}</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.store.allCategories}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {t.store.productsFound}: {filteredProducts.length}
          </div>
        </CardContent>
      </Card>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t.store.noProductsFound}</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className={`${!product.isActive ? 'opacity-60' : ''}`}>
              <div className="aspect-video relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-t-lg flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold truncate text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProductStatus(product.id, product.isActive)}
                    >
                      {product.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">{t.store.price} ${product.price}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{t.store.inStock}: {product.inStock}</span>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? t.store.active : t.store.hidden}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? t.store.editProduct : t.store.addNewProduct}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? t.store.editProductDesc : t.store.addProductDesc}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.store.productName}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">{t.store.priceLabel}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inStock">{t.store.quantityInStock}</Label>
                <Input
                  id="inStock"
                  type="number"
                  min="0"
                  value={formData.inStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">{t.store.imageUrlOptional}</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
              />
              <Label htmlFor="isActive">{t.store.productActiveDesc}</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                {t.common.cancel}
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                {editingProduct ? t.store.saveChanges : t.store.addNewProduct}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}