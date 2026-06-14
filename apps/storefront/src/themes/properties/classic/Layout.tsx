import React from 'react';
import { Header, Footer } from './components';
import './styles.css';
import '@/themes/properties/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-classic-theme">
      <Header />
      <main className="pc-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
