'use client';

import React, { useEffect, useState } from 'react';
import type { Category, Product } from '@/types';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchExploreCatalog, resolveExploreFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { isExploreSortOption, type ExploreSortOption } from '@/themes/unifieds/shared/product-utils';
import { B2BProductCard } from './components';

interface CategoryNode extends Category {
  children: CategoryNode[];
}

function buildTree(cats: Category[]): CategoryNode[] {
  const map = new Map<number, CategoryNode>();
  cats.forEach((c) => map.set(c.id, { ...c, children: [] }));
  const roots: CategoryNode[] = [];
  map.forEach((node) => {
    const parentId = (node as Category & { parent_id?: number | null }).parent_id;
    if (parentId && map.has(parentId)) {
      map.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function CategoryTreeItem({
  node,
  selectedId,
  onSelect,
  depth = 0,
}: {
  node: CategoryNode;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <li className={`b2b-cat-item${depth > 0 ? ' b2b-cat-item-child' : ''}`}>
      <div className="b2b-cat-row">
        <button
          type="button"
          className={`b2b-cat-label${isSelected ? ' b2b-cat-label-active' : ''}`}
          onClick={() => onSelect(isSelected ? null : node.id)}
          aria-pressed={isSelected}
        >
          {node.title}
        </button>
        {hasChildren && (
          <button
            type="button"
            className="b2b-cat-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? `Collapse ${node.title}` : `Expand ${node.title}`}
            aria-expanded={open}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"
              style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 150ms' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
      {hasChildren && open && (
        <ul className="b2b-cat-children">
          {node.children.map((child) => (
            <CategoryTreeItem key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

const ITEMS_PER_PAGE = 12;

export default function ExplorePage({
  initialCategorySlug,
  initialSearch = '',
}: {
  initialCategorySlug?: string;
  initialSearch?: string;
}) {
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
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const result = await fetchExploreCatalog();
      if (!isMounted) return;
      if (result.ok) {
        setProducts(result.products);
        setCategories(result.categories);
        setUseFallback(false);
        setApiError(null);
        if (initialCategorySlug) {
          const match = result.categories.find((c) => c.slug.toLowerCase() === initialCategorySlug.toLowerCase());
          if (match) setSelectedCategory(match.id);
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
        }
      }
      setLoading(false);
    }
    load();
    return () => { isMounted = false; };
  }, [allowDemo, initialCategorySlug]);

  useEffect(() => { setPage(1); }, [searchQuery, selectedCategory, sortBy]);

  const handleCategorySelect = (id: number | null) => {
    setSelectedCategory(id);
    const match = categories.find((c) => c.id === id);
    window.history.pushState(null, '', match ? themeLink(`/explore/${match.slug.toLowerCase()}`) : themeLink('/explore'));
  };

  const filteredProducts = products
    .filter((p) => {
      const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === null || p.category_id === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const categoryTree = buildTree(categories);

  const selectedCategoryLabel = categories.find((c) => c.id === selectedCategory)?.title;

  return (
    <div className="b2b-explore-wrapper">
      {/* Sidebar */}
      <aside className={`b2b-explore-sidebar${sidebarOpen ? ' b2b-explore-sidebar-open' : ''}`} aria-label="Category filters">
        <div className="b2b-explore-sidebar-header">
          <h2>Categories</h2>
          <button type="button" className="b2b-explore-sidebar-close b2b-icon-btn" onClick={() => setSidebarOpen(false)} aria-label="Close filters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className={`b2b-cat-all${selectedCategory === null ? ' b2b-cat-label-active' : ''}`}
          onClick={() => handleCategorySelect(null)}
        >
          All categories
          <span className="b2b-cat-count">{products.length}</span>
        </button>

        {loading ? (
          <div className="b2b-cat-skeleton">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="b2b-skeleton-line" style={{ width: `${60 + i * 8}%` }} />)}
          </div>
        ) : (
          <ul className="b2b-cat-tree">
            {categoryTree.map((node) => (
              <CategoryTreeItem key={node.id} node={node} selectedId={selectedCategory} onSelect={handleCategorySelect} />
            ))}
          </ul>
        )}
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="b2b-explore-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* Main content */}
      <div className="b2b-explore-main">
        {/* Toolbar */}
        <div className="b2b-explore-toolbar">
          <button type="button" className="b2b-explore-filter-toggle b2b-icon-btn" onClick={() => setSidebarOpen(true)} aria-label="Show category filters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          <div className="b2b-explore-search-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="b2b-explore-search-icon" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="b2b-explore-search"
              placeholder="Search catalog…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search catalog"
            />
          </div>

          <select
            className="b2b-explore-sort"
            value={sortBy}
            onChange={(e) => { if (isExploreSortOption(e.target.value)) setSortBy(e.target.value); }}
            aria-label="Sort products"
          >
            <option value="default">Featured</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>

          <span className="b2b-explore-count" aria-live="polite">
            {loading ? '—' : `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''}`}
            {selectedCategoryLabel ? ` in ${selectedCategoryLabel}` : ''}
          </span>
        </div>

        {/* Active filter chip */}
        {selectedCategory !== null && selectedCategoryLabel && (
          <div className="b2b-explore-active-filters">
            <button type="button" className="b2b-explore-filter-chip" onClick={() => handleCategorySelect(null)}>
              {selectedCategoryLabel}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true" style={{ marginLeft: '0.4rem' }}>
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {apiError && useFallback && <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ef" />}
        {apiError && !useFallback && <CatalogSyncAlert variant="production" error={apiError} classPrefix="ef" />}

        {/* Grid */}
        {loading ? (
          <div className="b2b-product-grid" aria-busy="true">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="b2b-product-card b2b-skeleton" style={{ minHeight: '280px' }} />)}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <>
            <div className="b2b-product-grid">
              {paginatedProducts.map((product) => (
                <B2BProductCard key={product.id} product={product} href={themeLink(`/product/${product.slug}`)} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="ef-pagination" aria-label="Catalog pages">
                <button type="button" className="ef-pagination-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Previous page">←</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} type="button"
                    className={`ef-pagination-btn${n === safePage ? ' ef-pagination-btn-active' : ''}`}
                    onClick={() => setPage(n)} aria-label={`Page ${n}`} aria-current={n === safePage ? 'page' : undefined}>
                    {n}
                  </button>
                ))}
                <button type="button" className="ef-pagination-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next page">→</button>
              </nav>
            )}
          </>
        ) : (
          <div className="b2b-state" role="status">
            <h3>No products match your search.</h3>
            <p>Try clearing the search field or selecting a different category.</p>
            <button type="button" className="b2b-btn b2b-btn-secondary" style={{ marginTop: '1.5rem' }}
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
