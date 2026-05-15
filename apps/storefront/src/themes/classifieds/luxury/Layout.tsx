import React from 'react';
import './styles.css';
import { CollectionHeader, CollectorFooter } from './components';

export default function CuratedCollectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="classifieds-luxury">
      <CollectionHeader />
      <main className="curated-collection-container">
        {children}
      </main>
      <CollectorFooter />
    </div>
  );
}
