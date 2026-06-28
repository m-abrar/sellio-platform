'use client';

import React from 'react';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

export const LuxuryAmenities = () => {
  const eyebrow = useThemeContent('amenities.eyebrow', 'White Glove Experience');
  const title = useThemeContent('amenities.title', 'The Platinum Standard.');
  const item1Title = useThemeContent('amenities.item_1_title', 'Private Concierge');
  const item1Desc = useThemeContent('amenities.item_1_desc', 'Dedicated representation for every acquisition, from first inquiry to closing.');
  const item2Title = useThemeContent('amenities.item_2_title', 'Global Mobility');
  const item2Desc = useThemeContent('amenities.item_2_desc', 'Private transportation arranged for viewings at estates worldwide.');
  const item3Title = useThemeContent('amenities.item_3_title', 'Asset Verification');
  const item3Desc = useThemeContent('amenities.item_3_desc', 'Institutional-grade verification for every luxury listing.');
  const item4Title = useThemeContent('amenities.item_4_title', 'Exclusive Network');
  const item4Desc = useThemeContent('amenities.item_4_desc', 'Access to off-market listings across global prime markets.');

  const items = [
    { icon: '🏛️', title: item1Title, desc: item1Desc },
    { icon: '🚁', title: item2Title, desc: item2Desc },
    { icon: '🛡️', title: item3Title, desc: item3Desc },
    { icon: '🌐', title: item4Title, desc: item4Desc },
  ];

  return (
    <section className="luxury-amenities">
      <div className="amenities-header">
        <span className="amenities-eyebrow" aria-hidden="true">{eyebrow}</span>
        <h2 className="amenities-title">{title}</h2>
      </div>
      <div className="amenity-grid">
        {items.map(({ icon, title: t, desc }) => (
          <div key={t} className="amenity-item">
            <span className="amenity-icon" aria-hidden="true">{icon}</span>
            <h4>{t}</h4>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
