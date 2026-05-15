
import React from 'react';
import './styles.css';
import { ServicesHeader } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="services-marketplace-wrapper">
      <ServicesHeader />
      <main>
        {children}
      </main>
      <footer style={{ background: '#0f172a', color: 'white', padding: '4rem', textAlign: 'center' }}>
        <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>© 2026 StyleTime Services Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}
