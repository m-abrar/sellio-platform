'use client';
import React, { useState, useEffect } from 'react';
import { DealsHeader, DealCard, DealsFooter, CountdownTimer } from './components';

export default function Page() {
  // State variables for search, filtering, and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

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

  // Hero Carousel slides data
  const heroSlides = [
    {
      title: "MacBook Pro 14\" M3 Max",
      desc: "Apple M3 Max Chip with 14-Core CPU, 30-Core GPU, 1TB SSD. Extreme speed, deal limited to stock on hand.",
      discount: "35",
      priceNow: "$1,299.00",
      priceWas: "$1,999.00",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600",
      category: "electronics"
    },
    {
      title: "PlayStation 5 Console Slim",
      desc: "Includes Marvel's Spider-Man 2 Full Game Voucher. Experience lightning-fast loading and deeper immersion.",
      discount: "33",
      priceNow: "$349.00",
      priceWas: "$499.00",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600",
      category: "gaming"
    },
    {
      title: "Sony WH-1000XM5 Headphones",
      desc: "Industry-leading noise canceling wireless headphones with crystal-clear hands-free calling and sleek comfort.",
      discount: "45",
      priceNow: "$219.00",
      priceWas: "$399.00",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
      category: "electronics"
    }
  ];

  // Rich list of mock classified bargain listings
  const initialDealsList = [
    // Electronics
    { title: "Apple Watch Series 8 (GPS, 41mm)", currentPrice: "$249.00", originalPrice: "$399.00", discount: "37", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=400", seller: "GadgetPro", isTopSeller: true, category: "electronics" },
    { title: "Canon EOS R6 Mirrorless Camera (Body Only)", currentPrice: "$1,399.00", originalPrice: "$2,299.00", discount: "39", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400", seller: "LensMaster", isTopSeller: true, category: "electronics" },
    { title: "Anker Soundcore Motion+ Bluetooth Speaker", currentPrice: "$59.00", originalPrice: "$99.99", discount: "41", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400", seller: "AudioDepot", isTopSeller: false, category: "electronics" },
    
    // Gaming
    { title: "Nintendo Switch OLED Model (White)", currentPrice: "$280.00", originalPrice: "$349.99", discount: "20", image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400", seller: "GamerDude88", isTopSeller: false, category: "gaming" },
    { title: "Razer DeathAdder V3 Pro Gaming Mouse", currentPrice: "$89.00", originalPrice: "$149.99", discount: "40", image: "https://images.unsplash.com/photo-1615663245857-ac93bb022f46?q=80&w=400", seller: "TechOutlet", isTopSeller: true, category: "gaming" },
    { title: "ASUS ROG Strix Flare II Mechanical Keyboard", currentPrice: "$119.00", originalPrice: "$179.99", discount: "34", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400", seller: "GamerDude88", isTopSeller: false, category: "gaming" },

    // Fashion
    { title: "Nike Air Max 270 Running Shoes", currentPrice: "$85.00", originalPrice: "$160.00", discount: "47", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400", seller: "KickZilla", isTopSeller: true, category: "fashion" },
    { title: "Levi's 511 Slim Fit Men's Jeans", currentPrice: "$39.00", originalPrice: "$69.50", discount: "44", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400", seller: "DenimRack", isTopSeller: false, category: "fashion" },
    { title: "Ray-Ban Classic Wayfarer Sunglasses", currentPrice: "$95.00", originalPrice: "$163.00", discount: "42", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400", seller: "StyleVault", isTopSeller: true, category: "fashion" },

    // Home
    { title: "Dyson V11 Cordless Vacuum (Refurbished)", currentPrice: "$299.00", originalPrice: "$599.00", discount: "50", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=400", seller: "HomeGoods99", isTopSeller: false, category: "home" },
    { title: "Vitamix 5200 Professional Blender", currentPrice: "$349.00", originalPrice: "$499.00", discount: "30", image: "https://images.unsplash.com/photo-1585237887309-84725ba5cbf1?q=80&w=400", seller: "KitchenKing", isTopSeller: true, category: "home" },
    { title: "Herman Miller Aeron Ergonomic Chair - Size B", currentPrice: "$450.00", originalPrice: "$1,200.00", discount: "62", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400", seller: "OfficeClearance", isTopSeller: false, category: "home" },
    { title: "YETI Tundra 45 Hard Cooler (Tan)", currentPrice: "$225.00", originalPrice: "$325.00", discount: "30", image: "https://images.unsplash.com/photo-1613962635952-4c2293bd3540?q=80&w=400", seller: "OutdoorGear", isTopSeller: true, category: "home" },

    // Vehicles
    { title: "Shoei RF-1400 Full Face Motorcycle Helmet", currentPrice: "$380.00", originalPrice: "$579.99", discount: "34", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400", seller: "MotoZone", isTopSeller: true, category: "vehicles" },
    { title: "Thule Motion XT XXL Cargo Box", currentPrice: "$550.00", originalPrice: "$999.00", discount: "45", image: "https://images.unsplash.com/photo-1617469767053-d3b508a0d84e?q=80&w=400", seller: "AdventureGear", isTopSeller: false, category: "vehicles" },

    // Tools
    { title: "DeWalt 20V Max Cordless Drill Kit", currentPrice: "$99.00", originalPrice: "$179.00", discount: "45", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400", seller: "HardwareDirect", isTopSeller: true, category: "tools" },
    { title: "Bosch Professional Laser Distance Measure", currentPrice: "$69.00", originalPrice: "$119.00", discount: "42", image: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=400", seller: "ToolShed", isTopSeller: false, category: "tools" },
  ];

  // Hot Bargains - strictly filtered for items with >40% discount
  const hotBargainsList = initialDealsList
    .filter(item => parseInt(item.discount) >= 42)
    .slice(0, 4);

  // Filter and sort general listings based on search, category selection, and sorting preference
  const filteredDeals = initialDealsList
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const getVal = (str: string) => parseFloat(str.replace('$', '').replace(',', ''));
      if (sortBy === 'discount') {
        return parseInt(b.discount) - parseInt(a.discount); // Highest discount first
      } else if (sortBy === 'price-asc') {
        return getVal(a.currentPrice) - getVal(b.currentPrice); // Low to high
      } else if (sortBy === 'price-desc') {
        return getVal(b.currentPrice) - getVal(a.currentPrice); // High to low
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

  return (
    <div className="classifieds-deals-wrapper">
      {/* Dynamic Header Component */}
      <DealsHeader 
        onSearch={setSearchTerm} 
        onSelectCategory={setSelectedCategory} 
        selectedCategory={selectedCategory} 
      />

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
                  <span style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--cd-primary-red)', fontSize: '0.9rem' }}>Trending Deal Highlight</span>
                  
                  <h1 className="cd-hero-title">{slide.title}</h1>
                  <p className="cd-hero-desc">{slide.desc}</p>
                  
                  <div className="cd-hero-meta">
                    <div className="cd-hero-price">
                      <span className="cd-hero-price-now">{slide.priceNow}</span>
                      <span className="cd-hero-price-was">{slide.priceWas}</span>
                    </div>
                    <div className="cd-hero-timer-container">
                      <span>⏳ Ends:</span>
                      <CountdownTimer hours={3} seconds={45} />
                    </div>
                  </div>

                  <button 
                    className="cd-btn-post" 
                    style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', boxShadow: '0 8px 24px rgba(231, 29, 54, 0.3)' }}
                    onClick={() => alert(`🎉 MacBook M3 / Deal claimed! Added to shopping basket.`)}
                  >
                    Snag This Deal Now ⚡
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
                <h2 className="cd-section-title">HOT BARGAINS</h2>
              </div>
              <span style={{ color: 'var(--cd-primary-red)', fontWeight: 800, fontSize: '0.85rem' }}>MAXIMUM DISCOUNTS EXCLUSIVES</span>
            </div>
            
            <div className="cd-deals-grid">
              {hotBargainsList.map((item, idx) => (
                <DealCard 
                  key={idx} 
                  {...item} 
                  isHotBargain={true}
                />
              ))}
            </div>
          </section>

          {/* Limited Time Offers list & Interactive controls */}
          <section className="cd-section">
            <div className="cd-section-header">
              <div className="cd-section-title-wrap">
                <span style={{ fontSize: '1.5rem' }}>⏰</span>
                <h2 className="cd-section-title">Limited-Time Deals</h2>
              </div>
              <span className="cd-section-link">Active Drops</span>
            </div>

            {/* Filter and sorting console ribbon */}
            <div className="cd-filter-bar">
              <div className="cd-filter-group">
                <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--cd-text-muted)' }}>Sort by:</span>
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
            {filteredDeals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--cd-text-muted)' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Deals Found</h3>
                <p>We couldn't find any bargains matching your query. Try broadening your keywords or resetting filters.</p>
              </div>
            ) : (
              <div className="cd-deals-grid">
                {filteredDeals.slice(0, visibleCount).map((deal, idx) => (
                  <DealCard key={idx} {...deal} />
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
                  {loadingMore ? 'Loading Price Drops...' : 'Load More Deals'}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar Column */}
        <aside className="cd-sidebar">
          
          {/* Flash Sale Widget with huge timer clock */}
          <div className="cd-flash-widget">
            <h3 className="cd-flash-title">DAILY FLASH SALE!</h3>
            <p className="cd-flash-subtitle">Super bargain lockouts</p>
            
            <div className="cd-flash-timer-box">
              <CountdownTimer hours={7} seconds={12} />
            </div>
            
            <p style={{ fontSize: '0.8rem', margin: '0 0 1rem', opacity: 0.9 }}>New extreme price drops will unlock once the countdown runs out!</p>
            <button 
              className="cd-flash-widget-btn"
              onClick={() => alert("🔑 Checking VIP status... Directing to Flash Lounge.")}
            >
              Enter Flash Lounge ⚡
            </button>
          </div>

          {/* Featured Sellers Follow Board */}
          <div className="cd-sidebar-widget">
            <h3 className="cd-widget-title">Featured Sellers</h3>
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
            <span className="cd-ad-badge">SPONSORED PROMOTION</span>
            <h3 className="cd-ad-title">Merchants Clearance Event</h3>
            <p className="cd-ad-desc">Overstock warehouses listing directly to local neighborhoods. Absolute rock-bottom bulk prices with next day shipping.</p>
            <button 
              className="cd-ad-btn"
              onClick={() => alert("📦 Connecting direct with overstock warehouses...")}
            >
              Browse Warehouse Deals
            </button>
          </div>

        </aside>

      </div>

      {/* Footer component */}
      <DealsFooter />
    </div>
  );
}
