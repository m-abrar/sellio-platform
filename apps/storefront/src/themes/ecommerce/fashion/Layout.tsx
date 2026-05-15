
import React from 'react';
import './styles.css';
import { VogueHeader, AtelierFooter } from './components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-fashion-wrapper">
      <VogueHeader />
      <main>
        {children}
      </main>
      <AtelierFooter />
    </div>
  );
}
