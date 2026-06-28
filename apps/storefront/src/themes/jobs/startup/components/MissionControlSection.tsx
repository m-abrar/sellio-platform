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
    const imageAlt = useThemeContent('mission.image_alt', 'Mission visual');
    const image = useThemeMedia('mission.image', '/themes/jobs/startup/mission-visual.svg');

    return (
        <section className="growth-mission-section">
            <div className="growth-mission-grid">
                <div>
                    <span className="growth-mission-eyebrow">{eyebrow}</span>
                    <h2 className="growth-mission-heading">
                        {title.split('\n').map((line, index) => (
                            <React.Fragment key={`${line}-${index}`}>
                                {index > 0 && <br />}
                                {line}
                            </React.Fragment>
                        ))}
                    </h2>
                    <p className="growth-mission-description">
                        {description}
                    </p>
                    <div className="growth-mission-metrics">
                        <div className="growth-panel growth-mission-metric-card">
                            <div className="growth-mission-metric-value">{metricOneValue}</div>
                            <div className="growth-mission-metric-label">{metricOneLabel}</div>
                        </div>
                        <div className="growth-panel growth-mission-metric-card">
                            <div className="growth-mission-metric-value">{metricTwoValue}</div>
                            <div className="growth-mission-metric-label">{metricTwoLabel}</div>
                        </div>
                    </div>
                </div>
                <div className="growth-mission-visual">
                    <div className="growth-mission-corner" aria-hidden="true"></div>
                    <div className="growth-mission-img-wrap">
                        {image && (
                            <img
                                src={image}
                                alt={imageAlt}
                                aria-hidden="true"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
