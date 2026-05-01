"use client"

import { useState } from "react"
import { Check } from "lucide-react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    // Frontend-only demo: pretend to subscribe
    setSubmitted(true)
    setEmail("")
    window.setTimeout(() => setSubmitted(false), 2400)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-sm items-center gap-2">
      <label htmlFor="newsletter" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@studio.com"
        className="h-9 flex-1 rounded-sm border border-border bg-card px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
      <button
        type="submit"
        className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-foreground px-3 font-mono text-xs uppercase tracking-[0.16em] text-background transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        {submitted ? (
          <>
            <Check className="h-3 w-3" aria-hidden /> Subscribed
          </>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  )
}
