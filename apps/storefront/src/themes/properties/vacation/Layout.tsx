import React from 'react';
import { VacationHeader, EscapeFooter } from './components';
import './styles.css';
import '@/themes/properties/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-vacation-theme">
      <VacationHeader />
      <main>
        {children}
      </main>
      <EscapeFooter />
    </div>
  );
}
