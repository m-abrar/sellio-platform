import React from 'react';
import './styles.css';
import { TerminalHeader, StatusBar } from './components';

export default function TechLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jobs-tech">
      <TerminalHeader />
      <main className="tech-container">
        {children}
      </main>
      <StatusBar />
    </div>
  );
}
