import React from 'react';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grocery-theme">
      <header className="grocery-header">
        <div className="grocery-logo">FreshMarket</div>
        <nav>
          <a href="#" style={{ color: '#2d6a4f', marginLeft: '2rem', fontWeight: 500 }}>Produce</a>
          <a href="#" style={{ color: '#2d6a4f', marginLeft: '2rem', fontWeight: 500 }}>Pantry</a>
          <a href="#" style={{ color: '#2d6a4f', marginLeft: '2rem', fontWeight: 500 }}>Recipes</a>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
