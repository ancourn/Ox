'use client';

import { useState } from 'react';

export default function DocsPage() {
  const [fileId] = useState('1'); // In real app, from URL or Drive
  const onlyOfficeUrl = `http://localhost:8002/welcome`;

  return (
    <div className="h-full bg-white dark:bg-gray-800">
      <iframe
        src={onlyOfficeUrl}
        className="w-full h-full border-none"
        title="Oxlas Docs"
        allow="fullscreen"
      />
    </div>
  );
}