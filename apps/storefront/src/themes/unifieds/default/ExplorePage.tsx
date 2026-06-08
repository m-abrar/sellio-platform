'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Category, Product } from '@sellio/types';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

interface ExplorePageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
}

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23f8fafc'/><g transform='translate(328,214)' stroke='%2394a3b8' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='8'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='700' letter-spacing='2' fill='%2364758b'>LISTING IMAGE</text></svg>";

export default function ExplorePage({ initialCategorySlug, initialSearch = '' }: ExplorePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const themeLink = useUnifiedThemeLink();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);

        if (!isMounted) {
          return;
        }

        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
        setListingError(null);

        if (initialCategorySlug) {
          const matchedCategory = fetchedCategories?.find(
            (category) => category.slug.toLowerCase() === initialCategorySlug.toLowerCase(),
          );
          if (matchedCategory) {
            setSelectedCategory(matchedCategory.id);
          }
        }
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load unified default explore listings:', error);
        setListingError(error instanceof Error ? error.message : 'Listings are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [initialCategorySlug]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const matchedCategory = categories.find((category) => category.id === categoryId);
    const newPath = matchedCategory
      ? themeLink(`/explore/${matchedCategory.slug.toLowerCase()}`)
      : themeLink('/explore');
    window.history.pushState(null, '', newPath);
  };

  const getProductImage = (product: Product) => (
    product.media?.featured_image || product.image_url || placeholderImage
  );

  const formatPrice = (product: Product) => (
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Contact for pricing')
  );

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === null || product.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((left, right) => {
      if (sortBy === 'price_asc') {
        return Number(left.price) - Number(right.price);
      }
      if (sortBy === 'price_desc') {
        return Number(right.price) - Number(left.price);
      }
      return 0;
    });

  return (
    <main className="ud-explore-page">
      <div className="ud-explore-header">
        <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1.5rem' }}>CORE_DIRECTORY</div>
        <h1>Explore Catalog Records</h1>
        <p>Search, filter, and inspect live marketplace listings synchronized from the Sellio core registry.</p>
      </div>

      <section className="ud-explore-controls" aria-label="Explore filters">
        <div>
          <label htmlFor="ud-explore-search">Search Keywords</label>
          <input
            id="ud-explore-search"
            type="text"
            placeholder="Search active listings..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ud-explore-category">Category</label>
          <select
            id="ud-explore-category"
            value={selectedCategory === null ? '' : selectedCategory.toString()}
            onChange={(event) => handleCategoryChange(event.target.value === '' ? null : Number(event.target.value))}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>{category.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ud-explore-sort">Sort Order</label>
          <select
            id="ud-explore-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as 'default' | 'price_asc' | 'price_desc')}
          >
            <option value="default">Default Registry</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="ud-listings-grid" aria-label="Loading explore listings">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="ud-listing-card ud-listing-skeleton" key={item}>
              <div className="ud-listing-image-wrap" />
              <div className="ud-listing-body">
                <span />
                <strong />
                <em />
              </div>
            </div>
          ))}
        </div>
      ) : listingError ? (
        <div className="ud-listing-state" role="status">
          <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>REGISTRY_OFFLINE</div>
          <h3>Explore listings could not be synchronized.</h3>
          <p>{listingError}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="ud-listings-grid">
          {filteredProducts.map((product) => (
            <a href={themeLink(`/product/${product.slug}`)} className="ud-listing-card" key={product.id}>
              <div className="ud-listing-image-wrap">
                <img src={getProductImage(product)} alt={product.title} />
              </div>
              <div className="ud-listing-body">
                <div className="ud-mono">CATALOG_ID_{product.id}</div>
                <h3>{product.title}</h3>
                <p>{product.description || 'Verified marketplace listing synchronized from the Sellio catalog.'}</p>
                <div className="ud-listing-meta">
                  <span>{formatPrice(product)}</span>
                  <span>View Record</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="ud-listing-state" role="status">
          <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>EMPTY_RESULTS</div>
          <h3>No listings matched your filters.</h3>
          <p>Try adjusting your search keywords or choosing a different category.</p>
        </div>
      )}
    </main>
  );
}
