"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { VOICES, VOICE_FILTERS } from "@/lib/voices"
import { VoiceCard } from "@/components/site/voice-card"
import { SectionLabel } from "@/components/site/hairline"
import { cn } from "@/lib/utils"

type FilterKey = keyof typeof VOICE_FILTERS

const FILTER_LABELS: Record<FilterKey, string> = {
  language: "Language",
  gender: "Gender",
  use: "Use case",
  age: "Age",
}

export function VoiceLibrary() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    language: "All",
    gender: "All",
    use: "All",
    age: "All",
  })
  const [sort, setSort] = useState<"newest" | "alpha" | "popular">("newest")

  const filtered = useMemo(() => {
    let list = VOICES.filter((v) => {
      if (filters.language !== "All" && v.language !== filters.language) return false
      if (filters.gender !== "All" && v.gender !== filters.gender) return false
      if (filters.use !== "All" && v.use !== filters.use) return false
      if (filters.age !== "All" && v.age !== filters.age) return false
      if (query) {
        const q = query.toLowerCase()
        const hay = `${v.name} ${v.accent} ${v.use} ${v.tags.join(" ")} ${v.language}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    if (sort === "alpha") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === "popular") {
      list = [...list].sort((a, b) => a.seed - b.seed)
    }
    return list
  }, [query, filters, sort])

  const activeFilterCount = (Object.keys(filters) as FilterKey[]).filter(
    (k) => filters[k] !== "All",
  ).length

  const clearFilters = () => {
    setFilters({ language: "All", gender: "All", use: "All", age: "All" })
    setQuery("")
  }

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="01" label="Voice library · v3" />
            <h1 className="mt-4 max-w-3xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.04em] lg:text-7xl">
              Voices, indexed.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              Every voice in the library is owned, consented, and watermarked. Filter by language, gender, age, or use case — preview inline, no signup required.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Total · {VOICES.length.toString().padStart(4, "0")}
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Showing · {filtered.length.toString().padStart(4, "0")}
            </div>
          </div>
        </div>

        {/* Search + sort row */}
        <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, accent, use case, or tag..."
              className="h-11 w-full rounded-sm border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
              aria-label="Search voices"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-sm border border-border bg-card px-3 h-11 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
              <span>Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="bg-transparent text-foreground focus:outline-none"
                aria-label="Sort voices"
              >
                <option value="newest">Newest</option>
                <option value="alpha">A → Z</option>
                <option value="popular">Popular</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 items-center gap-1.5 rounded-sm border border-border bg-card px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
              >
                Clear ({activeFilterCount})
                <X className="h-3 w-3" aria-hidden />
              </button>
            )}
          </div>
        </div>

        {/* Filter chip rows */}
        <div className="mt-6 space-y-3">
          {(Object.keys(VOICE_FILTERS) as FilterKey[]).map((key) => (
            <div key={key} className="flex flex-wrap items-center gap-2">
              <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {FILTER_LABELS[key]}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {VOICE_FILTERS[key].map((opt) => {
                  const active = filters[key] === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, [key]: opt }))}
                      className={cn(
                        "rounded-sm border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                        active
                          ? "border-primary/60 bg-primary/15 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-card p-16 text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                No voices match
              </div>
              <h3 className="text-2xl font-medium tracking-tight">Nothing in the index for that query.</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Try removing a filter or searching for a different language. Or upload a sample to clone your own.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 inline-flex h-9 items-center rounded-sm border border-border bg-background px-4 text-sm text-foreground hover:border-primary/60"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((v) => (
                <VoiceCard key={v.id} voice={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
