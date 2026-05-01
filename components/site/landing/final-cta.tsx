import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function FinalCta() {
  return (
    <section id="start" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 100%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl">
          <div data-reveal className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            // Ready when you are
          </div>
          <h2
            data-reveal
            data-delay="1"
            className="mt-6 text-balance text-5xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-[6.5rem]"
          >
            Render the
            <br />
            <span className="bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              unwritten.
            </span>
          </h2>
          <p
            data-reveal
            data-delay="2"
            className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            Start with 10,000 free characters and a public API key. No credit card. Production capacity unlocks the moment you ship.
          </p>
          <div data-reveal data-delay="3" className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#signup"
              className="group inline-flex h-12 items-center gap-2 rounded-sm bg-primary px-6 text-base font-medium text-primary-foreground transition-[transform,filter,box-shadow] hover:brightness-110 hover:shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_18%,transparent)] active:scale-[0.99]"
            >
              Start building free
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="#contact"
              className="inline-flex h-12 items-center gap-2 rounded-sm border border-border bg-card px-6 text-base text-foreground transition-colors hover:border-foreground/40"
            >
              Talk to sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
