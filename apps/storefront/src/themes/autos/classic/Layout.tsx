import React from 'react';
import { HeritageHeader, ArtisanFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-classic-theme">
      <HeritageHeader />
      <main>
        {children}
      </main>
      <ArtisanFooter />
    </div>
  );
}
