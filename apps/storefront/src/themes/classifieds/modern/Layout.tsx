import React from 'react';
import './styles.css';
import { HubHeader, HubFooter } from './components';

export default function ModernHubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="classifieds-modern">
      <HubHeader />
      <main className="modern-hub-container">
        {children}
      </main>
      <HubFooter />
    </div>
  );
}
