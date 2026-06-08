'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing, Category } from '@sellio/types';
import { PremiumHeader, PremiumCard, PremiumFooter } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

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
const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Global SaaS Platform & API",
    slug: "global-saas-platform-api",
    description: "Recurring revenue subscription model with high-margin customer base and fully automated delivery workflow.",
    pricing: {
      base_price: 2500000,
      sale_price: 2500000,
      is_on_sale: false,
      discount: null,
      formatted: "$2,500,000",
      formatted_short: "$2.5M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Fully Remote",
      state: "Global"
    },
    taxonomy: {
      category: "tech"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400"
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: true,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 2,
    title: "Upscale Urban Health Club",
    slug: "upscale-urban-health-club",
    description: "Established high-tier brand in a fast-growing metropolitan area with stable recurring memberships.",
    pricing: {
      base_price: 950000,
      sale_price: 950000,
      is_on_sale: false,
      discount: null,
      formatted: "$950,000",
      formatted_short: "$950K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "New York City",
      state: "NY"
    },
    taxonomy: {
      category: "hospitality"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400"
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: true,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 3,
    title: "B2B Logistics & Warehousing",
    slug: "b2b-logistics-warehousing",
    description: "Asset-heavy operation with stable long-term contracts and prime midwest hub access.",
    pricing: {
      base_price: 1200000,
      sale_price: 1200000,
      is_on_sale: false,
      discount: null,
      formatted: "$1,200,000",
      formatted_short: "$1.2M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Chicago",
      state: "IL"
    },
    taxonomy: {
      category: "manufacturing"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400"
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: true,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 4,
    title: "Niche E-Commerce Coffee Brand",
    slug: "niche-e-commerce-coffee-brand",
    description: "Fully custom Shopify setup specializing in organic micro-lot coffee blends with solid organic search presence.",
    pricing: {
      base_price: 350000,
      sale_price: 350000,
      is_on_sale: false,
      discount: null,
      formatted: "$350,000",
      formatted_short: "$350K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Remote",
      state: "US"
    },
    taxonomy: {
      category: "retail"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 5,
    title: "Local Cafe & Organic Bakery",
    slug: "local-cafe-organic-bakery",
    description: "Highly rated local spot in historic district featuring state-of-the-art kitchen equipment and high foot traffic.",
    pricing: {
      base_price: 120000,
      sale_price: 120000,
      is_on_sale: false,
      discount: null,
      formatted: "$120,000",
      formatted_short: "$120K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Seattle",
      state: "WA"
    },
    taxonomy: {
      category: "hospitality"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 6,
    title: "Regional Trucking Fleet Operation",
    slug: "regional-trucking-fleet-operation",
    description: "Operable fleet of 12 well-maintained semi-trucks, active CDL driver rosters, and contracted shipping lanes.",
    pricing: {
      base_price: 800000,
      sale_price: 800000,
      is_on_sale: false,
      discount: null,
      formatted: "$800,000",
      formatted_short: "$800K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Dallas",
      state: "TX"
    },
    taxonomy: {
      category: "manufacturing"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 7,
    title: "Software Reseller Agency Hub",
    slug: "software-reseller-agency-hub",
    description: "White-label distributor rights for CRM solutions in regional tech startup zones.",
    pricing: {
      base_price: 50000,
      sale_price: 50000,
      is_on_sale: false,
      discount: null,
      formatted: "$50,000",
      formatted_short: "$50K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Global Remote",
      state: "US"
    },
    taxonomy: {
      category: "tech"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400"
    },
    item_specs: {
      condition_rating: 3,
      condition_label: "Standard",
      badge_class: "cp-badge-standard",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 8,
    title: "B2B Enterprise Consulting Firm",
    slug: "b2b-enterprise-consulting-firm",
    description: "Consultancy focused on restructuring and supply chain optimization with high-value contracts.",
    pricing: {
      base_price: 450000,
      sale_price: 450000,
      is_on_sale: false,
      discount: null,
      formatted: "$450,000",
      formatted_short: "$450K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Remote",
      state: "US"
    },
    taxonomy: {
      category: "tech"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 9,
    title: "Vending Machine Route (22 spots)",
    slug: "vending-machine-route-22-spots",
    description: "Lucrative route of smart vending machines in corporate campuses and school gyms with cash flows verified.",
    pricing: {
      base_price: 75000,
      sale_price: 75000,
      is_on_sale: false,
      discount: null,
      formatted: "$75,000",
      formatted_short: "$75K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Phoenix",
      state: "AZ"
    },
    taxonomy: {
      category: "retail"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1575224300306-1b8da56134ec?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 10,
    title: "Digital Marketing Agency (SaaS Focused)",
    slug: "digital-marketing-agency-saas-focused",
    description: "Marketing specialists with active monthly retainer arrangements and proven SEO traffic channels.",
    pricing: {
      base_price: 220000,
      sale_price: 220000,
      is_on_sale: false,
      discount: null,
      formatted: "$220,000",
      formatted_short: "$220K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "London",
      state: "UK"
    },
    taxonomy: {
      category: "tech"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 11,
    title: "Local Automated Laundromat",
    slug: "local-automated-laundromat",
    description: "Fully coinless automated laundromat featuring brand-new commercial washers with high-margin returns.",
    pricing: {
      base_price: 90000,
      sale_price: 90000,
      is_on_sale: false,
      discount: null,
      formatted: "$90,000",
      formatted_short: "$90K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Miami",
      state: "FL"
    },
    taxonomy: {
      category: "retail"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1545173168-9f1947eebd01?q=80&w=400"
    },
    item_specs: {
      condition_rating: 3,
      condition_label: "Standard",
      badge_class: "cp-badge-standard",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  }
];

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

export default function Page() {
  const router = useRouter();
  const diagnosticsTitle = useThemeContent('diagnostics.title', '🛰️ VETTED NETWORK DIAGNOSTICS & RESILIENCE PANEL');
  const diagnosticsDescription = useThemeContent('diagnostics.description', 'Status: Local Database Node Offline. Activating Vetted sovereign proxy backup assets gracefully.');
  const featuredHeaderTitle = useThemeContent('featured_header.title', '💎 Featured Investment Opportunities');
  const featuredHeaderEmpty = useThemeContent('featured_header.empty', 'No featured opportunities match your refinements.');
  const membershipTitle = useThemeContent('membership.title', 'UNLOCK PREMIUM PRIVATE OPPORTUNITIES');
  const membershipSubtitle = useThemeContent('membership.subtitle', 'Gain verified access to institutional-grade M&A prospectuses, audit-vetted tax returns, and coordinate direct negotiations with certified investment brokers.');
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
  const [errorTrace, setErrorTrace] = useState<string>('');

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

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_premium${path}`;
      }
    }
    return path;
  };

  useEffect(() => {
    const fetchPremiumOpportunities = async () => {
      setLoading(true);
      try {
        const response = await api.getClassifieds();
        if (response && response.data && response.data.length > 0) {
          const mapped = response.data.map(translateOpportunity);
          setOpportunities(mapped);
          setUseFallback(false);

          // Extract category ribbon from API categories metadata if populated
          if (response.sidebar?.categories) {
            const mappedCats = response.sidebar.categories.map((cat: Category) => ({
              id: cat.slug || String(cat.id),
              name: cat.title
            }));
            const deduplicated = [{ id: "all", name: "All Categories" }];
            mappedCats.forEach((c) => {
              if (!deduplicated.some(d => d.id === c.id)) {
                deduplicated.push(c);
              }
            });
            setCategories(deduplicated);
          } else {
            // Fallback: Deduplicate from loaded listing records taxonomy
            const dynamicCategories = [{ id: "all", name: "All Categories" }];
            response.data.forEach((item) => {
              const catSlug = item.taxonomy?.category;
              if (catSlug && !dynamicCategories.some(d => d.id === catSlug)) {
                let label = catSlug;
                if (catSlug === 'tech') label = 'Technology & SaaS';
                else if (catSlug === 'retail') label = 'Real Estate & Retail';
                else if (catSlug === 'hospitality') label = 'Hospitality & F&B';
                else if (catSlug === 'manufacturing') label = 'Logistics & Industry';
                else label = catSlug.charAt(0).toUpperCase() + catSlug.slice(1);
                
                dynamicCategories.push({
                  id: catSlug,
                  name: label
                });
              }
            });
            setCategories(dynamicCategories);
          }
        } else {
          console.warn("Classifieds Premium database returned empty. Running backups.");
          setErrorTrace("Classifieds Premium database returned empty.");
          loadLocalFallback();
        }
      } catch (err: any) {
        console.error("AxiosError: Connection failure while fetching Premium assets:", err);
        setErrorTrace(err?.stack || err?.message || String(err));
        loadLocalFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadLocalFallback = () => {
      setOpportunities(FALLBACK_CLASSIFIEDS.map(translateOpportunity));
      setCategories([
        { id: "all", name: "All Categories" },
        { id: "tech", name: "Technology & SaaS" },
        { id: "retail", name: "Real Estate & Retail" },
        { id: "hospitality", name: "Hospitality & F&B" },
        { id: "manufacturing", name: "Logistics & Industry" }
      ]);
      setUseFallback(true);
    };

    fetchPremiumOpportunities();
  }, []);

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
        onPostClick={() => alert("🔑 Institutional M&A Hub:\nPlease authenticate using your brokerage secure key to list a new private memorandum opportunity.")} 
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
          {useFallback && (
            <div className="cp-resilience-panel">
              <div className="cp-resilience-header">
                {diagnosticsTitle}
              </div>
              <div style={{ fontWeight: 600 }}>
                {diagnosticsDescription}
              </div>
              <div className="cp-resilience-trace">
                {errorTrace || 'api.getClassifieds returned empty listings feed.'}
              </div>
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
                  onViewDetails={() => router.push(getThemeLink(`/product/${item.slug}`))}
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
              onClick={() => alert("🔑 Premium Concierge: Exploring premium advisory fee charts and corporate investor vetting tiers.")}
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
                  onViewDetails={() => router.push(getThemeLink(`/product/${item.slug}`))}
                />
              ))}
            </div>
          )}

          {/* Vetted Pagination */}
          <div className="cp-pagination">
            <button className="cp-page-btn cp-active">1</button>
            <button className="cp-page-btn" onClick={() => alert("Acquiring Listings Page 2...")}>2</button>
            <button className="cp-page-btn" onClick={() => alert("Acquiring Listings Page 3...")}>3</button>
          </div>

        </main>
      </div>

      {/* Footer component */}
      <PremiumFooter />
    </div>
  );
}
