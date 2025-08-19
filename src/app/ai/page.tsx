'use client';

import { useState, useEffect } from 'react';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingService, setIsCheckingService] = useState(true);
  const [serviceAvailable, setServiceAvailable] = useState(false);

  // Check if AI service is available
  useEffect(() => {
    const checkAIService = async () => {
      try {
        const res = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: 'test' }),
        });
        setServiceAvailable(res.ok);
      } catch (err) {
        setServiceAvailable(false);
      } finally {
        setIsCheckingService(false);
      }
    };

    checkAIService();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    setError('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Network error');
      }
      
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResponse(data.response);
      }
    } catch (err: any) {
      setError(`❌ Failed to reach AI engine: ${err.message}`);
      console.error('AI Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const retryServiceCheck = () => {
    setIsCheckingService(true);
    setServiceAvailable(false);
    // Re-check service
    setTimeout(() => {
      const checkAIService = async () => {
        try {
          const res = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'test' }),
          });
          setServiceAvailable(res.ok);
        } catch (err) {
          setServiceAvailable(false);
        } finally {
          setIsCheckingService(false);
        }
      };
      checkAIService();
    }, 1000);
  };

  if (isCheckingService) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking AI service...</p>
        </div>
      </div>
    );
  }

  if (!serviceAvailable) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold mb-4">AI Assistant Offline</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Service Unavailable</h2>
            <p className="text-red-700 mb-4">
              The AI service is currently not running. Please start the Ollama service to use AI features.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-left">
              <h3 className="font-semibold mb-2">To fix this issue:</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Start Ollama: <code className="bg-gray-200 px-1 rounded">docker compose up -d ollama</code></li>
                <li>Wait for Llama 3 model to download: <code className="bg-gray-200 px-1 rounded">docker compose exec ollama ollama pull llama3</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
          <button
            onClick={retryServiceCheck}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🧠 Oxlas AI Assistant</h1>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything: 'Summarize my inbox', 'Draft a reply', 'Schedule a meeting'"
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {response && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="font-semibold mb-2">AI Response:</h2>
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{response}</div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Ask for email summaries, meeting notes, or document drafts</li>
          <li>• Request help with scheduling or task management</li>
          <li>• Get creative ideas or problem-solving assistance</li>
          <li>• The AI runs locally on your infrastructure for privacy</li>
        </ul>
      </div>
    </div>
  );
}