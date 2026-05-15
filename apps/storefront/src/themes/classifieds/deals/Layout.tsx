import React from 'react';
import './styles.css';
import { DealsHeader, UrgencyTicker } from './components';

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="classifieds-deals">
      <DealsHeader />
      <UrgencyTicker />
      <main className="deals-container">
        {children}
      </main>
      <footer style={{ padding: '4rem 2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
        SELLIO_CLASSIFIEDS_DEALS_ENGINE_V4.0 // (C) 2026
      </footer>
    </div>
  );
}
