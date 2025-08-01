"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, getTranslations, Translations } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [translations, setTranslations] = useState<Translations>(getTranslations('en'))

  // Load language from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Force English language - clear any saved Russian language
      localStorage.setItem('admin-language', 'en')
      setLanguageState('en')
      setTranslations(getTranslations('en'))
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setTranslations(getTranslations(lang))
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-language', lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}