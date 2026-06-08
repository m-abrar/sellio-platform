import React from 'react';
import './styles.css';
import '@/themes/autos/shared/subpages.css';
import { UsedHeader, UsedFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-used-wrapper">
      <UsedHeader />
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>
      <UsedFooter />
    </div>
  );
}

