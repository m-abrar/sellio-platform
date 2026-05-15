
import React from 'react';
import './styles.css';
import { EditorialHeader, AtelierFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-showcase-wrapper">
      <EditorialHeader />
      <main>
        {children}
      </main>
      <AtelierFooter />
    </div>
  );
}
