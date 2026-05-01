export type Voice = {
  id: string
  /** Real ElevenLabs preset voice ID — the source of truth used by /api/tts. */
  elevenLabsId: string
  /** Short sentence the card plays as a preview. */
  sample: string
  number: string
  name: string
  gender: "Female" | "Male" | "Neutral"
  accent: string
  language: string
  age: "Young" | "Middle-aged" | "Mature"
  use: string
  description: string
  tags: string[]
  /** Seed used by the procedural waveform for deterministic visuals */
  seed: number
}

/**
 * Public ElevenLabs preset voice IDs. Each fictional library voice is mapped
 * to the closest matching preset so clicking Play returns real audio.
 */
export const VOICES: Voice[] = [
  {
    id: "atlas",
    elevenLabsId: "pNInz6obpgDQGcFmaJgB", // Adam — deep, mature
    sample: "I'm Atlas. Built for documentary and long-form, my baritone settles into stories like an old friend.",
    number: "001",
    name: "Atlas",
    gender: "Male",
    accent: "American",
    language: "EN-US",
    age: "Mature",
    use: "Narration",
    description: "Warm, deliberate baritone built for documentary and long-form audio.",
    tags: ["Narration", "Documentary", "Audiobook"],
    seed: 11,
  },
  {
    id: "luma",
    elevenLabsId: "21m00Tcm4TlvDq8ikWAM", // Rachel — bright, articulate
    sample: "Hi, I'm Luma. Crisp and articulate — perfect for assistants, product UIs, and confident brand voices.",
    number: "002",
    name: "Luma",
    gender: "Female",
    accent: "British",
    language: "EN-GB",
    age: "Young",
    use: "Conversational",
    description: "Bright and articulate. Engineered for assistants and product UIs.",
    tags: ["Assistant", "Product", "UI"],
    seed: 23,
  },
  {
    id: "onyx",
    elevenLabsId: "TxGEqnHWrfWFTfGW9XjX", // Josh — deep
    sample: "This is Onyx. Cinematic low end, unhurried cadence — built for trailers and brand intros.",
    number: "003",
    name: "Onyx",
    gender: "Male",
    accent: "American",
    language: "EN-US",
    age: "Mature",
    use: "Cinematic",
    description: "Cinematic low end with an unhurried cadence. Best for trailers and intros.",
    tags: ["Cinematic", "Trailer", "Brand"],
    seed: 41,
  },
  {
    id: "vega",
    elevenLabsId: "EXAVITQu4vr4xnSDxMaL", // Bella — clean, broadcast-friendly
    sample: "I'm Vega. Crisp diction with broadcast-grade clarity, ready for news desks and corporate stages.",
    number: "004",
    name: "Vega",
    gender: "Female",
    accent: "Latin American",
    language: "ES-LA",
    age: "Middle-aged",
    use: "News",
    description: "Crisp, neutral Spanish with broadcast-grade diction across long runs.",
    tags: ["News", "Broadcast", "Corporate"],
    seed: 67,
  },
  {
    id: "ember",
    elevenLabsId: "MF3mGyEYCl7XYWbV9V6O", // Elli — energetic, young
    sample: "Hey, I'm Ember. Energetic, expressive, and tuned for ads, games, and short-form content.",
    number: "005",
    name: "Ember",
    gender: "Female",
    accent: "Japanese",
    language: "JA-JP",
    age: "Young",
    use: "Energetic",
    description: "Energetic and expressive. Optimized for ads, games, and short-form.",
    tags: ["Advertising", "Games", "Social"],
    seed: 89,
  },
  {
    id: "halo",
    elevenLabsId: "AZnzlk1XvdvUeBnXmlld", // Domi — confident, neutral
    sample: "I'm Halo. Calm, steady, and androgynous — designed for accessibility, IVR, and assistants.",
    number: "006",
    name: "Halo",
    gender: "Neutral",
    accent: "Mid-Atlantic",
    language: "EN-INTL",
    age: "Young",
    use: "Assistant",
    description: "Androgynous, calm, and steady. Tuned for accessibility and IVR.",
    tags: ["Accessibility", "IVR", "Assistant"],
    seed: 103,
  },
  {
    id: "kairo",
    elevenLabsId: "ErXwobaYiN019PkySvjV", // Antoni — bright, well-rounded
    sample: "Kairo here. Bright, punchy, and broadcast-ready — let's call the play.",
    number: "007",
    name: "Kairo",
    gender: "Male",
    accent: "Australian",
    language: "EN-AU",
    age: "Middle-aged",
    use: "Sports",
    description: "Bright, punchy delivery with broadcast energy and urgent inflection.",
    tags: ["Sports", "Broadcast", "Live"],
    seed: 131,
  },
  {
    id: "noor",
    elevenLabsId: "EXAVITQu4vr4xnSDxMaL", // Bella — measured for documentary
    sample: "I'm Noor. Measured pacing and precise pronunciation — suited to documentary and long-form audio.",
    number: "008",
    name: "Noor",
    gender: "Female",
    accent: "Arabic",
    language: "AR-MSA",
    age: "Middle-aged",
    use: "Documentary",
    description: "Modern Standard Arabic, precise pronunciation, suited to long-form.",
    tags: ["Documentary", "News", "Audiobook"],
    seed: 149,
  },
  {
    id: "rune",
    elevenLabsId: "VR6AewLTigWG4xSOukaG", // Arnold — crisp, weighted
    sample: "I'm Rune. Cool, weighted timbre with a distinctive Scandinavian cadence.",
    number: "009",
    name: "Rune",
    gender: "Male",
    accent: "Nordic",
    language: "EN-INTL",
    age: "Mature",
    use: "Cinematic",
    description: "Cool, weighted timbre with a distinctive Scandinavian cadence.",
    tags: ["Cinematic", "Brand", "Trailer"],
    seed: 173,
  },
  {
    id: "sable",
    elevenLabsId: "21m00Tcm4TlvDq8ikWAM", // Rachel — storytelling
    sample: "I'm Sable. Subtle dynamics for character work, with a warm storytelling tone.",
    number: "010",
    name: "Sable",
    gender: "Female",
    accent: "American",
    language: "EN-US",
    age: "Young",
    use: "Audiobook",
    description: "Rich storytelling voice with subtle dynamics for character work.",
    tags: ["Audiobook", "Narration", "Character"],
    seed: 197,
  },
  {
    id: "kepler",
    elevenLabsId: "yoZ06aMxZJJ28mfd3POQ", // Sam — neutral, modern
    sample: "Kepler online. An overtly synthetic voice — designed for sci-fi UIs and game AIs.",
    number: "011",
    name: "Kepler",
    gender: "Neutral",
    accent: "Synthetic",
    language: "EN-SYN",
    age: "Young",
    use: "Sci-fi",
    description: "An overtly synthetic voice. Designed for sci-fi UIs and game AIs.",
    tags: ["Games", "Sci-fi", "UI"],
    seed: 211,
  },
  {
    id: "soren",
    elevenLabsId: "pNInz6obpgDQGcFmaJgB", // Adam — composed, professional
    sample: "I'm Soren. Composed, professional, with a measured tempo for corporate and e-learning content.",
    number: "012",
    name: "Soren",
    gender: "Male",
    accent: "German",
    language: "DE-DE",
    age: "Middle-aged",
    use: "Corporate",
    description: "Composed, professional, with a measured tempo for corporate use.",
    tags: ["Corporate", "E-learning", "News"],
    seed: 233,
  },
]

export const VOICE_FILTERS = {
  language: ["All", "EN-US", "EN-GB", "EN-AU", "EN-INTL", "ES-LA", "JA-JP", "AR-MSA", "DE-DE", "EN-SYN"],
  gender: ["All", "Female", "Male", "Neutral"],
  use: [
    "All",
    "Narration",
    "Conversational",
    "Cinematic",
    "News",
    "Energetic",
    "Assistant",
    "Sports",
    "Documentary",
    "Audiobook",
    "Sci-fi",
    "Corporate",
  ],
  age: ["All", "Young", "Middle-aged", "Mature"],
} as const
