
import React from 'react';
import './styles.css';
import { CyberHeader, DeepFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-creative-wrapper">
      <CyberHeader />
      <main>
        {children}
      </main>
      <DeepFooter />
    </div>
  );
}
