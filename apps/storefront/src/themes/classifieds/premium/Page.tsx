'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ClassifiedListing } from '@sellio/types';
import { PremiumHeader, PremiumCard, PremiumFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import { fetchClassifiedsHome, resolveClassifiedsFailure } from '@/themes/classifieds/shared/catalog';
import { PREMIUM_DEMO_CATEGORIES } from '@/themes/classifieds/shared/fallback-data';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

interface OpportunityItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  description: string;
  location: string;
  category: string;
  image: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  slug: string;
}

// Fallback high-fidelity Classifieds Premium database opportunities matching ClassifiedListing schema perfectly
// Opportunity mapping logic to translate API structures to Card inputs
const translateOpportunity = (item: ClassifiedListing): OpportunityItem => {
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    id: item.id,
    title: item.title,
    price: item.pricing?.formatted || item.pricing?.formatted_short || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`,
    numericPrice: item.pricing?.sale_price || item.pricing?.base_price || 0,
    description: item.description || "Established business acquisition opportunity with verified cash flows.",
    location: item.location ? `${item.location.city || 'Remote'}, ${item.location.state || 'Global'}` : "Fully Remote",
    category: item.taxonomy?.category || "tech",
    image: item.media?.main_photo || item.media?.thumbnail || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400",
    isVerified: (item.item_specs?.condition_rating && item.item_specs.condition_rating >= 4) || item.status?.is_featured || false,
    isFeatured: item.status?.is_featured || false,
    slug: generatedSlug
  };
};

const adminCreateClassifiedUrl = `${getAdminBaseUrl()}/admin/classifieds/create`;

export default function Page() {
  const router = useRouter();
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const featuredHeaderTitle = useThemeContent('featured_header.title', '💎 Featured Investment Opportunities');
  const featuredHeaderEmpty = useThemeContent('featured_header.empty', 'No featured opportunities match your refinements.');
  const membershipTitle = useThemeContent('membership.title', 'UNLOCK PREMIUM PRIVATE OPPORTUNITIES');
  const membershipSubtitle = useThemeContent('membership.subtitle', 'Browse premium listings including established businesses, commercial properties, and high-value items — all with verified seller profiles.');
  const membershipButtonLabel = useThemeContent('membership.button_label', 'Explore Membership Tiers');
  const toolbarTitleLabel = useThemeContent('toolbar.title_label', 'Available Listings');
  const toolbarOpportunitiesSuffix = useThemeContent('toolbar.opportunities_suffix', 'opportunities');
  const toolbarGridViewLabel = useThemeContent('toolbar.grid_view_label', 'Grid View');
  const toolbarListViewLabel = useThemeContent('toolbar.list_view_label', 'List View');
  const emptyTitle = useThemeContent('empty.title', 'No Private Listings Found');
  const emptyDescription = useThemeContent('empty.description', 'Try clearing price ranges or location strings to expand search bounds.');

  // Stateful interactive variables
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([
    { id: 'all', name: 'All Categories' }
  ]);

  // Loading & network resilience state tracking
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Search state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationTerm, setLocationTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Active Filter Applied State
  const [appliedFilters, setAppliedFilters] = useState({
    category: 'all',
    location: '',
    min: '',
    max: ''
  });

  // Grid/List View Toggler state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let isMounted = true;

    const fetchPremiumOpportunities = async () => {
      setLoading(true);
      const result = await fetchClassifiedsHome();

      if (!isMounted) return;

      if (result.ok && result.response.data && result.response.data.length > 0) {
        const mapped = result.response.data.map(translateOpportunity);
        setOpportunities(mapped);
        setUseFallback(false);
        setApiError(null);

        if (result.response.sidebar?.categories) {
          const mappedCats = result.response.sidebar.categories.map((cat) => ({
            id: cat.slug || String(cat.id),
            name: cat.title,
          }));
          const deduplicated = [{ id: 'all', name: 'All Categories' }];
          mappedCats.forEach((c) => {
            if (!deduplicated.some((d) => d.id === c.id)) {
              deduplicated.push(c);
            }
          });
          setCategories(deduplicated);
        } else {
          const dynamicCategories = [{ id: 'all', name: 'All Categories' }];
          result.response.data.forEach((item) => {
            const catSlug = typeof item.taxonomy?.category === 'string' ? item.taxonomy.category : '';
            if (catSlug && !dynamicCategories.some((d) => d.id === catSlug)) {
              let label = catSlug;
              if (catSlug === 'tech') label = 'Technology & SaaS';
              else if (catSlug === 'retail') label = 'Real Estate & Retail';
              else if (catSlug === 'hospitality') label = 'Hospitality & F&B';
              else if (catSlug === 'manufacturing') label = 'Logistics & Industry';
              else label = catSlug.charAt(0).toUpperCase() + catSlug.slice(1);

              dynamicCategories.push({
                id: catSlug,
                name: label,
              });
            }
          });
          setCategories(dynamicCategories);
        }
      } else {
        const errorMsg = result.ok ? 'No classifieds returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedsFailure(allowDemo, 'premium');

        if (resolution.mode === 'demo') {
          setOpportunities(resolution.listings.map(translateOpportunity));
          setCategories(PREMIUM_DEMO_CATEGORIES);
          setUseFallback(true);
        } else {
          setOpportunities([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    };

    fetchPremiumOpportunities();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  // Trigger Filter Application
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      category: selectedCategory,
      location: locationTerm,
      min: minPrice,
      max: maxPrice
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setLocationTerm('');
    setMinPrice('');
    setMaxPrice('');
    setAppliedFilters({
      category: 'all',
      location: '',
      min: '',
      max: ''
    });
  };

  // Filter listings based on sidebar and search options
  const filterCatalog = (itemsList: OpportunityItem[]) => {
    return itemsList.filter((item) => {
      // Keyword search
      const matchesSearch = searchTerm === '' || 
                            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Sidebar Filters
      const matchesCategory = appliedFilters.category === 'all' || item.category === appliedFilters.category;
      
      const matchesLocation = appliedFilters.location === '' || 
                              item.location.toLowerCase().includes(appliedFilters.location.toLowerCase());
      
      const minVal = appliedFilters.min === '' ? 0 : parseInt(appliedFilters.min);
      const maxVal = appliedFilters.max === '' ? Infinity : parseInt(appliedFilters.max);
      const matchesPrice = item.numericPrice >= minVal && item.numericPrice <= maxVal;

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  };

  const featuredItems = filterCatalog(opportunities.filter(item => item.isFeatured));
  const ordinaryItems = filterCatalog(opportunities.filter(item => !item.isFeatured));

  return (
    <div className="classifieds-premium-wrapper">
      {/* High-Fidelity Premium Navbar Header */}
      <PremiumHeader 
        homeHref={themeLink('')}
      />

      {/* Corporate Search Bar Banner */}
      <div className="cp-search-section">
        <div className="cp-search-box">
          <input 
            type="text" 
            className="cp-search-input" 
            placeholder="Search for Business Name, Industry keyword, or Acquisition profile..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="cp-search-btn">
            🔍 Find Opportunity
          </button>
        </div>
      </div>

      {/* Main Split Columns Grid */}
      <div className="cp-layout">
        
        {/* Left Sidebar Filter Section */}
        <aside>
          <form className="cp-sidebar" onSubmit={handleApplyFilters}>
            <div className="cp-sidebar-title">Refine Search</div>
            
            <div className="cp-field-group">
              <label className="cp-field-label">Category</label>
              <select 
                className="cp-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="cp-field-group">
              <label className="cp-field-label">Location</label>
              <input 
                type="text" 
                className="cp-input" 
                placeholder="City, State, or Country" 
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
              />
            </div>

            <div className="cp-field-group">
              <label className="cp-field-label">Price Range (USD)</label>
              <div className="cp-price-range">
                <input 
                  type="number" 
                  className="cp-input" 
                  placeholder="Min ($)" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input 
                  type="number" 
                  className="cp-input" 
                  placeholder="Max ($)" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="cp-btn-apply">
              Apply Filters
            </button>
            
            <button 
              type="button" 
              onClick={handleResetFilters}
              style={{ background: 'transparent', border: 'none', color: 'var(--cp-teal)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', padding: '4px 0' }}
            >
              Clear Refinements
            </button>
          </form>
        </aside>

        {/* Right Opportunities Feeds Column */}
        <main>

          {/* Resilient Diagnostics Connection Overlay on Server Outage */}
          {(useFallback || apiError) && apiError && (
            <div className="cp-resilience-panel">
              <CatalogSyncAlert
                classPrefix="cp"
                variant={useFallback ? 'demo' : 'production'}
                error={apiError}
              />
            </div>
          )}
          
          {/* Featured Header with linear gradient and subtle shadow */}
          <div className="cp-featured-header">
            {featuredHeaderTitle}
          </div>

          {loading ? (
            <div className="cp-grid-featured" style={{ marginBottom: '3rem' }}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="cp-shimmer-card" style={{ height: '350px' }}>
                  <div className="cp-shimmer-img" />
                  <div className="cp-shimmer-body">
                    <div className="cp-shimmer-badge" />
                    <div className="cp-shimmer-title" />
                    <div className="cp-shimmer-desc" />
                    <div className="cp-shimmer-footer">
                      <div className="cp-shimmer-loc" />
                      <div className="cp-shimmer-price" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredItems.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic', marginBottom: '3rem' }}>{featuredHeaderEmpty}</p>
          ) : (
            <div className="cp-grid-featured">
              {featuredItems.map((item) => (
                <PremiumCard 
                  key={item.id}
                  title={item.title}
                  price={item.price}
                  description={item.description}
                  location={item.location}
                  image={item.image}
                  isVerified={item.isVerified}
                  onViewDetails={() => router.push(themeLink(`/product/${item.slug}`))}
                />
              ))}
            </div>
          )}

          {/* Locked Premium Gold Frame Membership Banner */}
          <section className="cp-banner">
            <h3 className="cp-banner-title">{membershipTitle}</h3>
            <p className="cp-banner-subtitle">
              {membershipSubtitle}
            </p>
            <button 
              className="cp-banner-btn"
              onClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
            >
              {membershipButtonLabel}
            </button>
          </section>

          {/* Grid / List Toolbar Header */}
          <div className="cp-toolbar">
            <h4 className="cp-toolbar-title">
              {toolbarTitleLabel} ({loading ? '...' : ordinaryItems.length} {toolbarOpportunitiesSuffix})
            </h4>
            
            <div className="cp-toggle-group">
              <button 
                className={`cp-toggle-btn ${viewMode === 'grid' ? 'cp-active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                {toolbarGridViewLabel}
              </button>
              <button 
                className={`cp-toggle-btn ${viewMode === 'list' ? 'cp-active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                {toolbarListViewLabel}
              </button>
            </div>
          </div>

          {/* Ordinary Opportunities List/Grid Feed */}
          {loading ? (
            <div className="cp-grid-all">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="cp-shimmer-card">
                  <div className="cp-shimmer-img" />
                  <div className="cp-shimmer-body">
                    <div className="cp-shimmer-badge" />
                    <div className="cp-shimmer-title" />
                    <div className="cp-shimmer-desc" />
                    <div className="cp-shimmer-footer">
                      <div className="cp-shimmer-loc" />
                      <div className="cp-shimmer-price" />
                    </div>
                    <div className="cp-shimmer-btn" />
                  </div>
                </div>
              ))}
            </div>
          ) : ordinaryItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--cp-border)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.8rem' }}>💼</span>
              <h5 style={{ fontWeight: 800 }}>{emptyTitle}</h5>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{emptyDescription}</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'cp-grid-all' : 'cp-list-view'}>
              {ordinaryItems.map((item) => (
                <PremiumCard 
                  key={item.id}
                  title={item.title}
                  price={item.price}
                  description={item.description}
                  location={item.location}
                  image={item.image}
                  isVerified={item.isVerified}
                  onViewDetails={() => router.push(themeLink(`/product/${item.slug}`))}
                />
              ))}
            </div>
          )}

          {/* Vetted Pagination */}
          <div className="cp-pagination">
            <button className="cp-page-btn cp-active">1</button>
            <button className="cp-page-btn">2</button>
            <button className="cp-page-btn">3</button>
          </div>

        </main>
      </div>

      {/* Footer component */}
      <PremiumFooter />
    </div>
  );
}
