'use client';

import React from 'react';
import type { Property } from '@/types';

interface NeighborhoodData {
  walk_score?: number | null;
  transit_score?: number | null;
  schools_rating?: number | null;
  landmarks?: string[] | null;
}

interface PropertyWithNeighborhood extends Property {
  neighborhood?: NeighborhoodData | null;
}

interface LocationWithDistance {
  distance_to_center?: string | null;
}

interface NeighborhoodStatsProps {
  property: Property;
}

export function NeighborhoodStats({ property }: NeighborhoodStatsProps) {
  const p = property as PropertyWithNeighborhood;
  const neighborhood = p.neighborhood;
  if (!neighborhood) return null;

  const loc = property.location as (typeof property.location & LocationWithDistance) | undefined;

  const stats = [
    { label: 'Walk Score', value: neighborhood.walk_score != null ? String(neighborhood.walk_score) : null },
    { label: 'Transit Score', value: neighborhood.transit_score != null ? String(neighborhood.transit_score) : null },
    { label: 'Schools Rating', value: neighborhood.schools_rating != null ? String(neighborhood.schools_rating) : null },
    { label: 'To City Centre', value: loc?.distance_to_center ?? null },
  ].filter((s) => s.value != null);

  if (stats.length === 0) return null;

  const landmarks: string[] = neighborhood.landmarks?.slice(0, 3) ?? [];

  return (
    <div className="pc-prose-block pc-neighborhood-stats">
      <div className="pc-caps pc-section-eyebrow">Neighbourhood Profile</div>
      <div className="pc-neighborhood-stats__grid">
        {stats.map((stat) => (
          <div key={stat.label} className="pc-neighborhood-stats__item">
            <span className="pc-neighborhood-stats__label">{stat.label}</span>
            <span className="pc-neighborhood-stats__value">{stat.value}</span>
          </div>
        ))}
      </div>
      {landmarks.length > 0 && (
        <div className="pc-neighborhood-stats__landmarks">
          {landmarks.map((lm) => (
            <span key={lm} className="pc-neighborhood-stats__landmark">{lm}</span>
          ))}
        </div>
      )}
    </div>
  );
}
