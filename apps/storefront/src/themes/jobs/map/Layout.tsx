import React from 'react';
import './styles.css';
import { HubMapHeader } from './components';

export default function JobsMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="jobs-map">
      <div className="career-map-wrapper">
        <HubMapHeader />
        <div className="career-split-view">
          {children}
        </div>
      </div>
    </div>
  );
}
