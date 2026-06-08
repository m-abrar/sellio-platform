import React from 'react';
import { TechHeader, TechFooter } from './components';
import './styles.css';
import '@/themes/jobs/shared/subpages.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jobs-tech-wrapper">
      <TechHeader />
      <main>
        {children}
      </main>
      <TechFooter />
    </div>
  );
}
