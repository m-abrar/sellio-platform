import React from 'react';
import { WellnessHeader, ClinicFooter } from './components';
import './styles.css';
import '@/themes/services/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="services-health-theme">
      <WellnessHeader />
      <main>
        {children}
      </main>
      <ClinicFooter />
    </div>
  );
}
