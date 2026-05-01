import React from 'react';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fashion-theme">
      <header className="fashion-header">
        <div className="fashion-logo">LE BRINCE</div>
        <nav className="fashion-nav">
          <a href="#">Collections</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer style={{ padding: '4rem 5%', textAlign: 'center', borderTop: '1px solid #eee' }}>
        <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>© 2026 LE BRINCE MANUFACTURING. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
