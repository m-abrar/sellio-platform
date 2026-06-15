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

export default function ProductPage({ slug }: { slug: string }) {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notice, setNotice] = useState(false);

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
    return <main className="b2b-detail-page"><div className="b2b-state"><h1>Loading product...</h1></div></main>;
  }

  if (!product) {
    return (
      <main className="b2b-detail-page">
        <section className="b2b-state">
          <h1>Product could not be loaded.</h1>
          <p>{apiError || 'The requested product does not exist or has been removed.'}</p>
          <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">Browse catalog</a>
        </section>
      </main>
    );
  }

  const image = getProductImage(product, PRODUCT_DETAIL_PLACEHOLDER);
  const description = product.description || 'Catalog item ready for technical review, pricing discussion, and buyer RFQ submission.';

  return (
    <main className="b2b-detail-page">
      <a href={themeLink('/explore')} className="b2b-back-link">&larr; Back to catalog</a>

      {useFallback && apiError && <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ef" />}

      <section className="b2b-detail-grid">
        <div className="b2b-detail-media">
          <img src={image} alt={product.title} />
        </div>
        <article className="b2b-detail-panel">
          <span className="b2b-kicker">SKU-{String(product.id).padStart(4, '0')}</span>
          <h1>{product.title}</h1>
          <div className="b2b-detail-price">{formatProductPrice(product)}</div>
          <p>{description}</p>

          <div className="b2b-detail-specs">
            <div><span>MOQ</span><strong>Request with quote</strong></div>
            <div><span>Lead time</span><strong>Seller confirmed</strong></div>
            <div><span>Pricing</span><strong>Negotiated</strong></div>
          </div>

          <button type="button" className="b2b-btn b2b-btn-primary b2b-detail-action" onClick={handleRfq}>
            Add to RFQ
          </button>
          {notice && <p className="b2b-notice">Added to your RFQ list. A product RFQ API is the next backend step.</p>}
        </article>
      </section>
    </main>
  );
}
