import React from 'react';
import { Header, StatusBar } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jobs-tech-theme">
      <Header />
      <main>
        {children}
      </main>
      <StatusBar />
    </div>
  );
}
