'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { api } from '@sellio/api-client';
import type { Property, Category, Location } from '@sellio/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

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
    { id: 1, user_id: 1, category_id: 1, type_id: 1, location_id: 1, title: "The Pemberley Manor", slug: "pemberley-manor", description: "A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history.", base_price: 14200000, number_of_bedrooms: 6, number_of_bathrooms: 5, maximum_guests: 10, minimum_rental_days: 7, maximum_rental_days: 30, area_sq_ft: 12000, area_sq_m: 1114, number_of_parking_spots: 4, hoa: 200, year_built: 1815, address: "Pemberley Park", city: "Hertfordshire", state: "Herts", country: "UK", zip_code: "AL1 1AB", status: "active", is_published: true, is_featured: true, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 14200000, price_formatted: "$14,200,000", currency_symbol: "$" }, location: { id: 1, title: "Hertfordshire", country: "UK", slug: "hertfordshire" }, specs: { bedrooms: 6, bathrooms: 5, area_formatted: "12,000 Sq Ft", year_built: 1815, category: "Country Manors", property_type: "Sale" }, featured_image: "/themes/properties/luxury/3.webp", short_description: "A majestic historic manor situated in the heart of Hertfordshire, featuring sweeping countryside views and rich architectural history." },
    { id: 2, user_id: 1, category_id: 2, type_id: 1, location_id: 2, title: "Florentine Palazzo", slug: "florentine-palazzo", description: "An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens.", base_price: 22500000, number_of_bedrooms: 8, number_of_bathrooms: 7, maximum_guests: 16, minimum_rental_days: 3, maximum_rental_days: 14, area_sq_ft: 18500, area_sq_m: 1718, number_of_parking_spots: 2, hoa: 500, year_built: 1540, address: "Via dei Bardi", city: "Florence", state: "Tuscany", country: "Italy", zip_code: "50125", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 22500000, price_formatted: "$22,500,000", currency_symbol: "$" }, location: { id: 2, title: "Florence", country: "Italy", slug: "florence" }, specs: { bedrooms: 8, bathrooms: 7, area_formatted: "18,500 Sq Ft", year_built: 1540, category: "Historic Chateaus", property_type: "Sale" }, featured_image: "/themes/properties/luxury/4.webp", short_description: "An authentic Renaissance palace in central Florence, with original frescoes, grand vaulted halls, and private courtyard gardens." },
    { id: 3, user_id: 1, category_id: 3, type_id: 1, location_id: 3, title: "Colonial River Estate", slug: "colonial-river-estate", description: "A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm.", base_price: 8900000, number_of_bedrooms: 5, number_of_bathrooms: 4, maximum_guests: 8, minimum_rental_days: 1, maximum_rental_days: 365, area_sq_ft: 8200, area_sq_m: 761, number_of_parking_spots: 3, hoa: 100, year_built: 1742, address: "River Road", city: "Virginia", state: "VA", country: "USA", zip_code: "23220", status: "active", is_published: true, is_featured: false, is_rental: false, is_sale: true, created_at: "", updated_at: "", pricing: { base_price: 8900000, price_formatted: "$8,900,000", currency_symbol: "$" }, location: { id: 3, title: "Virginia", country: "USA", slug: "virginia" }, specs: { bedrooms: 5, bathrooms: 4, area_formatted: "8,200 Sq Ft", year_built: 1742, category: "Colonial Estates", property_type: "Sale" }, featured_image: "/themes/properties/luxury/3.webp", short_description: "A meticulously preserved classic colonial estate on the banks of the James River, boasting rich heritage and timeless charm." }
];

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
        <a href={themeLink(`/product/${slug}`)} className="estate-card-premium" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ overflow: 'hidden' }}>
                <img src={image} alt={title} className="estate-card-img" />
            </div>
            <div className="estate-card-info">
                <span className="estate-card-tag">{tag}</span>
                <h3 className="estate-card-title">{title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>{price}</span>
                    <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{location.toUpperCase()}</span>
                </div>
            </div>
        </a>
    );
};

function ExploreContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedLocation, setSelectedLocation] = useState<string | number>(initialLoc);
    const [selectedCategory, setSelectedCategory] = useState<string | number>(initialCat);
    const [selectedBedrooms, setSelectedBedrooms] = useState<string>(initialBeds);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>(initialPrice);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

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
                per_page: 6,
            };

            if (searchQuery) params.search = searchQuery;
            if (selectedCategory) params.category_id = selectedCategory;
            if (selectedLocation) params.location = selectedLocation;

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
            } else {
                triggerFallback(isLoadMore);
            }
        } catch {
            triggerFallback(isLoadMore);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const triggerFallback = (isLoadMore: boolean) => {
        setCategories(FALLBACK_CATEGORIES);
        setLocations(FALLBACK_LOCATIONS);

        let filtered = [...FALLBACK_ESTATES];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
        }
        if (selectedCategory) {
            filtered = filtered.filter(e => e.category_id === Number(selectedCategory));
        }
        if (selectedLocation) {
            filtered = filtered.filter(e => e.location_id === Number(selectedLocation));
        }
        if (selectedBedrooms) {
            filtered = filtered.filter(e => e.number_of_bedrooms >= Number(selectedBedrooms));
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

    useEffect(() => {
        fetchProperties(1, false);
        updateUrlParams(searchQuery, selectedLocation, selectedCategory, selectedBedrooms, selectedPriceRange);
    }, [searchQuery, selectedLocation, selectedCategory, selectedBedrooms, selectedPriceRange]);

    const handleLoadMore = () => {
        if (currentPage < lastPage) {
            fetchProperties(currentPage + 1, true);
        }
    };

    return (
        <div className="luxury-premium-wrapper" style={{ padding: '8rem 5% 15rem 5%' }}>
            {/* Elegant Header */}
            <div style={{ marginBottom: '6rem', borderBottom: '1px solid var(--luxury-border)', paddingBottom: '3rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--luxury-gold)', letterSpacing: '5px' }}>Portfolio Directory</span>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', fontWeight: 900, marginTop: '1rem', marginBottom: '1.5rem', letterSpacing: '-2px' }}>The Collection.</h1>
                <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', lineHeight: '1.8' }}>
                    Browse and filter premier estates from our verified global portfolio.
                </p>
            </div>

            {/* Scoped Minimalist Horizontal Filter Suite */}
            <div className="luxury-filter-bar">
                <input
                    type="text"
                    placeholder="Search estates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="luxury-filter-input"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="luxury-filter-select"
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                </select>

                <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="luxury-filter-select"
                >
                    <option value="">All Locations</option>
                    {locations.map((l) => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                </select>

                <select
                    value={selectedBedrooms}
                    onChange={(e) => setSelectedBedrooms(e.target.value)}
                    className="luxury-filter-select"
                >
                    <option value="">Min. Bedrooms</option>
                    <option value="2">2+ Beds</option>
                    <option value="4">4+ Beds</option>
                    <option value="6">6+ Beds</option>
                    <option value="8">8+ Beds</option>
                </select>

                <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="luxury-filter-select"
                >
                    <option value="">Price Range</option>
                    <option value="1m-5m">$1M – $5M</option>
                    <option value="5m-10m">$5M – $10M</option>
                    <option value="10m-plus">$10M+</option>
                </select>
            </div>

            {/* Listings Grid */}
            {loading && estates.length === 0 ? (
                <div className="showcase-grid" style={{ marginTop: '4rem' }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="estate-card-premium" style={{ opacity: 0.5 }}>
                            <div style={{ overflow: 'hidden', aspectRatio: '4/5', background: '#f5f5f5' }}></div>
                            <div className="estate-card-info">
                                <div style={{ height: '0.7rem', width: '30%', background: '#e5e5e5', marginBottom: '1rem' }}></div>
                                <div style={{ height: '2.5rem', width: '80%', background: '#e5e5e5', marginBottom: '1rem' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ height: '1.25rem', width: '40%', background: '#e5e5e5' }}></div>
                                    <div style={{ height: '0.8rem', width: '25%', background: '#e5e5e5' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : estates.length === 0 ? (
                <div style={{ padding: '8rem 0', textAlign: 'center', border: '1px solid var(--luxury-border)', borderRadius: '4px', marginTop: '4rem' }}>
                    <span style={{ fontSize: '2rem', color: 'var(--luxury-gold)', display: 'block', marginBottom: '2rem' }}>✦</span>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>No properties found.</h3>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>Try adjusting your filters or clearing your search.</p>
                </div>
            ) : (
                <>
                    <div className="showcase-grid" style={{ marginTop: '4rem' }}>
                        {estates.map((prop, i) => {
                            const price = prop.pricing?.price_formatted || (prop.base_price ? `$${Number(prop.base_price).toLocaleString()}` : '');
                            const loc = prop.location?.title || prop.city || 'Exclusive Location';
                            const tag = prop.is_featured ? 'FEATURED' : 'SIGNATURE';
                            const image = prop.featured_image || prop.primary_image_url || '/themes/properties/luxury/3.webp';

                            return (
                                <EstateCard
                                    key={prop.id || i}
                                    title={prop.title}
                                    price={price}
                                    location={loc}
                                    tag={tag}
                                    image={image}
                                    slug={prop.slug}
                                />
                            );
                        })}
                    </div>

                    {currentPage < lastPage && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8rem' }}>
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="luxury-btn-primary"
                                style={{
                                    background: 'none',
                                    color: 'var(--luxury-charcoal)',
                                    border: '1px solid var(--luxury-charcoal)',
                                    padding: '1.5rem 5rem',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    letterSpacing: '3px',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    textTransform: 'uppercase',
                                    opacity: loadingMore ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!loadingMore) {
                                        e.currentTarget.style.backgroundColor = 'var(--luxury-charcoal)';
                                        e.currentTarget.style.color = 'white';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--luxury-charcoal)';
                                }}
                            >
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={
            <div style={{ padding: '15rem 5%', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '2rem', fontStyle: 'italic', color: '#888' }}>
                Loading Ledger...
            </div>
        }>
            <ExploreContent />
        </Suspense>
    );
}
