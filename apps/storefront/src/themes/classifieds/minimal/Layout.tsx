import React from 'react';
import './styles.css';
import { MinimalHeader, MinimalFooter } from './components';

export default function MinimalClassifiedsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="classifieds-minimal">
      <MinimalHeader />
      <main className="minimal-container">
        {children}
      </main>
      <MinimalFooter />
    </div>
  );
}
