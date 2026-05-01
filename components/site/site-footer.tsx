import Link from "next/link"
import { Logo } from "./logo"
import { NewsletterForm } from "./newsletter-form"

const groups = [
  {
    title: "Products",
    links: [
      { label: "Text to Speech", href: "/#tts" },
      { label: "Voice Cloning", href: "/#cloning" },
      { label: "Dubbing", href: "/#dubbing" },
      { label: "Conversational AI", href: "/#agents" },
      { label: "Sound Effects", href: "/#sfx" },
      { label: "Music", href: "/#music" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Voice Library", href: "/voices" },
      { label: "Pricing", href: "/pricing" },
      { label: "API Reference", href: "/#developers" },
      { label: "Status", href: "/#status" },
      { label: "Changelog", href: "/#changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Research", href: "/#research" },
      { label: "Careers", href: "/#careers" },
      { label: "Press", href: "/#press" },
      { label: "Safety", href: "/#safety" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/#terms" },
      { label: "Privacy", href: "/#privacy" },
      { label: "Cookies", href: "/#cookies" },
      { label: "DPA", href: "/#dpa" },
      { label: "Trust Center", href: "/#trust" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Status strip */}
        <div className="flex flex-col items-start justify-between gap-3 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-primary" />
            </span>
            <span>All systems operational</span>
            <span className="hairline h-3 w-px" />
            <span>p50 latency 412ms</span>
            <span className="hairline h-3 w-px" />
            <span>31 regions online</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Build 11.4.20</span>
            <span className="hairline h-3 w-px" />
            <span>v0.elevenlabs / resonance-os</span>
          </div>
        </div>

        <div className="hairline h-px w-full" />

        {/* Link groups */}
        <div className="grid gap-10 py-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              The runtime for synthetic sound. Built for creators, developers, and enterprises rendering the next billion hours of human-grade audio.
            </p>
            <NewsletterForm />
          </div>

          {groups.map((group) => (
            <div key={group.title} className="md:col-span-2">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline h-px w-full" />

        <div className="flex flex-col items-start justify-between gap-3 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>
            © 2026 ElevenLabs Inc. — Synthesized in 32 languages, served from the edge.
          </div>
          <div className="flex items-center gap-4 font-mono uppercase tracking-[0.16em]">
            <Link href="/#twitter" className="hover:text-foreground">
              X
            </Link>
            <Link href="/#github" className="hover:text-foreground">
              GitHub
            </Link>
            <Link href="/#discord" className="hover:text-foreground">
              Discord
            </Link>
            <Link href="/#youtube" className="hover:text-foreground">
              YouTube
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
