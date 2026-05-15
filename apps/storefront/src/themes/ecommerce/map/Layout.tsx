import React from 'react';
import './styles.css';
import { BoutiqueMapHeader } from './components';

export default function BoutiqueMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ecommerce-map">
      <div className="boutique-map-wrapper">
        <BoutiqueMapHeader />
        <div className="boutique-split-container">
          {children}
        </div>
      </div>
    </div>
  );
}
