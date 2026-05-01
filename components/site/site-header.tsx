"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Command, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Logo } from "./logo"

const navItems = [
  { label: "Products", href: "/#products" },
  { label: "Voices", href: "/voices" },
  { label: "Pricing", href: "/pricing" },
  { label: "Developers", href: "/#developers" },
  { label: "Research", href: "/#research" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  // Scroll-driven density + a 1px progress strip at the top
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      const max =
        (document.documentElement.scrollHeight || 0) - window.innerHeight || 1
      setScrolled(y > 16)
      setProgress(Math.max(0, Math.min(1, y / max)))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[backdrop-filter,background-color,border-color] duration-300",
        scrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
          : "border-b border-border/40 bg-background/40 backdrop-blur-md",
      )}
    >
      {/* Scroll progress strip — sits at the very top of the header */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border/60"
      >
        <div
          className="h-full origin-left bg-primary transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <div
        className={cn(
          "mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-4 transition-[height] duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-12" : "h-14",
        )}
      >
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="shrink-0 rounded-sm transition-opacity hover:opacity-80"
            aria-label="ElevenLabs home"
          >
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active =
                item.href === "/voices"
                  ? pathname.startsWith("/voices")
                  : item.href === "/pricing"
                    ? pathname.startsWith("/pricing")
                    : false
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-sm px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-primary transition-transform duration-300",
                      active && "scale-x-100",
                    )}
                  />
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden h-8 items-center gap-2 rounded-sm border border-border bg-card/60 px-2.5 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground md:flex"
            aria-label="Open command palette"
          >
            <Command className="h-3 w-3" aria-hidden />
            <span>Search</span>
            <span className="ml-2 rounded-sm border border-border px-1.5 py-0.5 text-[10px]">
              ⌘K
            </span>
          </button>
          <Link
            href="/#signin"
            className="hidden h-8 items-center px-3 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/#start"
            className="group inline-flex h-8 items-center gap-1.5 rounded-sm bg-primary px-3 text-sm font-medium text-primary-foreground transition-[transform,filter,box-shadow] hover:brightness-110 hover:shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_20%,transparent)] active:scale-[0.98]"
          >
            Start building
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-card transition-colors hover:border-foreground/40 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <X className="h-4 w-4" aria-hidden />
            ) : (
              <Menu className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-3 text-sm text-foreground last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
