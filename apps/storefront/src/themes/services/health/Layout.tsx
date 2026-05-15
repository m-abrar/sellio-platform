
import React from 'react';
import './styles.css';
import { ClinicHeader, HealthFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="services-health-wrapper">
      <ClinicHeader />
      <main>
        {children}
      </main>
      <HealthFooter />
    </div>
  );
}
