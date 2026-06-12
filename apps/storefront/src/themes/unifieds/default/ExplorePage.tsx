'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category, Product } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/unifieds/shared/CatalogSyncAlert';
import { fetchProductsExplore } from '@/themes/unifieds/shared/catalog';
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductImage,
  isExploreSortOption,
  PRODUCT_CARD_PLACEHOLDER,
  type ExploreSortOption,
} from '@/themes/unifieds/shared/product-utils';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

interface ExplorePageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
}

function ExplorePageContent({ initialCategorySlug, initialSearch = '' }: ExplorePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeLink = useUnifiedThemeLink();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listingError, setListingError] = useState<string | null>(null);

  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const [lastPage, setLastPage] = useState(1);

  const searchQuery = searchParams.get('search') || searchParams.get('q') || initialSearch;
  const selectedCategorySlug = searchParams.get('category') || initialCategorySlug || '';
  const sortBy = (searchParams.get('sort') as ExploreSortOption) || 'default';

  const selectedCategory =
    categories.find((category) => category.slug.toLowerCase() === selectedCategorySlug.toLowerCase()) ??
    null;

  const buildQueryParams = (pageNumber: number) => {
    const params: Record<string, unknown> = { page: pageNumber, per_page: 12 };
    if (searchQuery) params.search = searchQuery;
    if (selectedCategorySlug) params.category = selectedCategorySlug;
    return params;
  };

  const updateFilters = (updates: Record<string, string>, pageNumber = 1) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (pageNumber > 1) {
      params.set('page', pageNumber.toString());
    } else {
      params.delete('page');
    }

    router.push(themeLink(`/explore?${params.toString()}`));
  };

  useEffect(() => {
    async function loadData() {
      const isFirstPage = page === 1;

      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const result = await fetchProductsExplore(buildQueryParams(page));

      if (result.ok) {
        const listings = result.response.data;

        setProducts((prev) => {
          const merged = isFirstPage ? listings : [...prev, ...listings];
          const seen = new Set<number>();

          return merged.filter((item) => {
            if (seen.has(item.id)) {
              return false;
            }
            seen.add(item.id);
            return true;
          });
        });

        setLastPage(result.response.meta?.last_page || 1);
        setInventoryTotal(result.response.meta?.total ?? listings.length);

        if (isFirstPage && result.response.sidebar?.categories) {
          setCategories(result.response.sidebar.categories);
        }

        setListingError(null);
      } else {
        setListingError(result.error);
        if (isFirstPage) {
          setProducts([]);
          setCategories([]);
          setInventoryTotal(null);
        }
      }

      setLoading(false);
      setLoadingMore(false);
    }

    loadData();
  }, [searchParams, page, searchQuery, selectedCategorySlug]);

  const filteredProducts = products
    .filter((product) => {
      const normalizedSearch = searchQuery.toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        (product.description && product.description.toLowerCase().includes(normalizedSearch));
      const matchesCategory =
        !selectedCategory || product.category_id === selectedCategory.id;
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

  const handleLoadMore = () => {
    updateFilters({}, page + 1);
  };

  return (
    <main className="ud-explore-page">
      <div className="ud-explore-header">
        <div className="ud-mono ud-section-eyebrow">CORE_DIRECTORY</div>
        <h1>Explore Catalog Records</h1>
        <p>Search, filter, and inspect live marketplace listings synchronized from the Sellio core registry.</p>
        {!loading && inventoryTotal != null && (
          <p className="ud-explore-meta">{inventoryTotal} records indexed</p>
        )}
      </div>

      <section className="ud-explore-controls" aria-label="Explore filters">
        <div>
          <label htmlFor="ud-explore-search">Search Keywords</label>
          <input
            id="ud-explore-search"
            type="search"
            placeholder="Search active listings..."
            defaultValue={searchQuery}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                updateFilters({ search: (event.target as HTMLInputElement).value });
              }
            }}
          />
        </div>
        <div>
          <label htmlFor="ud-explore-category">Category</label>
          <select
            id="ud-explore-category"
            value={selectedCategorySlug}
            onChange={(event) => updateFilters({ category: event.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ud-explore-sort">Sort Order</label>
          <select
            id="ud-explore-sort"
            value={sortBy}
            onChange={(event) => {
              if (isExploreSortOption(event.target.value)) {
                updateFilters({ sort: event.target.value });
              }
            }}
          >
            <option value="default">Default Registry</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {listingError && (
        <div className="ud-alert-slot">
          <CatalogSyncAlert error={listingError} />
        </div>
      )}

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
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="ud-listings-grid">
            {filteredProducts.map((product) => (
              <a href={themeLink(`/product/${product.slug}`)} className="ud-listing-card" key={product.id}>
                <div className="ud-listing-image-wrap">
                  <img src={getProductImage(product, PRODUCT_CARD_PLACEHOLDER)} alt={product.title} />
                </div>
                <div className="ud-listing-body">
                  <div className="ud-mono">{getProductCategoryLabel(product, categories)}</div>
                  <h3>{product.title}</h3>
                  <p>
                    {product.description ||
                      'Verified marketplace listing synchronized from the Sellio catalog.'}
                  </p>
                  <div className="ud-listing-meta">
                    <span>{formatProductPrice(product)}</span>
                    <span>View Record</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {page < lastPage && (
            <div className="ud-load-more-wrap">
              <button type="button" className="core-btn-primary" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading records...' : 'Load more listings'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="ud-listing-state" role="status">
          <div className="ud-mono ud-section-eyebrow">EMPTY_RESULTS</div>
          <h3>No listings matched your filters.</h3>
          <p>Try adjusting your search keywords or choosing a different category.</p>
          <a href={themeLink('/')} className="core-btn-primary ud-empty-cta">
            Back to core feed
          </a>
        </div>
      )}
    </main>
  );
}

export default function ExplorePage(props: ExplorePageProps) {
  return (
    <Suspense fallback={<main className="ud-explore-page"><p>Loading explore...</p></main>}>
      <ExplorePageContent {...props} />
    </Suspense>
  );
}
