'use client';

import {
  getCoordinates,
  getFullAddress,
  getGoogleMapsEmbedUrl,
  getGoogleMapsExternalUrl,
} from '../property-detail-utils';
import type { PropertyDetail } from '../property-detail-types';

interface PropertyMapEmbedProps {
  property: PropertyDetail;
}

export function PropertyMapEmbed({ property }: PropertyMapEmbedProps) {
  const coords = getCoordinates(property);
  if (!coords) return null;

  const address = getFullAddress(property);
  const embedUrl = getGoogleMapsEmbedUrl(coords.lat, coords.lng);
  const externalUrl = getGoogleMapsExternalUrl(coords.lat, coords.lng);

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Location</span>
      <h2 className="pm-detail-block__title">Map</h2>
      {address && <p className="pm-detail-block__copy">{address}</p>}
      <div className="pm-map-frame">
        <iframe
          title={`Map for ${property.title}`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a href={externalUrl} className="pm-map-link" target="_blank" rel="noopener noreferrer">
        Open in Google Maps →
      </a>
    </section>
  );
}
