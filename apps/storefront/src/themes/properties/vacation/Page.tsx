'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Category } from '@sellio/types';
import { RetreatBentoCard, ExperienceStats } from './components';
import { CatalogSyncAlert } from './components/CatalogSyncAlert';
import { fetchVacationCatalogPage } from './catalog';
import { FALLBACK_RETREATS } from './fallback-data';
import {
  buildVacationCategories,
  mapPropertyToVacationCard,
  matchesVacationPriceRange,
  type VacationRetreatCard,
} from './vacation-utils';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

const ShimmerCard = () => (
  <div className="pv-retreat-card pv-shimmer-pulse pv-shimmer-card">
    <div className="pv-shimmer-image" />
    <div className="pv-shimmer-body">
      <div className="pv-shimmer-line pv-shimmer-line-sm" />
      <div className="pv-shimmer-line pv-shimmer-line-lg" />
      <div className="pv-shimmer-line pv-shimmer-line-md" />
      <div className="pv-shimmer-line pv-shimmer-line-sm" />
    </div>
  </div>
);

function renderMultilineTitle(text: string, highlight: string, highlightClassName = 'pv-italic pv-azure-text') {
  return text.split('\n').map((line, index, lines) => {
    const hasHighlight = highlight && line.includes(highlight);
    return (
      <React.Fragment key={index}>
        {hasHighlight
          ? line.split(highlight).map((part, partIndex, parts) => (
              <React.Fragment key={partIndex}>
                {part}
                {partIndex < parts.length - 1 && (
                  <span className={highlightClassName}>
                    {highlight}
                  </span>
                )}
              </React.Fragment>
            ))
          : line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function Page() {
  const themeLink = usePropertyThemeLink();

  const heroKicker = useThemeContent('hero.kicker', 'Global Vacation Retreats');
  const heroTitle = useThemeContent('hero.title', 'Find Your \nInfinite \nHorizon.');
  const heroHighlight = useThemeContent('hero.highlight', 'Horizon.');
  const heroDescription = useThemeContent(
    'hero.description',
    "A curated collection of the world's most significant vacation retreats. Verified by local experts and enjoyed by travelers worldwide.",
  );

  const gridKicker = useThemeContent('grid.kicker', 'Curated Collection');
  const gridTitle = useThemeContent('grid.title', 'The \nRetreats.');
  const gridHighlight = useThemeContent('grid.highlight', 'Retreats.');
  const gridDescription = useThemeContent(
    'grid.description',
    'Every property in our vacation collection is handpicked and verified to ensure an exceptional stay.',
  );

  const philosophyKicker = useThemeContent('philosophy.kicker', 'The Getaway Philosophy');
  const philosophyTitle = useThemeContent('philosophy.title', 'The Art of \nthe \nEscape.');
  const philosophyHighlight = useThemeContent('philosophy.highlight', 'Escape.');
  const philosophyDescription = useThemeContent(
    'philosophy.description',
    'We do not just check the amenities; we validate the character and local significance of every retreat.',
  );
  const philosophyImage = useThemeMedia('philosophy.image', '/themes/properties/rental/7.webp');
  const philosophyBadge = useThemeContent('philosophy.badge_label', 'AUTHENTICATED LOCAL RETREAT');

  const ctaTitle = useThemeContent('cta.title', 'Your Next Escape \nis \nOne Click Away.');
  const ctaHighlight = useThemeContent('cta.highlight', 'One Click Away.');
  const ctaButtonLabel = useThemeContent('cta.button_label', 'SECURE YOUR RETREAT');

  const trustItems = useThemeContent(
    'trust.items',
    '100% Verified|No Hidden Fees|Local Expert Support|Secure Booking',
  ).split('|');

  const searchLocationLabel = useThemeContent('search.location_label', 'Where to?');
  const searchLocationPlaceholder = useThemeContent('search.location_placeholder', 'Search city, region, or retreat name...');
  const searchCheckInLabel = useThemeContent('search.check_in_label', 'Check In');
  const searchCheckOutLabel = useThemeContent('search.check_out_label', 'Check Out');
  const searchBudgetLabel = useThemeContent('search.budget_label', 'Budget / Night');
  const searchBudgetAll = useThemeContent('search.budget_all', 'All Budgets');
  const searchBudgetUnder500 = useThemeContent('search.budget_under_500', 'Under $500/night');
  const searchBudget500to1000 = useThemeContent('search.budget_500_1000', '$500–$1,000/night');
  const searchBudget1000plus = useThemeContent('search.budget_1000_plus', '$1,000+/night');
  const searchResetLabel = useThemeContent('search.reset_label', 'Reset');
  const gridInventorySuffix = useThemeContent('grid.inventory_suffix', 'retreats in catalog');
  const gridCategoryAllLabel = useThemeContent('grid.category_all_label', 'All Retreats');
  const emptyTitle = useThemeContent('empty.title', 'No retreats found');
  const emptyDescription = useThemeContent('empty.description', 'We could not find any vacation retreats matching your filters.');
  const emptyResetLabel = useThemeContent('empty.reset_label', 'Clear filters');
  const statsRetreatsLabel = useThemeContent('stats.retreats_label', 'Live Retreats');
  const statsLocationsLabel = useThemeContent('stats.locations_label', 'Unique Locations');

  const [retreats, setRetreats] = useState<VacationRetreatCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    async function loadRetreats() {
      setLoading(true);
      const result = await fetchVacationCatalogPage(
        1,
        {
          searchQuery: searchQuery || undefined,
          checkIn: checkInDate || undefined,
          checkOut: checkOutDate || undefined,
        },
        20,
      );

      if (result.ok) {
        setRetreats(result.data.map((property, index) => mapPropertyToVacationCard(property, index)));
        setCategories(result.categories);
        setInventoryTotal(result.total);
        setApiError(null);
      } else {
        setRetreats(FALLBACK_RETREATS);
        setCategories([]);
        setInventoryTotal(null);
        setApiError(result.error);
      }

      setLoading(false);
    }

    loadRetreats();
  }, [searchQuery, checkInDate, checkOutDate]);

  const categoryList = useMemo(() => buildVacationCategories(retreats), [retreats]);

  const filteredRetreats = retreats.filter((retreat) => {
    if (selectedCategory && retreat.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    return matchesVacationPriceRange(retreat.numericPrice, priceRange);
  });

  const liveStats = useMemo(
    () => ({
      retreats: inventoryTotal ?? retreats.length,
      categories: categories.length || categoryList.length,
      locations: new Set(retreats.map((item) => item.location)).size,
    }),
    [categories.length, categoryList.length, inventoryTotal, retreats],
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setCheckInDate('');
    setCheckOutDate('');
    setPriceRange('');
  };

  const hasActiveFilters =
    Boolean(searchQuery || selectedCategory || checkInDate || checkOutDate || priceRange);

  return (
    <div className="pv-section">
      <section className="pv-hero" aria-labelledby="pv-hero-title">
        <div className="pv-hero-tag">
          <div className="pv-mono pv-hero-kicker">{heroKicker}</div>
          <h1 className="pv-heading-xl" id="pv-hero-title">
            {renderMultilineTitle(heroTitle, heroHighlight)}
          </h1>
        </div>
        <p className="pv-hero-lead">{heroDescription}</p>
      </section>

      <section className="pv-search-hud" aria-label="Search vacation retreats">
        <div className="pv-search-field pv-search-field--wide">
          <label htmlFor="pv-search-location">{searchLocationLabel}</label>
          <input
            id="pv-search-location"
            type="search"
            placeholder={searchLocationPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="pv-search-field">
          <label htmlFor="pv-search-checkin">{searchCheckInLabel}</label>
          <input
            id="pv-search-checkin"
            type="date"
            value={checkInDate}
            onChange={(event) => setCheckInDate(event.target.value)}
          />
        </div>

        <div className="pv-search-field">
          <label htmlFor="pv-search-checkout">{searchCheckOutLabel}</label>
          <input
            id="pv-search-checkout"
            type="date"
            value={checkOutDate}
            onChange={(event) => setCheckOutDate(event.target.value)}
          />
        </div>

        <div className="pv-search-field">
          <label htmlFor="pv-search-budget">{searchBudgetLabel}</label>
          <select
            id="pv-search-budget"
            value={priceRange}
            onChange={(event) => setPriceRange(event.target.value)}
          >
            <option value="">{searchBudgetAll}</option>
            <option value="under-500">{searchBudgetUnder500}</option>
            <option value="500-1000">{searchBudget500to1000}</option>
            <option value="1000-plus">{searchBudget1000plus}</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button type="button" className="pv-reset-btn" onClick={clearFilters}>
            {searchResetLabel}
          </button>
        )}
      </section>

      <section className="pv-trust-bar" aria-label="Trust and Protocol Indicators">
        {trustItems.map((trust) => (
          <div key={trust} className="pv-mono pv-trust-item">
            {trust}
          </div>
        ))}
      </section>

      <section id="pv-registry-grid" aria-labelledby="pv-grid-title" className="pv-grid-section">
        <div className="pv-grid-header">
          <div>
            <div className="pv-mono pv-section-kicker">{gridKicker}</div>
            <h2 id="pv-grid-title" className="pv-grid-title">
              {renderMultilineTitle(gridTitle, gridHighlight, 'pv-italic')}
            </h2>
            {!loading && inventoryTotal != null && (
              <p className="pv-grid-meta">{inventoryTotal} {gridInventorySuffix}</p>
            )}
          </div>
          <p className="pv-grid-description">{gridDescription}</p>
        </div>

        {apiError && (
          <div className="pv-alert-slot">
            <CatalogSyncAlert error={apiError} />
          </div>
        )}

        <div className="pv-category-ribbon">
          <button
            type="button"
            className={`pv-category-pill ${!selectedCategory ? 'pv-category-pill--active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            {gridCategoryAllLabel}
          </button>
          {categoryList.map((category) => (
            <button
              key={category}
              type="button"
              className={`pv-category-pill ${selectedCategory === category ? 'pv-category-pill--active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="pv-retreat-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <ShimmerCard key={index} />
            ))}
          </div>
        ) : filteredRetreats.length === 0 ? (
          <div className="pv-empty-state">
            <span className="pv-empty-icon">🏝️</span>
            <h3>{emptyTitle}</h3>
            <p>{emptyDescription}</p>
            <button type="button" className="pv-btn-primary" onClick={clearFilters}>
              {emptyResetLabel}
            </button>
          </div>
        ) : (
          <div className="pv-retreat-grid">
            {filteredRetreats.map((retreat) => (
              <a key={retreat.id} href={themeLink(`/product/${retreat.slug}`)} className="pv-retreat-link">
                <RetreatBentoCard {...retreat} />
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="pv-philosophy-grid" aria-labelledby="pv-phil-title">
        <div>
          <div className="pv-mono pv-section-kicker">{philosophyKicker}</div>
          <h2 className="pv-heading-xl pv-philosophy-title" id="pv-phil-title">
            {renderMultilineTitle(philosophyTitle, philosophyHighlight, 'pv-italic pv-coral-text')}
          </h2>
          <p className="pv-philosophy-copy">{philosophyDescription}</p>
          <div className="pv-stats-grid">
            <ExperienceStats value={String(liveStats.retreats)} label={statsRetreatsLabel} />
            <ExperienceStats value={String(liveStats.locations)} label={statsLocationsLabel} />
          </div>
        </div>
        <div className="pv-phil-img-wrapper">
          <div className="pv-phil-img-container">
            <img src={philosophyImage} alt="Coastal getaway" className="pv-phil-img" />
          </div>
          <div className="pv-floating-badge">{philosophyBadge}</div>
        </div>
      </section>

      <section className="pv-cta-box" aria-labelledby="pv-cta-title">
        <h2 id="pv-cta-title" className="pv-cta-title">
          {renderMultilineTitle(ctaTitle, ctaHighlight, 'pv-italic pv-coral-text')}
        </h2>
        <button
          type="button"
          className="pv-btn-primary pv-cta-btn"
          id="pv-btn-cta-auth"
          onClick={() => document.getElementById('pv-registry-grid')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {ctaButtonLabel}
        </button>
      </section>
    </div>
  );
}
