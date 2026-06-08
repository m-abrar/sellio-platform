
import React from 'react';
import './styles.css';
import { NexusHeader, NexusFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nexus-prime-wrapper">
      <NexusHeader />
      <main>
        {children}
      </main>
      <NexusFooter />
    </div>
  );
}
