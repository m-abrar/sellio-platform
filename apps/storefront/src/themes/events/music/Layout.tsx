
import React from 'react';
import './styles.css';
import { MusicHeader, MusicFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-music-wrapper">
      <MusicHeader />
      <main>
        {children}
      </main>
      <MusicFooter />
    </div>
  );
}
