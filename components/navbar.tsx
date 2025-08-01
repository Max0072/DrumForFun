"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, Music, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"

const routes = [
  { href: "/", label: "Home" },
  { href: "/booking", label: "Booking" },
  // { href: "/lessons", label: "Lessons" },
  { href: "/store", label: "Store" },
  { href: "/rental", label: "Rental" },
  // { href: "/drum-show", label: "Drum Show" },
  { href: "/about", label: "About Us" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { items } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Music className="h-6 w-6 text-yellow-500" />
                  <span className="font-bold text-xl">DrumForFun</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="mt-8 flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-yellow-500",
                      pathname === route.href ? "text-yellow-500" : "text-muted-foreground",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Music className="h-6 w-6 text-yellow-500" />
            <span className="font-bold text-xl hidden md:inline-block">DrumForFun</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-yellow-500",
                pathname === route.href ? "text-yellow-500" : "text-muted-foreground",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-yellow-500 text-black">
                  {items.length}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>
          </Link>
          <Button asChild size="sm" className="hidden md:flex bg-yellow-500 hover:bg-yellow-600 text-black">
            <Link href="/booking">Book Now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
