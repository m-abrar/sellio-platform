
import React from 'react';
import './styles.css';
import { UtilityHeader, CommunityFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="classifieds-general-wrapper">
      <UtilityHeader />
      <main>
        {children}
      </main>
      <CommunityFooter />
    </div>
  );
}
