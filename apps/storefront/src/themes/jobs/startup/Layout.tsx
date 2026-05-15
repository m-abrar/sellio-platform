
import React from 'react';
import './styles.css';
import { GrowthHeader, NetworkFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="growth-node-wrapper">
      <GrowthHeader />
      <main>
        {children}
      </main>
      <NetworkFooter />
    </div>
  );
}
