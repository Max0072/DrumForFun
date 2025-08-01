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
  Package,
  Plus, 
  Search, 
  Edit,
  Trash2,
  DollarSign,
  Image as ImageIcon,
  Eye,
  EyeOff
} from "lucide-react"
import { useLanguage } from '@/components/admin/LanguageProvider'

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

export default function AdminRentalContent() {
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([])
  const [filteredItems, setFilteredItems] = useState<RentalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RentalItem | null>(null)
  const { toast } = useToast()
  const { t } = useLanguage()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    pricePerDay: '',
    inStock: '',
    imageUrl: '',
    isActive: true
  })

  useEffect(() => {
    fetchRentalItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [rentalItems, searchTerm, categoryFilter, statusFilter])

  const fetchRentalItems = async () => {
    try {
      const response = await fetch('/api/admin/rental')
      const result = await response.json()
      
      if (result.success) {
        setRentalItems(result.items)
      } else {
        toast({
          title: t.common.error,
          description: t.rental.loadErrorDesc,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(t.rental.loadError, error)
      toast({
        title: t.common.error,
        description: t.rental.loadErrorDesc,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = rentalItems

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        statusFilter === 'active' ? item.isActive : !item.isActive
      )
    }

    setFilteredItems(filtered)
  }

  const categories = [...new Set(rentalItems.map(item => item.category))].filter(Boolean)

  const openDialog = (item?: RentalItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description,
        pricePerDay: item.pricePerDay.toString(),
        inStock: item.inStock.toString(),
        imageUrl: item.imageUrl || '',
        isActive: item.isActive
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: '',
        category: '',
        description: '',
        pricePerDay: '',
        inStock: '',
        imageUrl: '',
        isActive: true
      })
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({
      name: '',
      category: '',
      description: '',
      pricePerDay: '',
      inStock: '',
      imageUrl: '',
      isActive: true
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const itemData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      pricePerDay: parseFloat(formData.pricePerDay),
      inStock: parseInt(formData.inStock),
      imageUrl: formData.imageUrl || undefined,
      isActive: formData.isActive
    }

    try {
      const url = editingItem ? `/api/admin/rental/${editingItem.id}` : '/api/admin/rental'
      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: t.common.success,
          description: editingItem 
            ? t.rental.updateSuccess
            : t.rental.addSuccess,
        })
        closeDialog()
        fetchRentalItems()
      } else {
        toast({
          title: t.common.error,
          description: result.error || t.rental.saveError,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.rental.saveErrorDesc,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm(t.rental.deleteConfirm)) return

    try {
      const response = await fetch(`/api/admin/rental/${itemId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: t.common.success,
          description: t.rental.deleteSuccess,
        })
        fetchRentalItems()
      } else {
        toast({
          title: t.common.error,
          description: result.error || t.rental.deleteError,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.rental.deleteErrorDesc,
        variant: "destructive",
      })
    }
  }

  const toggleItemStatus = async (itemId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/rental/${itemId}`, {
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
          description: t.rental.statusChangeSuccess.replace('{status}', !currentStatus ? t.rental.activated : t.rental.deactivated),
        })
        fetchRentalItems()
      } else {
        toast({
          title: t.common.error,
          description: t.rental.statusChangeError,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.rental.statusChangeError,
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
          <h1 className="text-2xl font-bold text-foreground">{t.rental.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.rental.description}
          </p>
        </div>
        <Button onClick={() => openDialog()} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="mr-2 h-4 w-4" />
          {t.rental.addRentalItem}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t.rental.searchAndFilters}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t.rental.searchLabel}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.rental.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.rental.categoryLabel}</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.rental.allCategories}</SelectItem>
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
            {t.rental.itemsFound}: {filteredItems.length}
          </div>
        </CardContent>
      </Card>

      {/* Items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t.rental.noItemsFound}</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className={`${!item.isActive ? 'opacity-60' : ''}`}>
              <div className="aspect-video relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
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
                    <h3 className="font-semibold truncate text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleItemStatus(item.id, item.isActive)}
                    >
                      {item.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">{t.rental.pricePerDay} ${item.pricePerDay}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{t.rental.inStock}: {item.inStock}</span>
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? t.rental.active : t.rental.hidden}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t.rental.editItem : t.rental.addNewItem}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? t.rental.editItemDesc : t.rental.addItemDesc}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.rental.itemName}</Label>
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
                <Label htmlFor="pricePerDay">{t.rental.priceLabel}</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inStock">{t.rental.quantityInStock}</Label>
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
              <Label htmlFor="imageUrl">{t.rental.imageUrlOptional}</Label>
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
              <Label htmlFor="isActive">{t.rental.itemActiveDesc}</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                {t.common.cancel}
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                {editingItem ? t.rental.saveChanges : t.rental.addNewItem}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}