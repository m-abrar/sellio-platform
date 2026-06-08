import React from 'react';
import './styles.css';
import { ClassicHeader, ClassicFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-classic-wrapper">
      <ClassicHeader />
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>
      <ClassicFooter />
    </div>
  );
}

