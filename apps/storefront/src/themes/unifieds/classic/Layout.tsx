
import React from 'react';
import './styles.css';
import { HeritageNav, TraditionalFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unified-classic-wrapper">
      <HeritageNav />
      <main>
        {children}
      </main>
      <TraditionalFooter />
    </div>
  );
}
