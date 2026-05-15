
import React from 'react';
import './styles.css';
import { ScaleHeader, StandardFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="scale-protocol-wrapper">
      <ScaleHeader />
      <main>
        {children}
      </main>
      <StandardFooter />
    </div>
  );
}
