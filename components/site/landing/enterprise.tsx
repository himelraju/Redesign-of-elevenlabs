import Link from "next/link"
import { Lock, ShieldCheck, Globe2, FileCheck2, ArrowUpRight } from "lucide-react"
import { SectionLabel } from "@/components/site/hairline"

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "SOC 2 Type II",
    desc: "Annual audits, continuous monitoring, and a public trust portal with real-time controls.",
  },
  {
    icon: Lock,
    title: "Zero-retention mode",
    desc: "Inputs and outputs discarded at the edge. No training on customer data, ever.",
  },
  {
    icon: Globe2,
    title: "Regional residency",
    desc: "Pin synthesis to US, EU, JP, or AU. BYOC available on dedicated capacity.",
  },
  {
    icon: FileCheck2,
    title: "Provenance & C2PA",
    desc: "Every output carries cryptographic provenance and inaudible watermarking.",
  },
]

export function Enterprise() {
  return (
    <section id="enterprise" className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-noise opacity-40"
      />
      <div className="relative mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-5">
            <SectionLabel index="04" label="Enterprise" />
            <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.035em] lg:text-5xl">
              Built for the teams that ship to billions.
            </h2>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              Dedicated capacity, regional residency, and a security posture that survives procurement. Talk to us about volume pricing, custom voices, and on-prem deployment.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#contact"
                className="group inline-flex h-11 items-center gap-2 rounded-sm bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Contact sales
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="#trust"
                className="inline-flex h-11 items-center gap-2 rounded-sm border border-border bg-card px-5 text-sm text-foreground hover:border-foreground/40"
              >
                Trust center
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
              {PILLARS.map((p, i) => {
                const Icon = p.icon
                return (
                  <li
                    key={p.title}
                    data-reveal
                    data-delay={i + 1}
                    className="group relative bg-card p-6 transition-colors hover:bg-card/70 lg:p-8"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-background text-primary transition-colors group-hover:border-primary/50">
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <h3 className="mt-5 text-lg font-medium tracking-tight">{p.title}</h3>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
