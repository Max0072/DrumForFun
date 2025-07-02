"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useScrollPosition } from "@/hooks/use-scroll-position"

interface ScrollPositionSaverProps {
  paths?: string[]
}

export function ScrollPositionSaver({ paths = ["/store"] }: ScrollPositionSaverProps) {
  const pathname = usePathname()
  const { saveScrollPosition } = useScrollPosition()

  useEffect(() => {
    // Сохраняем позицию только для указанных страниц
    if (!paths.includes(pathname)) return

    const handleBeforeUnload = () => {
      saveScrollPosition()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveScrollPosition()
      }
    }

    // Сохраняем позицию при различных событиях
    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Сохраняем позицию при размонтировании компонента
    return () => {
      saveScrollPosition()
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [pathname, paths, saveScrollPosition])

  return null
}
