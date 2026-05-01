const LOGOS = [
  "WASHINGTON POST",
  "TIME",
  "HARPERCOLLINS",
  "DISNEY",
  "BBC",
  "NEW YORK TIMES",
  "EPIC GAMES",
  "BLOOMBERG",
]

export function LogoStrip() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by 60% of Fortune 500 audio teams
          </div>
          <div className="hairline hidden h-px flex-1 md:block md:mx-8" />
          <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 md:w-auto md:flex md:flex-wrap md:items-center md:gap-x-8">
            {LOGOS.map((logo) => (
              <li
                key={logo}
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {logo}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
