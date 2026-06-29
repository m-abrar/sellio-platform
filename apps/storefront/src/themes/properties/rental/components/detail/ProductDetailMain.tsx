'use client';

import type { Amenity } from '@/types';
import type { PropertyDetail } from '../../property-detail-types';
import {
  getCoordinates,
  getFullAddress,
  getGoogleMapsEmbedUrl,
  getGoogleMapsExternalUrl,
} from '../../property-detail-utils';

interface ProductDetailMainProps {
  detail: PropertyDetail;
  description: string | null;
  amenities?: Amenity[] | null;
  title: string;
}

export function ProductDetailMain({
  detail,
  description,
  amenities,
  title,
}: ProductDetailMainProps) {
  const amenityList = amenities || [];
  const coords = getCoordinates(detail);

  return (
    <div className="pr-detail-main">
      {(description || detail.short_description) && (
        <section className="pr-detail-block">
          <span className="pr-kicker">Overview</span>
          <h2 className="pr-detail-block__title">About this rental</h2>
          <div className="pr-detail-description__body">
            {description || detail.short_description}
          </div>
        </section>
      )}

      {amenityList.length > 0 && (
        <section className="pr-detail-block">
          <span className="pr-kicker">Amenities</span>
          <h2 className="pr-detail-block__title">What is included</h2>
          <div className="pr-amenity-grid">
            {amenityList.map((amenity) => {
              const icon = (amenity as Amenity & { icon?: string }).icon;
              return (
                <div key={amenity.id} className="pr-amenity-chip">
                  {icon ? <span aria-hidden="true">{icon}</span> : null}
                  <span>{amenity.title}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {(detail.rules || detail.policies) && (
        <section className="pr-detail-block">
          <span className="pr-kicker">Policies</span>
          <h2 className="pr-detail-block__title">House rules</h2>
          {detail.rules && <p className="pr-detail-block__copy">{detail.rules}</p>}
          {detail.policies && (
            <p className="pr-detail-block__copy" style={{ marginTop: '0.75rem' }}>
              {detail.policies}
            </p>
          )}
        </section>
      )}

      {coords && (
        <section className="pr-detail-block">
          <span className="pr-kicker">Location</span>
          <h2 className="pr-detail-block__title">Neighborhood</h2>
          <p className="pr-detail-block__copy">{getFullAddress(detail) || 'View on map'}</p>
          <div className="pr-map-embed">
            <iframe
              title={`Map for ${title}`}
              src={getGoogleMapsEmbedUrl(coords.lat, coords.lng)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={getGoogleMapsExternalUrl(coords.lat, coords.lng)}
            className="pr-map-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </section>
      )}

      {(detail.video || detail.virtual_tour) && (
        <section className="pr-detail-block">
          <span className="pr-kicker">Media</span>
          <h2 className="pr-detail-block__title">Virtual tour</h2>
          <div className="pr-media-links">
            {detail.video && (
              <a href={detail.video} target="_blank" rel="noopener noreferrer">
                Watch video tour
              </a>
            )}
            {detail.virtual_tour && (
              <a href={detail.virtual_tour} target="_blank" rel="noopener noreferrer">
                3D walkthrough
              </a>
            )}
          </div>
        </section>
      )}

      {detail.owner && (
        <section className="pr-detail-block pr-agent-card">
          <span className="pr-kicker">Listed by</span>
          <div className="pr-agent-card__inner">
            {detail.owner.avatar_url && (
              <img src={detail.owner.avatar_url} alt="" className="pr-agent-card__avatar" />
            )}
            <div>
              <strong>{detail.owner.name}</strong>
              {detail.brand?.title && (
                <p className="pr-agent-card__brand">{detail.brand.title}</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
