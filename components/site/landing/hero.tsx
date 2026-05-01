import Link from "next/link"
import { ArrowUpRight, Play } from "lucide-react"
import { LiveDemo } from "@/components/site/live-demo"
import { SectionLabel } from "@/components/site/hairline"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Layered backdrop: dot grid + radial primary wash + column ticks */}
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 55% at 50% 0%, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)",
        }}
      />
      {/* Column ticks — subtle hairlines at 25/50/75% to reinforce the control-surface feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/4 hidden w-px bg-border/40 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-border/30 md:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-3/4 hidden w-px bg-border/40 md:block"
      />
      {/* Top hairline that draws on load */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-primary/60"
        style={{ animation: "hairline-draw 900ms cubic-bezier(0.2, 0.8, 0.2, 1) 200ms both" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div data-reveal>
              <SectionLabel index="00" label="Resonance OS · build 11.4.20" />
            </div>
            <h1
              data-reveal
              data-delay="1"
              className="mt-6 text-balance text-5xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-[5.5rem]"
            >
              Synthesize the
              <br />
              <span className="bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                human voice.
              </span>
            </h1>
            <p
              data-reveal
              data-delay="2"
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              The runtime for synthetic sound. Generate, clone, and orchestrate human-grade audio across{" "}
              <span className="text-foreground">32 languages</span> with the lowest latency in the industry —{" "}
              <span className="font-mono text-foreground">p50 412ms</span>.
            </p>
            <div data-reveal data-delay="3" className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#start"
                className="group inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-5 text-sm font-medium text-primary-foreground transition-[transform,filter,box-shadow] hover:brightness-110 hover:shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_18%,transparent)] active:scale-[0.99]"
              >
                Start building free
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="#demo"
                className="inline-flex h-11 items-center gap-2 rounded-sm border border-border bg-card/60 px-5 text-sm text-foreground backdrop-blur transition-colors hover:border-foreground/40 hover:bg-card"
              >
                <Play className="h-3.5 w-3.5 text-primary" aria-hidden />
                Watch the demo
              </Link>
            </div>

            {/* Spec rail */}
            <dl
              data-reveal
              data-delay="4"
              className="mt-10 grid max-w-xl grid-cols-3 gap-x-6 gap-y-1 border-t border-border pt-6 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"
            >
              <div>
                <dt>Voices</dt>
                <dd className="mt-1 text-2xl text-foreground">6,412</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd className="mt-1 text-2xl text-foreground">32</dd>
              </div>
              <div>
                <dt>p50 Latency</dt>
                <dd className="mt-1 text-2xl text-foreground">
                  412<span className="text-muted-foreground">ms</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5" id="demo">
            <div data-reveal data-delay="2" className="relative">
              <div
                aria-hidden
                className="animate-drift pointer-events-none absolute -inset-3 rounded-xl bg-primary/10 blur-3xl"
              />
              <LiveDemo className="relative" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
