'use client';

import React from 'react';

interface StructureSpecBarProps {
  beds?: number | null;
  baths?: number | null;
  area?: string | null;
  parking?: number | null;
  year?: number | null;
}

export function StructureSpecBar({ beds, baths, area, parking, year }: StructureSpecBarProps) {
  const items = [
    beds != null ? { icon: '🛏️', label: 'Bedrooms', value: String(beds) } : null,
    baths != null ? { icon: '🛁', label: 'Bathrooms', value: String(baths) } : null,
    area ? { icon: '📐', label: 'Area', value: area } : null,
    parking != null ? { icon: '🅿️', label: 'Parking', value: String(parking) } : null,
    year ? { icon: '🏗️', label: 'Year Built', value: String(year) } : null,
  ].filter(Boolean) as Array<{ icon: string; label: string; value: string }>;

  if (!items.length) return null;

  return (
    <div className="pm-spec-bar">
      {items.map((item) => (
        <div key={item.label} className="pm-spec-bar__item">
          <span className="pm-spec-bar__icon" aria-hidden="true">
            {item.icon}
          </span>
          <div>
            <span className="pm-spec-bar__label">{item.label}</span>
            <strong className="pm-spec-bar__value">{item.value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
