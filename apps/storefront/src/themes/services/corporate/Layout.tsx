import React from 'react';
import { CorporateHeader, EnterpriseFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="services-corporate-theme">
      <CorporateHeader />
      <main>
        {children}
      </main>
      <EnterpriseFooter />
    </div>
  );
}
