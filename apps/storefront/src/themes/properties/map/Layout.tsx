import React from 'react';
import './styles.css';
import { MapHeader } from './components';

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties-map">
      <div className="map-page-wrapper">
        <MapHeader />
        <div className="split-view-container">
          {children}
        </div>
      </div>
    </div>
  );
}
