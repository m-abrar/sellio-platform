import React from 'react';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="electronics-theme">
      <header className="electronics-header">
        <div className="electronics-logo">SELLIO TECH</div>
        <nav>
          <a href="#" style={{ color: 'white', marginLeft: '2rem' }}>Hardware</a>
          <a href="#" style={{ color: 'white', marginLeft: '2rem' }}>Components</a>
          <a href="#" style={{ color: 'white', marginLeft: '2rem' }}>Support</a>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

// Moving Page to its own file next
