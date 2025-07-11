"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from './ThemeToggle'
import { 
  LayoutDashboard, 
  Calendar, 
  History, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Store,
  Package,
  ShoppingCart
} from "lucide-react"

interface AdminLayoutContentProps {
  children: React.ReactNode
}

export default function AdminLayoutContent({ children }: AdminLayoutContentProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Rooms', href: '/admin/rooms', icon: Settings },
    { name: 'Store', href: '/admin/store', icon: Store },
    { name: 'Rental', href: '/admin/rental', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'History', href: '/admin/history', icon: History },
    { name: 'Statistics', href: '/admin/statistics', icon: BarChart3 },
  ]

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: 'Logged out',
          description: 'You have successfully logged out',
        })
        router.push('/admin/login')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex transition-colors">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center justify-between px-4">
              <h1 className="text-lg font-semibold text-card-foreground">Admin Panel</h1>
              <ThemeToggle />
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-card border-r border-border">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-between flex-shrink-0 px-4">
                <h1 className="text-lg font-semibold text-card-foreground">Admin Panel</h1>
                <ThemeToggle />
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-border p-4">
              <div className="flex flex-col w-full space-y-2">
                <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                  <Home className="mr-2 h-4 w-4" />
                  To website
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-card shadow lg:hidden">
          <button
            type="button"
            className="px-4 border-r border-border text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}