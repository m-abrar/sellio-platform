
import React from 'react';

interface SkylineSyncBarProps {
    nodeCount?: number;
}

export const SkylineSyncBar = ({ nodeCount = 0 }: SkylineSyncBarProps) => (
    <section className="skyline-sync-bar" aria-label="Marketplace highlights">
        <span>Verified listings</span>
        <span>Updated daily</span>
        <span>Secure inquiries</span>
        <span>
          {nodeCount > 0 ? `${nodeCount} properties listed` : 'Listings loading'}
        </span>
    </section>
);
