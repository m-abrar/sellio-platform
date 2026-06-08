import React from 'react';
import './styles.css';
import '@/themes/autos/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-electric-wrapper">
      <main>
        {children}
      </main>
    </div>
  );
}
