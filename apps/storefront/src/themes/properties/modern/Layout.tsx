
import React from 'react';
import './styles.css';
import { UrbanHeader, CivicFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="urban-node-wrapper">
      <UrbanHeader />
      <main>
        {children}
      </main>
      <CivicFooter />
    </div>
  );
}
