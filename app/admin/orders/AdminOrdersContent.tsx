"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { 
  ShoppingCart,
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  Package,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import { format } from "date-fns"
import { useLanguage } from '@/components/admin/LanguageProvider'

interface Order {
  id: string
  orderCode: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  notes?: string
  items: string // JSON string
  totalPrice: number
  status: 'pending' | 'ready' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt?: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  type: 'product' | 'rental'
}

export default function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const result = await response.json()
      
      if (result.success) {
        setOrders(result.orders)
      }
    } catch (error) {
      console.error(t.orders.loadError, error)
      toast({
        title: t.common.error,
        description: t.orders.loadErrorDesc,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order => 
        order.orderCode.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term)
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'ready' | 'completed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: t.common.success,
          description: t.orders.statusChangeSuccess.replace('{status}', getStatusText(status)),
        })
        fetchOrders()
      } else {
        toast({
          title: t.common.error,
          description: result.error || t.orders.statusChangeError,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.orders.statusChangeErrorDesc,
        variant: "destructive",
      })
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t.orders.processing
      case 'ready': return t.orders.readyForPickup
      case 'completed': return t.orders.completed
      case 'cancelled': return t.orders.cancelled
      default: return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'ready': return 'default'
      case 'completed': return 'default'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  const parseItems = (itemsJson: string): CartItem[] => {
    try {
      return JSON.parse(itemsJson)
    } catch {
      return []
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.orders.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.orders.description}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t.orders.searchAndFilters}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.orders.searchLabel}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.orders.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.orders.statusLabel}</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.orders.allStatuses}</SelectItem>
                  <SelectItem value="pending">{t.orders.processing}</SelectItem>
                  <SelectItem value="ready">{t.orders.readyForPickup}</SelectItem>
                  <SelectItem value="completed">{t.orders.completed}</SelectItem>
                  <SelectItem value="cancelled">{t.orders.cancelled}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {t.orders.ordersFound}: {filteredOrders.length}
          </div>
        </CardContent>
      </Card>

      {/* Order list */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t.orders.noOrdersFound}</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const items = parseItems(order.items)
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{t.orders.orderNumber}{order.orderCode}</CardTitle>
                        <Badge variant={getStatusVariant(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')} • {order.customerName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {t.orders.details}
                      </Button>
                      {order.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Package className="h-4 w-4 mr-1" />
                            {t.orders.ready}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {t.orders.cancel}
                          </Button>
                        </>
                      )}
                      {order.status === 'ready' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t.orders.complete}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{items.length} item(s)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Order details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {t.orders.orderNumber}{selectedOrder?.orderCode}
            </DialogTitle>
            <DialogDescription>
              {t.orders.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.orders.customerInformation}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm text-foreground">{selectedOrder.customerAddress}</span>
                    </div>
                    {selectedOrder.notes && (
                      <div className="mt-3 p-3 bg-muted rounded">
                        <p className="text-sm font-medium text-foreground">Comments:</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.orders.orderDetails}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.orders.orderCode}</span>
                      <span className="font-mono font-semibold text-foreground">{selectedOrder.orderCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.orders.status}</span>
                      <Badge variant={getStatusVariant(selectedOrder.status)}>
                        {getStatusText(selectedOrder.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.orders.createdDate}</span>
                      <span className="text-foreground">{format(new Date(selectedOrder.createdAt), 'dd.MM.yyyy HH:mm')}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-foreground">{t.orders.total}</span>
                      <span className="text-foreground">${selectedOrder.totalPrice.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.orders.orderedItems}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {parseItems(selectedOrder.items).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{t.orders.quantity} {item.quantity}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.type === 'rental' ? t.orders.rental : t.orders.purchase}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price}/{t.orders.each}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}