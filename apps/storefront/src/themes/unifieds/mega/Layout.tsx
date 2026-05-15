
import React from 'react';
import './styles.css';
import { MegaHeader, VerticalFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unified-mega-wrapper">
      <MegaHeader />
      <main>
        {children}
      </main>
      <VerticalFooter />
    </div>
  );
}
