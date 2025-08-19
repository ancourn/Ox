'use client';

import { useState } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { ComingSoon } from '@/components/ui/coming-soon';
import { Clipboard, FileText, Users } from 'lucide-react';

export default function Forms() {
  const features = [
    {
      title: 'Form Builder',
      description: 'Drag-and-drop form creation interface',
    },
    {
      title: 'Data Collection',
      description: 'Collect and analyze form responses',
    },
    {
      title: 'Surveys & Polls',
      description: 'Create surveys and polls for feedback',
    }
  ];

  const integration = {
    name: 'Formbricks',
    description: 'Open-source form and survey platform',
    features: [
      'Form builder',
      'Survey creation',
      'Response collection',
      'Data analysis',
      'A/B testing',
      'Integrations',
    ],
    benefits: [
      'Open-source',
      'Self-hosted',
      'Privacy-focused',
      'GDPR compliant',
      'Real-time analytics',
      'Customizable',
    ],
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <ComingSoon
          title="Forms"
          description="Form builder and surveys with Formbricks integration"
          icon={Clipboard}
          features={features}
          integration={integration}
          color="from-yellow-100 to-yellow-200"
        />
      </div>
    </div>
  );
}