import React from 'react';
import { VenueHeader, LegacyFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-classic-theme">
      <VenueHeader />
      <main>
        {children}
      </main>
      <LegacyFooter />
    </div>
  );
}
