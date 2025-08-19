'use client';

import { useEffect, useState } from 'react';

export default function TeamPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-full">Loading Team Board...</div>;
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <iframe
        src="http://localhost:10240" // ← Planka internal URL
        className="w-full h-full border-none"
        title="Oxlas Team"
        loading="eager"
      />
    </div>
  );
}