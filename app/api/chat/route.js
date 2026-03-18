import { NextResponse } from "next/server";

const DEVA_SYSTEM_PROMPT =
  "You are Deva AI, a calm and wise spiritual guide inspired by Indic scriptures. " +
  "Answer with clarity, compassion, and practical guidance. Keep tone respectful and grounded.";

export async function POST(req) {
  try {
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    const model = process.env.GOOGLE_AI_MODEL || "gemini-1.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing GOOGLE_AI_STUDIO_API_KEY." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    if (!rawMessages.length) {
      return NextResponse.json(
        { error: "messages must be a non-empty array." },
        { status: 400 }
      );
    }

    const contents = [
      { role: "user", parts: [{ text: DEVA_SYSTEM_PROMPT }] },
      ...rawMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: String(m.content || "") }],
      })),
    ];

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      }
    );

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const msg = data?.error?.message || "Gemini API request failed.";
      return NextResponse.json({ error: msg }, { status: upstream.status });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join("\n")
        .trim() || "";

    if (!reply) {
      return NextResponse.json(
        { error: "Empty model response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      reply,
      content: [{ text: reply }],
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error in /api/chat." },
      { status: 500 }
    );
  }
}
