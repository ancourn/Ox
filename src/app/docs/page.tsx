'use client';

import { useState, useEffect } from 'react';

export default function DocsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if OnlyOffice is accessible
    const checkOnlyOffice = async () => {
      try {
        const response = await fetch('http://localhost:8002/welcome', {
          method: 'HEAD',
          mode: 'no-cors'
        });
        setIsLoading(false);
      } catch (err) {
        setError('OnlyOffice service is not running. Please start the OnlyOffice container.');
        setIsLoading(false);
      }
    };

    checkOnlyOffice();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading OnlyOffice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Service Unavailable</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <h3 className="font-semibold mb-2">To fix this issue:</h3>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Start OnlyOffice: <code className="bg-gray-200 px-1 rounded">docker compose up -d onlyoffice</code></li>
              <li>Wait 2-3 minutes for OnlyOffice to initialize</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-800">
      <iframe
        src="http://localhost:8002/welcome"
        className="w-full h-full border-none"
        title="Oxlas Docs - OnlyOffice"
        allow="fullscreen"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  );
}