
import React from 'react';
import './styles.css';
import { MotionHeader, KineticFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="motion-node-wrapper">
      <MotionHeader />
      <main>
        {children}
      </main>
      <KineticFooter />
    </div>
  );
}
