
import React from 'react';
import './styles.css';
import { SilentHeader, ZenFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="silent-edge-wrapper">
      <SilentHeader />
      <main>
        {children}
      </main>
      <ZenFooter />
    </div>
  );
}
