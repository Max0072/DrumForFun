import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import { ClientScrollToTop } from "@/components/client-scroll-to-top"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { ScrollPositionSaver } from "@/components/scroll-position-saver"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DrumForFun - Music School & Entertainment Space",
  description: "Learn, practice, perform, and celebrate with drums and guitars",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <ClientScrollToTop />
              <ScrollPositionSaver />
              <main className="flex-1">{children}</main>
              <Footer />
              <ThemeToggleButton />
            </div>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
