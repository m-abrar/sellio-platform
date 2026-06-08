'use client';

import React, { useEffect, useState } from 'react';
import type { Category, Product } from '@sellio/types';
import { LuxuryHeader } from './components';
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
    <>
      <LuxuryHeader />
      <div className="ecl-explore-page">
      <header className="ecl-explore-header">
        <a href={themeLink('/')} className="ecl-detail-back">
          <span aria-hidden="true">&larr;</span>
          Back to maison
        </a>
        <h2 className="ecl-hero-subtitle">The Collection</h2>
        <h1 className="ecl-heading ecl-section-title">Explore Masterpieces</h1>
        <p>Browse signature pieces curated from your live Sellio catalog.</p>
      </header>

      {apiError && useFallback && (
        <div className="ecl-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ecl" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="ecl-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="ecl" />
        </div>
      )}

      <section className="ecl-explore-controls" aria-label="Explore filters">
        <div>
          <label htmlFor="ecl-explore-search">Search</label>
          <input
            id="ecl-explore-search"
            type="text"
            placeholder="Search pieces..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ecl-explore-category">Category</label>
          <select
            id="ecl-explore-category"
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
          <label htmlFor="ecl-explore-sort">Sort</label>
          <select
            id="ecl-explore-sort"
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
        <div className="ecl-grid ecl-explore-grid" aria-busy="true">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="ecl-product-card ecl-product-skeleton" key={item}>
              <div className="ecl-product-img-wrap" />
              <div className="ecl-product-title" />
              <div className="ecl-product-price" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="ecl-grid ecl-explore-grid">
          {filteredProducts.map((product) => (
            <a
              href={themeLink(`/product/${product.slug}`)}
              className="ecl-product-card"
              key={product.id}
            >
              <div className="ecl-product-img-wrap">
                <img src={getProductImage(product)} className="ecl-product-img" alt={product.title} />
                <span className="ecl-add-to-cart">View piece</span>
              </div>
              <h3 className="ecl-product-title">{product.title}</h3>
              <p className="ecl-product-price">{formatProductPrice(product)}</p>
            </a>
          ))}
        </div>
      ) : (
        <div className="ecl-product-state" role="status">
          <div className="ecl-product-kicker">No matches</div>
          <h3>No pieces match your search.</h3>
          <p>Try adjusting filters or searching with fewer keywords.</p>
          <a href={themeLink('/explore')} className="ecl-btn-gold">
            Reset explore
          </a>
        </div>
      )}
      </div>
    </>
  );
}
