import React from 'react';
import './styles.css';
import { SocialHeader } from './components';

export default function ModernRetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-modern">
      <SocialHeader />
      <main className="modern-ecommerce-container">
        {children}
      </main>
      <footer className="modern-ecommerce-footer">
        <div className="social-logo" style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>SELLIO_VIBE</div>
        <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>© 2026 THE_VIBE_RETAIL_GROUP</p>
      </footer>
    </div>
  );
}
