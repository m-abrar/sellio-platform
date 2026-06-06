import React from 'react';
import { CommunityHeader, HoodFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-neighborhood-theme">
      <CommunityHeader />
      <main>
        {children}
      </main>
      <HoodFooter />
    </div>
  );
}
