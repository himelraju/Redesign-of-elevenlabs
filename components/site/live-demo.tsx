"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AlertTriangle, Loader2, Pause, Play, Sparkles } from "lucide-react"
import { ReactiveWaveform } from "./reactive-waveform"
import { cn } from "@/lib/utils"

/**
 * Curated ElevenLabs preset voices. These IDs are public defaults on the
 * ElevenLabs platform. The TTS request is made server-side through /api/tts
 * so the API key is never exposed to the browser.
 */
type VoicePreset = {
  id: string
  name: string
  tag: string
}

const VOICES: VoicePreset[] = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", tag: "Narration · EN-US" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", tag: "Confident · EN-US" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", tag: "Soft · EN-US" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", tag: "Deep · EN-US" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", tag: "Crisp · EN-US" },
]

const DEFAULT_TEXT =
  "The future of synthetic sound is now in your hands. Type anything, choose a voice, and listen as the waveform reacts in real time."

const CHAR_LIMIT = 400

export function LiveDemo({ className }: { className?: string }) {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [voiceId, setVoiceId] = useState(VOICES[0].id)
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const cacheRef = useRef<Map<string, string>>(new Map())
  // Re-render when analyser becomes available so ReactiveWaveform receives it
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)

  const voice = useMemo(() => VOICES.find((v) => v.id === voiceId) ?? VOICES[0], [voiceId])
  const cacheKey = useMemo(() => `${voiceId}::${text.trim()}`, [voiceId, text])

  // Mount: create hidden audio element and wire listeners
  useEffect(() => {
    const audio = new Audio()
    audio.crossOrigin = "anonymous"
    audio.preload = "auto"
    audioRef.current = audio

    const onTime = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setProgress(audio.currentTime / audio.duration)
      }
    }
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      setIsPlaying(false)
      setProgress(1)
    }
    const onErr = () => {
      setIsPlaying(false)
      setIsLoading(false)
      setError("Playback failed.")
    }

    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onErr)

    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onErr)
      cacheRef.current.forEach((url) => URL.revokeObjectURL(url))
      cacheRef.current.clear()
      objectUrlRef.current = null
      try {
        sourceNodeRef.current?.disconnect()
      } catch {}
      try {
        analyserRef.current?.disconnect()
      } catch {}
      ctxRef.current?.close().catch(() => {})
    }
  }, [])

  // Keep playbackRate in sync with the speed slider
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed
  }, [speed])

  const ensureGraph = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AC()
      const an = ctx.createAnalyser()
      an.fftSize = 1024
      an.smoothingTimeConstant = 0.78
      const src = ctx.createMediaElementSource(audio)
      src.connect(an)
      an.connect(ctx.destination)
      ctxRef.current = ctx
      analyserRef.current = an
      sourceNodeRef.current = src
      setAnalyser(an)
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {})
    }
  }, [])

  const fetchAudio = useCallback(async (): Promise<string> => {
    const cached = cacheRef.current.get(cacheKey)
    if (cached) return cached

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim(), voiceId }),
    })

    if (!res.ok) {
      let detail = `HTTP ${res.status}`
      let code: string | null = null
      try {
        const data = (await res.json()) as { error?: string; code?: string }
        if (data?.error) detail = data.error
        if (data?.code) code = data.code
      } catch {}
      const err = new Error(detail) as Error & { code?: string }
      if (code) err.code = code
      throw err
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    cacheRef.current.set(cacheKey, url)
    return url
  }, [cacheKey, text, voiceId])

  const handlePlay = useCallback(async () => {
    setError(null)
    setErrorCode(null)
    const audio = audioRef.current
    if (!audio || !text.trim()) return

    if (isPlaying) {
      audio.pause()
      return
    }

    // Resume if we have the same clip loaded mid-playback
    const sameClip = objectUrlRef.current && cacheRef.current.get(cacheKey) === objectUrlRef.current
    if (sameClip && audio.currentTime > 0 && audio.currentTime < (audio.duration || Infinity)) {
      ensureGraph()
      audio.play().catch(() => {})
      return
    }

    setIsLoading(true)
    try {
      const url = await fetchAudio()
      ensureGraph()
      audio.src = url
      objectUrlRef.current = url
      audio.currentTime = 0
      audio.playbackRate = speed
      setProgress(0)
      await audio.play()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed."
      const code = (err as Error & { code?: string }).code ?? null
      setError(msg)
      setErrorCode(code)
    } finally {
      setIsLoading(false)
    }
  }, [cacheKey, ensureGraph, fetchAudio, isPlaying, speed, text])

  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-primary" aria-hidden />
          <span>Live synthesis · ElevenLabs</span>
        </div>
        <span>model · multilingual_v2</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
        {/* Text input */}
        <div className="relative">
          <label htmlFor="demo-text" className="sr-only">
            Text to synthesize
          </label>
          <textarea
            id="demo-text"
            value={text}
            onChange={(e) => {
              setText(e.target.value.slice(0, CHAR_LIMIT))
              setError(null)
            }}
            rows={5}
            maxLength={CHAR_LIMIT}
            className="block h-full w-full resize-none bg-transparent p-4 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none lg:text-lg"
            placeholder="Type anything to synthesize..."
          />
          <div className="pointer-events-none absolute bottom-2 left-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {text.length}/{CHAR_LIMIT} chars
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 border-t border-border bg-background/40 p-4 lg:border-l lg:border-t-0">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Voice
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVoiceId(v.id)
                    setError(null)
                  }}
                  className={cn(
                    "group flex items-center justify-between rounded-sm border px-2.5 py-1.5 text-left text-sm transition-colors",
                    voiceId === v.id
                      ? "border-primary/60 bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={voiceId === v.id}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        voiceId === v.id ? "bg-primary" : "bg-muted-foreground/40",
                      )}
                      aria-hidden
                    />
                    <span className="font-medium">{v.name}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{v.tag}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Speed</span>
              <span className="text-foreground">{speed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.6}
              step={0.05}
              value={speed}
              onChange={(e) => setSpeed(Number.parseFloat(e.target.value))}
              className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
              aria-label="Playback speed"
            />
          </div>

          <button
            type="button"
            onClick={handlePlay}
            disabled={isLoading || !text.trim()}
            className="group inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-primary text-sm font-medium text-primary-foreground transition-[transform,filter] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Generating
              </>
            ) : isPlaying ? (
              <>
                <Pause className="h-4 w-4" aria-hidden />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden />
                Synthesize &amp; play
              </>
            )}
          </button>
        </div>
      </div>

      {/* Waveform */}
      <div className="border-t border-border p-4">
        <ReactiveWaveform analyser={isPlaying ? analyser : null} className="aspect-[16/5] w-full" />
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="text-foreground">{voice.name}</span>
            <span className="hairline h-3 w-px" />
            <span>{voice.tag}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>progress</span>
            <span className="text-foreground">{Math.round(progress * 100)}%</span>
          </div>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 border-t border-destructive/40 bg-destructive/10 px-4 py-3 font-mono text-[11px] text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="rounded-sm border border-destructive/40 bg-destructive/10 px-1.5 py-0.5 uppercase tracking-[0.16em]">
                {errorCode === "quota_exceeded"
                  ? "Quota"
                  : errorCode === "invalid_key"
                    ? "Auth"
                    : errorCode === "rate_limited"
                      ? "Rate limit"
                      : "Error"}
              </span>
              <span className="break-words text-foreground/90">{error}</span>
            </div>
            {errorCode === "quota_exceeded" ? (
              <a
                href="https://elevenlabs.io/app/subscription"
                target="_blank"
                rel="noreferrer"
                className="self-start text-foreground underline decoration-destructive/60 underline-offset-4 hover:decoration-destructive"
              >
                Open ElevenLabs billing →
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
