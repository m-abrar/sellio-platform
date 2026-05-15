import React from 'react';
import './styles.css';
import { MusicHeader, MusicFooter } from './components';

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-music">
      <MusicHeader />
      <main className="music-container">
        {children}
      </main>
      <MusicFooter />
    </div>
  );
}
