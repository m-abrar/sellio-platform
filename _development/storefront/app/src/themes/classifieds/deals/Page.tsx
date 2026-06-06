'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing } from '@sellio/types';
import { DealsHeader, DealCard, DealsFooter, CountdownTimer } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const FALLBACK_DEALS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Apple Watch Series 8 (GPS, 41mm)",
    slug: "apple-watch-series-8-gps-41mm",
    description: "Keep track of your health and fitness with the Apple Watch Series 8. Features advanced sensors for insights into your physical well-being, an Always-On Retina display, robust water resistance, and fast-charging capabilities. Perfect condition, original packaging included.",
    short_description: "Apple Watch Series 8 in pristine space gray condition.",
    pricing: {
      base_price: 399,
      sale_price: 249,
      is_on_sale: true,
      discount: "37",
      formatted: "$249.00",
      formatted_short: "$249",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Like New",
      badge_class: "cd-badge-like-new",
      age_years: 1,
      quantity: 3,
      dimensions: "41mm x 35mm x 10.7mm",
      warranty: "6 Months Seller Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "electronics",
      type: "For Sale",
      brand: "Apple",
      tags: ["smartwatch", "fitness", "apple", "wearables"]
    },
    location: {
      city: "San Francisco",
      state: "CA",
      country: "USA",
      address: "Downtown SF"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: true,
      inquiry_count: 5
    },
    seller: {
      id: 101,
      name: "GadgetPro",
      avatar: null
    }
  },
  {
    id: 2,
    title: "Canon EOS R6 Mirrorless Camera (Body Only)",
    slug: "canon-eos-r6-mirrorless-camera-body-only",
    description: "The Canon EOS R6 is a versatile tool for photographers and videographers alike. Boasting a 20MP Full-Frame sensor, 4K60 video capabilities, 5-axis in-body image stabilization, and up to 20 fps mechanical shooting. Exceptionally clean body, negligible shutter count.",
    short_description: "Pro-tier mirrorless camera body, pristine condition.",
    pricing: {
      base_price: 2299,
      sale_price: 1399,
      is_on_sale: true,
      discount: "39",
      formatted: "$1,399.00",
      formatted_short: "$1,399",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Excellent",
      badge_class: "cd-badge-excellent",
      age_years: 1.5,
      quantity: 1,
      dimensions: "138.4mm x 97.5mm x 88.4mm",
      warranty: "1 Year Remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "electronics",
      type: "For Sale",
      brand: "Canon",
      tags: ["camera", "mirrorless", "canon", "photography"]
    },
    location: {
      city: "New York",
      state: "NY",
      country: "USA",
      address: "Manhattan Studio"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: true,
      is_shipping: true,
      inquiry_count: 12
    },
    seller: {
      id: 102,
      name: "LensMaster",
      avatar: null
    }
  },
  {
    id: 3,
    title: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5-headphones",
    description: "Industry-leading noise canceling wireless headphones with crystal-clear hands-free calling, smart features, and unmatched audio fidelity. Features a lightweight design with soft fit leather headband.",
    short_description: "Sony WH-1000XM5 wireless ANC headphones in black.",
    pricing: {
      base_price: 399,
      sale_price: 219,
      is_on_sale: true,
      discount: "45",
      formatted: "$219.00",
      formatted_short: "$219",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Brand New",
      badge_class: "cd-badge-new",
      age_years: 0.1,
      quantity: 5,
      dimensions: "Standard Over-Ear",
      warranty: "2 Year Global Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "electronics",
      type: "For Sale",
      brand: "Sony",
      tags: ["headphones", "anc", "audio", "sony", "music"]
    },
    location: {
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      address: "Beverly Hills"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: true,
      inquiry_count: 9
    },
    seller: {
      id: 103,
      name: "AudioDepot",
      avatar: null
    }
  },
  {
    id: 4,
    title: "Nike Air Max 270 Running Shoes",
    slug: "nike-air-max-270-running-shoes",
    description: "Nike's first lifestyle Air Max brings you style, comfort, and big attitude. Features an extra-large air pocket for supreme cushioning. Vibrant crimson red accents that match your active daily energy.",
    short_description: "Nike Air Max 270 in original box, never worn outdoors.",
    pricing: {
      base_price: 160,
      sale_price: 85,
      is_on_sale: true,
      discount: "47",
      formatted: "$85.00",
      formatted_short: "$85",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.9,
      condition_label: "Like New",
      badge_class: "cd-badge-like-new",
      age_years: 0.2,
      quantity: 2,
      dimensions: "US Men Size 10.5",
      warranty: "No Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "fashion",
      type: "For Sale",
      brand: "Nike",
      tags: ["shoes", "sneakers", "nike", "fashion", "running"]
    },
    location: {
      city: "Chicago",
      state: "IL",
      country: "USA",
      address: "Lincoln Park"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: true,
      inquiry_count: 2
    },
    seller: {
      id: 104,
      name: "KickZilla",
      avatar: null
    }
  },
  {
    id: 5,
    title: "Herman Miller Aeron Ergonomic Chair - Size B",
    slug: "herman-miller-aeron-ergonomic-chair-size-b",
    description: "The gold standard of ergonomic office seating. Fully loaded Size B model with posturefit lumbar support, tilt limiter, seat angle adjustment, and fully adjustable vinyl armrests. Pellet mesh is in superb shape without any tears.",
    short_description: "Classic Herman Miller Aeron office chair, Size B.",
    pricing: {
      base_price: 1200,
      sale_price: 450,
      is_on_sale: true,
      discount: "62",
      formatted: "$450.00",
      formatted_short: "$450",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.5,
      condition_label: "Very Good",
      badge_class: "cd-badge-very-good",
      age_years: 3,
      quantity: 1,
      dimensions: "Size B (Medium)",
      warranty: "5 Years Warranty Remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "home",
      type: "For Sale",
      brand: "Herman Miller",
      tags: ["chair", "ergonomic", "office", "furniture"]
    },
    location: {
      city: "Boston",
      state: "MA",
      country: "USA",
      address: "Financial District"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: false,
      inquiry_count: 14
    },
    seller: {
      id: 105,
      name: "OfficeClearance",
      avatar: null
    }
  },
  {
    id: 6,
    title: "DeWalt 20V Max Cordless Drill Kit",
    slug: "dewalt-20v-max-cordless-drill-kit",
    description: "High performance DeWalt 20V cordless compact drill and driver kit. Includes two 20V lithium-ion batteries, a charger, and a heavy-duty contractor carrying bag. Ideal for home projects or contractor duties.",
    short_description: "DeWalt Cordless Drill Kit, complete set with 2 batteries.",
    pricing: {
      base_price: 179,
      sale_price: 99,
      is_on_sale: true,
      discount: "45",
      formatted: "$99.00",
      formatted_short: "$99",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Like New",
      badge_class: "cd-badge-like-new",
      age_years: 0.5,
      quantity: 2,
      dimensions: "Compact 20V",
      warranty: "1 Year Remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "tools",
      type: "For Sale",
      brand: "DeWalt",
      tags: ["drill", "tools", "dewalt", "cordless"]
    },
    location: {
      city: "Seattle",
      state: "WA",
      country: "USA",
      address: "Greenwood"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true,
      inquiry_count: 4
    },
    seller: {
      id: 106,
      name: "HardwareDirect",
      avatar: null
    }
  }
];

const DealCardSkeleton = () => (
  <div className="cd-deal-card" style={{ border: '1px solid rgba(231,29,54,0.2)' }}>
    <div style={{
      height: '180px',
      backgroundColor: '#1f2937',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(231,29,54,0.15), transparent)',
        animation: 'cdShimmerGrid 1.5s infinite'
      }} />
    </div>
    <div className="cd-card-body" style={{ backgroundColor: '#111827' }}>
      <div style={{ height: '1.25rem', backgroundColor: '#374151', borderRadius: '4px', marginBottom: '0.75rem', width: '80%' }} />
      <div style={{ height: '1rem', backgroundColor: '#374151', borderRadius: '4px', marginBottom: '0.75rem', width: '50%' }} />
      <div style={{ height: '2.5rem', backgroundColor: '#1f2937', borderRadius: '6px', marginTop: '1rem' }} />
    </div>
  </div>
);

export default function Page() {
  const router = useRouter();
  const diagnosticsTitle = useThemeContent('diagnostics.title', 'DATABASE CONNECTION WARNING: Local catalog resilience fallback active');
  const trendingTagLabel = useThemeContent('trending.tag_label', 'Trending Deal Highlight');
  const endsLabel = useThemeContent('trending.ends_label', '⏳ Ends:');
  const hotBargainsTitle = useThemeContent('hot_bargains.title', 'HOT BARGAINS');
  const hotBargainsSubtitle = useThemeContent('hot_bargains.subtitle', 'MAXIMUM DISCOUNTS EXCLUSIVES');
  const limitedDealsTitle = useThemeContent('limited_deals.title', 'Limited-Time Deals');
  const limitedDealsSubtitle = useThemeContent('limited_deals.subtitle', 'Active Drops');
  const sortLabel = useThemeContent('limited_deals.sort_label', 'Sort by:');
  const loadMoreLabel = useThemeContent('collection.load_more_label', 'Load More Deals');
  const loadingMoreLabel = useThemeContent('collection.loading_more_label', 'Loading Price Drops...');
  const flashSaleTitle = useThemeContent('sidebar.flash_sale.title', 'DAILY FLASH SALE!');
  const flashSaleSubtitle = useThemeContent('sidebar.flash_sale.subtitle', 'Super bargain lockouts');
  const flashSaleDescription = useThemeContent('sidebar.flash_sale.description', 'New extreme price drops will unlock once the countdown runs out!');
  const flashSaleButtonLabel = useThemeContent('sidebar.flash_sale.button_label', 'Enter Flash Lounge ⚡');
  const featuredSellersTitle = useThemeContent('sidebar.featured_sellers.title', 'Featured Sellers');
  const adBadge = useThemeContent('sidebar.ad.badge', 'SPONSORED PROMOTION');
  const adTitle = useThemeContent('sidebar.ad.title', 'Merchants Clearance Event');
  const adDesc = useThemeContent('sidebar.ad.desc', 'Overstock warehouses listing directly to local neighborhoods. Absolute rock-bottom bulk prices with next day shipping.');
  const adButtonLabel = useThemeContent('sidebar.ad.button_label', 'Browse Warehouse Deals');

  const [deals, setDeals] = useState<ClassifiedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // State variables for search, filtering, and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await api.getClassifieds();
        if (response && response.data && response.data.length > 0) {
          setDeals(response.data);
          setUseFallback(false);
        } else {
          console.warn("Classifieds Deals API responded with empty list. Restoring local reserves.");
          setErrorTrace("Classifieds Deals API responded with empty list.");
          loadFallback();
        }
      } catch (err: any) {
        console.error("Classifieds Deals API connection failed. Loading local reserves.", err);
        setErrorTrace(err?.stack || err?.message || String(err));
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      setDeals(FALLBACK_DEALS);
      setUseFallback(true);
    };

    fetchDeals();
  }, []);

  // Auto-play the Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Featured sellers followed states in sidebar
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);
  const toggleFollow = (seller: string) => {
    if (followedSellers.includes(seller)) {
      setFollowedSellers(followedSellers.filter(s => s !== seller));
    } else {
      setFollowedSellers([...followedSellers, seller]);
    }
  };

  // Hero Carousel slides data (retaining premium high-impact static layouts for graphics)
  const heroSlides = [
    {
      title: useThemeContent('hero.slide_1.title', 'MacBook Pro 14" M3 Max'),
      desc: useThemeContent('hero.slide_1.desc', 'Apple M3 Max Chip with 14-Core CPU, 30-Core GPU, 1TB SSD. Extreme speed, deal limited to stock on hand.'),
      discount: useThemeContent('hero.slide_1.discount', '35'),
      priceNow: useThemeContent('hero.slide_1.priceNow', '$1,299.00'),
      priceWas: useThemeContent('hero.slide_1.priceWas', '$1,999.00'),
      image: useThemeContent('hero.slide_1.image', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600'),
      category: "electronics",
      buttonLabel: useThemeContent('hero.slide_1.button_label', 'Snag This Deal Now ⚡')
    },
    {
      title: useThemeContent('hero.slide_2.title', 'PlayStation 5 Console Slim'),
      desc: useThemeContent('hero.slide_2.desc', "Includes Marvel's Spider-Man 2 Full Game Voucher. Experience lightning-fast loading and deeper immersion."),
      discount: useThemeContent('hero.slide_2.discount', '33'),
      priceNow: useThemeContent('hero.slide_2.priceNow', '$349.00'),
      priceWas: useThemeContent('hero.slide_2.priceWas', '$499.00'),
      image: useThemeContent('hero.slide_2.image', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600'),
      category: "gaming",
      buttonLabel: useThemeContent('hero.slide_2.button_label', 'Snag This Deal Now ⚡')
    },
    {
      title: useThemeContent('hero.slide_3.title', 'Sony WH-1000XM5 Headphones'),
      desc: useThemeContent('hero.slide_3.desc', 'Industry-leading noise canceling wireless headphones with crystal-clear hands-free calling and sleek comfort.'),
      discount: useThemeContent('hero.slide_3.discount', '45'),
      priceNow: useThemeContent('hero.slide_3.priceNow', '$219.00'),
      priceWas: useThemeContent('hero.slide_3.priceWas', '$399.00'),
      image: useThemeContent('hero.slide_3.image', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600'),
      category: "electronics",
      buttonLabel: useThemeContent('hero.slide_3.button_label', 'Snag This Deal Now ⚡')
    }
  ];

  const getDisc = (d: ClassifiedListing) => {
    if (d.pricing?.discount) return parseInt(d.pricing.discount);
    if (d.pricing?.base_price && d.pricing?.sale_price) {
      return Math.round(((d.pricing.base_price - d.pricing.sale_price) / d.pricing.base_price) * 100);
    }
    return 0;
  };

  const getPrice = (d: ClassifiedListing) => d.pricing?.sale_price || d.pricing?.base_price || 0;

  // Hot Bargains - strictly filtered for items with >= 42% discount
  const hotBargainsList = deals
    .filter(item => getDisc(item) >= 42)
    .slice(0, 4);

  // Filter and sort general listings based on search, category selection, and sorting preference
  const filteredDeals = deals
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (item.seller?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || (item.taxonomy?.category || '').toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'discount') {
        return getDisc(b) - getDisc(a); // Highest discount first
      } else if (sortBy === 'price-asc') {
        return getPrice(a) - getPrice(b); // Low to high
      } else if (sortBy === 'price-desc') {
        return getPrice(b) - getPrice(a); // High to low
      }
      return 0;
    });

  // Handle Load More clicks with mock spinner animation
  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setLoadingMore(false);
    }, 600);
  };

  const resolveProductUrl = (slug: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_deals/product/${slug}`;
      }
    }
    return `/product/${slug}`;
  };

  const handleCardClick = (slug: string) => {
    router.push(resolveProductUrl(slug));
  };

  return (
    <div className="classifieds-deals-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cdShimmerGrid {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />

      {/* Dynamic Header Component */}
      <DealsHeader 
        onSearch={setSearchTerm} 
        onSelectCategory={setSelectedCategory} 
        selectedCategory={selectedCategory} 
      />

      {/* High-Impact connection diagnostics traceback ribbon */}
      {useFallback && (
        <div style={{
          backgroundColor: '#0f172a',
          border: '2px solid #e71d36',
          borderRadius: '12px',
          padding: '1.5rem',
          margin: '2rem 5%',
          fontFamily: 'monospace',
          color: '#f3f4f6',
          boxShadow: '0 0 20px rgba(231, 29, 54, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e71d36', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem' }}>
            <span className="cd-pulse-dot" style={{ backgroundColor: '#e71d36' }}></span>
            {diagnosticsTitle}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <strong>STATUS:</strong> [OFFLINE] | LATENCY: [TIMEOUT]
            <br />
            <strong>REASON:</strong> {errorTrace && errorTrace.includes('is not a function') ? 'Turbopack cache mismatch. Browser is running an outdated build of @sellio/api-client.' : 'Axios connection failed to 127.0.0.1:8000. Laravel backend database node unresponsive.'}
            <br />
            <strong>DIAGNOSTICS:</strong> {errorTrace || 'api.getClassifieds is not a function (Turbopack cache mismatch).'}
            <br />
            <strong>ACTION:</strong> Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...
          </div>
        </div>
      )}

      {/* Hero / Bargain Slides Carousel (Auto-playing and interactive) */}
      <div className="cd-hero-container">
        <div className="cd-hero-slider">
          {heroSlides.map((slide, index) => {
            const isCurrent = index === carouselIndex;
            return (
              <div 
                key={index} 
                className="cd-hero-slide"
                style={{ 
                  transform: `translateX(-${carouselIndex * 100}%)`,
                  display: 'flex'
                }}
              >
                <div className="cd-discount-badge-hero">⚡ {slide.discount}% OFF DAILY FLASH</div>
                
                <div className="cd-hero-info">
                  <div className="cd-pulse-dot" style={{ marginRight: '8px' }}></div>
                  <span style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--cd-primary-red)', fontSize: '0.9rem' }}>{trendingTagLabel}</span>
                  
                  <h1 className="cd-hero-title">{slide.title}</h1>
                  <p className="cd-hero-desc">{slide.desc}</p>
                  
                  <div className="cd-hero-meta">
                    <div className="cd-hero-price">
                      <span className="cd-hero-price-now">{slide.priceNow}</span>
                      <span className="cd-hero-price-was">{slide.priceWas}</span>
                    </div>
                    <div className="cd-hero-timer-container">
                      <span>{endsLabel}</span>
                      <CountdownTimer hours={3} seconds={45} />
                    </div>
                  </div>

                  <button 
                    className="cd-btn-post" 
                    style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', boxShadow: '0 8px 24px rgba(231, 29, 54, 0.3)' }}
                    onClick={() => {
                      // Navigate to corresponding item details page
                      const matchingSlug = slide.category === 'electronics' 
                        ? (slide.title.includes('MacBook') ? 'apple-watch-series-8-gps-41mm' : 'sony-wh-1000xm5-headphones')
                        : 'sony-wh-1000xm5-headphones';
                      router.push(resolveProductUrl(matchingSlug));
                    }}
                  >
                    {slide.buttonLabel}
                  </button>
                </div>

                <div className="cd-hero-image-wrap d-none d-lg-flex">
                  <img src={slide.image} className="cd-hero-img" alt={slide.title} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button 
          className="cd-slider-btn cd-slider-btn-prev" 
          onClick={() => setCarouselIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          aria-label="Previous Deal Slide"
        >
          🡠
        </button>
        <button 
          className="cd-slider-btn cd-slider-btn-next" 
          onClick={() => setCarouselIndex((prev) => (prev + 1) % heroSlides.length)}
          aria-label="Next Deal Slide"
        >
          🡢
        </button>

        {/* Carousel Indicators/Dots */}
        <div className="cd-slider-dots">
          {heroSlides.map((_, index) => (
            <button 
              key={index} 
              className={`cd-slider-dot ${index === carouselIndex ? 'cd-active' : ''}`}
              onClick={() => setCarouselIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Grid Layout (Two Columns: Main Area vs Sidebar Widget Board) */}
      <div className="cd-main-container">
        
        {/* Left Main Content Pane */}
        <div>
          {/* Exclusive Hot Bargains Showcase */}
          <section className="cd-section">
            <div className="cd-section-header">
              <div className="cd-section-title-wrap">
                <span style={{ fontSize: '1.5rem' }}>🔥</span>
                <h2 className="cd-section-title">{hotBargainsTitle}</h2>
              </div>
              <span style={{ color: 'var(--cd-primary-red)', fontWeight: 800, fontSize: '0.85rem' }}>{hotBargainsSubtitle}</span>
            </div>
            
            <div className="cd-deals-grid">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <DealCardSkeleton key={i} />)
              ) : hotBargainsList.length === 0 ? (
                <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '2rem', color: 'var(--cd-text-muted)' }}>
                  No Hot Bargains currently live in selected filters.
                </div>
              ) : (
                hotBargainsList.map((item, idx) => (
                  <DealCard 
                    key={idx} 
                    title={item.title}
                    currentPrice={item.pricing?.formatted || `$${item.pricing?.sale_price || item.pricing?.base_price}`}
                    originalPrice={`$${item.pricing?.base_price}`}
                    discount={item.pricing?.discount || getDisc(item).toString()}
                    image={item.media?.main_photo || ''}
                    seller={item.seller?.name || 'GadgetPro'}
                    isTopSeller={true}
                    category={item.taxonomy?.category || 'all'}
                    slug={item.slug}
                    onClick={handleCardClick}
                    isHotBargain={true}
                  />
                ))
              )}
            </div>
          </section>

          {/* Limited Time Offers list & Interactive controls */}
          <section className="cd-section">
            <div className="cd-section-header">
              <div className="cd-section-title-wrap">
                <span style={{ fontSize: '1.5rem' }}>⏰</span>
                <h2 className="cd-section-title">{limitedDealsTitle}</h2>
              </div>
              <span className="cd-section-link">{limitedDealsSubtitle}</span>
            </div>

            {/* Filter and sorting console ribbon */}
            <div className="cd-filter-bar">
              <div className="cd-filter-group">
                <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--cd-text-muted)' }}>{sortLabel}</span>
                <select 
                  className="cd-select" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="discount">🔥 Highest Discount</option>
                  <option value="price-asc">💵 Price: Low to High</option>
                  <option value="price-desc">💵 Price: High to Low</option>
                </select>
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--cd-text-muted)' }}>
                Showing {Math.min(visibleCount, filteredDeals.length)} of {filteredDeals.length} deals
              </div>
            </div>

            {/* General Deals Grid */}
            {loading ? (
              <div className="cd-deals-grid">
                {Array.from({ length: 6 }).map((_, i) => <DealCardSkeleton key={i} />)}
              </div>
            ) : filteredDeals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--cd-text-muted)' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Deals Found</h3>
                <p>We couldn't find any bargains matching your query. Try broadening your keywords or resetting filters.</p>
              </div>
            ) : (
              <div className="cd-deals-grid">
                {filteredDeals.slice(0, visibleCount).map((deal, idx) => (
                  <DealCard 
                    key={idx} 
                    title={deal.title}
                    currentPrice={deal.pricing?.formatted || `$${deal.pricing?.sale_price || deal.pricing?.base_price}`}
                    originalPrice={`$${deal.pricing?.base_price}`}
                    discount={deal.pricing?.discount || getDisc(deal).toString()}
                    image={deal.media?.main_photo || ''}
                    seller={deal.seller?.name || 'GadgetPro'}
                    isTopSeller={true}
                    category={deal.taxonomy?.category || 'all'}
                    slug={deal.slug}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredDeals.length > visibleCount && (
              <div className="cd-load-more-wrap">
                <button 
                  className="cd-btn-load-more" 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? loadingMoreLabel : loadMoreLabel}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar Column */}
        <aside className="cd-sidebar">
          
          {/* Flash Sale Widget with huge timer clock */}
          <div className="cd-flash-widget">
            <h3 className="cd-flash-title">{flashSaleTitle}</h3>
            <p className="cd-flash-subtitle">{flashSaleSubtitle}</p>
            
            <div className="cd-flash-timer-box">
              <CountdownTimer hours={7} seconds={12} />
            </div>
            
            <p style={{ fontSize: '0.8rem', margin: '0 0 1rem', opacity: 0.9 }}>{flashSaleDescription}</p>
            <button 
              className="cd-flash-widget-btn"
              onClick={() => alert("🔑 Checking VIP status... Directing to Flash Lounge.")}
            >
              {flashSaleButtonLabel}
            </button>
          </div>

          {/* Featured Sellers Follow Board */}
          <div className="cd-sidebar-widget">
            <h3 className="cd-widget-title">{featuredSellersTitle}</h3>
            <div className="cd-sellers-list">
              {[
                { name: "Gadget Guru", rating: "⭐⭐⭐⭐⭐ (240 reviews)", initial: "G" },
                { name: "Fashion Finds", rating: "⭐⭐⭐⭐ (198 reviews)", initial: "F" },
                { name: "Home Essentials", rating: "⭐⭐⭐⭐⭐ (84 reviews)", initial: "H" },
                { name: "LensMaster", rating: "⭐⭐⭐⭐⭐ (310 reviews)", initial: "L" },
                { name: "KickZilla", rating: "⭐⭐⭐⭐ (112 reviews)", initial: "K" }
              ].map((seller, idx) => {
                const following = followedSellers.includes(seller.name);
                return (
                  <div key={idx} className="cd-seller-row">
                    <div className="cd-seller-avatar-info">
                      <div className="cd-seller-avatar">{seller.initial}</div>
                      <div className="cd-seller-meta">
                        <span className="cd-seller-row-name">{seller.name}</span>
                        <span className="cd-seller-rating">{seller.rating}</span>
                      </div>
                    </div>
                    <button 
                      className={`cd-btn-follow ${following ? 'cd-following' : ''}`}
                      onClick={() => toggleFollow(seller.name)}
                    >
                      {following ? '✓' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ad Clearance Sponsored Slot */}
          <div className="cd-ad-widget">
            <span className="cd-ad-badge">{adBadge}</span>
            <h3 className="cd-ad-title">{adTitle}</h3>
            <p className="cd-ad-desc">{adDesc}</p>
            <button 
              className="cd-ad-btn"
              onClick={() => alert("📦 Connecting direct with overstock warehouses...")}
            >
              {adButtonLabel}
            </button>
          </div>

        </aside>

      </div>

      {/* Footer component */}
      <DealsFooter />
    </div>
  );
}
