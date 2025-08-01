"use client"

import { useRef } from "react"
import { usePathname } from "next/navigation"

interface ScrollPosition {
  x: number
  y: number
}

const SCROLL_POSITIONS_KEY = "scroll-positions"

export function useScrollPosition() {
  const pathname = usePathname()
  const isRestoringRef = useRef(false)

  // Сохранить текущую позицию прокрутки
  const saveScrollPosition = (path?: string) => {
    if (typeof window === "undefined") return

    const currentPath = path || pathname
    const scrollPosition: ScrollPosition = {
      x: window.scrollX,
      y: window.scrollY,
    }

    try {
      const savedPositions = JSON.parse(sessionStorage.getItem(SCROLL_POSITIONS_KEY) || "{}")
      savedPositions[currentPath] = scrollPosition
      sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(savedPositions))
    } catch (error) {
      console.warn("Failed to save scroll position:", error)
    }
  }

  // Восстановить позицию прокрутки
  const restoreScrollPosition = (path?: string) => {
    if (typeof window === "undefined") return false

    const currentPath = path || pathname

    try {
      const savedPositions = JSON.parse(sessionStorage.getItem(SCROLL_POSITIONS_KEY) || "{}")
      const position = savedPositions[currentPath]

      if (position) {
        isRestoringRef.current = true
        // Используем requestAnimationFrame для обеспечения завершения рендеринга
        requestAnimationFrame(() => {
          window.scrollTo({
            left: position.x,
            top: position.y,
            behavior: "instant",
          })
          // Сбрасываем флаг через небольшую задержку
          setTimeout(() => {
            isRestoringRef.current = false
          }, 100)
        })
        return true
      }
    } catch (error) {
      console.warn("Failed to restore scroll position:", error)
    }

    return false
  }

  // Очистить сохраненную позицию
  const clearScrollPosition = (path?: string) => {
    if (typeof window === "undefined") return

    const currentPath = path || pathname

    try {
      const savedPositions = JSON.parse(sessionStorage.getItem(SCROLL_POSITIONS_KEY) || "{}")
      delete savedPositions[currentPath]
      sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(savedPositions))
    } catch (error) {
      console.warn("Failed to clear scroll position:", error)
    }
  }

  // Проверить, восстанавливается ли сейчас позиция
  const isRestoring = () => isRestoringRef.current

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    isRestoring,
  }
}
