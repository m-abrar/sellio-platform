import React from 'react';
import { CoreHeader, CoreFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-electronics-theme">
      <CoreHeader />
      <main>
        {children}
      </main>
      <CoreFooter />
    </div>
  );
}
