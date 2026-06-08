'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Category, Product } from '@sellio/types';
import {
  formatProductPrice,
  getProductImage,
  isExploreSortOption,
  type ExploreSortOption,
} from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import './subpages.css';

export type UnifiedExplorePageProps = {
  initialCategorySlug?: string;
  initialSearch?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function UnifiedExplorePage({
  initialCategorySlug,
  initialSearch = '',
  eyebrow = 'CATALOG_DIRECTORY',
  title = 'Explore Listings',
  description = 'Search, filter, and inspect live marketplace listings synchronized from your Sellio catalog.',
}: UnifiedExplorePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<ExploreSortOption>('default');
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

        console.error('Failed to load unified explore listings:', error);
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

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === null || product.category_id === selectedCategory;
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
    <main className="uni-explore-page">
      <div className="uni-explore-header">
        <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1.5rem' }}>
          {eyebrow}
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <section className="uni-explore-controls" aria-label="Explore filters">
        <div>
          <label htmlFor="uni-explore-search">Search Keywords</label>
          <input
            id="uni-explore-search"
            type="text"
            placeholder="Search active listings..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="uni-explore-category">Category</label>
          <select
            id="uni-explore-category"
            value={selectedCategory === null ? '' : selectedCategory.toString()}
            onChange={(event) =>
              handleCategoryChange(event.target.value === '' ? null : Number(event.target.value))
            }
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="uni-explore-sort">Sort Order</label>
          <select
            id="uni-explore-sort"
            value={sortBy}
            onChange={(event) => {
              if (isExploreSortOption(event.target.value)) {
                setSortBy(event.target.value);
              }
            }}
          >
            <option value="default">Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="uni-listings-grid" aria-label="Loading explore listings">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="uni-listing-card uni-listing-skeleton" key={item}>
              <div className="uni-listing-image-wrap" />
              <div className="uni-listing-body">
                <span />
                <strong />
                <em />
              </div>
            </div>
          ))}
        </div>
      ) : listingError ? (
        <div className="uni-listing-state" role="status">
          <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>
            REGISTRY_OFFLINE
          </div>
          <h3>Explore listings could not be synchronized.</h3>
          <p>{listingError}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="uni-listings-grid">
          {filteredProducts.map((product) => (
            <a
              href={themeLink(`/product/${product.slug}`)}
              className="uni-listing-card"
              key={product.id}
            >
              <div className="uni-listing-image-wrap">
                <img src={getProductImage(product)} alt={product.title} />
              </div>
              <div className="uni-listing-body">
                <div className="uni-mono">LISTING_{product.id}</div>
                <h3>{product.title}</h3>
                <p>
                  {product.description ||
                    'Verified marketplace listing synchronized from the Sellio catalog.'}
                </p>
                <div className="uni-listing-meta">
                  <span>{formatProductPrice(product)}</span>
                  <span>View Listing</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="uni-listing-state" role="status">
          <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>
            EMPTY_RESULTS
          </div>
          <h3>No listings matched your filters.</h3>
          <p>Try adjusting your search keywords or choosing a different category.</p>
        </div>
      )}
    </main>
  );
}
