import React from 'react';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unified-minimal">
      <header className="minimal-header">
        <div style={{ fontWeight: 500 }}>SELLIO / MINIMAL</div>
        <button className="minimal-btn">MENU</button>
      </header>
      <main className="minimal-section">{children}</main>
    </div>
  );
}
