'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property, Category, Location } from '@sellio/types';
import { EstateCard, FilterSidebar } from './components';
import { useSearchParams, useRouter } from 'next/navigation';

interface ExplorePageProps {
  initialCategorySlug?: string;
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, title: 'Country Manors', slug: 'country-manors' },
  { id: 2, title: 'Historic Chateaus', slug: 'historic-chateaus' },
  { id: 3, title: 'Colonial Estates', slug: 'colonial-estates' },
  { id: 4, title: 'Royal Castles', slug: 'royal-castles' }
];

const FALLBACK_LOCATIONS: Location[] = [
  { id: 1, title: 'Hertfordshire', country: 'UK', slug: 'hertfordshire' },
  { id: 2, title: 'Florence', country: 'Italy', slug: 'florence' },
  { id: 3, title: 'Loire Valley', country: 'France', slug: 'loire' }
];

const FALLBACK_ESTATES: Property[] = [
  { id: 1, user_id: 1, category_id: 1, type_id: 1, location_id: 1, title: "The Pemberley Manor", slug: "pemberley-manor", description: "A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history.", base_price: 14200000, number_of_bedrooms: 6, number_of_bathrooms: 5, maximum_guests: 10, minimum_rental_days: 7, maximum_rental_days: 30, area_sq_ft: 12000, area_sq_m: 1114, number_of_parking_spots: 4, hoa: 200, year_built: 1815, address: "Pemberley Park", city: "Hertfordshire", state: "Herts", country: "UK", zip_code: "AL1 1AB", status: "active", is_published: true, is_featured: true, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 14200000, price_formatted: "$14,200,000", currency_symbol: "$" }, location: { id: 1, title: "Hertfordshire", country: "UK", slug: "hertfordshire" }, specs: { bedrooms: 6, bathrooms: 5, area_formatted: "12,000 Sq Ft", year_built: 1815, category: "Country Manors", property_type: "Sale" }, featured_image: "/themes/properties/classic/1.webp", short_description: "A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history." },
  { id: 2, user_id: 1, category_id: 2, type_id: 1, location_id: 2, title: "Florentine Palazzo", slug: "florentine-palazzo", description: "An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens.", base_price: 22500000, number_of_bedrooms: 8, number_of_bathrooms: 7, maximum_guests: 16, minimum_rental_days: 3, maximum_rental_days: 14, area_sq_ft: 18500, area_sq_m: 1718, number_of_parking_spots: 2, hoa: 500, year_built: 1540, address: "Via dei Bardi", city: "Florence", state: "Tuscany", country: "Italy", zip_code: "50125", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 22500000, price_formatted: "$22,500,000", currency_symbol: "$" }, location: { id: 2, title: "Florence", country: "Italy", slug: "florence" }, specs: { bedrooms: 8, bathrooms: 7, area_formatted: "18,500 Sq Ft", year_built: 1540, category: "Historic Chateaus", property_type: "Sale" }, featured_image: "/themes/properties/classic/2.webp", short_description: "An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens." },
  { id: 3, user_id: 1, category_id: 3, type_id: 1, location_id: 3, title: "Colonial River Estate", slug: "colonial-river-estate", description: "A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm.", base_price: 8900000, number_of_bedrooms: 5, number_of_bathrooms: 4, maximum_guests: 8, minimum_rental_days: 1, maximum_rental_days: 365, area_sq_ft: 8200, area_sq_m: 761, number_of_parking_spots: 3, hoa: 100, year_built: 1742, address: "River Road", city: "Virginia", state: "VA", country: "USA", zip_code: "23220", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 8900000, price_formatted: "$8,900,000", currency_symbol: "$" }, location: { id: 3, title: "Virginia", country: "USA", slug: "virginia" }, specs: { bedrooms: 5, bathrooms: 4, area_formatted: "8,200 Sq Ft", year_built: 1742, category: "Colonial Estates", property_type: "Sale" }, featured_image: "/themes/properties/classic/3.webp", short_description: "A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm." },
  { id: 4, user_id: 1, category_id: 2, type_id: 1, location_id: 3, title: "Loire Valley Chateau", slug: "loire-valley-chateau", description: "A breathtaking French chateau with spectacular turrets, exquisite manicured formal gardens, and extensive woodland acreage.", base_price: 35000000, number_of_bedrooms: 12, number_of_bathrooms: 10, maximum_guests: 20, minimum_rental_days: 5, maximum_rental_days: 30, area_sq_ft: 24000, area_sq_m: 2229, number_of_parking_spots: 10, hoa: 800, year_built: 1620, address: "Chateau Road", city: "Loire", state: "Centre-Val de Loire", country: "France", zip_code: "37000", status: "active", is_published: true, is_featured: true, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 35000000, price_formatted: "$35,000,000", currency_symbol: "$" }, location: { id: 3, title: "Loire Valley", country: "France", slug: "loire" }, specs: { bedrooms: 12, bathrooms: 10, area_formatted: "24,000 Sq Ft", year_built: 1620, category: "Historic Chateaus", property_type: "Sale" }, featured_image: "/themes/properties/classic/4.webp", short_description: "A breathtaking French chateau with spectacular turrets, exquisite manicured formal gardens, and extensive woodland acreage." },
  { id: 5, user_id: 1, category_id: 4, type_id: 1, location_id: 1, title: "Scottish Highland Castle", slug: "scottish-highland-castle", description: "A historic stone fortress overlooking the Scottish Highlands, complete with authentic battlements, grand hall, and private loch.", base_price: 12400000, number_of_bedrooms: 10, number_of_bathrooms: 8, maximum_guests: 18, minimum_rental_days: 2, maximum_rental_days: 14, area_sq_ft: 15000, area_sq_m: 1393, number_of_parking_spots: 6, hoa: 400, year_built: 1480, address: "Highland Way", city: "Inverness", state: "Highlands", country: "Scotland", zip_code: "IV1 1AA", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 12400000, price_formatted: "$12,400,000", currency_symbol: "$" }, location: { id: 1, title: "Inverness", country: "Scotland", slug: "inverness" }, specs: { bedrooms: 10, bathrooms: 8, area_formatted: "15,000 Sq Ft", year_built: 1480, category: "Royal Castles", property_type: "Sale" }, featured_image: "/themes/properties/classic/5.webp", short_description: "A historic stone fortress overlooking the Scottish Highlands, complete with authentic battlements, grand hall, and private loch." },
  { id: 6, user_id: 1, category_id: 1, type_id: 1, location_id: 1, title: "Bavarian Hunting Lodge", slug: "bavarian-hunting-lodge", description: "An alpine timber lodge surrounded by deep Bavarian forests, offering ultimate privacy, heated floors, and a gorgeous stone hearth.", base_price: 6500000, number_of_bedrooms: 4, number_of_bathrooms: 3, maximum_guests: 6, minimum_rental_days: 3, maximum_rental_days: 30, area_sq_ft: 5800, area_sq_m: 538, number_of_parking_spots: 2, hoa: 150, year_built: 1895, address: "Alpine Lodge Weg", city: "Bavaria", state: "Bavaria", country: "Germany", zip_code: "80331", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 6500000, price_formatted: "$6,500,000", currency_symbol: "$" }, location: { id: 1, title: "Bavaria", country: "Germany", slug: "bavaria" }, specs: { bedrooms: 4, bathrooms: 3, area_formatted: "5,800 Sq Ft", year_built: 1895, category: "Country Manors", property_type: "Sale" }, featured_image: "/themes/properties/classic/6.webp", short_description: "An alpine timber lodge surrounded by deep Bavarian forests, offering ultimate privacy, heated floors, and a gorgeous stone hearth." }
];

export default function ExplorePage({ initialCategorySlug }: ExplorePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial states from URL Search Params (or props)
  const initialSearch = searchParams.get('q') || '';
  const initialLoc = searchParams.get('loc') || '';
  const initialCat = searchParams.get('cat') || '';
  const initialBeds = searchParams.get('beds') || '';
  const initialPrice = searchParams.get('price') || '';

  const [estates, setEstates] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filter States synced with URL
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLocation, setSelectedLocation] = useState<string | number>(initialLoc);
  const [selectedCategory, setSelectedCategory] = useState<string | number>(initialCat);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>(initialBeds);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>(initialPrice);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // If a category slug is passed in via the dynamic route, map it on mount
  useEffect(() => {
    if (initialCategorySlug) {
      // Find category match
      const matched = FALLBACK_CATEGORIES.find(c => c.slug === initialCategorySlug);
      if (matched) {
        setSelectedCategory(matched.id);
      }
    }
  }, [initialCategorySlug]);

  const updateUrlParams = (
    query: string,
    loc: string | number,
    cat: string | number,
    beds: string,
    price: string
  ) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (loc) params.set('loc', String(loc));
    if (cat) params.set('cat', String(cat));
    if (beds) params.set('beds', beds);
    if (price) params.set('price', price);

    // Maintain theme preview path prefix if present
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const fetchProperties = async (pageToFetch = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params: Record<string, any> = {
        page: pageToFetch,
        per_page: 9,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedLocation) params.location = selectedLocation;

      // Handle Price range mapping for the API
      if (selectedPriceRange) {
        params.property_type = 'sale';
        if (selectedPriceRange === '1m-5m') {
          params.min_price = 1000000;
          params.max_price = 5000000;
        } else if (selectedPriceRange === '5m-10m') {
          params.min_price = 5000000;
          params.max_price = 10000000;
        } else if (selectedPriceRange === '10m-plus') {
          params.min_price = 10000000;
        }
      }

      const response = await api.getProperties(params);
      console.log("Classic Properties Explorer: Successfully fetched dynamic properties:", response);

      if (response && response.data && response.data.length > 0) {
        if (isLoadMore) {
          setEstates(prev => [...prev, ...response.data]);
        } else {
          setEstates(response.data);
        }

        if (response.sidebar) {
          setCategories(response.sidebar.categories || []);
          setLocations(response.sidebar.locations || []);
        }

        if (response.meta) {
          setCurrentPage(response.meta.current_page);
          setLastPage(response.meta.last_page);
        }
        setUseFallback(false);
        setApiError(null);
      } else {
        console.warn("Classic Properties Explorer: API returned empty properties collection. Falling back to static data.");
        setApiError("Database returned no listings. Ensure seeders have run.");
        triggerFallbacks(isLoadMore);
      }
    } catch (error) {
      console.error("Classic Properties Explorer: Failed to load dynamic real estate listings from API:", error);
      setApiError(error instanceof Error ? error.message : String(error));
      triggerFallbacks(isLoadMore);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const triggerFallbacks = (isLoadMore: boolean) => {
    setUseFallback(true);
    setCategories(FALLBACK_CATEGORIES);
    setLocations(FALLBACK_LOCATIONS);

    // Apply local client-side filter to the fallback array
    let filtered = [...FALLBACK_ESTATES];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(e => e.category_id === Number(selectedCategory));
    }
    if (selectedLocation) {
      filtered = filtered.filter(e => e.location_id === Number(selectedLocation));
    }
    if (selectedBedrooms) {
      filtered = filtered.filter(e => (e.specs?.bedrooms ?? e.number_of_bedrooms) >= Number(selectedBedrooms));
    }
    if (selectedPriceRange) {
      filtered = filtered.filter(e => {
        const val = Number(e.pricing?.base_price || e.base_price);
        if (selectedPriceRange === '1m-5m') return val >= 1000000 && val <= 5000000;
        if (selectedPriceRange === '5m-10m') return val >= 5000000 && val <= 10000000;
        if (selectedPriceRange === '10m-plus') return val >= 10000000;
        return true;
      });
    }

    if (isLoadMore) {
      setEstates(prev => [...prev, ...filtered]);
    } else {
      setEstates(filtered);
    }
    setCurrentPage(1);
    setLastPage(1);
  };

  // Perform search whenever any primary filter triggers
  useEffect(() => {
    fetchProperties(1, false);
    updateUrlParams(searchQuery, selectedLocation, selectedCategory, selectedBedrooms, selectedPriceRange);
  }, [selectedLocation, selectedCategory, selectedBedrooms, selectedPriceRange]);

  const handleRefineSearch = () => {
    fetchProperties(1, false);
    updateUrlParams(searchQuery, selectedLocation, selectedCategory, selectedBedrooms, selectedPriceRange);
  };

  const handleLoadMore = () => {
    if (useFallback) return;
    if (currentPage < lastPage) {
      fetchProperties(currentPage + 1, true);
    }
  };

  // Local client-side filters for bedrooms on raw API responses
  const displayEstates = useFallback
    ? estates
    : estates.filter(e => {
        if (selectedBedrooms) {
          const beds = e.specs?.bedrooms ?? e.number_of_bedrooms ?? 0;
          if (beds < Number(selectedBedrooms)) return false;
        }
        return true;
      });

  return (
    <div className="pc-container-base" style={{ background: 'var(--pc-bone)', minHeight: '100vh', paddingTop: '8rem' }}>
      
      {/* Explorer Editorial Header */}
      <section className="pc-section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--pc-border)', paddingBottom: '4rem', gap: '2rem' }}>
          <div>
            <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '1.25rem', opacity: 0.4 }}>Global Provenance Catalog</div>
            <h1 className="pc-serif" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pc-teal)', margin: 0 }}>
              The <span className="pc-italic" style={{ fontWeight: 400 }}>Catalogue.</span>
            </h1>
          </div>
          <div style={{ maxWidth: '400px' }}>
            <div style={{ background: 'var(--pc-border)', padding: '1px' }} className="pc-search-bar">
              <div className="pc-search-inner" style={{ flex: 1, background: 'white', padding: '1rem', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Filter region, manor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRefineSearch(); }}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--pc-font-body)', fontSize: '0.9rem' }}
                />
              </div>
              <button
                className="pc-btn-primary"
                style={{ background: 'var(--pc-teal)', color: 'white', padding: '1rem 2rem' }}
                onClick={handleRefineSearch}
              >
                FIND
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Grid View */}
      <section className="pc-section" style={{ paddingTop: '2rem', paddingBottom: '12rem' }}>
        <div className="pc-main-grid">
          <FilterSidebar
            categories={categories}
            locations={locations}
            selectedLocation={selectedLocation}
            selectedCategory={selectedCategory}
            selectedBedrooms={selectedBedrooms}
            selectedPriceRange={selectedPriceRange}
            onLocationChange={setSelectedLocation}
            onCategoryChange={setSelectedCategory}
            onBedroomsChange={setSelectedBedrooms}
            onPriceRangeChange={setSelectedPriceRange}
            onRefine={handleRefineSearch}
          />

          <div>
            {useFallback && apiError && (
              <div style={{
                background: 'var(--pc-white)',
                border: '1px solid var(--pc-border)',
                borderLeft: '4px solid var(--pc-accent)',
                padding: '2.5rem',
                marginBottom: '5rem',
                boxShadow: '0 20px 40px rgba(var(--pc-teal-rgb), 0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--pc-accent)',
                    display: 'inline-block'
                  }}></span>
                  <span className="pc-caps" style={{ color: 'var(--pc-accent)', fontSize: '0.7rem' }}>Heritage Archive Offline // Local Fallback Mode</span>
                </div>
                <div>
                  <h3 className="pc-serif" style={{ fontSize: '1.5rem', color: 'var(--pc-teal)', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                    Unable to Synchronize with Core Registry
                  </h3>
                  <p style={{ color: 'var(--pc-text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.7' }}>
                    We are currently displaying the Provincial Fallback Catalogue because the connection to the live Sellio database could not be established. 
                    This ensures uninterrupted browsing while the network or local database server is being configured.
                  </p>
                </div>
                <div style={{
                  background: 'var(--pc-beige)',
                  padding: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: 'var(--pc-teal)',
                  borderLeft: '2px solid var(--pc-teal)',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  System Diagnostic: {apiError}
                </div>
              </div>
            )}

            {loading && displayEstates.length === 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }} className="pc-estate-grid-skeleton">
                <style dangerouslySetInnerHTML={{ __html: `
                  .pc-skeleton-card {
                    background: var(--pc-white);
                    border: 1px solid var(--pc-border);
                    height: 550px;
                    opacity: 0.6;
                    animation: pcPulse 1.5s infinite ease-in-out;
                  }
                  @keyframes pcPulse {
                    0% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.4; }
                  }
                  @media (min-width: 992px) {
                    .pc-estate-grid-skeleton { grid-template-columns: repeat(2, 1fr) !important; }
                  }
                ` }} />
                <div className="pc-skeleton-card" />
                <div className="pc-skeleton-card" />
              </div>
            ) : displayEstates.length > 0 ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', fontSize: '0.8rem', color: 'var(--pc-text-muted)' }}>
                  <div className="pc-caps" style={{ opacity: 0.5 }}>
                    {displayEstates.length} Listing{displayEstates.length !== 1 ? 's' : ''} Cataloged
                  </div>
                  <div style={{ fontWeight: 800 }}>SORT: PROVENANCE DEFAULT</div>
                </div>

                <div className="pc-estate-grid">
                  {displayEstates.map((property) => (
                    <EstateCard
                      key={property.id}
                      property={property}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '8rem 2rem', border: '1px dashed var(--pc-border)', background: 'var(--pc-white)' }}>
                <h4 className="pc-serif" style={{ fontSize: '2rem', color: 'var(--pc-teal)', marginBottom: '1rem' }}>No Listings Located</h4>
                <p style={{ color: 'var(--pc-text-muted)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                  Adjust your search guidelines or filter specifications to locate available estates.
                </p>
              </div>
            )}

            {!useFallback && currentPage < lastPage && (
              <div style={{ marginTop: '8rem', textAlign: 'center' }}>
                <button
                  className="pc-btn-primary"
                  style={{ background: 'transparent', border: '1px solid var(--pc-teal)', color: 'var(--pc-teal)' }}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'LOCATING ARCHIVES...' : 'LOAD MORE ESTATES'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
