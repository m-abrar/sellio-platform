
import React from 'react';
import './styles.css';
import { CommunityHeader, ActiveFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="classifieds-local-wrapper">
      <CommunityHeader />
      <main>
        {children}
      </main>
      <ActiveFooter />
    </div>
  );
}
