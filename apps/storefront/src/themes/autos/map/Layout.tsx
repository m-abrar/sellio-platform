import React from 'react';
import './styles.css';
import { DealerMapHeader } from './components';

export default function AutosMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="autos-map">
      <div className="autos-map-wrapper">
        <DealerMapHeader />
        <div className="autos-split-container">
          {children}
        </div>
      </div>
    </div>
  );
}
