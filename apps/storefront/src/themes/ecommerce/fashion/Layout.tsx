import React from 'react';
import { RunwayHeader, AtelierFooter } from './components';
import './styles.css';
import '@/themes/ecommerce/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-fashion-theme">
      <RunwayHeader />
      <main>
        {children}
      </main>
      <AtelierFooter />
    </div>
  );
}
