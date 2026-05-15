
import React from 'react';
import './styles.css';
import { MinimalHeader, SimpleFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="minimal-wrapper">
      <MinimalHeader />
      <main>
        {children}
      </main>
      <SimpleFooter />
    </div>
  );
}
