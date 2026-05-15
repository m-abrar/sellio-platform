
import React from 'react';
import './styles.css';
import { CommunityNav, NeighborhoodFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="neighborhood-wrapper">
      <CommunityNav />
      <main>
        {children}
      </main>
      <NeighborhoodFooter />
    </div>
  );
}
