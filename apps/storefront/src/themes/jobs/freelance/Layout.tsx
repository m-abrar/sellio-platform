
import React from 'react';
import './styles.css';
import { FlexHeader, NetworkFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="freelance-jobs-wrapper">
      <FlexHeader />
      <main>
        {children}
      </main>
      <NetworkFooter />
    </div>
  );
}
