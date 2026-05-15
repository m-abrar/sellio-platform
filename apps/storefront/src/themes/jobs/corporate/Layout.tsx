
import React from 'react';
import './styles.css';
import { CareerHeader, LeadershipFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="corporate-jobs-wrapper">
      <CareerHeader />
      <main>
        {children}
      </main>
      <LeadershipFooter />
    </div>
  );
}
