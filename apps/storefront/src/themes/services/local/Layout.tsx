
import React from 'react';
import './styles.css';
import { NeighborHeader, LocalFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="services-local-wrapper">
      <NeighborHeader />
      <main>
        {children}
      </main>
      <LocalFooter />
    </div>
  );
}
