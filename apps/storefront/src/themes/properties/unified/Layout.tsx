
import React from 'react';
import './styles.css';
import { MasterHeader, UnifiedFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-unified-wrapper">
      <MasterHeader />
      <main>
        {children}
      </main>
      <UnifiedFooter />
    </div>
  );
}
