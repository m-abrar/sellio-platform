import React from 'react';
import { ArtisanHeader, EditorialFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-showcase-theme">
      <ArtisanHeader />
      <main>
        {children}
      </main>
      <EditorialFooter />
    </div>
  );
}
