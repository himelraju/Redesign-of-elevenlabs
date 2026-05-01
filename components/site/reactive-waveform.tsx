"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type Props = {
  /** Optional analyser node from a Web Audio graph. When absent, an idle ambient pattern is rendered. */
  analyser?: AnalyserNode | null
  className?: string
  /** Lines render as horizontal frequency bars + center waveform. */
  variant?: "hero" | "compact"
}

/**
 * Canvas-based audio-reactive waveform.
 * Reads time-domain + frequency-domain data from an AnalyserNode and renders
 * a centered waveform line plus mirrored frequency bars on a grid.
 */
export function ReactiveWaveform({ analyser, className, variant = "hero" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const idleTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const timeData = new Uint8Array(analyser?.fftSize ?? 1024)
    const freqData = new Uint8Array(analyser?.frequencyBinCount ?? 256)

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      ctx.clearRect(0, 0, w, h)

      // Background grid
      ctx.save()
      ctx.strokeStyle = "rgba(255,255,255,0.05)"
      ctx.lineWidth = 1
      const cols = 16
      const rows = variant === "hero" ? 8 : 4
      for (let i = 1; i < cols; i++) {
        const x = (w / cols) * i
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let i = 1; i < rows; i++) {
        const y = (h / rows) * i
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      ctx.restore()

      // Pull data
      let timeArray: Uint8Array | null = null
      let freqArray: Uint8Array | null = null
      if (analyser) {
        analyser.getByteTimeDomainData(timeData as Uint8Array)
        analyser.getByteFrequencyData(freqData as Uint8Array)
        timeArray = timeData
        freqArray = freqData
      } else {
        idleTimeRef.current += reduceMotion ? 0 : 0.012
        const t = idleTimeRef.current
        // Synthesize a gentle ambient pattern
        const td = new Uint8Array(512)
        for (let i = 0; i < td.length; i++) {
          const x = i / td.length
          const v =
            Math.sin(x * Math.PI * 6 + t * 1.4) * 0.18 +
            Math.sin(x * Math.PI * 14 - t * 0.9) * 0.08 +
            Math.sin(x * Math.PI * 32 + t * 2.1) * 0.04
          td[i] = Math.round(128 + v * 127)
        }
        timeArray = td
        const fd = new Uint8Array(96)
        for (let i = 0; i < fd.length; i++) {
          const env = Math.exp(-i / 60)
          const wob = (Math.sin(t * 1.5 + i * 0.18) + 1) / 2
          fd[i] = Math.max(0, Math.min(255, Math.round(env * (40 + wob * 70))))
        }
        freqArray = fd
      }

      // Frequency bars (mirrored, behind waveform)
      ctx.save()
      const bins = Math.min(freqArray.length, 64)
      const barW = w / bins
      for (let i = 0; i < bins; i++) {
        const v = freqArray[i] / 255
        const barH = v * (h * 0.42)
        const x = i * barW
        const cy = h / 2
        ctx.fillStyle = `rgba(242,244,247,${0.06 + v * 0.18})`
        ctx.fillRect(x + 1, cy - barH, Math.max(1, barW - 2), barH)
        ctx.fillRect(x + 1, cy, Math.max(1, barW - 2), barH)
      }
      ctx.restore()

      // Center waveform line (electric lime)
      ctx.save()
      ctx.lineWidth = 2
      ctx.lineJoin = "round"
      ctx.lineCap = "round"
      ctx.shadowColor = "rgba(212,255,58,0.35)"
      ctx.shadowBlur = 12
      ctx.strokeStyle = "#D4FF3A"
      ctx.beginPath()
      const len = timeArray.length
      const step = w / (len - 1)
      for (let i = 0; i < len; i++) {
        const v = (timeArray[i] - 128) / 128
        const x = i * step
        const y = h / 2 + v * (h * 0.42)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.restore()

      // Centerline + tick marks
      ctx.save()
      ctx.strokeStyle = "rgba(255,255,255,0.08)"
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()
      ctx.restore()

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [analyser, variant])

  return (
    <div className={cn("relative w-full overflow-hidden rounded-md border border-border bg-card", className)}>
      {/* Corner markers for the "instrument" aesthetic */}
      <CornerMark className="left-2 top-2" />
      <CornerMark className="right-2 top-2" rotate={90} />
      <CornerMark className="right-2 bottom-2" rotate={180} />
      <CornerMark className="left-2 bottom-2" rotate={270} />

      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-between px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>00:00.000</span>
        <span>{analyser ? "live • 48khz" : "idle • 48khz"}</span>
      </div>
    </div>
  )
}

function CornerMark({ className, rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute h-3 w-3 text-primary/80", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="absolute left-0 top-0 h-px w-3 bg-current" />
      <span className="absolute left-0 top-0 h-3 w-px bg-current" />
    </span>
  )
}
