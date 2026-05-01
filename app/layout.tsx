import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { RevealObserver } from "@/components/site/reveal-observer"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "ElevenLabs — Resonance OS for synthetic sound",
  description:
    "The runtime for synthetic voice. Generate, clone, and orchestrate human-grade audio across 32 languages with the lowest latency in the industry.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0A0B0D",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased text-foreground selection:bg-primary selection:text-primary-foreground">
        {children}
        <RevealObserver />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
