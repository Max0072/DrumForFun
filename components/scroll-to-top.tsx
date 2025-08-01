"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useScrollPosition } from "@/hooks/use-scroll-position"

export function ScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { restoreScrollPosition, isRestoring } = useScrollPosition()

  useEffect(() => {
    if (typeof window === "undefined") return

    // Список страниц, для которых нужно сохранять позицию прокрутки
    const pagesWithSavedPosition = ["/store"]

    // Проверяем, нужно ли восстановить позицию для текущей страницы
    const shouldRestorePosition = pagesWithSavedPosition.includes(pathname)

    if (shouldRestorePosition) {
      // Пытаемся восстановить позицию
      const restored = restoreScrollPosition()

      // Если позиция не была восстановлена, прокручиваем вверх
      if (!restored) {
        window.scrollTo({
          top: 0,
          behavior: "instant",
        })
      }
    } else {
      // Для остальных страниц всегда прокручиваем вверх
      if (!isRestoring()) {
        window.scrollTo({
          top: 0,
          behavior: "instant",
        })
      }
    }
  }, [pathname, searchParams, restoreScrollPosition, isRestoring])

  return null
}
