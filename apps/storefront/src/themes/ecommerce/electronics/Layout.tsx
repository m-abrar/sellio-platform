import React from 'react';
import { SiliconHeader, SystemFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-electronics-theme">
      <SiliconHeader />
      <main>
        {children}
      </main>
      <SystemFooter />
    </div>
  );
}
