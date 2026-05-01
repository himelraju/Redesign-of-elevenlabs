"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import {
  ArrowUpRight,
  AudioLines,
  Languages,
  Mic,
  MessagesSquare,
  Music2,
  Wand2,
  Headphones,
} from "lucide-react"
import { SectionLabel } from "@/components/site/hairline"
import { cn } from "@/lib/utils"

type Product = {
  id: string
  title: string
  desc: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  span: string
  meta: string
}

const PRODUCTS: Product[] = [
  {
    id: "tts",
    title: "Text to Speech",
    desc: "Render human-grade narration in 32 languages with controllable emotion, pacing, and timbre.",
    href: "/#tts",
    icon: AudioLines,
    span: "lg:col-span-6 lg:row-span-2",
    meta: "Resonance v3 · 192kbps",
  },
  {
    id: "cloning",
    title: "Voice Cloning",
    desc: "Capture a voice from 30 seconds of audio. Render it forever, with consent and watermarking.",
    href: "/#cloning",
    icon: Mic,
    span: "lg:col-span-3 lg:row-span-1",
    meta: "Instant · Professional",
  },
  {
    id: "dubbing",
    title: "Dubbing",
    desc: "Translate and lip-match video into 29 languages while preserving the original speaker's voice.",
    href: "/#dubbing",
    icon: Languages,
    span: "lg:col-span-3 lg:row-span-1",
    meta: "29 languages",
  },
  {
    id: "agents",
    title: "Conversational Agents",
    desc: "Sub-300ms turn-taking with native interrupt handling. Build voice agents your users won't hang up on.",
    href: "/#agents",
    icon: MessagesSquare,
    span: "lg:col-span-3 lg:row-span-1",
    meta: "p50 287ms",
  },
  {
    id: "sfx",
    title: "Sound Effects",
    desc: "Generate cinematic SFX, foley, and ambience from a prompt. Stems included.",
    href: "/#sfx",
    icon: Wand2,
    span: "lg:col-span-3 lg:row-span-1",
    meta: "Prompt → 48kHz",
  },
  {
    id: "music",
    title: "Music",
    desc: "Compose stems and full tracks with controllable mood, tempo, and instrumentation.",
    href: "/#music",
    icon: Music2,
    span: "lg:col-span-3 lg:row-span-1",
    meta: "BPM · Key · Stems",
  },
  {
    id: "studio",
    title: "Studio",
    desc: "A timeline editor for long-form audio. Multitrack, scriptable, and collaborative.",
    href: "/#studio",
    icon: Headphones,
    span: "lg:col-span-3 lg:row-span-1",
    meta: "Multitrack · Scripted",
  },
]

export function ProductsBento() {
  const wrapRef = useRef<HTMLDivElement | null>(null)

  // Cursor-aware highlight on the bento grid
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty("--mx", `${e.clientX - r.left}px`)
      el.style.setProperty("--my", `${e.clientY - r.top}px`)
    }
    el.addEventListener("mousemove", onMove)
    return () => el.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <section id="products" className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div data-reveal>
            <SectionLabel index="01" label="Product surface" />
            <h2 className="mt-4 max-w-3xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.035em] lg:text-6xl">
              Seven instruments. <span className="text-muted-foreground">One runtime.</span>
            </h2>
          </div>
          <p
            data-reveal
            data-delay="1"
            className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground"
          >
            Every surface shares the same model graph, the same telemetry, and the same SDK. Compose them however you ship.
          </p>
        </div>

        <div
          ref={wrapRef}
          className="relative mt-12 grid grid-cols-1 gap-3 lg:grid-cols-12 lg:auto-rows-[200px]"
          style={{
            // Cursor-aware mask wash
            backgroundImage:
              "radial-gradient(240px 240px at var(--mx, -200px) var(--my, -200px), color-mix(in oklch, var(--primary) 8%, transparent), transparent 70%)",
          }}
        >
          {PRODUCTS.map((p, i) => {
            const Icon = p.icon
            return (
              <Link
                key={p.id}
                href={p.href}
                data-reveal
                data-delay={Math.min(6, Math.floor(i / 2) + 1)}
                className={cn(
                  "glow-ring group relative flex flex-col justify-between overflow-hidden rounded-md border border-border bg-card p-6 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/80",
                  p.span,
                )}
              >
                {/* hover halo */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(180px 180px at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)",
                  }}
                />
                {/* corner ticks — futuristic register marks */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-2 top-2 h-2 w-2 border-l border-t border-border/60 transition-colors group-hover:border-primary/70"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-2 bottom-2 h-2 w-2 border-b border-r border-border/60 transition-colors group-hover:border-primary/70"
                />

                <div className="relative flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-background text-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </div>

                <div className="relative mt-10">
                  <h3 className="text-balance text-2xl font-medium leading-tight tracking-tight lg:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                    <span>{p.meta}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
