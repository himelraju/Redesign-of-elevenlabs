"use client"

import { useEffect } from "react"

/**
 * Mounts a single IntersectionObserver that flips `data-visible` on every
 * element annotated with `data-reveal`. Pair with the CSS rules in
 * globals.css to fade + lift sections into view as the user scrolls.
 *
 * One global observer keeps the cost flat regardless of how many sections
 * opt in, and we disconnect each element after it reveals so we never
 * re-trigger.
 */
export function RevealObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-visible])"),
    )

    if (reduce) {
      elements.forEach((el) => el.setAttribute("data-visible", ""))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "")
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )

    elements.forEach((el) => io.observe(el))

    // Re-scan once after a tick to catch elements rendered by client islands.
    const id = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-visible])")
        .forEach((el) => io.observe(el))
    }, 200)

    return () => {
      window.clearTimeout(id)
      io.disconnect()
    }
  }, [])

  return null
}
