
import React from 'react';
import './styles.css';
import { LegacyHeader, AncestralFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="legacy-node-wrapper">
      <LegacyHeader />
      <main>
        {children}
      </main>
      <AncestralFooter />
    </div>
  );
}
