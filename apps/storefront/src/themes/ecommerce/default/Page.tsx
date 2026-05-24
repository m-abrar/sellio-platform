'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { CategoryRibbon } from './components';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='820' viewBox='0 0 640 820'><rect width='100%' height='100%' fill='%23f8fafc'/><g transform='translate(288,350)' stroke='%232563eb' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='10'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='57%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='13' font-weight='800' letter-spacing='2' fill='%2364748b'>PRODUCT IMAGE</text></svg>";

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const fetchedProducts = await api.getProducts();
        if (!isMounted) {
          return;
        }

        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setProductError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load ecommerce default products:', error);
        setProductError(error instanceof Error ? error.message : 'Products are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const getProductImage = (product: Product) => (
    product.media?.featured_image || product.image_url || placeholderImage
  );

  const formatPrice = (product: Product) => (
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Contact for price')
  );

  return (
    <div className="ed-section">
      {/* Refined Functional Hero */}
      <section className="ed-hero">
        <div>
          <div className="ed-mono" style={{ marginBottom: '2.5rem' }}>SUMMER_COLLECTION_2026_V8</div>
          <h1 className="ed-heading-xl">
            Refined <br/>
            Essentials for <br/>
            <span style={{ color: 'var(--ed-blue)' }}>Modern Life.</span>
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--ed-text-muted)', lineHeight: 1.8, maxWidth: '550px' }}>
            Discover a curated selection of premium garments designed with a focus on silhouette, material, and enduring quality.
          </p>
          <div style={{ marginTop: '6rem' }}>
            <button className="ed-btn-primary">Shop Collection</button>
          </div>
        </div>
        <div className="ed-hero-img-wrapper">
          <img src="/themes/ecommerce/default/9.webp" alt="Hero Lifestyle" className="ed-hero-img" />
          <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div className="ed-mono" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>FEATURED_NODE</div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>Technical_Shell_v4</div>
          </div>
        </div>
      </section>

      {/* Trust & Category Ribbon */}
      <section style={{ padding: '8rem 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem', borderTop: '1px solid var(--ed-border)', marginTop: '10rem' }}>
          <CategoryRibbon label="New Arrivals" count="124" />
          <CategoryRibbon label="Essentials" count="86" />
          <CategoryRibbon label="Outerwear" count="42" />
          <CategoryRibbon label="Accessories" count="156" />
      </section>

      {/* Featured Collection Grid */}
      <section style={{ marginTop: '15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ed-mono" style={{ marginBottom: '1.5rem' }}>CURATED_PRODUCT_REGISTRY</div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase' }}>New <br/>Arrivals.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--ed-text-muted)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes product availability from the world&apos;s most significant garment nodes.
              </div>
          </div>
          
          <div className="ed-product-grid">
            {loadingProducts ? (
              [1, 2, 3, 4].map((item) => (
                <div className="ed-product-card ed-product-skeleton" key={item}>
                  <div className="ed-img-frame" />
                  <div className="ed-product-copy">
                    <span />
                    <strong />
                    <em />
                  </div>
                </div>
              ))
            ) : productError ? (
              <div className="ed-product-state">
                <div className="ed-mono" style={{ marginBottom: '1rem' }}>PRODUCT_SYNC_OFFLINE</div>
                <h3>Products could not be synchronized.</h3>
                <p>{productError}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="ed-product-state">
                <div className="ed-mono" style={{ marginBottom: '1rem' }}>EMPTY_PRODUCT_REGISTRY</div>
                <h3>No live products are available yet.</h3>
                <p>Add product records in the backend and this collection will hydrate automatically.</p>
              </div>
            ) : (
              products.slice(0, 8).map((product) => (
                <a href={`/product/${product.slug}`} className="ed-product-card" key={product.id}>
                  <div className="ed-img-frame">
                    <img src={getProductImage(product)} alt={product.title} className="ed-img" />
                  </div>
                  <div className="ed-mono" style={{ marginBottom: '0.8rem' }}>PRODUCT_{product.id}</div>
                  <h3>{product.title}</h3>
                  <div className="ed-product-price">{formatPrice(product)}</div>
                </a>
              ))
            )}
          </div>
      </section>

      {/* Collective / Newsletter Section */}
      <section style={{ marginTop: '20rem', padding: '15rem 10%', background: 'var(--ed-frost)', borderRadius: '32px', textAlign: 'center' }}>
          <div className="ed-mono" style={{ marginBottom: '3rem' }}>JOIN_THE_COLLECTIVE</div>
          <h2 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px', textTransform: 'uppercase', color: 'var(--ed-slate)', marginBottom: '4rem', lineHeight: 1 }}>
              Stay In <br/>The Loop.
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 8rem', fontSize: '1.25rem', color: 'var(--ed-text-muted)', lineHeight: 1.8 }}>
              Join our collective and be the first to know about new collection drops, exclusive events, and seasonal sales.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
              <input type="email" placeholder="ENTER_EMAIL_NODE" style={{ flex: 1, padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid var(--ed-border)', fontSize: '1rem', fontWeight: 600 }} />
              <button className="ed-btn-primary" style={{ padding: '1.5rem 4rem' }}>SUBSCRIBE</button>
          </div>
      </section>
      
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
