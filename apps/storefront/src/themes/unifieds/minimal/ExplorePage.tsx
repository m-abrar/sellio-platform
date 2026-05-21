'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Product, Category } from '@sellio/types';

interface ExplorePageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
}

export default function ExplorePage({ initialCategorySlug, initialSearch = '' }: ExplorePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');

  const SYSTEM_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23F9FAFB'/><g transform='translate(176,110)' stroke='%23D1D5DB' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='44' height='44' rx='4'/><circle cx='15' cy='15' r='4'/><path d='M42 34L30 22 8 44'/></g><text x='50%' y='64%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' font-weight='500' fill='%239CA3AF'>No image uploaded</text></svg>";

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(fetchedProducts || []);
        setCategories(fetchedCategories || []);

        if (initialCategorySlug) {
          const matchedCategory = fetchedCategories?.find(
            (c) => c.slug.toLowerCase() === initialCategorySlug.toLowerCase()
          );
          if (matchedCategory) {
            setSelectedCategory(matchedCategory.id);
          }
        }
      } catch (err) {
        console.error('Failed to load explore content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialCategorySlug]);

  const handleCategoryChange = (catId: number | null) => {
    setSelectedCategory(catId);
    
    // Update browser URL state dynamically
    const isPreview = window.location.pathname.startsWith('/preview/');
    const prefix = isPreview ? window.location.pathname.split('/').slice(0, 3).join('/') : '';
    const matchedCategory = categories.find(c => c.id === catId);
    
    const newPath = matchedCategory
      ? `${prefix}/explore/${matchedCategory.slug.toLowerCase()}`
      : `${prefix}/explore`;
      
    window.history.pushState(null, '', newPath);
  };


  const getProductImage = (product: Product) => {
    if (product.media?.featured_image) {
      return product.media.featured_image;
    }
    if (product.image_url) {
      return product.image_url;
    }
    return SYSTEM_PLACEHOLDER;
  };

  // Filter and Sort Logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === null || product.category_id === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') {
        return Number(a.price) - Number(b.price);
      }
      if (sortBy === 'price_desc') {
        return Number(b.price) - Number(a.price);
      }
      return 0; // default order
    });

  return (
    <div style={{ animation: 'fadeIn 0.8s ease-out', padding: '8rem 6% 6rem' }}>
      {/* Title & Introduction */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="usm-mono" style={{ color: 'var(--usm-primary)', marginBottom: '1.5rem', display: 'inline-block', fontWeight: 600 }}>DISCOVER ESSENTIALS</span>
        <h1 className="usm-heading-xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', margin: '1rem 0', fontWeight: 600 }}>
          Explore Directory
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', color: '#666', fontWeight: 300, lineHeight: 1.8 }}>
          Refine by category, find specific items, and experience pure marketplace aesthetics.
        </p>
      </div>

      {/* Control Panel (Search, Categories, Sorting) */}
      <div style={{ 
        background: '#fff', 
        border: '1px solid var(--usm-border)', 
        borderRadius: '12px', 
        padding: '2rem', 
        marginBottom: '4rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem', color: '#111' }}>
              Search Keywords
            </label>
            <input 
              type="text" 
              placeholder="Search active listings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                border: '1px solid var(--usm-border)',
                borderRadius: '8px',
                fontFamily: 'var(--usm-font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                backgroundColor: 'var(--usm-ghost)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--usm-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--usm-border)'}
            />
          </div>

          {/* Category Filter Dropdown */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem', color: '#111' }}>
              Category
            </label>
            <select 
              value={selectedCategory === null ? '' : selectedCategory.toString()}
              onChange={(e) => handleCategoryChange(e.target.value === '' ? null : Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                border: '1px solid var(--usm-border)',
                borderRadius: '8px',
                fontFamily: 'var(--usm-font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                backgroundColor: 'var(--usm-ghost)',
                cursor: 'pointer'
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>{cat.title}</option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem', color: '#111' }}>
              Sort Order
            </label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                border: '1px solid var(--usm-border)',
                borderRadius: '8px',
                fontFamily: 'var(--usm-font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                backgroundColor: 'var(--usm-ghost)',
                cursor: 'pointer'
              }}
            >
              <option value="default">Default Registry</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} style={{ border: '1px solid var(--usm-border)', borderRadius: '12px', padding: '1.5rem', opacity: 0.6 }}>
              <div style={{ aspectRatio: '4/3', borderRadius: '8px', background: '#f3f4f6', animation: 'pulse 1.5s infinite', marginBottom: '1.5rem' }}></div>
              <div style={{ height: '12px', background: '#ddd', width: '30%', borderRadius: '4px' }}></div>
              <div style={{ height: '20px', background: '#ddd', width: '80%', borderRadius: '4px', marginTop: '10px' }}></div>
              <div style={{ height: '16px', background: '#ddd', width: '40%', borderRadius: '4px', marginTop: '10px' }}></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {filteredProducts.map((product) => (
            <a 
              href={`/preview/unifieds_minimal/product/${product.slug}`} 
              key={product.id} 
              className="usm-listing-card" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="usm-card-img-wrap">
                <img src={getProductImage(product)} className="usm-card-img" alt={product.title} />
              </div>
              <div className="usm-card-body">
                <span className="usm-card-category">
                  {categories.find(c => c.id === product.category_id)?.title || 'Featured'}
                </span>
                <h3 className="usm-card-title">{product.title}</h3>
                <div className="usm-card-price">
                  {product.pricing?.formatted || `$${Number(product.price).toLocaleString()}`}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '6rem 0', border: '1px dashed var(--usm-border)', borderRadius: '12px' }}>
          <svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" width="48" height="48" style={{ color: '#aaa', marginBottom: '1.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--usm-ink)', marginBottom: '0.5rem' }}>No Listings Found</h3>
          <p style={{ color: '#888', fontWeight: 300 }}>Try adjusting your search keywords or choosing a different category.</p>
        </div>
      )}
    </div>
  );
}
