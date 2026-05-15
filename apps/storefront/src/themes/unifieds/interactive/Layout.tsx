import React from 'react';
import './styles.css';
import { InteractiveHeader, PulseFooter } from './components';

export default function InteractiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unifieds-interactive">
      <InteractiveHeader />
      <main className="interactive-container">
        {children}
      </main>
      <PulseFooter />
    </div>
  );
}
