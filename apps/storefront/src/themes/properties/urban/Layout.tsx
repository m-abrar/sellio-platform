import React from 'react';
import { SkylineHeader, CityPulseFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-urban-theme">
      <SkylineHeader />
      <main>
        {children}
      </main>
      <CityPulseFooter />
    </div>
  );
}
