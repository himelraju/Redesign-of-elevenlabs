"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AlertTriangle, Loader2, Pause, Play } from "lucide-react"
import type { Voice } from "@/lib/voices"
import { cn } from "@/lib/utils"

/**
 * Canvas waveform. When `analyser` is supplied it visualizes real audio in
 * real time. Otherwise it falls back to a deterministic procedural animation
 * driven by the voice seed (subtle when idle, lively when "active").
 */
function VoiceWaveform({
  seed,
  active,
  analyser,
}: {
  seed: number
  active: boolean
  analyser: AnalyserNode | null
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const tRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const dataRef = useRef<Uint8Array | null>(null)

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

    if (analyser) {
      dataRef.current = new Uint8Array(analyser.frequencyBinCount)
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      ctx.clearRect(0, 0, w, h)

      const bars = 56
      const bw = w / bars

      // Pull live frequency data when an analyser is connected.
      let liveData: Uint8Array | null = null
      if (analyser && dataRef.current && active) {
        analyser.getByteFrequencyData(dataRef.current as unknown as Uint8Array<ArrayBuffer>)
        liveData = dataRef.current
      }

      tRef.current += active && !reduceMotion ? 0.05 : 0.005

      for (let i = 0; i < bars; i++) {
        let v: number
        if (liveData) {
          // Map the i-th bar to a frequency bucket; emphasize lower mids.
          const idx = Math.floor((i / bars) * (liveData.length * 0.55))
          v = liveData[idx] / 255
        } else {
          const phase = (i / bars) * Math.PI * 4 + seed * 0.13
          const env = Math.exp(-Math.pow((i - bars / 2) / (bars * 0.6), 2))
          const wob = Math.sin(phase + tRef.current * (active ? 2.4 : 0.8)) * 0.5 + 0.5
          const wob2 = Math.sin(phase * 1.8 - tRef.current * (active ? 1.6 : 0.5)) * 0.5 + 0.5
          v = (wob * 0.7 + wob2 * 0.3) * env
        }

        const barH = Math.max(2, v * h * 0.92)
        const x = i * bw
        const y = (h - barH) / 2
        const isPeak = v > 0.62
        ctx.fillStyle = active
          ? isPeak
            ? "#D4FF3A"
            : "rgba(212,255,58,0.55)"
          : isPeak
            ? "rgba(242,244,247,0.55)"
            : "rgba(242,244,247,0.18)"
        ctx.fillRect(x + 1, y, Math.max(1, bw - 2), barH)
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [seed, active, analyser])

  return <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
}

export function VoiceCard({ voice }: { voice: Voice }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)

  // Mount the hidden <audio> element + listeners.
  useEffect(() => {
    const audio = new Audio()
    audio.preload = "auto"
    audio.crossOrigin = "anonymous"
    audioRef.current = audio
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    const onError = () => {
      setIsPlaying(false)
      setIsLoading(false)
    }
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)
    return () => {
      audio.pause()
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  /** Lazily build the WebAudio graph the first time the user presses Play. */
  const ensureGraph = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!audioCtxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctx) return
      const ctx = new Ctx()
      const src = ctx.createMediaElementSource(audio)
      const an = ctx.createAnalyser()
      an.fftSize = 512
      an.smoothingTimeConstant = 0.78
      src.connect(an)
      an.connect(ctx.destination)
      audioCtxRef.current = ctx
      sourceRef.current = src
      setAnalyser(an)
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {})
    }
  }, [])

  const handlePlay = useCallback(async () => {
    setError(null)
    setErrorCode(null)
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      return
    }

    // Resume the same clip if we have one already.
    if (objectUrlRef.current && audio.currentTime > 0 && audio.currentTime < (audio.duration || Infinity)) {
      ensureGraph()
      audio.play().catch(() => {})
      return
    }

    setIsLoading(true)
    try {
      let url = objectUrlRef.current
      if (!url) {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: voice.sample, voiceId: voice.elevenLabsId }),
        })
        if (!res.ok) {
          let detail = `HTTP ${res.status}`
          let code: string | null = null
          try {
            const data = (await res.json()) as { error?: string; code?: string }
            if (data?.error) detail = data.error
            if (data?.code) code = data.code
          } catch {
            // ignore
          }
          const err = new Error(detail) as Error & { code?: string }
          if (code) err.code = code
          throw err
        }
        const blob = await res.blob()
        url = URL.createObjectURL(blob)
        objectUrlRef.current = url
      }

      ensureGraph()
      audio.src = url
      audio.currentTime = 0
      await audio.play()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed."
      const code = (err as Error & { code?: string }).code ?? null
      setError(msg)
      setErrorCode(code)
    } finally {
      setIsLoading(false)
    }
  }, [ensureGraph, isPlaying, voice.elevenLabsId, voice.sample])

  return (
    <article className="group relative flex flex-col gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/50">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {voice.number}
          </span>
          <span className="hairline h-3 w-px" />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {voice.language}
          </span>
        </div>
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.18em]",
            isPlaying ? "text-primary" : isLoading ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {isLoading ? "loading" : isPlaying ? "● live" : "ready"}
        </span>
      </header>

      <div className="flex items-end justify-between gap-3">
        <h3 className="text-balance text-3xl font-medium leading-none tracking-tight">{voice.name}</h3>
        <button
          type="button"
          onClick={handlePlay}
          disabled={isLoading}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
          aria-label={isPlaying ? `Stop ${voice.name}` : `Preview ${voice.name}`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" aria-hidden />
          ) : (
            <Play className="h-4 w-4 translate-x-px" aria-hidden />
          )}
        </button>
      </div>

      <div className="aspect-[16/5] w-full overflow-hidden rounded-sm border border-border bg-background">
        <VoiceWaveform seed={voice.seed} active={isPlaying} analyser={analyser} />
      </div>

      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{voice.description}</p>

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-[10px] text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="break-words text-foreground/90">{error}</span>
            {errorCode === "quota_exceeded" ? (
              <a
                href="https://elevenlabs.io/app/subscription"
                target="_blank"
                rel="noreferrer"
                className="self-start text-foreground underline decoration-destructive/60 underline-offset-4 hover:decoration-destructive"
              >
                Open billing →
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <footer className="mt-auto flex flex-wrap items-center gap-1.5">
        {voice.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {voice.gender} · {voice.age} · {voice.accent}
        </span>
      </footer>
    </article>
  )
}
