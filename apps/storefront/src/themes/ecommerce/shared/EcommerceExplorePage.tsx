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

export type EcommerceSubpagePrefix = 'ef' | 'el';

interface ExplorePageProps {
  classPrefix: EcommerceSubpagePrefix;
  initialCategorySlug?: string;
  initialSearch?: string;
  shell?: (content: React.ReactNode) => React.ReactNode;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function EcommerceExplorePage({
  classPrefix: prefix,
  initialCategorySlug,
  initialSearch = '',
  shell,
}: ExplorePageProps) {
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

  const monoClass = prefix === 'el' ? 'el-tech-font' : `${prefix}-mono`;
  const primaryBtnClass = prefix === 'el' ? 'el-btn el-btn-primary' : `${prefix}-btn-primary`;

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

  const content = (
    <main className={cls(prefix, 'explore-page')}>
      <header className={cls(prefix, 'explore-header')}>
        <a href={themeLink('/')} className={cls(prefix, 'detail-back')}>
          <span aria-hidden="true">←</span>
          Back to shop
        </a>
        <div className={monoClass} style={{ marginBottom: '1.5rem' }}>
          COLLECTION
        </div>
        <h1>Explore the Collection</h1>
        <p>Browse and shop our complete product catalog with search, filters, and sorting.</p>
      </header>

      {apiError && useFallback && (
        <CatalogSyncAlert variant="demo" error={apiError} classPrefix={prefix} />
      )}
      {apiError && !useFallback && (
        <CatalogSyncAlert variant="production" error={apiError} classPrefix={prefix} />
      )}

      <section className={cls(prefix, 'explore-controls')} aria-label="Explore filters">
        <div>
          <label htmlFor={`${prefix}-explore-search`}>Search</label>
          <input
            id={`${prefix}-explore-search`}
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${prefix}-explore-category`}>Category</label>
          <select
            id={`${prefix}-explore-category`}
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
          <label htmlFor={`${prefix}-explore-sort`}>Sort</label>
          <select
            id={`${prefix}-explore-sort`}
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
        <div className={`${cls(prefix, 'explore-grid')}`} aria-busy="true">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className={cls(prefix, 'product-card')} key={item} style={{ opacity: 0.4 }}>
              <div style={{ aspectRatio: '4/5', background: '#eee' }} />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className={cls(prefix, 'explore-grid')}>
          {filteredProducts.map((product) => (
            <a
              href={themeLink(`/product/${product.slug}`)}
              className={cls(prefix, 'product-card')}
              key={product.id}
            >
              <div style={{ overflow: 'hidden', marginBottom: '1rem' }}>
                <img
                  src={getProductImage(product)}
                  alt={product.title}
                  style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }}
                />
              </div>
              <div className={monoClass} style={{ marginBottom: '0.8rem', fontSize: '0.55rem' }}>
                PRODUCT_{product.id}
              </div>
              <h3>{product.title}</h3>
              <div className={cls(prefix, 'product-price')}>{formatProductPrice(product)}</div>
            </a>
          ))}
        </div>
      ) : (
        <div className={cls(prefix, 'product-state')} role="status">
          <div className={monoClass} style={{ marginBottom: '1rem' }}>
            EMPTY_RESULTS
          </div>
          <h3>No products match your filters.</h3>
          <p>Try clearing filters or searching with fewer keywords.</p>
          <a href={themeLink('/explore')} className={primaryBtnClass} style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
            Reset explore
          </a>
        </div>
      )}
    </main>
  );

  return shell ? shell(content) : content;
}
