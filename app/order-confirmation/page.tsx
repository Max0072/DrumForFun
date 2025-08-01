"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Mail, MapPin, Phone, ArrowLeft } from "lucide-react"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderCode = searchParams.get("code")

  if (!orderCode) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-4">Order code not specified</p>
          <Button asChild>
            <Link href="/store">Return to store</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order placed successfully!</h1>
          <p className="text-muted-foreground">Thank you for your order. We've sent a confirmation to your email.</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
            <CardDescription>
              Save your order code for item pickup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="text-sm text-green-700 font-medium">Your pickup code</p>
                  <p className="text-2xl font-bold text-green-800">{orderCode}</p>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  Being prepared
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Email notification</p>
                    <p className="text-sm text-muted-foreground">Confirmation sent with order details</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Order preparation</p>
                    <p className="text-sm text-muted-foreground">Our staff is preparing your order</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Pickup Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Wait for notification</p>
                    <p className="text-sm text-muted-foreground">We'll notify you when your order is ready for pickup</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Come to the school</p>
                    <p className="text-sm text-muted-foreground">Visit our music school with your order code</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Collect your order</p>
                    <p className="text-sm text-muted-foreground">Present code {orderCode} and receive your items</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                <h4 className="font-medium text-blue-900 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Address: [Specify music school address]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone: [Specify phone number]</span>
                  </div>
                  <p>Opening hours: [Specify opening hours]</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/store">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue shopping
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              Return to homepage
            </Link>
          </Button>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-8">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Important</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Save your order code: <strong>{orderCode}</strong></li>
            <li>• Check your email for detailed information</li>
            <li>• Order is valid for 30 days</li>
            <li>• Contact us if you have any questions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-10 px-4">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading order...</h2>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}