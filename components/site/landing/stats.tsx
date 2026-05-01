"use client"

import { useEffect, useRef, useState } from "react"

const STATS = [
  { label: "Hours synthesized", value: 1_240_000_000, suffix: "+", format: compact },
  { label: "Voices in library", value: 6412, suffix: "", format: integer },
  { label: "Languages", value: 32, suffix: "", format: integer },
  { label: "p50 latency", value: 412, suffix: "ms", format: integer },
]

function integer(n: number) {
  return Math.round(n).toLocaleString()
}
function compact(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`
  return Math.round(n).toString()
}

function Counter({ value, format }: { value: number; format: (n: number) => string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true
            if (reduceMotion) {
              setDisplay(value)
              return
            }
            const start = performance.now()
            const duration = 1400
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration)
              const eased = 1 - Math.pow(1 - t, 3)
              setDisplay(value * eased)
              if (t < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return <span ref={ref}>{format(display)}</span>
}

export function Stats() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <ul
          data-reveal
          className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-4"
        >
          {STATS.map((s, i) => (
            <li
              key={s.label}
              data-reveal
              data-delay={i + 1}
              className="group relative bg-card p-6 transition-colors hover:bg-card/70 lg:p-8"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-3 text-4xl font-medium tracking-[-0.025em] lg:text-5xl">
                <Counter value={s.value} format={s.format} />
                <span className="text-muted-foreground">{s.suffix}</span>
              </div>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
