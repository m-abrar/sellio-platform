import React from 'react';
import './styles.css';
import { ExecutiveHeader, DiscreetFooter } from './components';

export default function ExecutiveSearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jobs-luxury">
      <ExecutiveHeader />
      <main className="executive-portal-container">
        {children}
      </main>
      <DiscreetFooter />
    </div>
  );
}
