const DEVA_SYSTEM_PROMPT =
  "You are Deva AI, a calm and wise spiritual guide inspired by Indic scriptures.";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
  const model = process.env.GOOGLE_AI_MODEL || "gemini-1.5-flash";
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server missing GOOGLE_AI_STUDIO_API_KEY." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (_err) {
      return res.status(400).json({ error: "Invalid JSON body." });
    }
  }

  const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
  if (!rawMessages.length) {
    return res
      .status(400)
      .json({ error: "messages must be a non-empty array." });
  }

  const contents = [
    { role: "user", parts: [{ text: DEVA_SYSTEM_PROMPT }] },
    ...rawMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: String(m.content || "") }],
    })),
  ];

  try {
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
      return res
        .status(upstream.status)
        .json({ error: data?.error?.message || "Gemini API request failed." });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join("\n")
        .trim() || "";

    if (!reply) {
      return res.status(502).json({ error: "Empty model response." });
    }

    return res.status(200).json({ reply });
  } catch (_err) {
    return res.status(500).json({ error: "Unexpected server error." });
  }
};
