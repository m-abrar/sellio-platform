import React from 'react';
import './styles.css';
import { EventHeader, EventFooter } from './components';

export default function ModernEventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-modern">
      <EventHeader />
      <main className="modern-events-container">
        {children}
      </main>
      <EventFooter />
    </div>
  );
}
