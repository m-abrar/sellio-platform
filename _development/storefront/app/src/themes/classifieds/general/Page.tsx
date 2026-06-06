'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { ClassifiedListing, Category } from '@sellio/types';
import { GeneralHeader, ListingCard, GeneralFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

interface ListingItem {
  id: number;
  title: string;
  price: string;
  numericPrice: number;
  image: string;
  seller: string;
  isSaved: boolean;
  category: string;
  localPickup: boolean;
  delivery: boolean;
  dateAdded: number; // Timestamp order
  slug: string;
}

// Fallback high-fidelity Classifieds General database opportunities matching ClassifiedListing schema perfectly
const FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "iPhone 13 Pro - 256GB Gold Unlocked",
    slug: "iphone-13-pro-256gb-gold-unlocked",
    description: "Pristine gold iPhone 13 Pro. 256GB storage, fully factory unlocked. Battery health is at 90%, screen and chassis are free of major scratches.",
    pricing: {
      base_price: 799,
      sale_price: 799,
      is_on_sale: false,
      discount: null,
      formatted: "$799",
      formatted_short: "$799",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Dallas", state: "TX" },
    taxonomy: { category: "electronics", brand: "User113" },
    media: { main_photo: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 2,
    title: "Sony A7III Mirrorless Camera Body",
    slug: "sony-a7iii-mirrorless-camera-body",
    description: "Well-maintained Sony A7III body only. Low shutter count, comes with original strap, box, and 2 batteries.",
    pricing: {
      base_price: 1200,
      sale_price: 1200,
      is_on_sale: false,
      discount: null,
      formatted: "$1,200",
      formatted_short: "$1.2K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Seattle", state: "WA" },
    taxonomy: { category: "electronics", brand: "PhotoPro" },
    media: { main_photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 3,
    title: "Sony Noise Canceling Headphones WH-CH720N",
    slug: "sony-noise-canceling-headphones-wh-ch720n",
    description: "Lightweight over-ear headphones with superior active noise canceling. Comes with charging cable.",
    pricing: {
      base_price: 120,
      sale_price: 120,
      is_on_sale: false,
      discount: null,
      formatted: "$120",
      formatted_short: "$120",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Boston", state: "MA" },
    taxonomy: { category: "electronics", brand: "AudioFan" },
    media: { main_photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 4,
    title: "2018 Honda Civic EX - Low Mileage",
    slug: "2018-honda-civic-ex-low-mileage",
    description: "EX trim model with only 45k miles. Single owner, clean title, and up-to-date maintenance records.",
    pricing: {
      base_price: 16500,
      sale_price: 16500,
      is_on_sale: false,
      discount: null,
      formatted: "$16,500",
      formatted_short: "$16.5K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Dallas", state: "TX" },
    taxonomy: { category: "vehicles", brand: "AutoSeller99" },
    media: { main_photo: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 5,
    title: "Classic Road Bike - Excellent Frame",
    slug: "classic-road-bike-excellent-frame",
    description: "Vintage steel frame road bike, recently tuned up with brand new tires, tubes, and handlebar tape.",
    pricing: {
      base_price: 450,
      sale_price: 450,
      is_on_sale: false,
      discount: null,
      formatted: "$450",
      formatted_short: "$450",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Chicago", state: "IL" },
    taxonomy: { category: "vehicles", brand: "CyclistJoe" },
    media: { main_photo: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 6,
    title: "Cozy 1-Bedroom Condo near Downtown",
    slug: "cozy-1-bedroom-condo-near-downtown",
    description: "Charming 1-bedroom condo with updated appliances, in-unit laundry, and a beautiful balcony view.",
    pricing: {
      base_price: 145000,
      sale_price: 145000,
      is_on_sale: false,
      discount: null,
      formatted: "$145,000",
      formatted_short: "$145K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Denver", state: "CO" },
    taxonomy: { category: "real-estate", brand: "AgentSarah" },
    media: { main_photo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 7,
    title: "Spacious Suburb Family Home (4B/3B)",
    slug: "spacious-suburb-family-home-4b-3b",
    description: "Stunning 4-bedroom, 3-bathroom suburban home with huge backyard and renovated kitchen.",
    pricing: {
      base_price: 320000,
      sale_price: 320000,
      is_on_sale: false,
      discount: null,
      formatted: "$320,000",
      formatted_short: "$320K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Dallas", state: "TX" },
    taxonomy: { category: "real-estate", brand: "AgentDave" },
    media: { main_photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 8,
    title: "Mid-Century Modern Sofa (Teal Velvet)",
    slug: "mid-century-modern-sofa-teal-velvet",
    description: "Vibrant teal velvet sofa, mid-century design. Extremely comfortable, minor wear on legs.",
    pricing: {
      base_price: 600,
      sale_price: 600,
      is_on_sale: false,
      discount: null,
      formatted: "$600",
      formatted_short: "$600",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "New York", state: "NY" },
    taxonomy: { category: "home", brand: "UsesM83" },
    media: { main_photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 9,
    title: "Modern Elegant Brass Desk Lamp",
    slug: "modern-elegant-brass-desk-lamp",
    description: "Heavy solid brass desk lamp. Minimalist design, casts a warm downward glow.",
    pricing: {
      base_price: 85,
      sale_price: 85,
      is_on_sale: false,
      discount: null,
      formatted: "$85",
      formatted_short: "$85",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Austin", state: "TX" },
    taxonomy: { category: "home", brand: "ShopLux" },
    media: { main_photo: "https://images.unsplash.com/photo-1507473885765-e6ed057f7821?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 10,
    title: "Retro Leather Bomber Jacket (Large)",
    slug: "retro-leather-bomber-jacket-large",
    description: "Thick premium leather bomber jacket. Classic vintage fit, fully lined.",
    pricing: {
      base_price: 180,
      sale_price: 180,
      is_on_sale: false,
      discount: null,
      formatted: "$180",
      formatted_short: "$180",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Portland", state: "OR" },
    taxonomy: { category: "fashion", brand: "VintageHQ" },
    media: { main_photo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400" },
    item_specs: { condition_rating: 4, condition_label: "Great", badge_class: "cg-badge-great", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  },
  {
    id: 11,
    title: "Designer Chronograph Gold Watch",
    slug: "designer-chronograph-gold-watch",
    description: "Heavy gold plated luxury wristwatch. Chronograph functions are fully operational.",
    pricing: {
      base_price: 350,
      sale_price: 350,
      is_on_sale: false,
      discount: null,
      formatted: "$350",
      formatted_short: "$350",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Miami", state: "FL" },
    taxonomy: { category: "fashion", brand: "StyleVault" },
    media: { main_photo: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: false, is_shipping: false }
  },
  {
    id: 12,
    title: "Professional Guitar & Bass Lessons",
    slug: "professional-guitar-bass-lessons",
    description: "One-on-one lessons for beginner to intermediate levels. Taught by certified instructor.",
    pricing: {
      base_price: 45,
      sale_price: 45,
      is_on_sale: false,
      discount: null,
      formatted: "$45",
      formatted_short: "$45",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: { city: "Chicago", state: "IL" },
    taxonomy: { category: "services", brand: "GuitarGuru" },
    media: { main_photo: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=400" },
    item_specs: { condition_rating: 5, condition_label: "Excellent", badge_class: "cg-badge-excellent", quantity: 1 },
    status: { is_featured: false, is_published: true, is_new_listing: true, is_shipping: true }
  }
];

const getCategoryIcon = (slug: string): string => {
  if (slug === 'electronics') return '📱';
  if (slug === 'vehicles') return '🚗';
  if (slug === 'real-estate') return '🏠';
  if (slug === 'home') return '🛋️';
  if (slug === 'fashion') return '👕';
  if (slug === 'services') return '🔧';
  return '📦';
};

const translateListing = (item: ClassifiedListing): ListingItem => {
  const generatedSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    id: item.id,
    title: item.title,
    price: item.pricing?.formatted || item.pricing?.formatted_short || `$${(item.pricing?.sale_price || item.pricing?.base_price || 0).toLocaleString()}`,
    numericPrice: item.pricing?.sale_price || item.pricing?.base_price || 0,
    image: item.media?.main_photo || item.media?.thumbnail || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400",
    seller: item.taxonomy?.brand || "Verified Seller",
    isSaved: false,
    category: item.taxonomy?.category || "electronics",
    localPickup: item.status?.is_shipping ? false : true,
    delivery: item.status?.is_shipping || false,
    dateAdded: item.id,
    slug: generatedSlug
  };
};

export default function Page() {
  const router = useRouter();
  const sidebarCategoriesTitle = useThemeContent('sidebar.categories_title', 'Explore Categories');
  const sidebarFiltersTitle = useThemeContent('sidebar.filters_title', 'Filters');
  const pickupOnlyLabel = useThemeContent('filters.pickup_label', 'Local pickup only');
  const deliveryLabel = useThemeContent('filters.delivery_label', 'Includes delivery');
  const priceLimitLabel = useThemeContent('filters.price_limit_label', 'Price Limit:');
  const clearFiltersLabel = useThemeContent('filters.clear_label', 'Clear all filters');
  const allListingsTitle = useThemeContent('collection.all_title', 'All Recommended Listings');
  const categoryShowcaseSuffix = useThemeContent('collection.category_suffix', 'Showcase');
  const sortLabel = useThemeContent('collection.sort_label', 'Sort:');
  const emptyTitle = useThemeContent('empty.title', 'No Listings Found');
  const emptyDescription = useThemeContent('empty.description', "We couldn't find items that match your current sidebar filters or search tags.");
  const emptyButtonLabel = useThemeContent('empty.button_label', 'Reset Settings');
  const loadMoreLabel = useThemeContent('collection.load_more_label', 'Load More Listings');
  const loadingMoreLabel = useThemeContent('collection.loading_more_label', 'Syncing Classifieds...');
  const chatPlaceholder = useThemeContent('chat.placeholder', 'Type your offer or ask questions...');

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/classifieds_general${path}`;
      }
    }
    return path;
  };

  // Dynamic state bindings
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([
    { id: 'all', name: 'All Listings', icon: '📂' }
  ]);

  // Loading & network resilience state tracking
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [errorTrace, setErrorTrace] = useState<string>('');

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [localPickupOnly, setLocalPickupOnly] = useState(false);
  const [includesDelivery, setIncludesDelivery] = useState(false);
  const [maxPrice, setMaxPrice] = useState(25000); // Max filter value (starts high to show all)
  const [sortBy, setSortBy] = useState('new');
  
  // Pagination / Load More states
  const [visibleCount, setVisibleCount] = useState(12); // symmetry-locked initial visibleCount of 12!
  const [loadingListings, setLoadingListings] = useState(false);

  // Chat/Messaging States
  interface ChatMessage {
    sender: 'user' | 'seller';
    text: string;
    timestamp: string;
  }
  const [activeChatListing, setActiveChatListing] = useState<ListingItem | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState('');

  // Auto Scroll Chat Body
  useEffect(() => {
    const chatBody = document.getElementById('cg-chat-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const fetchGeneralClassifieds = async () => {
      setLoading(true);
      try {
        const response = await api.getClassifieds();
        if (response && response.data && response.data.length > 0) {
          const mapped = response.data.map(translateListing);
          setListings(mapped);
          setUseFallback(false);

          // Extract category ribbon from API categories metadata if populated
          if (response.sidebar?.categories) {
            const mappedCats = response.sidebar.categories.map((cat: Category) => ({
              id: cat.slug || String(cat.id),
              name: cat.title,
              icon: getCategoryIcon(cat.slug || '')
            }));
            const deduplicated = [{ id: "all", name: "All Listings", icon: "📂" }];
            mappedCats.forEach((c) => {
              if (!deduplicated.some(d => d.id === c.id)) {
                deduplicated.push(c);
              }
            });
            setCategories(deduplicated);
          } else {
            // Deduplicate from loaded listing records taxonomy
            const dynamicCategories = [{ id: "all", name: "All Listings", icon: "📂" }];
            response.data.forEach((item) => {
              const catSlug = item.taxonomy?.category;
              if (catSlug && !dynamicCategories.some(d => d.id === catSlug)) {
                let label = catSlug;
                if (catSlug === 'electronics') label = 'Electronics';
                else if (catSlug === 'vehicles') label = 'Vehicles';
                else if (catSlug === 'real-estate') label = 'Real Estate';
                else if (catSlug === 'home') label = 'Home Goods';
                else if (catSlug === 'fashion') label = 'Fashion';
                else if (catSlug === 'services') label = 'Services';
                else label = catSlug.charAt(0).toUpperCase() + catSlug.slice(1);

                dynamicCategories.push({
                  id: catSlug,
                  name: label,
                  icon: getCategoryIcon(catSlug)
                });
              }
            });
            setCategories(dynamicCategories);
          }
        } else {
          console.warn("Classifieds General database returned empty. Running backups.");
          setErrorTrace("Classifieds General database returned empty.");
          loadLocalFallback();
        }
      } catch (err: unknown) {
        console.error("AxiosError: Connection failure while fetching general classifieds:", err);
        setErrorTrace(err instanceof Error ? (err.stack || err.message) : String(err));
        loadLocalFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadLocalFallback = () => {
      setListings(FALLBACK_CLASSIFIEDS.map(translateListing));
      setCategories([
        { id: "all", name: "All Listings", icon: "📂" },
        { id: "electronics", name: "Electronics", icon: "📱" },
        { id: "vehicles", name: "Vehicles", icon: "🚗" },
        { id: "real-estate", name: "Real Estate", icon: "🏠" },
        { id: "home", name: "Home Goods", icon: "🛋️" },
        { id: "fashion", name: "Fashion", icon: "👕" },
        { id: "services", name: "Services", icon: "🔧" }
      ]);
      setUseFallback(true);
    };

    fetchGeneralClassifieds();
  }, []);

  // Handle message send & mock seller response
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatListing) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setTypedMessage('');

    // Trigger mock seller response after 1.2 seconds
    setTimeout(() => {
      const sellerMsg: ChatMessage = {
        sender: 'seller',
        text: `Hi! Yes, my ${activeChatListing.title} is still available. Would you like to schedule a quick meeting or coordinate delivery options?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, sellerMsg]);
    }, 1200);
  };

  // Open Chat Widget Action
  const initiateChat = (item: ListingItem) => {
    setActiveChatListing(item);
    setChatMessages([
      {
        sender: 'seller',
        text: `Hello! Thanks for your interest in my ${item.title}. Let me know if you have any questions or would like to make an offer!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Toggle Saved Item favorites
  const toggleSaveItem = (id: number) => {
    setListings(
      listings.map((item) => {
        if (item.id === id) {
          return { ...item, isSaved: !item.isSaved };
        }
        return item;
      })
    );
  };

  // Reset all filters console action
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setLocalPickupOnly(false);
    setIncludesDelivery(false);
    setMaxPrice(25000);
    setSortBy('new');
    setVisibleCount(12);
  };

  // Filter and sort general listings matching sidebar controls
  const filteredListings = listings
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesPickup = !localPickupOnly || item.localPickup;
      const matchesDelivery = !includesDelivery || item.delivery;
      const matchesPrice = item.numericPrice <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPickup && matchesDelivery && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'new') {
        return b.dateAdded - a.dateAdded; // Freshly listed first
      } else if (sortBy === 'price-asc') {
        return a.numericPrice - b.numericPrice; // Low to High
      } else if (sortBy === 'price-desc') {
        return b.numericPrice - a.numericPrice; // High to Low
      }
      return 0;
    });

  // Handle general Load More action with visual spinner latency mock
  const handleLoadMore = () => {
    setLoadingListings(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12); // symmetry increments of 12!
      setLoadingListings(false);
    }, 650);
  };

  return (
    <div className="classifieds-general-wrapper">
      {/* High-Fidelity Header */}
      <GeneralHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onReset={resetFilters} 
      />

      {/* Main Two Column Grid */}
      <div className="cg-layout">
        
        {/* Left Side Category sidebar panel */}
        <aside>
          <div className="cg-sidebar">
            <div className="cg-sidebar-title">{sidebarCategoriesTitle}</div>
            <div className="cg-category-list">
              {categories.map((cat) => (
                <a 
                  key={cat.id} 
                  href="#" 
                  className={`cg-category-link ${selectedCategory === cat.id ? 'cg-active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setSelectedCategory(cat.id); }}
                >
                  <span>{cat.icon}</span> {cat.name}
                </a>
              ))}
            </div>

            {/* Structured Sidebar filters */}
            <div className="cg-sidebar-title">{sidebarFiltersTitle}</div>
            <div className="cg-filter-section">
              <label className="cg-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={localPickupOnly} 
                  onChange={(e) => setLocalPickupOnly(e.target.checked)} 
                />
                📍 {pickupOnlyLabel}
              </label>
              
              <label className="cg-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={includesDelivery} 
                  onChange={(e) => setIncludesDelivery(e.target.checked)} 
                />
                📦 {deliveryLabel}
              </label>

              {/* Price Range Slider */}
              <div className="cg-range-box">
                <div className="cg-range-labels">
                  <span>{priceLimitLabel}</span>
                  <span style={{ color: 'var(--cg-primary)', fontWeight: 700 }}>
                    {maxPrice >= 25000 ? 'Any Price' : `$${maxPrice.toLocaleString()}`}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="25000" 
                  step="50" 
                  className="cg-slider" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                />
              </div>

              <button 
                onClick={resetFilters} 
                style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  color: 'var(--cg-primary)', 
                  cursor: 'pointer', 
                  fontSize: '0.8rem', 
                  fontWeight: 700, 
                  textAlign: 'left',
                  padding: '4px 0',
                  marginTop: '0.5rem',
                  textTransform: 'uppercase'
                }}
              >
                {clearFiltersLabel}
              </button>
            </div>
          </div>
        </aside>

        {/* Right General Listings Panel */}
        <main>

          {/* Resilient Diagnostics Connection Overlay on Server Outage */}
          {useFallback && (
            <div className="cg-resilience-panel">
              <div className="cg-resilience-header">
                🛰️ VETTED NETWORK DIAGNOSTICS & RESILIENCE PANEL
              </div>
              <div style={{ fontWeight: 600 }}>
                Status: Local Database Node Offline. Activating Vetted sovereign proxy backup assets gracefully.
              </div>
              <div className="cg-resilience-trace">
                {errorTrace || 'api.getClassifieds returned empty listings feed.'}
              </div>
            </div>
          )}
          
          {/* List Header controls */}
          <div className="cg-grid-header">
            <h1 className="cg-grid-title">
              {selectedCategory === 'all' 
                ? allListingsTitle 
                : `${categories.find(c => c.id === selectedCategory)?.name || ''} ${categoryShowcaseSuffix}`}
            </h1>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cg-text-muted)', textTransform: 'uppercase' }}>{sortLabel}</span>
              <select 
                className="cg-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '0.4rem 1rem', border: '1px solid var(--cg-border)', borderRadius: '6px' }}
              >
                <option value="new">🕒 Newly Listed</option>
                <option value="price-asc">💵 Price: Low to High</option>
                <option value="price-desc">💵 Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* listings Grid */}
          {loading ? (
            <div className="cg-grid">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="cg-shimmer-card">
                  <div className="cg-shimmer-img" />
                  <div className="cg-shimmer-body">
                    <div className="cg-shimmer-title" />
                    <div className="cg-shimmer-price" />
                    <div className="cg-shimmer-footer">
                      <div className="cg-shimmer-seller" />
                      <div className="cg-shimmer-btns" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--cg-border)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1.25rem' }}>📦</span>
              <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{emptyTitle}</h2>
              <p style={{ color: 'var(--cg-text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{emptyDescription}</p>
              <button className="cg-btn cg-btn-primary" onClick={resetFilters}>{emptyButtonLabel}</button>
            </div>
          ) : (
            <div className="cg-grid">
              {filteredListings.slice(0, visibleCount).map((item) => (
                <ListingCard 
                  key={item.id} 
                  title={item.title}
                  price={item.price}
                  image={item.image}
                  seller={item.seller}
                  isSaved={item.isSaved}
                  category={item.category}
                  onMessageClick={() => initiateChat(item)}
                  onToggleSave={() => toggleSaveItem(item.id)}
                  onClick={() => router.push(getThemeLink(`/product/${item.slug}`))}
                />
              ))}
            </div>
          )}

          {/* Load More Trigger */}
          {!loading && filteredListings.length > visibleCount && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button 
                className="cg-btn cg-btn-outline" 
                onClick={handleLoadMore}
                disabled={loadingListings}
                style={{ minWidth: '220px' }}
              >
                {loadingListings ? loadingMoreLabel : loadMoreLabel}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Messenger Widget (Renders dynamically when activeChatListing is selected) */}
      {activeChatListing && (
        <div className="cg-chat-widget">
          
          {/* Header */}
          <div className="cg-chat-header">
            <div className="cg-chat-title-wrap">
              <span className="cg-chat-title">Chat with {activeChatListing.seller}</span>
              <span className="cg-chat-subtitle">Regarding: {activeChatListing.title}</span>
            </div>
            <button className="cg-chat-close" onClick={() => setActiveChatListing(null)}>×</button>
          </div>
          
          {/* Chat Messages Log */}
          <div className="cg-chat-body" id="cg-chat-body">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`cg-chat-msg ${msg.sender === 'user' ? 'cg-chat-msg-user' : 'cg-chat-msg-seller'}`}
              >
                <div>{msg.text}</div>
                <div style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: '4px', opacity: 0.75 }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}
          </div>

          {/* Input field send area */}
          <form onSubmit={handleSendMessage} className="cg-chat-input-area">
            <input 
              type="text" 
              className="cg-chat-input" 
              placeholder={chatPlaceholder}
              required
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
            />
            <button type="submit" className="cg-chat-btn-send">
              🡢
            </button>
          </form>

        </div>
      )}

      {/* Footer component */}
      <GeneralFooter />
    </div>
  );
}
