'use client';

import { useState } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { ComingSoon } from '@/components/ui/coming-soon';
import { Book, FileText, Users } from 'lucide-react';

export default function Wiki() {
  const features = [
    {
      title: 'Documentation',
      description: 'Comprehensive documentation and knowledge base',
    },
    {
      title: 'Collaborative Editing',
      description: 'Real-time collaborative document editing',
    },
    {
      title: 'Version Control',
      description: 'Document version history and change tracking',
    }
  ];

  const integration = {
    name: 'Outline',
    description: 'Modern wiki and knowledge base platform',
    features: [
      'Rich text editor',
      'Document collaboration',
      'Version history',
      'Search functionality',
      'Access controls',
      'API integration',
    ],
    benefits: [
      'Open-source',
      'Self-hosted',
      'Modern UI',
      'Real-time collaboration',
      'Markdown support',
      'Customizable',
    ],
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <ComingSoon
          title="Wiki"
          description="Collaborative documentation and knowledge base with Outline integration"
          icon={Book}
          features={features}
          integration={integration}
          color="from-indigo-100 to-indigo-200"
        />
      </div>
    </div>
  );
}