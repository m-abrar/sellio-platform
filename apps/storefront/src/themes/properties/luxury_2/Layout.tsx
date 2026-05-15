import React from 'react';
import { Header, Footer } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-luxury-2-theme">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
