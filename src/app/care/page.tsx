'use client';

import { useState } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { ComingSoon } from '@/components/ui/coming-soon';
import { Headset, Users, MessageSquare, Phone } from 'lucide-react';

export default function Care() {
  const features = [
    {
      title: 'Ticket Management',
      description: 'Comprehensive ticket tracking and resolution system',
    },
    {
      title: 'Customer Support',
      description: 'Multi-channel customer support management',
    },
    {
      title: 'Knowledge Base',
      description: 'Self-service help articles and documentation',
    }
  ];

  const integration = {
    name: 'Zammad',
    description: 'Professional helpdesk and customer support platform',
    features: [
      'Ticket management system',
      'Customer communication',
      'Knowledge base',
      'Automation workflows',
      'Multi-channel support',
      'Reporting and analytics',
    ],
    benefits: [
      'Open-source',
      'Self-hosted',
      'GDPR compliant',
      'API access',
      'Mobile responsive',
      'Customizable',
    ],
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <ComingSoon
          title="Care"
          description="Customer support and helpdesk management with Zammad integration"
          icon={Headset}
          features={features}
          integration={integration}
          color="from-teal-100 to-teal-200"
        />
      </div>
    </div>
  );
}