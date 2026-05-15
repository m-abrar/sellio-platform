import React from 'react';
import './styles.css';
import { GlassNav, SaaSFooter } from './components';

export default function ModernSaaSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unifieds-modern">
      <GlassNav />
      <main className="modern-container">
        {children}
      </main>
      <SaaSFooter />
    </div>
  );
}
