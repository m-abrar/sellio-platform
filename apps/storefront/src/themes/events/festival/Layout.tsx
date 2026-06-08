import React from 'react';
import { FestivalHeader, NexusFooter } from './components';
import './styles.css';
import '@/themes/events/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-festival-theme">
      <FestivalHeader />
      <main>
        {children}
      </main>
      <NexusFooter />
    </div>
  );
}
