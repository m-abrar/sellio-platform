import React from 'react';
import { UniversalHeader, GlobalFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-unified-theme">
      <UniversalHeader />
      <main>
        {children}
      </main>
      <GlobalFooter />
    </div>
  );
}
