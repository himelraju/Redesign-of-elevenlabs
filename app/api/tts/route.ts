import { NextResponse } from "next/server"

export const runtime = "nodejs"

const ELEVEN_ENDPOINT = "https://api.elevenlabs.io/v1/text-to-speech"

type ElevenError = {
  detail?:
    | string
    | {
        status?: string
        message?: string
      }
}

function humanizeUpstreamError(status: number, body: string): string {
  // Try to parse ElevenLabs's structured error envelope.
  let parsed: ElevenError | null = null
  try {
    parsed = JSON.parse(body) as ElevenError
  } catch {
    // not JSON
  }

  const detail = parsed?.detail
  const upstreamMessage =
    typeof detail === "string"
      ? detail
      : typeof detail?.message === "string"
        ? detail.message
        : ""
  const upstreamStatus = typeof detail === "object" ? detail?.status : undefined

  if (status === 401) {
    return "ElevenLabs rejected the API key. Verify ELEVENLABS_API_KEY is correct and active."
  }
  if (status === 402 || upstreamStatus === "quota_exceeded") {
    return (
      upstreamMessage ||
      "ElevenLabs quota exceeded. The connected account has no remaining character credits — top up the plan or use a key with available quota."
    )
  }
  if (status === 422) {
    return upstreamMessage || "Invalid request. The selected voice or text was rejected."
  }
  if (status === 429) {
    return "ElevenLabs rate limit reached. Wait a moment and try again."
  }
  return upstreamMessage || `ElevenLabs error (HTTP ${status}).`
}

export async function POST(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured on the server." },
      { status: 500 },
    )
  }

  let body: { text?: string; voiceId?: string; modelId?: string; stability?: number; similarity?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const text = (body.text ?? "").trim()
  const voiceId = body.voiceId?.trim()

  if (!text) {
    return NextResponse.json({ error: "Missing 'text'." }, { status: 400 })
  }
  if (!voiceId) {
    return NextResponse.json({ error: "Missing 'voiceId'." }, { status: 400 })
  }
  if (text.length > 1000) {
    return NextResponse.json({ error: "Text too long. Max 1000 characters." }, { status: 400 })
  }

  const modelId = body.modelId ?? "eleven_multilingual_v2"
  const stability = typeof body.stability === "number" ? body.stability : 0.5
  const similarity = typeof body.similarity === "number" ? body.similarity : 0.75

  let upstream: Response
  try {
    upstream = await fetch(`${ELEVEN_ENDPOINT}/${encodeURIComponent(voiceId)}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarity,
        },
      }),
      cache: "no-store",
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Could not reach ElevenLabs.", detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    )
  }

  if (!upstream.ok) {
    const raw = await upstream.text().catch(() => "")
    const message = humanizeUpstreamError(upstream.status, raw)
    return NextResponse.json(
      {
        error: message,
        upstreamStatus: upstream.status,
        // Forward the parsed status code so the client can react (e.g. show a "quota" badge)
        code:
          upstream.status === 402
            ? "quota_exceeded"
            : upstream.status === 401
              ? "invalid_key"
              : upstream.status === 429
                ? "rate_limited"
                : "upstream_error",
      },
      { status: upstream.status === 401 || upstream.status === 402 ? upstream.status : 502 },
    )
  }

  const audio = await upstream.arrayBuffer()
  return new NextResponse(audio, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  })
}
