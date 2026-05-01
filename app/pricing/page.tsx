import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { Pricing } from "@/components/site/pricing"
import { FinalCta } from "@/components/site/landing/final-cta"

export const metadata: Metadata = {
  title: "Pricing — ElevenLabs",
  description:
    "Five tiers, one runtime. Start free, scale on usage, switch to enterprise when procurement comes knocking.",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Pricing />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
