
import React from 'react';
import './styles.css';
import { UnifiedHeader, UnifiedFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unified-default-wrapper">
      <UnifiedHeader />
      <main>
        {children}
      </main>
      <UnifiedFooter />
    </div>
  );
}
