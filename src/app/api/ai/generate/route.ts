import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return Response.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const ollamaRes = await fetch('http://ollama:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      const err = await ollamaRes.text();
      return Response.json({ error: `Ollama error: ${err}` }, { status: 500 });
    }

    const ollamaData = await ollamaRes.json();
    return Response.json({ response: ollamaData.response });
  } catch (err: any) {
    return Response.json({ error: err.message || 'AI service unavailable' }, { status: 500 });
  }
}