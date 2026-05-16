
import React from 'react';
import './styles.css';
import { HubHeader, HubFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cm-wrapper">
      <HubHeader />
      <main className="cm-main">
        {children}
      </main>
      <HubFooter />
    </div>
  );
}
