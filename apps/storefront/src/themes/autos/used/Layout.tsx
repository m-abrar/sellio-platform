import React from 'react';
import { SelectHeader, RegistryFooter } from './components';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-used-theme">
      <SelectHeader />
      <main>
        {children}
      </main>
      <RegistryFooter />
    </div>
  );
}
