import React from 'react';
import { ShopHeader, TransactionFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-default-theme">
      <ShopHeader />
      <main>
        {children}
      </main>
      <TransactionFooter />
    </div>
  );
}
