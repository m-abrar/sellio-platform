
import React from 'react';
import './styles.css';
import { StudioHeader, StudioFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="creative-services-wrapper">
      <StudioHeader />
      <main>
        {children}
      </main>
      <StudioFooter />
    </div>
  );
}
