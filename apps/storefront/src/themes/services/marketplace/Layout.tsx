import React from 'react';
import { Header, Footer } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="services-marketplace-theme">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
