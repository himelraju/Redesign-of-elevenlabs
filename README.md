# Resonance OS — A Futuristic ElevenLabs Redesign
**Utilized ElevenLabs’ audio API for voice generation and developed the application using v0.app.**

A complete UI/UX redesign of [ElevenLabs.io](https://elevenlabs.io), reimagined as the *operating system for synthetic sound*. **Resonance OS** feels like a control surface — telemetric, cinematic, instrumented.

Built with Next.js 16, Tailwind CSS v4, and a real ElevenLabs Text-to-Speech integration.

<img width="1024" height="1024" alt="cover" src="https://github.com/user-attachments/assets/443e406b-0589-42e5-a532-155a8489cc25" />





## Tech stack

- **[Next.js 16](https://nextjs.org)** App Router with React Server Components and tiny client islands per interactive component
- **[Tailwind CSS v4](https://tailwindcss.com)** with theme tokens defined in `app/globals.css`
- **[shadcn/ui](https://ui.shadcn.com)** primitives, themed to the Resonance OS palette
- **[Lucide](https://lucide.dev)** icons
- **Web Audio API** — `MediaElementAudioSourceNode → AnalyserNode` powers the live waveform
- **[ElevenLabs](https://elevenlabs.io)** TTS API (`eleven_multilingual_v2`)
- **[Vercel](https://vercel.com)** for hosting, env vars, edge-ready route handlers, and analytics

No external state, motion, or animation libraries — everything ships with the framework.

---

## How the ElevenLabs integration works

End-to-end and production-shaped:

- **Server-only API key.** A Next.js Route Handler at `app/api/tts/route.ts` reads `ELEVENLABS_API_KEY` from the environment. The browser never sees the key.
- **Real synthesis.** The route POSTs to `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` with `eleven_multilingual_v2` and streams `audio/mpeg` back to the client.
- **Real audio reactivity.** The returned MP3 plays through a hidden `<audio>` element wired into `MediaElementAudioSourceNode → AnalyserNode → destination`. The hero canvas and every voice card pull live frequency data from that analyser at 60fps.
- **Structured error handling.** ElevenLabs's `detail` envelope is parsed and returned with a machine-readable `code` (`quota_exceeded`, `invalid_key`, `rate_limited`, `upstream_error`). The UI surfaces a clear badge plus a one-click link to billing on quota issues.
- **Per-voice, per-text caching.** Generated clips are memoized by `voiceId + text` in memory so repeat plays are instant and don't re-bill the account.

---

## Project structure

```plaintext
app/
  api/tts/route.ts          # Server-only ElevenLabs proxy
  voices/page.tsx           # Voice library route
  pricing/page.tsx          # Pricing route
  layout.tsx                # Root layout, fonts, RevealObserver
  globals.css               # Theme tokens, motion keyframes, glow utilities
  page.tsx                  # Landing page composition
components/
  site/
    landing/                # Hero, products bento, stats, voices teaser, etc.
    live-demo.tsx           # Hero TTS demo + audio graph
    reactive-waveform.tsx   # Canvas waveform driven by AnalyserNode
    voice-card.tsx          # Voice library card with live frequency painting
    voice-library.tsx       # Searchable, filterable voice browser
    pricing.tsx             # Tiered cards + comparison matrix
    site-header.tsx         # Density-shifting header + scroll-progress strip
    site-footer.tsx         # Status strip + sitemap
    reveal-observer.tsx     # Global scroll-reveal IntersectionObserver
  ui/                       # shadcn/ui primitives
lib/
  voices.ts                 # Voice roster with real ElevenLabs voice IDs
  utils.ts                  # cn() helper
```
### Add your ElevenLabs API key

Create a `.env.local` file at the project root:

```shellscript
ELEVENLABS_API_KEY=sk_your_key_here
```
## Getting started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/elevenlabs-redesign.git
cd elevenlabs-redesign
pnpm install

### 3. Run the dev server

```shellscript
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Credits
Built for the ElevenLabs × v0 2026
