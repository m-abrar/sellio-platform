'use client';

import React, { useEffect, useState } from 'react';
import type { Product } from '@sellio/types';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductDetail, resolveProductFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import {
  formatProductPrice,
  getProductImage,
  PRODUCT_DETAIL_PLACEHOLDER,
} from '@/themes/unifieds/shared/product-utils';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

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
        if (resolution.mode === 'demo') {
          setProduct(resolution.product);
          setUseFallback(true);
        } else {
          setProduct(null);
          setUseFallback(false);
        }
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

  const getGalleryImages = (item: Product) => {
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
      '/themes/ecommerce/default/12.webp',
      '/themes/ecommerce/default/13.webp',
      '/themes/ecommerce/default/14.webp',
    ];

    const normalized = rawImages.map((image) => {
      if (!image) return null;
      if (typeof image === 'string') return image;
      return image.url || image.path || image.image_url || null;
    });

    return Array.from(new Set(normalized.filter(Boolean))) as string[];
  };

  const handleAddToCart = () => {
    if (!product) return;

    setAddingToCart(true);
    addProductToCart(product);
    setCartNotice(true);
    setAddingToCart(false);
  };

  if (loading) {
    return (
      <main className="ed-detail-page" aria-busy="true">
        <div className="ed-detail-back-skeleton" />
        <section className="ed-detail-grid">
          <div className="ed-detail-media ed-detail-skeleton" />
          <div className="ed-detail-panel">
            <div className="ed-detail-line ed-detail-line-small" />
            <div className="ed-detail-line ed-detail-line-title" />
            <div className="ed-detail-line ed-detail-line-price" />
            <div className="ed-detail-line ed-detail-line-copy" />
            <div className="ed-detail-line ed-detail-line-copy" />
            <div className="ed-detail-line ed-detail-line-button" />
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="ed-detail-page">
        <section className="ed-detail-state" role="status">
          <div className="ed-mono" style={{ marginBottom: '1rem' }}>
            Product unavailable
          </div>
          <h1>Product could not be loaded.</h1>
          <p>
            {apiError || 'The requested product does not exist or has been removed.'}
          </p>
          <a href={themeLink('/explore')} className="ed-btn-primary ed-inline-cta">
            Browse collection
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="ed-detail-page">
      <a href={themeLink('/')} className="ed-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to shop
      </a>

      {useFallback && apiError && (
        <div className="ed-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ed" />
        </div>
      )}

      {(() => {
        const galleryImages = getGalleryImages(product);
        const selectedImage = activeImage || galleryImages[0] || PRODUCT_DETAIL_PLACEHOLDER;
        const description = product.description ||
          'This product is available from the Sellio catalog with pricing, stock, and checkout handled by the storefront.';

        return (
          <>
      <section className="ed-detail-grid" aria-labelledby="ed-detail-title">
        <div>
          <div className="ed-detail-media">
            <img src={selectedImage} alt={product.title} />
          </div>
          <div className="ed-detail-gallery" aria-label="Product gallery">
            {galleryImages.map((image) => (
              <button
                key={image}
                type="button"
                className={image === selectedImage ? 'ed-detail-thumb ed-detail-thumb-active' : 'ed-detail-thumb'}
                onClick={() => setActiveImage(image)}
                aria-label={`View ${product.title} image`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <article className="ed-detail-panel">
          <div className="ed-mono">SKU-{String(product.id).padStart(4, '0')}</div>
          <h1 id="ed-detail-title">{product.title}</h1>
          <div className="ed-detail-price">{formatProductPrice(product)}</div>

          <div className="ed-detail-rule" />

          <p className="ed-detail-summary">
            {description}
          </p>

          <div className="ed-detail-specs" aria-label="Product metadata">
            <div>
              <span>Availability</span>
              <strong>Ready to ship</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>2-5 business days</strong>
            </div>
            <div>
              <span>Returns</span>
              <strong>30-day returns</strong>
            </div>
          </div>

          <button
            type="button"
            className="ed-btn-primary ed-detail-action"
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding...' : 'Add to cart'}
          </button>

          <div className="ed-detail-assurance" aria-label="Buyer assurance">
            <div>
              <strong>Secure checkout</strong>
              <span>Order flow connected to Sellio cart.</span>
            </div>
            <div>
              <strong>Live catalog</strong>
              <span>Price and stock come from API records.</span>
            </div>
          </div>

          {cartNotice && (
            <p className="ed-cart-notice" role="status">
              Added to cart.{' '}
              <a href={themeLink('/cart')} className="ed-cart-notice__link">
                View cart
              </a>
            </p>
          )}
        </article>
      </section>

      <section className="ed-detail-tabs-section" aria-label="Product information">
        <div className="ed-detail-tabs" role="tablist" aria-label="Product detail tabs">
          {[
            ['description', 'Description'],
            ['reviews', 'Reviews'],
            ['shipping', 'Shipping'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              className={activeTab === key ? 'ed-detail-tab-active' : undefined}
              onClick={() => setActiveTab(key as typeof activeTab)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ed-detail-tab-panel">
          {activeTab === 'description' && (
            <>
              <h2>Product details</h2>
              <p>{description}</p>
              <p>
                Category reference: {product.category_id ? `Category ${product.category_id}` : 'General catalog'}.
                Product reference: SKU-{String(product.id).padStart(4, '0')}.
              </p>
            </>
          )}
          {activeTab === 'reviews' && (
            <>
              <h2>Customer reviews</h2>
              <p>
                Reviews are ready for integration with the storefront review system. Until then, this product
                uses verified catalog and checkout data from Sellio.
              </p>
            </>
          )}
          {activeTab === 'shipping' && (
            <>
              <h2>Shipping and returns</h2>
              <p>
                Orders move through the connected Sellio cart and checkout flow. Standard delivery estimates
                are 2-5 business days, with 30-day returns for eligible items.
              </p>
            </>
          )}
        </div>
      </section>
          </>
        );
      })()}
    </main>
  );
}
