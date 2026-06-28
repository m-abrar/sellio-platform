'use client';

import type { Property } from '@sellio/types';
import { ListingBadges } from './ListingBadges';
import { StructureSpecBar } from './StructureSpecBar';
import { TagList } from './TagList';
import type { ListingMode } from '../listing-mode';
import { getListingModeLabel } from '../listing-mode';
import type { PropertyDetail } from '../property-detail-types';
import { getPropertyLocation, getPropertyPrice, getPropertySpecs } from '../property-utils';

interface ProductDetailHeroProps {
  property: Property;
  detail: PropertyDetail;
  listingMode: ListingMode;
  images: string[];
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
  specs: ReturnType<typeof getPropertySpecs>;
  tags: string[];
}

export function ProductDetailHero({
  property,
  detail,
  listingMode,
  images,
  activeImageIndex,
  onSelectImage,
  specs,
  tags,
}: ProductDetailHeroProps) {
  const activeImage = images[activeImageIndex] || images[0];
  const nightly = property.pricing?.price_per_night;

  return (
    <section className={`pm-detail-bento pm-detail-bento--${listingMode}`}>
      <div className="pm-gallery">
        <div className="pm-gallery-main">
          <img src={activeImage} alt={property.title} loading="eager" />
        </div>
        {images.length > 1 && (
          <div className="pm-gallery-thumbs">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`pm-gallery-thumb ${index === activeImageIndex ? 'pm-gallery-thumb--active' : ''}`}
                onClick={() => onSelectImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <article className={`pm-detail-glass pm-detail-glass--${listingMode}`}>
        <span className={`pm-listing-type-pill pm-listing-type-pill--${listingMode}`}>
          {getListingModeLabel(listingMode)}
        </span>
        <ListingBadges property={detail} />
        <div className="urban-detail-kicker">{specs.category}</div>
        <h1 className="pm-detail-title">{property.title}</h1>

        <div className={`pm-detail-price-block pm-detail-price-block--${listingMode}`}>
          <div className="urban-detail-price">{getPropertyPrice(property)}</div>
          {listingMode === 'rental' && nightly != null && (
            <p className="pm-detail-price-sub">
              {property.pricing?.currency_symbol || '$'}
              {Number(nightly).toLocaleString()} per night
            </p>
          )}
          {listingMode === 'sale' && property.pricing?.hoa != null && (
            <p className="pm-detail-price-sub">
              HOA {property.pricing.hoa_formatted || `$${Number(property.pricing.hoa).toLocaleString()}/mo`}
            </p>
          )}
        </div>

        {detail.short_description && property.description && (
          <p className="urban-detail-lede">{detail.short_description}</p>
        )}

        <StructureSpecBar
          beds={specs.beds}
          baths={specs.baths}
          area={specs.area}
          parking={specs.parking}
          year={specs.year}
        />

        <div className="urban-detail-specs">
          <div>
            <span>Location</span>
            <strong>{getPropertyLocation(property)}</strong>
          </div>
          {property.specs?.property_type && (
            <div>
              <span>Property type</span>
              <strong>{property.specs.property_type}</strong>
            </div>
          )}
          {listingMode === 'rental' && detail.minimum_rental_days ? (
            <div>
              <span>Minimum stay</span>
              <strong>
                {detail.minimum_rental_days} night{detail.minimum_rental_days === 1 ? '' : 's'}
              </strong>
            </div>
          ) : null}
        </div>

        <TagList tags={tags} variant="inline" />
      </article>
    </section>
  );
}
