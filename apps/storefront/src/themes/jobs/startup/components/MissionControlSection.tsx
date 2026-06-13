'use client';

import React from 'react';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

export const MissionControlSection = () => {
    const eyebrow = useThemeContent('mission.eyebrow', 'Our Mission');
    const title = useThemeContent('mission.title', 'Operational\nExcellence.');
    const description = useThemeContent(
      'mission.description',
      'Every startup in our network is vetted for growth potential. We surface funding status, equity structures, and team culture so you can confidently choose your next opportunity.'
    );
    const metricOneValue = useThemeContent('mission.metric_1_value', '$4.2B');
    const metricOneLabel = useThemeContent('mission.metric_1_label', 'VC Funding Tracked');
    const metricTwoValue = useThemeContent('mission.metric_2_value', '12.4%');
    const metricTwoLabel = useThemeContent('mission.metric_2_label', 'Avg. Equity Offered');
    const image = useThemeMedia('mission.image', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072');

    return (
        <section style={{ padding: '10rem 6%', background: '#0a0f1d', borderTop: '1px solid var(--growth-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center' }}>
                <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--growth-neon)', letterSpacing: '5px' }}>{eyebrow}</span>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', fontWeight: 700, color: 'white', marginTop: '1.5rem', marginBottom: '3rem', letterSpacing: '-2px' }}>
                        {title.split('\n').map((line, index) => (
                            <React.Fragment key={`${line}-${index}`}>
                                {index > 0 && <br />}
                                {line}
                            </React.Fragment>
                        ))}
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--growth-dim)', lineHeight: 2, marginBottom: '4rem' }}>
                        {description}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                        <div className="growth-panel" style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--growth-neon)', fontFamily: 'var(--font-heading)' }}>{metricOneValue}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px' }}>{metricOneLabel}</div>
                        </div>
                        <div className="growth-panel" style={{ padding: '2rem' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--growth-neon)', fontFamily: 'var(--font-heading)' }}>{metricTwoValue}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px' }}>{metricTwoLabel}</div>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', width: '50px', height: '50px', borderTop: '2px solid var(--growth-neon)', borderLeft: '2px solid var(--growth-neon)' }}></div>
                    <div style={{ height: '500px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '24px', border: '1px solid var(--growth-border)', overflow: 'hidden' }}>
                        <img src={image} alt="Space Tech" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                    </div>
                </div>
            </div>
        </section>
    );
};
