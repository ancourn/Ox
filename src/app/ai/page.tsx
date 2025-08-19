'use client';

import { useState } from 'react';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.response || data.error);
    } catch (err) {
      setResponse('Failed to reach AI engine. Is Ollama running?');
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🧠 Oxlas AI Assistant</h1>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything: 'Summarize my inbox', 'Draft a reply', 'Schedule a meeting'"
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {response && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}