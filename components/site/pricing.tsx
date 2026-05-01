"use client"

import { Fragment, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, Minus } from "lucide-react"
import { SectionLabel } from "@/components/site/hairline"
import { cn } from "@/lib/utils"

type Tier = {
  id: string
  name: string
  tagline: string
  monthly: number | "custom"
  annual: number | "custom"
  characters: string
  features: string[]
  cta: string
  highlight?: boolean
  meta: string
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    tagline: "For tinkering and side projects.",
    monthly: 0,
    annual: 0,
    characters: "10,000 chars / mo",
    features: [
      "3 generations per minute",
      "Standard voices only",
      "Non-commercial license",
      "Community support",
    ],
    cta: "Start free",
    meta: "tier · 00",
  },
  {
    id: "creator",
    name: "Creator",
    tagline: "For solo creators shipping content.",
    monthly: 22,
    annual: 18,
    characters: "100,000 chars / mo",
    features: [
      "Instant Voice Cloning",
      "Commercial license",
      "Studio editor",
      "Priority queue",
    ],
    cta: "Start Creator",
    meta: "tier · 01",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For teams in production.",
    monthly: 99,
    annual: 82,
    characters: "500,000 chars / mo",
    features: [
      "Professional Voice Cloning",
      "44.1kHz · 192kbps PCM",
      "Streaming + low-latency mode",
      "Email support, 1 day SLA",
    ],
    cta: "Start Pro",
    highlight: true,
    meta: "tier · 02 · most chosen",
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For high-volume products.",
    monthly: 330,
    annual: 275,
    characters: "2,000,000 chars / mo",
    features: [
      "5 seats included",
      "Custom pronunciations",
      "Dedicated capacity option",
      "99.9% uptime SLA",
    ],
    cta: "Start Scale",
    meta: "tier · 03",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Volume, residency, and procurement.",
    monthly: "custom",
    annual: "custom",
    characters: "Unlimited (negotiated)",
    features: [
      "SOC 2 Type II + DPA",
      "Regional residency · BYOC",
      "Zero-retention mode",
      "Named TAM, 99.99% uptime",
    ],
    cta: "Contact sales",
    meta: "tier · 04",
  },
]

type MatrixRow = {
  group: string
  rows: { label: string; values: (string | boolean)[] }[]
}

const MATRIX: MatrixRow[] = [
  {
    group: "Synthesis",
    rows: [
      { label: "Characters / month", values: ["10K", "100K", "500K", "2M", "Unlimited"] },
      { label: "Concurrency", values: ["2", "5", "10", "25", "Custom"] },
      { label: "Quality", values: ["48kHz", "48kHz", "44.1kHz · 192kbps", "44.1kHz · 192kbps", "Custom"] },
      { label: "Streaming", values: [false, true, true, true, true] },
      { label: "Low-latency mode", values: [false, false, true, true, true] },
    ],
  },
  {
    group: "Voices",
    rows: [
      { label: "Public library", values: [true, true, true, true, true] },
      { label: "Instant Voice Cloning", values: [false, true, true, true, true] },
      { label: "Professional Voice Cloning", values: [false, false, true, true, true] },
      { label: "Custom pronunciations", values: [false, false, true, true, true] },
    ],
  },
  {
    group: "Security & support",
    rows: [
      { label: "Watermarking + provenance", values: [true, true, true, true, true] },
      { label: "Zero-retention mode", values: [false, false, false, true, true] },
      { label: "SSO / SAML", values: [false, false, false, true, true] },
      { label: "Regional residency", values: [false, false, false, "Add-on", true] },
      { label: "Support", values: ["Community", "Email", "Priority", "Priority + Slack", "TAM + 24/7"] },
    ],
  },
]

const FAQS = [
  {
    q: "What counts as a character?",
    a: "Anything you submit to a synthesis endpoint — including spaces and punctuation — counts toward your monthly character allotment. Audio you re-render from a saved project is free.",
  },
  {
    q: "Can I use generated audio commercially?",
    a: "Yes, on every paid plan. The Free tier is non-commercial. Enterprise contracts include indemnification and an extended warranty.",
  },
  {
    q: "Do unused characters roll over?",
    a: "Annual plans roll up to 2 months of unused characters into the next cycle. Monthly plans reset on each billing date.",
  },
  {
    q: "How does Voice Cloning consent work?",
    a: "Every cloned voice requires verifiable consent through our challenge-response protocol. Outputs are signed with C2PA-compliant provenance and an inaudible watermark.",
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-noise opacity-50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
          <SectionLabel index="00" label="Pricing · billing engine v3" />
          <div className="mt-6 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <h1 className="max-w-3xl text-balance text-5xl font-medium leading-[0.95] tracking-[-0.04em] lg:text-7xl">
              Pay for what you
              <br />
              <span className="text-primary">render.</span>
            </h1>
            <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              Five tiers, one runtime. Start free, scale on usage, switch to enterprise when procurement comes knocking. No surprise overages — you set hard caps in the dashboard.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="mt-10 flex items-center gap-3">
            <div className="inline-flex items-center rounded-sm border border-border bg-card p-1 font-mono text-[11px] uppercase tracking-[0.18em]">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={cn(
                  "h-8 rounded-sm px-3 transition-colors",
                  !annual ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={!annual}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={cn(
                  "h-8 rounded-sm px-3 transition-colors",
                  annual ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={annual}
              >
                Annual
              </button>
            </div>
            <span className="rounded-sm border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              Save 17% on annual
            </span>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
          <ul className="grid gap-3 lg:grid-cols-5">
            {TIERS.map((t) => {
              const price = annual ? t.annual : t.monthly
              return (
                <li
                  key={t.id}
                  className={cn(
                    "relative flex flex-col rounded-md border bg-card p-5 transition-colors",
                    t.highlight
                      ? "border-primary/60 shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_30%,transparent)]"
                      : "border-border",
                  )}
                >
                  {t.highlight && (
                    <span className="absolute -top-2 left-5 rounded-sm bg-primary px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground">
                      Most chosen
                    </span>
                  )}
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.meta}
                  </div>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    {price === "custom" ? (
                      <span className="text-4xl font-medium tracking-[-0.02em]">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-medium tracking-[-0.02em]">${price}</span>
                        <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          / mo {annual ? "billed yearly" : ""}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {t.characters}
                  </div>

                  <Link
                    href="#start"
                    className={cn(
                      "mt-5 inline-flex h-10 items-center justify-center gap-1.5 rounded-sm px-3 text-sm font-medium transition-colors",
                      t.highlight
                        ? "bg-primary text-primary-foreground hover:brightness-110"
                        : t.id === "enterprise"
                          ? "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
                          : "border border-border bg-background text-foreground hover:border-foreground/40",
                    )}
                  >
                    {t.cta}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>

                  <ul className="mt-6 space-y-2.5 border-t border-border pt-5 text-sm">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Matrix */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <SectionLabel index="01" label="Comparison matrix" />
              <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-[-0.03em] lg:text-5xl">
                Every feature, side by side.
              </h2>
            </div>
            <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              Hover any row to see how a feature scales across the tiers. Need something in between? Talk to sales.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-card">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 w-[28%] border-b border-border bg-card px-5 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Feature
                  </th>
                  {TIERS.map((t) => (
                    <th
                      key={t.id}
                      scope="col"
                      className={cn(
                        "border-b border-l border-border px-5 py-4 align-bottom",
                        t.highlight && "bg-primary/5",
                      )}
                    >
                      <div className="text-base font-medium tracking-tight text-foreground">
                        {t.name}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {t.monthly === "custom"
                          ? "Custom"
                          : `$${annual ? t.annual : t.monthly}/mo`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((group) => (
                  <Fragment key={group.group}>
                    <tr className="bg-background">
                      <td
                        colSpan={TIERS.length + 1}
                        className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary"
                      >
                        {group.group}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr
                        key={row.label}
                        className="group transition-colors hover:bg-card/60"
                      >
                        <th
                          scope="row"
                          className="sticky left-0 z-10 border-b border-border bg-background px-5 py-3 text-left text-sm font-normal text-foreground/90 group-hover:bg-card/60"
                        >
                          {row.label}
                        </th>
                        {row.values.map((value, i) => {
                          const isHighlight = TIERS[i].highlight
                          return (
                            <td
                              key={i}
                              className={cn(
                                "border-b border-l border-border px-5 py-3 text-sm",
                                isHighlight && "bg-primary/5",
                              )}
                            >
                              {typeof value === "boolean" ? (
                                value ? (
                                  <Check className="h-4 w-4 text-primary" aria-label="Included" />
                                ) : (
                                  <Minus className="h-4 w-4 text-muted-foreground/50" aria-label="Not included" />
                                )
                              ) : (
                                <span className="text-foreground/90">{value}</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionLabel index="02" label="FAQ" />
              <h2 className="mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-[-0.03em] lg:text-5xl">
                Questions, answered.
              </h2>
              <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                Still unsure? Our solutions team replies in under an hour during business hours, and the docs are open-source on GitHub.
              </p>
            </div>
            <ul className="lg:col-span-8 divide-y divide-border border-y border-border">
              {FAQS.map((f, i) => {
                const open = openFaq === i
                return (
                  <li key={f.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="text-lg font-medium tracking-tight text-foreground">
                          {f.q}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform",
                          open && "rotate-45 border-primary text-primary",
                        )}
                      >
                        +
                      </span>
                    </button>
                    {open && (
                      <p className="pb-5 pl-14 pr-4 text-pretty text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
