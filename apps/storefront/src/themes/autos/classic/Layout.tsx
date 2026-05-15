import React from 'react';
import './styles.css';
import { DealerHeader, ClassicFooter } from './components';

export default function ClassicDealerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-classic">
      <DealerHeader />
      <main className="classic-inventory-container">
        {children}
      </main>
      <ClassicFooter />
    </div>
  );
}
