import React from 'react';
import './styles.css';
import { CommunityMapHeader } from './components';

export default function CommunityMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="classifieds-map">
      <div className="map-marketplace-wrapper">
        <CommunityMapHeader />
        <div className="map-split-view">
          {children}
        </div>
      </div>
    </div>
  );
}
