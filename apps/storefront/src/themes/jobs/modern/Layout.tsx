import React from 'react';
import './styles.css';
import { TalentHeader, ModernJobFooter } from './components';

export default function ModernJobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jobs-modern">
      <TalentHeader />
      <main className="modern-jobs-container">
        {children}
      </main>
      <ModernJobFooter />
    </div>
  );
}
