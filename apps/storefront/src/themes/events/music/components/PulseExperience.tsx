'use client';
import React from 'react';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

export const PulseExperience = () => {
    const eyebrow = useThemeContent('experience.eyebrow', 'THE EXPERIENCE');
    const title = useThemeContent('experience.title', 'Absolute\nSound.');
    const description = useThemeContent(
        'experience.description',
        "PULSE is the definitive destination for live music culture. We don't just sell tickets; we connect you with the most unforgettable music events on the planet.",
    );
    const image = useThemeMedia('experience.image', '/themes/events/music/15.webp');
    const callout = useThemeContent('experience.callout', 'Next Up: Ibiza');
    const [firstTitleLine, ...restTitleLines] = title.split('\n');

    const stat1Value = useThemeContent('experience.stat_1_value', '100%');
    const stat1Label = useThemeContent('experience.stat_1_label', 'Verified Access');
    const stat2Value = useThemeContent('experience.stat_2_value', 'Global');
    const stat2Label = useThemeContent('experience.stat_2_label', 'Event Network');

    return (
    <section className="pulse-experience">
        <div className="pulse-experience-grid">
            <div>
                <span className="pulse-experience-eyebrow">{eyebrow}</span>
                <h2 className="exp-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', textTransform: 'uppercase' }}>
                    {firstTitleLine} <br/><span style={{ color: 'var(--neon-blue)' }}>{restTitleLines.join(' ')}</span>
                </h2>
                <p className="pulse-experience-description">{description}</p>
                <div className="pulse-experience-stats">
                    <div>
                        <div className="pulse-stat-value">{stat1Value}</div>
                        <div className="pulse-stat-label pulse-stat-label--lime">{stat1Label}</div>
                    </div>
                    <div>
                        <div className="pulse-stat-value">{stat2Value}</div>
                        <div className="pulse-stat-label pulse-stat-label--blue">{stat2Label}</div>
                    </div>
                </div>
            </div>
            <div className="pulse-experience-visual">
                <div className="pulse-experience-corner" aria-hidden="true"></div>
                <div className="pulse-experience-img-wrap">
                    <img src={image} alt="" aria-hidden="true" />
                </div>
                <div className="pulse-experience-callout">
                    <div className="pulse-experience-callout-text">{callout}</div>
                </div>
            </div>
        </div>
    </section>
    );
};
