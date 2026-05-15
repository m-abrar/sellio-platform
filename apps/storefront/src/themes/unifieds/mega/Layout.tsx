
import React from 'react';
import './styles.css';
import { MegaHeader, AuthorityFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="heavyweight-grid-wrapper">
      <MegaHeader />
      <main>
        {children}
      </main>
      <AuthorityFooter />
    </div>
  );
}
