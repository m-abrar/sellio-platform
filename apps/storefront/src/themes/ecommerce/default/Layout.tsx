
import React from 'react';
import './styles.css';
import { StorefrontHeader, MainFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-default-wrapper">
      <StorefrontHeader />
      <main>
        {children}
      </main>
      <MainFooter />
    </div>
  );
}
