'use client';

import React from 'react';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useRentalThemeLink } from '../hooks/useRentalThemeLink';

const DEFAULT_CITIES = 'Downtown Core|downtown-core|1|/themes/properties/rental/1.webp|West End|west-end|2|/themes/properties/rental/2.webp|Financial Hub|financial-hub|3|/themes/properties/rental/3.webp|Suburban Pines|suburban-pines|4|/themes/properties/rental/5.webp';

interface CityCard {
  name: string;
  slug: string;
  locationId: string;
  image: string;
}

export function CityHighlightGrid() {
  const themeLink = useRentalThemeLink();
  const sectionKicker = useThemeContent('cities.kicker', 'Explore by area');
  const sectionTitle = useThemeContent('cities.title', 'Find your neighbourhood');
  const citiesRaw = useThemeContent('cities.items', DEFAULT_CITIES);

  // Format: name|slug|locationId|image|name|slug|... (groups of 4)
  const parts = citiesRaw.split('|');
  const cities: CityCard[] = [];
  for (let i = 0; i + 3 < parts.length; i += 4) {
    cities.push({
      name: parts[i] ?? '',
      slug: parts[i + 1] ?? '',
      locationId: parts[i + 2] ?? '',
      image: parts[i + 3] ?? '',
    });
  }

  return (
    <section className="pr-cities-section">
      <div className="pr-cities-header">
        <span className="pr-kicker">{sectionKicker}</span>
        <h2 className="pr-section-title pr-cities-title">{sectionTitle}</h2>
      </div>
      <div className="pr-city-grid">
        {cities.map(({ name, slug, locationId, image }) => (
          <a
            key={slug}
            href={themeLink(`/explore?loc=${locationId}`)}
            className="pr-city-card"
            aria-label={`Browse rentals in ${name}`}
          >
            <img src={image} alt="" className="pr-city-card__img" loading="lazy" aria-hidden="true" />
            <div className="pr-city-card__overlay" />
            <span className="pr-city-card__name">{name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
