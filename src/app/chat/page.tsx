'use client';

import { useState } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { ComingSoon } from '@/components/ui/coming-soon';
import { MessageSquare, Users, Phone } from 'lucide-react';

export default function Chat() {
  const features = [
    {
      title: 'Team Messaging',
      description: 'Real-time team communication and messaging',
    },
    {
      title: 'Video Calls',
      description: 'Integrated video and voice calling',
    },
    {
      title: 'File Sharing',
      description: 'Share files and documents within chats',
    }
  ];

  const integration = {
    name: 'Matrix + Element',
    description: 'Secure, decentralized communication platform',
    features: [
      'End-to-end encryption',
      'Cross-platform support',
      'Bridging to other networks',
      'File sharing',
      'Voice/video calls',
      'Bots and integrations',
    ],
    benefits: [
      'Open-source',
      'Self-hosted',
      'Federated',
      'Privacy-focused',
      'Extensible',
      'Standards-based',
    ],
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <ComingSoon
          title="Chat"
          description="Secure team messaging with Matrix and Element integration"
          icon={MessageSquare}
          features={features}
          integration={integration}
          color="from-pink-100 to-pink-200"
        />
      </div>
    </div>
  );
}