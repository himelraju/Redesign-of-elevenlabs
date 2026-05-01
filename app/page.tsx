import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { Hero } from "@/components/site/landing/hero"
import { LogoStrip } from "@/components/site/landing/logo-strip"
import { ProductsBento } from "@/components/site/landing/products-bento"
import { Stats } from "@/components/site/landing/stats"
import { VoicesTeaser } from "@/components/site/landing/voices-teaser"
import { Developers } from "@/components/site/landing/developers"
import { Enterprise } from "@/components/site/landing/enterprise"
import { FinalCta } from "@/components/site/landing/final-cta"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <LogoStrip />
        <ProductsBento />
        <Stats />
        <VoicesTeaser />
        <Developers />
        <Enterprise />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
