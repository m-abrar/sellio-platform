
import React from 'react';
import './styles.css';
import { UtilityNav, IndustrialFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blue-collar-jobs-wrapper">
      <UtilityNav />
      <main>
        {children}
      </main>
      <IndustrialFooter />
    </div>
  );
}
