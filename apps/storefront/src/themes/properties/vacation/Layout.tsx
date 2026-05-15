
import React from 'react';
import './styles.css';
import { EscapeHeader, SunnyFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="vacation-wrapper">
      <EscapeHeader />
      <main>
        {children}
      </main>
      <SunnyFooter />
    </div>
  );
}
