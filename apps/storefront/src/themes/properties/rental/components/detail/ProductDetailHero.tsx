'use client';

import { useState } from 'react';
import type { Property } from '@sellio/types';
import type { PropertyDetail } from '../../property-detail-types';
import {
  formatMonthlyRent,
  getRentalScarcityLabel,
  getPropertyLocation,
  getPropertySpecs,
} from '../../property-utils';
import { normalizeTags } from '../../property-detail-utils';

interface ProductDetailHeroProps {
  property: Property;
  detail: PropertyDetail;
  images: string[];
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
}

export function ProductDetailHero({
  property,
  detail,
  images,
  activeImageIndex,
  onSelectImage,
}: ProductDetailHeroProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const specs = getPropertySpecs(property);
  const tags = normalizeTags(detail);
  const scarcityLabel = getRentalScarcityLabel(property);
  const activeImage = images[activeImageIndex] || images[0];

  return (
    <>
      <section className="pr-listing-hero">
        <div className="pr-listing-gallery">
          <button
            type="button"
            className="pr-gallery-main"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open full-size photo"
          >
            <img src={activeImage} alt={property.title} />
            <span className="pr-gallery-expand">View all photos</span>
          </button>
          {images.length > 1 && (
            <div className="pr-gallery-thumbs" role="tablist" aria-label="Property photos">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={index === activeImageIndex}
                  className={`pr-gallery-thumb ${index === activeImageIndex ? 'pr-gallery-thumb--active' : ''}`}
                  onClick={() => onSelectImage(index)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pr-listing-intro">
        <article className="pr-listing-intro__card">
          <div className="pr-listing-intro__main">
          <div className="pr-detail-summary__badges">
            <span className="pr-detail-type-pill">{specs.category}</span>
            {scarcityLabel && (
              <span className="pr-scarcity-badge pr-scarcity-badge--detail">{scarcityLabel}</span>
            )}
          </div>
          <h1 className="pr-detail-title">{property.title}</h1>
          <p className="pr-detail-summary__location">{getPropertyLocation(property)}</p>

          <div className="pr-detail-price-block">
            <span className="pr-detail-price">{formatMonthlyRent(property)}</span>
            <span className="pr-detail-price-suffix">/ month</span>
          </div>

          {detail.short_description && (
            <p className="pr-detail-lede">{detail.short_description}</p>
          )}

          <ul className="pr-spec-bar">
            {specs.beds != null && (
              <li className="pr-spec-bar__item">
                <span className="pr-spec-bar__label">Bedrooms</span>
                <span className="pr-spec-bar__value">{specs.beds}</span>
              </li>
            )}
            {specs.baths != null && (
              <li className="pr-spec-bar__item">
                <span className="pr-spec-bar__label">Bathrooms</span>
                <span className="pr-spec-bar__value">{specs.baths}</span>
              </li>
            )}
            {specs.area && (
              <li className="pr-spec-bar__item">
                <span className="pr-spec-bar__label">Area</span>
                <span className="pr-spec-bar__value">{specs.area}</span>
              </li>
            )}
            {specs.parking != null && (
              <li className="pr-spec-bar__item">
                <span className="pr-spec-bar__label">Parking</span>
                <span className="pr-spec-bar__value">{specs.parking}</span>
              </li>
            )}
          </ul>

          {tags.length > 0 && (
            <ul className="pr-tag-list">
              {tags.map((tag) => (
                <li key={tag} className="pr-tag-list__item">
                  {tag}
                </li>
              ))}
            </ul>
          )}
          </div>

          <a href="#pr-apply" className="pr-btn-primary pr-listing-intro__cta">
            Apply for this rental
          </a>
        </article>
        </div>
      </section>

      {lightboxOpen && (
        <div
          className="pr-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="pr-gallery-lightbox__close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close gallery"
          >
            ×
          </button>
          <img
            src={activeImage}
            alt={property.title}
            onClick={(event) => event.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="pr-gallery-lightbox__nav">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectImage((activeImageIndex - 1 + images.length) % images.length);
                }}
              >
                ←
              </button>
              <span>
                {activeImageIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectImage((activeImageIndex + 1) % images.length);
                }}
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
