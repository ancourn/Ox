'use client';

import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import Dashboard from '@/components/oxlas/Dashboard';

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}