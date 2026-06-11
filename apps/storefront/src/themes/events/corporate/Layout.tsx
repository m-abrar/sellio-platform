import React from 'react';
import { Header, Footer } from './components';
import './styles.css';
import '@/themes/events/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-corporate-theme">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
