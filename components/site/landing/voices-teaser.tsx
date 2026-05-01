import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { VOICES } from "@/lib/voices"
import { VoiceCard } from "@/components/site/voice-card"
import { SectionLabel } from "@/components/site/hairline"

export function VoicesTeaser() {
  const featured = VOICES.slice(0, 4)
  return (
    <section id="voices" className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div data-reveal>
            <SectionLabel index="02" label="Voice library" />
            <h2 className="mt-4 max-w-3xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.035em] lg:text-6xl">
              6,412 voices.
              <br />
              <span className="text-muted-foreground">Each one tunable to a tenth of a semitone.</span>
            </h2>
          </div>
          <Link
            data-reveal
            data-delay="1"
            href="/voices"
            className="group inline-flex h-10 items-center gap-2 rounded-sm border border-border bg-card px-4 text-sm text-foreground transition-colors hover:border-primary/60"
          >
            Browse all voices
            <ArrowUpRight
              className="h-4 w-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((v, i) => (
            <div key={v.id} data-reveal data-delay={Math.min(4, i + 1)}>
              <VoiceCard voice={v} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
