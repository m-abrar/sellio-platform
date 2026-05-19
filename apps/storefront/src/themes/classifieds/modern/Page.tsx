'use client';
import React, { useState } from 'react';
import { ModernHeader, ModernCard, ModernFooter } from './components';

interface CatalogItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  location: string;
  time: string;
  image: string;
  description: string;
  category: string;
  isFeatured?: boolean;
  isRecent?: boolean;
  isSale?: boolean;
  isFavorite: boolean;
}

export default function Page() {
  const initialItems: CatalogItem[] = [
    { 
      id: 1, 
      title: "Apple iPad Pro 12.9 (M2 Chip - 256GB)", 
      price: "$850", 
      numericPrice: 850,
      location: "San Jose, CA", 
      time: "2h ago", 
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400",
      description: "Mint condition Apple iPad Pro 12.9-inch with the powerhouse M2 chip. 256GB storage, space gray color. Includes original box, charger, and an extra screen protector.",
      category: "electronics",
      isRecent: true,
      isFavorite: false
    },
    { 
      id: 2, 
      title: "Chesterfield Vintage Leather Sofa", 
      price: "$1,200", 
      numericPrice: 1200,
      location: "Austin, TX", 
      time: "5h ago", 
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400",
      description: "Stunning Chesterfield 3-seater sofa in aged oxblood vintage leather. Hand-tufted details, solid mahogany legs, and classic scroll arms. Incredibly comfortable.",
      category: "furniture",
      isFeatured: true,
      isFavorite: true
    },
    { 
      id: 3, 
      title: "DJI Mavic Air 2 Fly More Combo", 
      price: "$650", 
      numericPrice: 650,
      location: "Miami, FL", 
      time: "Just now", 
      image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=400",
      description: "Perfect working order DJI Mavic Air 2 drone. Fly More Combo includes 3 smart batteries, multi-charger hub, ND filter set, carrying bag, and replacement propellers.",
      category: "electronics",
      isSale: true,
      isFavorite: false
    },
    { 
      id: 4, 
      title: "Adidas Yeezy Boost 350 V2", 
      price: "$220", 
      numericPrice: 220,
      location: "Brooklyn, NY", 
      time: "1d ago", 
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400",
      description: "Adidas Yeezy Boost 350 V2 'Carbon'. Size US 10.5. Deadstock condition, never worn, tags still attached. Purchased directly from Adidas Confirmed app.",
      category: "fashion",
      isRecent: true,
      isFavorite: false
    },
    { 
      id: 5, 
      title: "Sony PlayStation 5 Disc Edition", 
      price: "$400", 
      numericPrice: 400,
      location: "Chicago, IL", 
      time: "3d ago", 
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400",
      description: "Gently used Sony PlayStation 5 Disc Console. Firmware updated. Package includes 1 white DualSense wireless controller, HDMI cable, power cord, and Astro's Playroom.",
      category: "electronics",
      isFeatured: true,
      isFavorite: false
    },
    { 
      id: 6, 
      title: "Canon EOS R5 Mirrorless Camera Body", 
      price: "$2,800", 
      numericPrice: 2800,
      location: "Seattle, WA", 
      time: "4d ago", 
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400",
      description: "Professional mirrorless setup: Canon EOS R5 body. 45MP full-frame sensor, 8K video, 5-axis in-body stabilization. Shutter count under 12k. Flawless cosmetics.",
      category: "electronics",
      isSale: true,
      isFavorite: false
    },
    { 
      id: 7, 
      title: "Secretlab TITAN Evo Gaming Chair", 
      price: "$350", 
      numericPrice: 350,
      location: "Denver, CO", 
      time: "1w ago", 
      image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=400",
      description: "Secretlab TITAN Evo 2022 Series gaming chair. Size Regular, upholstered in softweave plush fabric (charcoal blue). 4D armrests, magnetic head pillow.",
      category: "furniture",
      isRecent: true,
      isFavorite: false
    },
    { 
      id: 8, 
      title: "Oculus Quest 2 128GB VR Headset", 
      price: "$200", 
      numericPrice: 200,
      location: "Atlanta, GA", 
      time: "1w ago", 
      image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=400",
      description: "Meta Oculus Quest 2 standalone VR headset. 128GB memory model. Includes two touch controllers, glasses spacer, silicon face cover, and charge adapter.",
      category: "electronics",
      isRecent: true,
      isFavorite: false
    }
  ];

  const categories = [
    { id: "all", name: "Everything" },
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "furniture", name: "Furniture" }
  ];

  // Stateful filtering & modal variables
  const [items, setItems] = useState<CatalogItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('new');
  
  // Quick View Modal States
  const [quickViewItem, setQuickViewItem] = useState<CatalogItem | null>(null);

  // Pagination / Load More states
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingItems, setLoadingItems] = useState(false);

  const toggleFavoriteItem = (id: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const nextVal = !item.isFavorite;
          console.log(`Favorite toggled for item: ${item.title} -> ${nextVal}`);
          return { ...item, isFavorite: nextVal };
        }
        return item;
      })
    );
  };

  const handleShareClick = (item: CatalogItem, platform: string) => {
    alert(`🔗 Shared: Successfully copied share link for "${item.title}" to ${platform}!`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('new');
    setVisibleCount(6);
  };

  // Filter listings based on categories pill and search keyword
  const filteredItems = items
    .filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'new') {
        return a.id - b.id; // Chronological mockup order
      } else if (sortBy === 'price-asc') {
        return a.numericPrice - b.numericPrice; // Price Low to High
      } else if (sortBy === 'price-desc') {
        return b.numericPrice - a.numericPrice; // Price High to Low
      }
      return 0;
    });

  // Handle load more mockup animation
  const handleLoadMore = () => {
    setLoadingItems(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setLoadingItems(false);
    }, 600);
  };

  return (
    <div className="classifieds-modern-wrapper">
      {/* Modern Header component */}
      <ModernHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onPostClick={() => alert("📸 Post Ad Wizard: Secure ad wizard opened to list item.")} 
      />

      {/* Hero Banner Area */}
      <section className="cm-hero">
        <div className="cm-hero-content">
          <h1 className="cm-hero-title">
            Discover the best things to <span className="cm-text-orange">buy</span>, <span className="cm-text-cyan">sell</span>, and trade.
          </h1>
          
          {/* Custom Search Box inside Hero */}
          <div className="cm-search-container">
            <input 
              type="text" 
              className="cm-search-input" 
              placeholder="What are you looking for today? (e.g. camera, table, jacket)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="cm-btn cm-btn-primary" 
              style={{ margin: '0.25rem', padding: '0.65rem 2rem' }}
              onClick={() => console.log(`Searching for keyword: ${searchTerm}`)}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Pill Selection */}
      <div className="cm-categories">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            className={`cm-cat-pill ${selectedCategory === cat.id ? 'active-orange' : ''}`}
            onClick={() => { setSelectedCategory(cat.id); setVisibleCount(6); }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Grid Feed */}
      <section className="cm-section">
        
        {/* Title and sorting controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="cm-section-title">Fresh Recommendations</h2>
          
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cm-text-muted)', textTransform: 'uppercase' }}>Sort by:</span>
            <select 
              style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', outline: 'none', fontWeight: 600, fontFamily: 'var(--cm-font)', fontSize: '0.8rem', cursor: 'pointer', backgroundColor: '#ffffff' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="new">🕒 Newest Listed</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💵 Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dynamic Card Grid */}
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#ffffff', borderRadius: '16px', border: '1.5px solid var(--cm-border)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No Listings Matching Search</h3>
            <p style={{ color: 'var(--cm-text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>We couldn't find items that match your tags or keyword search query.</p>
            <button className="cm-btn cm-btn-primary" onClick={resetFilters}>Reset Settings</button>
          </div>
        ) : (
          <div className="cm-grid">
            {filteredItems.slice(0, visibleCount).map((item) => (
              <ModernCard 
                key={item.id}
                title={item.title}
                price={item.price}
                location={item.location}
                time={item.time}
                image={item.image}
                isFeatured={item.isFeatured}
                isRecent={item.isRecent}
                isSale={item.isSale}
                isFavorite={item.isFavorite}
                onQuickView={() => setQuickViewItem(item)}
                onToggleFavorite={() => toggleFavoriteItem(item.id)}
                onShare={() => handleShareClick(item, 'clipboard')}
              />
            ))}
          </div>
        )}

        {/* Load More trigger CTA */}
        {filteredItems.length > visibleCount && (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <button 
              className="cm-btn" 
              onClick={handleLoadMore}
              disabled={loadingItems}
              style={{ backgroundColor: 'white', border: '2px solid var(--cm-border)', color: 'var(--cm-text-dark)', minWidth: '200px', justifyContent: 'center' }}
            >
              {loadingItems ? 'Retrieving listings...' : 'Load More Items'}
            </button>
          </div>
        )}

      </section>

      {/* Floating Center Quick View Popup Modal Dialog */}
      {quickViewItem && (
        <div className="cm-modal-overlay" onClick={() => setQuickViewItem(null)}>
          <div className="cm-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cm-modal-close" onClick={() => setQuickViewItem(null)}>×</button>
            
            <img src={quickViewItem.image} className="cm-modal-img" alt={quickViewItem.title} />
            
            <div className="cm-modal-price">{quickViewItem.price}</div>
            <h4 className="cm-modal-title">{quickViewItem.title}</h4>
            <div className="cm-modal-meta">📍 {quickViewItem.location} &bull; Posted {quickViewItem.time}</div>
            
            <p className="cm-modal-desc">{quickViewItem.description}</p>
            
            {/* Social Share Buttons */}
            <div className="cm-modal-social-wrap">
              <button className="cm-social-btn" onClick={() => handleShareClick(quickViewItem, 'Facebook')} title="Share to Facebook">📘</button>
              <button className="cm-social-btn" onClick={() => handleShareClick(quickViewItem, 'Twitter')} title="Share to Twitter">🐦</button>
              <button className="cm-social-btn" onClick={() => handleShareClick(quickViewItem, 'Pinterest')} title="Share to Pinterest">📌</button>
              <button className="cm-social-btn" onClick={() => handleShareClick(quickViewItem, 'Instagram')} title="Share to Instagram">📸</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button 
                className="cm-btn" 
                style={{ backgroundColor: '#f1f5f9', color: 'var(--cm-text-dark)', fontSize: '0.8rem' }}
                onClick={() => alert(`✉️ Messenger initiated: Secure chat launched with seller regarding "${quickViewItem.title}"`)}
              >
                Message Seller
              </button>
              <button 
                className="cm-btn cm-btn-primary" 
                style={{ fontSize: '0.8rem' }}
                onClick={() => alert(`🔍 Detail Page: Navigating to full description index for "${quickViewItem.title}"`)}
              >
                View Full Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modern Footer Component */}
      <ModernFooter />
    </div>
  );
}
