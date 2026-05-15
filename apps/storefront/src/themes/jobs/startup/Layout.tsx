
import React from 'react';
import './styles.css';
import { RocketHeader, PulseFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jobs-startup-wrapper">
      <RocketHeader />
      <main>
        {children}
      </main>
      <PulseFooter />
    </div>
  );
}
