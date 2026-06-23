'use client';

import React, { useEffect, useState } from 'react';
import type { Product } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductDetail, resolveProductFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import {
  formatProductPrice,
  getProductImage,
  PRODUCT_DETAIL_PLACEHOLDER,
} from '@/themes/unifieds/shared/product-utils';

type Tab = 'description' | 'specifications' | 'rfq';

export default function ProductPage({ slug }: { slug: string }) {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notice, setNotice] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('description');

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setLoading(true);
      const result = await fetchProductDetail(slug);

      if (!isMounted) return;

      if (result.ok) {
        setProduct(result.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveProductFailure(slug, allowDemo);
        setProduct(resolution.mode === 'demo' ? resolution.product : null);
        setUseFallback(resolution.mode === 'demo');
      }

      setLoading(false);
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug, allowDemo]);

  useEffect(() => {
    setActiveImage(null);
    setActiveTab('description');
  }, [slug]);

  const getGalleryImages = (item: Product): string[] => {
    const productWithMedia = item as Product & {
      media?: {
        featured_image?: string | null;
        images?: Array<string | { url?: string | null; path?: string | null; image_url?: string | null }> | null;
      } | null;
      images?: Array<string | { url?: string | null; path?: string | null; image_url?: string | null }> | null;
    };

    const rawImages = [
      getProductImage(item, PRODUCT_DETAIL_PLACEHOLDER),
      productWithMedia.media?.featured_image,
      ...(Array.isArray(productWithMedia.media?.images) ? productWithMedia.media.images : []),
      ...(Array.isArray(productWithMedia.images) ? productWithMedia.images : []),
    ];

    const normalized = rawImages.map((img) => {
      if (!img) return null;
      if (typeof img === 'string') return img;
      return img.url || img.path || img.image_url || null;
    });

    return Array.from(new Set(normalized.filter(Boolean))) as string[];
  };

  const handleRfq = () => {
    if (!product) return;
    const existing = JSON.parse(localStorage.getItem('sellio_b2b_rfq_items') || '[]') as Array<{ id: number; title: string; slug: string }>;
    const next = existing.some((item) => item.id === product.id)
      ? existing
      : [...existing, { id: product.id, title: product.title, slug: product.slug }];
    localStorage.setItem('sellio_b2b_rfq_items', JSON.stringify(next));
    setNotice(true);
  };

  if (loading) {
    return (
      <main className="b2b-detail-page">
        <div className="b2b-state b2b-skeleton" style={{ minHeight: '60vh' }}>
          <p style={{ opacity: 0.5 }}>Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="b2b-detail-page">
        <section className="b2b-state">
          <h1>Product could not be loaded.</h1>
          <p>{apiError || 'The requested product does not exist or has been removed.'}</p>
          <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary" style={{ marginTop: '1.5rem' }}>
            Browse catalog
          </a>
        </section>
      </main>
    );
  }

  const galleryImages = getGalleryImages(product);
  const selectedImage = activeImage || galleryImages[0] || PRODUCT_DETAIL_PLACEHOLDER;
  const description = product.description || 'Orthopedic instrument available for quotation by quantity, finish, marking, packing, and export document requirement.';

  return (
    <main className="b2b-detail-page">
      <a href={themeLink('/explore')} className="b2b-back-link">&larr; Back to catalog</a>

      {useFallback && apiError && <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ef" />}

      <section className="b2b-detail-grid">
        {/* Media column with gallery */}
        <div>
          <div className="b2b-detail-media">
            <img src={selectedImage} alt={product.title} />
          </div>
          {galleryImages.length > 1 && (
            <div className="b2b-detail-gallery" aria-label="Product image gallery">
              {galleryImages.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  className={`b2b-detail-thumb ${img === selectedImage ? 'b2b-detail-thumb-active' : ''}`}
                  onClick={() => setActiveImage(img)}
                  aria-label={`View image ${idx + 1}`}
                  aria-pressed={img === selectedImage}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <article className="b2b-detail-panel">
          <span className="b2b-kicker">SKU-{String(product.id).padStart(4, '0')}</span>
          <h1>{product.title}</h1>
          <div className="b2b-detail-price">{formatProductPrice(product)}</div>

          <p className="b2b-detail-summary">
            {description.length > 160 ? `${description.slice(0, 160).trimEnd()}...` : description}
          </p>

          <div className="b2b-detail-specs">
            <div><span>MOQ</span><strong>Quoted by item</strong></div>
            <div><span>Lead time</span><strong>Confirmed before order</strong></div>
            <div><span>Pricing</span><strong>Based on quantity</strong></div>
          </div>

          <button
            type="button"
            className="b2b-btn b2b-btn-primary b2b-detail-action"
            onClick={handleRfq}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Add to enquiry list
          </button>

          {notice && (
            <p className="b2b-notice" role="status">
              Added to your enquiry list.{' '}
              <a href={themeLink('/cart')} style={{ color: 'inherit', textDecoration: 'underline' }}>
                View list
              </a>
            </p>
          )}

          <div className="b2b-detail-assurance">
            <div className="b2b-assurance-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Private label can be discussed</span>
            </div>
            <div className="b2b-assurance-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <span>Manufacturer and exporter</span>
            </div>
          </div>
        </article>
      </section>

      {/* Tabs section */}
      <section className="b2b-detail-tabs-section" aria-label="Product information">
        <div className="b2b-detail-tabs" role="tablist" aria-label="Product detail tabs">
          {([
            ['description', 'Description'],
            ['specifications', 'Specifications'],
            ['rfq', 'Quote Details'],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              className={activeTab === key ? 'b2b-detail-tab-active' : undefined}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="b2b-detail-tab-panel">
          {activeTab === 'description' && (
            <>
              <h2>Product description</h2>
              <p>{description}</p>
              <p style={{ marginTop: '1rem', fontSize: '0.88rem' }}>
                Catalog reference: SKU-{String(product.id).padStart(4, '0')}.
                {product.category_id ? ` Category ${product.category_id}.` : ''}
              </p>
            </>
          )}
          {activeTab === 'specifications' && (
            <>
              <h2>Technical specifications</h2>
              <p>
                Detailed size, pattern, steel grade, finish, marking, packing, and document requirements are confirmed during quotation.
                Add this product to your enquiry list and include any export requirements in the notes.
              </p>
              <div className="b2b-spec-table">
                <div><dt>Product ID</dt><dd>SKU-{String(product.id).padStart(4, '0')}</dd></div>
                <div><dt>Minimum Order Quantity</dt><dd>Quoted by item and quantity</dd></div>
                <div><dt>Lead Time</dt><dd>Confirmed before order approval</dd></div>
                <div><dt>Pricing Model</dt><dd>Based on quantity and specification</dd></div>
                <div><dt>Payment Terms</dt><dd>Agreed before order confirmation</dd></div>
                <div><dt>Shipping</dt><dd>Export terms agreed with buyer</dd></div>
              </div>
            </>
          )}
          {activeTab === 'rfq' && (
            <>
              <h2>Quotation and export details</h2>
              <p>
                When you add this instrument to your enquiry list, you can specify quantity, steel grade, finish, branding, destination country,
                delivery timeline, and document requirements. We review these points before sending a quotation.
              </p>
              <p style={{ marginTop: '1rem' }}>
                Sample approval, private label files, material certificates, inspection records, and packing lists can be discussed when required by your market.
                Packing and shipment terms are agreed before production or dispatch.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
