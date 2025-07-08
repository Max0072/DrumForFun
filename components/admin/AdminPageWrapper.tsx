"use client"

import { LanguageProvider } from './LanguageProvider'
import { ThemeProvider } from './ThemeProvider'
import AdminGuard from './AdminGuard'
import AdminLayoutContent from './AdminLayoutContent'

interface AdminPageWrapperProps {
  children: React.ReactNode
}

export default function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AdminGuard>
          <AdminLayoutContent>
            {children}
          </AdminLayoutContent>
        </AdminGuard>
      </LanguageProvider>
    </ThemeProvider>
  )
}