"use client"

import { usePathname } from 'next/navigation'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ClientScrollToTop } from "@/components/client-scroll-to-top"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { ScrollPositionSaver } from "@/components/scroll-position-saver"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    // Для админских страниц показываем только контент
    return <>{children}</>
  }

  // Для обычных страниц показываем полный layout
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ClientScrollToTop />
      <ScrollPositionSaver />
      <main className="flex-1">{children}</main>
      <Footer />
      <ThemeToggleButton />
    </div>
  )
}