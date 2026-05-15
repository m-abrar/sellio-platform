
import React from 'react';
import './styles.css';
import { MetroHeader, UrbanFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="urban-wrapper">
      <MetroHeader />
      <main>
        {children}
      </main>
      <UrbanFooter />
    </div>
  );
}
