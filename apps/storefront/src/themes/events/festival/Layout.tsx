
import React from 'react';
import './styles.css';
import { VibeHeader, NeonFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="festival-wrapper">
      <VibeHeader />
      <main>
        {children}
      </main>
      <NeonFooter />
    </div>
  );
}
