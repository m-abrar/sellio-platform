import React from 'react';
import './styles.css';
import '@/themes/ecommerce/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-electronics-wrapper">
      <main>
        {children}
      </main>
    </div>
  );
}
