
import React from 'react';
import './styles.css';
import { JobsHeader, JobsFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jm-wrapper">
      <JobsHeader />
      <main className="jm-main">
        {children}
      </main>
      <JobsFooter />
    </div>
  );
}
