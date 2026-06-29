'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Property } from '@/types';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { LUXURY_FALLBACK_ESTATES } from '../fallback-data';

interface EstateCardProps {
  title: string;
  price: string;
  location: string;
  tag: string;
  image: string;
  slug: string;
}

const EstateCard = ({ title, price, location, tag, image, slug }: EstateCardProps) => {
  const themeLink = usePropertyThemeLink();
  return (
    <a href={themeLink(`/product/${slug}`)} className="estate-card-premium estate-card-link">
      <div className="estate-card-img-overflow">
        <img src={image} alt={title} className="estate-card-img" loading="lazy" />
      </div>
      <div className="estate-card-info">
        <span className="estate-card-tag">{tag}</span>
        <h3 className="estate-card-title">{title}</h3>
        <div className="estate-card-meta">
          <span className="estate-card-price">{price}</span>
          <span className="estate-card-location">{location.toUpperCase()}</span>
        </div>
      </div>
    </a>
  );
};

const FALLBACK_CARDS: EstateCardProps[] = LUXURY_FALLBACK_ESTATES.slice(0, 2).map((e, i) => ({
  title: e.title,
  price: e.pricing?.price_formatted ?? `$${Number(e.base_price).toLocaleString()}`,
  location: e.location?.title ?? e.city ?? 'Exclusive Location',
  tag: i === 0 ? 'New Listing' : 'Featured',
  image: e.featured_image ?? '/themes/properties/luxury/3.webp',
  slug: e.slug,
}));

export const EstateShowcase = () => {
  const themeLink = usePropertyThemeLink();
  const [estates, setEstates] = useState<EstateCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionEyebrow = useThemeContent('showcase.section_eyebrow', 'Curated Collection');
  const sectionTitle = useThemeContent('showcase.section_title', 'Exceptional Residences.');
  const ctaLabel = useThemeContent('showcase.cta_label', 'View Full Portfolio');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await api.getProperties({ per_page: 6 });
        if (response?.data?.length > 0) {
          const mapped: EstateCardProps[] = response.data.map((prop: Property) => ({
            title: prop.title,
            price: prop.pricing?.price_formatted || (prop.base_price ? `$${Number(prop.base_price).toLocaleString()}` : ''),
            location: prop.location?.title || prop.city || 'Exclusive Location',
            tag: prop.is_featured ? 'Featured' : 'Signature',
            image: prop.featured_image || prop.primary_image_url || '/themes/properties/luxury/3.webp',
            slug: prop.slug,
          }));
          setEstates(mapped);
        } else {
          setEstates(FALLBACK_CARDS);
        }
      } catch {
        setEstates(FALLBACK_CARDS);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="estate-showcase">
      <div className="showcase-section-header">
        <span className="showcase-eyebrow">{sectionEyebrow}</span>
        <h2 className="showcase-title">{sectionTitle}</h2>
      </div>

      {loading ? (
        <div className="showcase-grid">
          {[1, 2].map((i) => (
            <div key={i} className="estate-card-premium showcase-skeleton-card">
              <div className="showcase-skeleton-img" />
              <div className="estate-card-info">
                <div className="showcase-skeleton-tag" />
                <div className="showcase-skeleton-title" />
                <div className="estate-card-meta">
                  <div className="showcase-skeleton-price" />
                  <div className="showcase-skeleton-loc" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="showcase-grid">
          {estates.map((e, i) => <EstateCard key={i} {...e} />)}
        </div>
      )}

      {!loading && estates.length > 0 && (
        <div className="showcase-cta-wrap">
          <a href={themeLink('/explore')} className="luxury-btn-outline">
            {ctaLabel}
          </a>
        </div>
      )}
    </section>
  );
};
