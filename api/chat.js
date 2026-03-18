module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Server is missing ANTHROPIC_API_KEY.' } });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ error: { message: 'Invalid JSON body.' } });
    }
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: { message: 'messages must be a non-empty array.' } });
  }

  const payload = {
    model: body?.model || process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
    max_tokens: Math.min(Number(body?.max_tokens) || 1200, 4000),
    messages
  };

  if (typeof body?.system === 'string' && body.system.trim()) {
    payload.system = body.system.trim();
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    const data = await upstream.json().catch(() => ({ error: { message: 'Invalid response from Anthropic.' } }));

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: {
          message: data?.error?.message || 'Anthropic request failed.'
        }
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: 'Failed to reach Anthropic service.' } });
  }
};
