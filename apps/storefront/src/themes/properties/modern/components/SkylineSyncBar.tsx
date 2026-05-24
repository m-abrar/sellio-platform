
import React from 'react';

interface SkylineSyncBarProps {
    nodeCount?: number;
}

export const SkylineSyncBar = ({ nodeCount = 0 }: SkylineSyncBarProps) => (
    <section className="skyline-sync-bar" aria-label="Skyline sync status">
        <span>STRUCTURAL_INTEGRITY: 100%</span>
        <span>LATENCY: 5ms</span>
        <span>SKYLINE_SYNC: ACTIVE</span>
        <span>DISTRICT_NODES: {nodeCount > 0 ? nodeCount : '—'}</span>
    </section>
);
