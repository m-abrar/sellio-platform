import React from 'react';
import './styles.css';
import { ExperienceMapHeader } from './components';

export default function EventsMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="events-map">
      <div className="experience-map-wrapper">
        <ExperienceMapHeader />
        <div className="experience-split-view">
          {children}
        </div>
      </div>
    </div>
  );
}
