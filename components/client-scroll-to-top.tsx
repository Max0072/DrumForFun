"use client"

import { Suspense } from "react"
import { ScrollToTop } from "./scroll-to-top"

export function ClientScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTop />
    </Suspense>
  )
}
