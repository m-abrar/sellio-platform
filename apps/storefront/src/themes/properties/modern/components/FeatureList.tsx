'use client';

import type { PropertyFeature } from '@sellio/types';

interface FeatureListProps {
  features: PropertyFeature[];
}

export function FeatureList({ features }: FeatureListProps) {
  if (!features.length) return null;

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Features</span>
      <h2 className="pm-detail-block__title">Property features</h2>
      <ul className="pm-feature-list">
        {features.map((feature) => (
          <li key={feature.id}>
            <span className="pm-feature-list__mark" aria-hidden="true">◆</span>
            <span>
              {feature.title}
              {feature.pivot?.value ? `: ${feature.pivot.value}` : ''}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
