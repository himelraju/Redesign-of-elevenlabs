import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { VoiceLibrary } from "@/components/site/voice-library"

export const metadata: Metadata = {
  title: "Voice Library — ElevenLabs",
  description:
    "Browse 6,000+ consented, watermarked voices across 32 languages. Filter by language, gender, age, and use case.",
}

export default function VoicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <VoiceLibrary />
      </main>
      <SiteFooter />
    </div>
  )
}
