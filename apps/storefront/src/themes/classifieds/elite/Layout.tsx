
import React from 'react';
import './styles.css';
import { EliteHeader, DiamondFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="classifieds-premium-wrapper">
      <EliteHeader />
      <main>
        {children}
      </main>
      <DiamondFooter />
    </div>
  );
}
