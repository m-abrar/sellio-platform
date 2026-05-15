
import React from 'react';
import './styles.css';
import { HeritageHeader, LegacyFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-classic-wrapper">
      <HeritageHeader />
      <main>
        {children}
      </main>
      <LegacyFooter />
    </div>
  );
}
