
import React from 'react';
import './styles.css';
import { ReliableHeader, TrustFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="used-autos-wrapper">
      <ReliableHeader />
      <main>
        {children}
      </main>
      <TrustFooter />
    </div>
  );
}
