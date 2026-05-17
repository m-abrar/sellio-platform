import React from 'react';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="classifieds-modern-wrapper">
      <main>
        {children}
      </main>
    </div>
  );
}
