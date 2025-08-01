"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Trash, MinusCircle, PlusCircle, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useScrollPosition } from "@/hooks/use-scroll-position"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const { saveScrollPosition } = useScrollPosition()

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "drumfun10") {
      const discountAmount = totalPrice * 0.1
      setDiscount(discountAmount)
      toast({
        title: "Coupon applied",
        description: "10% discount has been applied to your order.",
      })
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is invalid or expired.",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = () => {
    // Redirect to checkout page instead of clearing cart
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Link href="/store">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        ${item.price.toFixed(2)} {item.type === "rental" ? "" : "each"}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.type === "rental"}
                          >
                            <MinusCircle className="h-4 w-4" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.type === "rental"}
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/store" className="flex items-center gap-2" onClick={() => saveScrollPosition("/cart")}>
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button variant="destructive" onClick={clearCart}>
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-yellow-500">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(totalPrice * 0.07).toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(totalPrice - discount + totalPrice * 0.07).toFixed(2)}</span>
                </div>

                <div className="pt-4">
                  <Label htmlFor="coupon" className="mb-2 block">
                    Coupon Code
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                    />
                    <Button onClick={handleApplyCoupon}>Apply</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Try "DRUMFUN10" for 10% off</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleCheckout}>
                Continue to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
