import React from 'react';
import { CreativeHeader, VibrantFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-creative-theme">
      <CreativeHeader />
      <main>
        {children}
      </main>
      <VibrantFooter />
    </div>
  );
}
