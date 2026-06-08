'use client';

import React, { useEffect, useState } from 'react';
import type { Category, Product } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchExploreCatalog, resolveExploreFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import {
  formatProductPrice,
  getProductImage,
  isExploreSortOption,
  type ExploreSortOption,
} from '@/themes/unifieds/shared/product-utils';

interface ExplorePageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
}

export default function ExplorePage({ initialCategorySlug, initialSearch = '' }: ExplorePageProps) {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<ExploreSortOption>('default');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      const result = await fetchExploreCatalog();

      if (!isMounted) return;

      if (result.ok) {
        setProducts(result.products);
        setCategories(result.categories);
        setUseFallback(false);
        setApiError(null);

        if (initialCategorySlug) {
          const matchedCategory = result.categories.find(
            (category) => category.slug.toLowerCase() === initialCategorySlug.toLowerCase(),
          );
          if (matchedCategory) {
            setSelectedCategory(matchedCategory.id);
          }
        }
      } else {
        setApiError(result.error);
        const resolution = resolveExploreFailure(allowDemo);
        if (resolution.mode === 'demo') {
          setProducts(resolution.products);
          setCategories(resolution.categories);
          setUseFallback(true);
        } else {
          setProducts([]);
          setCategories([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [allowDemo, initialCategorySlug]);

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
    <main className="ed-explore-page">
      <header className="ed-explore-header">
        <a href={themeLink('/')} className="ed-detail-back">
          <span aria-hidden="true">←</span>
          Back to shop
        </a>
        <div className="ed-mono" style={{ marginBottom: '1.5rem' }}>
          PRODUCT_DIRECTORY
        </div>
        <h1>Explore the Collection</h1>
        <p>Search, filter, and shop live products synchronized from your Sellio catalog.</p>
      </header>

      {apiError && useFallback && (
        <div className="ed-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ed" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="ed-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="ed" />
        </div>
      )}

      <section className="ed-explore-controls" aria-label="Explore filters">
        <div>
          <label htmlFor="ed-explore-search">Search</label>
          <input
            id="ed-explore-search"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ed-explore-category">Category</label>
          <select
            id="ed-explore-category"
            value={selectedCategory === null ? '' : selectedCategory.toString()}
            onChange={(event) =>
              handleCategoryChange(event.target.value === '' ? null : Number(event.target.value))
            }
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ed-explore-sort">Sort</label>
          <select
            id="ed-explore-sort"
            value={sortBy}
            onChange={(event) => {
              if (isExploreSortOption(event.target.value)) {
                setSortBy(event.target.value);
              }
            }}
          >
            <option value="default">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {loading ? (
        <div className="ed-product-grid ed-explore-grid" aria-busy="true">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="ed-product-card ed-product-skeleton" key={item}>
              <div className="ed-img-frame" />
              <div className="ed-product-copy">
                <span />
                <strong />
                <em />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="ed-product-grid ed-explore-grid">
          {filteredProducts.map((product) => (
            <a
              href={themeLink(`/product/${product.slug}`)}
              className="ed-product-card"
              key={product.id}
            >
              <div className="ed-img-frame">
                <img src={getProductImage(product)} alt={product.title} className="ed-img" />
              </div>
              <div className="ed-mono" style={{ marginBottom: '0.8rem' }}>
                PRODUCT_{product.id}
              </div>
              <h3>{product.title}</h3>
              <div className="ed-product-price">{formatProductPrice(product)}</div>
            </a>
          ))}
        </div>
      ) : (
        <div className="ed-product-state" role="status">
          <div className="ed-mono" style={{ marginBottom: '1rem' }}>
            EMPTY_RESULTS
          </div>
          <h3>No products match your filters.</h3>
          <p>Try clearing filters or searching with fewer keywords.</p>
          <a href={themeLink('/explore')} className="ed-btn-primary ed-inline-cta">
            Reset explore
          </a>
        </div>
      )}
    </main>
  );
}
