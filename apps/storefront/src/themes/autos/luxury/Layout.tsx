
import React from 'react';
import './styles.css';
import { DiamondHeader, EliteDriveFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="diamond-drive-wrapper">
      <DiamondHeader />
      <main>
        {children}
      </main>
      <EliteDriveFooter />
    </div>
  );
}
