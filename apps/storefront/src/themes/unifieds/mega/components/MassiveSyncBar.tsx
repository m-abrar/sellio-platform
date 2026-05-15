
import React from 'react';

export const MassiveSyncBar = () => (
    <section style={{ padding: '4rem 5%', background: '#f8f8f8', borderBottom: '1px solid var(--mega-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 900, color: '#aaa', letterSpacing: '4px' }}>
        <span>LOAD_BALANCING: ACTIVE</span>
        <span>LATENCY: 5ms</span>
        <span>THROUGHPUT: UNLIMITED</span>
        <span>SECURITY_PROTOCOL: AES_512</span>
    </section>
);
