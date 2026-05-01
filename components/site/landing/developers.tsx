"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { SectionLabel } from "@/components/site/hairline"
import { cn } from "@/lib/utils"

const SAMPLES = [
  {
    id: "node",
    label: "Node.js",
    code: `import { ElevenLabs } from "@elevenlabs/sdk"

const client = new ElevenLabs({ apiKey: process.env.ELEVEN_API_KEY })

const audio = await client.speech.create({
  voice: "atlas",
  model: "resonance-v3",
  text: "The future of synthetic sound is now in your hands.",
  format: "mp3_44100_192",
  latency: "low",
})

await audio.pipe(process.stdout)`,
  },
  {
    id: "python",
    label: "Python",
    code: `from elevenlabs import ElevenLabs

client = ElevenLabs(api_key=os.environ["ELEVEN_API_KEY"])

stream = client.speech.create(
    voice="atlas",
    model="resonance-v3",
    text="The future of synthetic sound is now in your hands.",
    format="mp3_44100_192",
    latency="low",
)

for chunk in stream:
    sys.stdout.buffer.write(chunk)`,
  },
  {
    id: "curl",
    label: "cURL",
    code: `curl https://api.elevenlabs.io/v3/speech \\
  -H "Authorization: Bearer $ELEVEN_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "voice": "atlas",
    "model": "resonance-v3",
    "text": "The future of synthetic sound is now in your hands.",
    "format": "mp3_44100_192",
    "latency": "low"
  }' --output speech.mp3`,
  },
]

export function Developers() {
  const [active, setActive] = useState(SAMPLES[0].id)
  const [copied, setCopied] = useState(false)

  const sample = SAMPLES.find((s) => s.id === active) ?? SAMPLES[0]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sample.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  return (
    <section id="developers" className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-5">
            <SectionLabel index="03" label="Developers" />
            <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.035em] lg:text-5xl">
              An SDK that disappears into your stack.
            </h2>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              First-class clients for Node, Python, Go, Rust, and the browser. WebSocket streaming, low-latency mode, server-sent events, and a public OpenAPI schema.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-foreground/90">
              {[
                ["01", "Streaming with first-byte under 250ms in 4 regions"],
                ["02", "Idempotent requests, signed webhooks, and granular keys"],
                ["03", "Watermarked output with C2PA-compliant provenance"],
                ["04", "Open-source SDKs, public changelog, semver guarantees"],
              ].map(([n, t]) => (
                <li key={n} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{n}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#docs"
                className="group inline-flex h-10 items-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground hover:brightness-110"
              >
                Read the docs
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="#api"
                className="inline-flex h-10 items-center gap-2 rounded-sm border border-border bg-card px-4 text-sm text-foreground hover:border-foreground/40"
              >
                API reference
              </Link>
            </div>
          </div>

          <div data-reveal data-delay="2" className="lg:col-span-7">
            <div className="overflow-hidden rounded-md border border-border bg-card shadow-[0_0_60px_-30px_color-mix(in_oklch,var(--primary)_50%,transparent)]">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div className="flex items-center gap-1">
                  {SAMPLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActive(s.id)}
                      className={cn(
                        "rounded-sm px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                        active === s.id
                          ? "bg-background text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex h-7 items-center gap-1.5 rounded-sm border border-border bg-background px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Copy code"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-primary" aria-hidden />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" aria-hidden />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto bg-background p-5 font-mono text-[12.5px] leading-relaxed text-foreground/90">
                <code>{sample.code}</code>
              </pre>
              <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <span>POST /v3/speech</span>
                <span>200 OK · 248ms · 192kbps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
