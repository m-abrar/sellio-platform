import React from 'react';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="services-creative-theme">
      <main>
        {children}
      </main>
    </div>
  );
}
