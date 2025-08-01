"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from './LanguageProvider'
import { Language } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-xs px-2 py-1 h-auto"
      >
        EN
      </Button>
      <Button
        variant={language === 'ru' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('ru')}
        className="text-xs px-2 py-1 h-auto"
      >
        RU
      </Button>
    </div>
  )
}