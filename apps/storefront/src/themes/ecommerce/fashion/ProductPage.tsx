'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Product } from '@sellio/types';
import { EditorialLookCard } from './components';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import {
  fetchProductDetail,
  fetchProductsCatalog,
  resolveProductFailure,
} from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { addProductToCart } from '@/themes/unifieds/shared/cart';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

interface ProductPageProps {
  slug: string;
}

interface BespokeFittingForm {
  name: string;
  email: string;
  size: string;
  height: string;
  chest: string;
  waist: string;
  notes: string;
}

const getFallbackProduct = (slug: string): any => {
  const fallbacks: Record<string, any> = {
    'silk-drape-blazer': {
      id: 101,
      title: "Silk Drape Blazer",
      slug: "silk-drape-blazer",
      description: "Architected with double-breasted closure and refined peak lapels, this blazer is tailored from pure double-faced organic silk drape. Features raw structural silhouette curves and invisible slip pockets.",
      price: 1250.00,
      pricing: { base_price: 1250.00, sale_price: 1250.00, current_price: 1250.00, formatted: "$1,250.00", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/fashion/11.webp",
      specs: { material: "100% Organic Mulberry Silk", weight: "320 gsm heavy-drape", origin: "Atelier Milan, Italy", care: "Dry clean only" }
    },
    'monolith-chelsea-boots': {
      id: 102,
      title: "Monolith Chelsea Boots",
      slug: "monolith-chelsea-boots",
      description: "Crafted from brushed full-grain box calfskin leather, these monolithic boots highlight a bold thick lugged rubber sole and elasticated side gussets. A structural statement for any silhouette.",
      price: 850.00,
      pricing: { base_price: 850.00, sale_price: 850.00, current_price: 850.00, formatted: "$850.00", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/fashion/12.webp",
      specs: { material: "Brushed Italian Box Calfskin", weight: "Thick lugged outsole", origin: "Porto, Portugal", care: "Apply wax polish" }
    },
    'satin-evening-gown': {
      id: 103,
      title: "Satin Evening Gown",
      slug: "satin-evening-gown",
      description: "A breathtaking floor-length satin evening gown cut on the bias to hug body contours beautifully. Elegant cowl neckline, delicate criss-cross back straps, and subtle side slit details.",
      price: 2400.00,
      pricing: { base_price: 2400.00, sale_price: 2400.00, current_price: 2400.00, formatted: "$2,400.00", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/fashion/13.webp",
      specs: { material: "95% Silk Satin, 5% Elastane", weight: "Bias cut drapery", origin: "Atelier Paris, France", care: "Dry clean only" }
    },
    'oversized-cashmere-coat': {
      id: 104,
      title: "Oversized Cashmere Coat",
      slug: "oversized-cashmere-coat",
      description: "Woven in Italy from unmatched brushed pure cashmere fibers. Generous oversized proportions, broad dropped shoulders, deep patch pockets, and premium horn buttons.",
      price: 3200.00,
      pricing: { base_price: 3200.00, sale_price: 3200.00, current_price: 3200.00, formatted: "$3,200.00", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/fashion/14.webp",
      specs: { material: "100% Loro Piana Cashmere", weight: "Buffalo horn buttons", origin: "Atelier Florence, Italy", care: "Dry clean only" }
    },
    'textured-knit-sweater': {
      id: 105,
      title: "Textured Knit Sweater",
      slug: "textured-knit-sweater",
      description: "A heavy-gauge organic cotton and linen ribbed blend. Styled with a raised mock collar, extended rib knit sleeve cuffs, and distinct high-low structural drop side slits.",
      price: 450.00,
      pricing: { base_price: 450.00, sale_price: 450.00, current_price: 450.00, formatted: "$450.00", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/fashion/15.webp",
      specs: { material: "60% Cotton, 40% Linen", weight: "5-Gauge heavy ribbed", origin: "Atelier Tokyo, Japan", care: "Hand wash cold, dry flat" }
    },
    'pleated-architecture-skirt': {
      id: 106,
      title: "Pleated Architecture Skirt",
      slug: "pleated-architecture-skirt",
      description: "Architectural structured box pleats engineered from a crisp wool-blend twill fabric. Designed with an asymmetric draped silhouette edge and a concealed side zipper.",
      price: 980.00,
      pricing: { base_price: 980.00, sale_price: 980.00, current_price: 980.00, formatted: "$980.00", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/fashion/16.webp",
      specs: { material: "80% Virgin Wool, 20% Polyester", weight: "Asymmetric twill cut", origin: "Atelier London, UK", care: "Dry clean only" }
    }
  };

  const resolved = fallbacks[slug];
  if (resolved) return resolved;

  const titleStr = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    id: 999,
    title: titleStr,
    slug: slug,
    description: "An elegant structural statement silhouette piece from our unified luxury atelier line. Fabricated from premium fibers and detailed with tailored finishings.",
    price: 990.00,
    pricing: { base_price: 990.00, sale_price: 990.00, current_price: 990.00, formatted: "$990.00", currency_symbol: "$" },
    category_id: 1,
    image_url: "/themes/ecommerce/fashion/11.webp",
    specs: { material: "Atelier Luxury Blend", weight: "Structured twill", origin: "Atelier Paris", care: "Dry clean only" }
  };
};

const FALLBACK_SUGGESTED = [
  { title: "Silk Drape Blazer", price: "$1,250.00", slug: "silk-drape-blazer", image: "/themes/ecommerce/fashion/11.webp" },
  { title: "Monolith Chelsea Boots", price: "$850.00", slug: "monolith-chelsea-boots", image: "/themes/ecommerce/fashion/12.webp" },
  { title: "Oversized Cashmere Coat", price: "$3,200.00", slug: "oversized-cashmere-coat", image: "/themes/ecommerce/fashion/14.webp" }
];

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const labelSuggestionsEyebrow = useThemeContent('suggestions.eyebrow', 'LOOKBOOK_CURATION');
  const labelSuggestionsSeason = useThemeContent('suggestions.season_label', 'AUTUMN_WINTER_2026_CURATIONS');
  const labelSpecsTitle = useThemeContent('detail.specs_title', 'Atelier Garment Blueprint');
  const labelCatalogLabel = useThemeContent('detail.catalog_label', 'READY_TO_WEAR_CATALOG');

  const [product, setProduct] = useState<any | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'care'>('details');
  const [activeTabId] = useState(() => `tab-panel-${Math.random().toString(36).slice(2)}`);

  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [form, setForm] = useState<BespokeFittingForm>({
    name: '',
    email: '',
    size: 'M',
    height: '',
    chest: '',
    waist: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
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
        if (resolution.mode === 'demo' && resolution.product) {
          setProduct(resolution.product);
          setUseFallback(true);
        } else if (allowDemo) {
          setProduct(getFallbackProduct(slug));
          setUseFallback(true);
        } else {
          setProduct(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug, allowDemo]);

  useEffect(() => {
    fetchProductsCatalog().then(result => {
      if (result.ok && result.data?.length) {
        setCatalogProducts(result.data);
      }
    });
  }, []);

  useEffect(() => {
    setActiveImage(null);
    setActiveTab('details');
  }, [slug]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setForm(prev => ({ ...prev, size }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBespokeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setFormError('Please enter your name and email to submit a fitting request.');
      return;
    }
    setFormError(null);

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder = {
        id: `ATELIER-${Date.now()}`,
        productSlug: slug,
        productTitle: product?.title || slug,
        price: product?.pricing?.formatted || (product?.price ? `$${product.price}` : "$0.00"),
        customizations: { ...form },
        timestamp: new Date().toISOString()
      };

      try {
        const existing = localStorage.getItem('sellio_ecommerce_fashion_orders');
        const orders = existing ? JSON.parse(existing) : [];
        orders.push(newOrder);
        localStorage.setItem('sellio_ecommerce_fashion_orders', JSON.stringify(orders));
      } catch (e) {
        console.warn("Could not save to LocalStorage:", e);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleAddToCart = () => {
    if (!product) return;
    setAddingToCart(true);
    addProductToCart(product as Product);
    setCartNotice(true);
    setAddingToCart(false);
  };

  const getGalleryImages = (item: any) => {
    if (!item) return [];

    const mediaImages = Array.isArray(item.media?.images)
      ? item.media.images.map((image: any) => (
        typeof image === 'string' ? image : image?.url || image?.path || image?.image_url
      ))
      : [];

    return Array.from(new Set([
      item.image_url,
      item.media?.featured_image,
      ...mediaImages,
      '/themes/ecommerce/fashion/11.webp',
      '/themes/ecommerce/fashion/12.webp',
      '/themes/ecommerce/fashion/13.webp',
    ].filter(Boolean))) as string[];
  };

  const suggestedLooks = useMemo(() => {
    const fromCatalog = catalogProducts
      .filter(p => p.slug !== slug)
      .slice(0, 3);
    if (fromCatalog.length > 0) {
      return fromCatalog.map((p, i) => ({
        title: p.title,
        price: p.pricing?.formatted || (typeof p.price === 'number' ? `$${p.price.toLocaleString()}` : '$0.00'),
        slug: p.slug || '',
        image: p.image_url || `/themes/ecommerce/fashion/${(i % 6) + 11}.webp`,
      }));
    }
    return FALLBACK_SUGGESTED.filter(l => l.slug !== slug).slice(0, 3);
  }, [catalogProducts, slug]);

  if (loading) {
    return (
      <div className="ef-detail-loading">
        <div className="ef-loading-spinner" />
        <div className="ef-mono ef-detail-loading-label">LOADING_ATELIER_NODE</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="ef-detail-notfound">
        <h2>Garment not found</h2>
        <p>{apiError || 'This lookbook item could not be loaded.'}</p>
        <a href={themeLink('/explore')} className="ef-btn-primary">Browse lookbook</a>
      </div>
    );
  }

  const priceFormatted = product?.pricing?.formatted ||
    (typeof product?.price === 'number' ? `$${product.price.toLocaleString()}` : "$0.00");

  const specs = product?.specs || {
    material: "Atelier Handcrafted Twill",
    weight: "Premium drape profile",
    origin: "Atelier Florence, Italy",
    care: "Dry clean only"
  };
  const galleryImages = getGalleryImages(product);
  const selectedImage = activeImage || galleryImages[0] || '/themes/ecommerce/fashion/11.webp';

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', padding: '0 0 10rem 0' }}>

      {useFallback && apiError && (
        <div className="ef-detail-alert-wrap">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ef" />
        </div>
      )}

      <div className="ef-detail-back-wrap">
        <a href={themeLink('/')} className="ef-detail-back">
          <span>&larr;</span> Back to catalog
        </a>
      </div>

      <section className="ef-section ef-detail-grid">

        {/* Left: Garment Image Visual */}
        <div>
          <div className="ef-detail-media">
            <img src={selectedImage} alt={product?.title} />
            <div className="ef-mono ef-detail-atelier-badge">
              ATELIER_NO_0{product?.id || 101}
            </div>
          </div>
          <div className="ef-detail-gallery" aria-label="Product image gallery">
            {galleryImages.map((image) => (
              <button
                key={image}
                type="button"
                className={image === selectedImage ? 'ef-detail-thumb ef-detail-thumb-active' : 'ef-detail-thumb'}
                onClick={() => setActiveImage(image)}
                aria-label={`View ${product?.title} image`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>

          {/* Garment Specifications */}
          <div className="ef-detail-specs-section">
            <h3 className="ef-detail-specs-title">{labelSpecsTitle}</h3>
            <div className="ef-detail-specs-grid">
              <div>
                <div className="ef-mono ef-detail-spec-label">MATERIAL_PROFILE</div>
                <div className="ef-detail-spec-value">{specs.material}</div>
              </div>
              <div>
                <div className="ef-mono ef-detail-spec-label">STRUCTURE_WEIGHT</div>
                <div className="ef-detail-spec-value">{specs.weight}</div>
              </div>
              <div>
                <div className="ef-mono ef-detail-spec-label">ORIGIN_ATELIER</div>
                <div className="ef-detail-spec-value">{specs.origin}</div>
              </div>
              <div>
                <div className="ef-mono ef-detail-spec-label">CARE_INSTRUCTION</div>
                <div className="ef-detail-spec-value">{specs.care}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Garment Title, Price, Sizes and Custom Order Form */}
        <div className="ef-detail-info-panel">

          <div className="ef-mono ef-detail-catalog-label">{labelCatalogLabel}</div>
          <h1 className="ef-detail-title">{product?.title}</h1>
          <div className="ef-detail-price">{priceFormatted}</div>

          <p className="ef-detail-summary ef-detail-desc">{product?.description}</p>

          <button
            type="button"
            className={`ef-btn-primary ef-detail-cart-btn${cartNotice ? ' ef-detail-cart-btn--noticed' : ''}`}
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding...' : 'Add to cart'}
          </button>
          {cartNotice && (
            <p role="status" className="ef-detail-cart-notice">
              Added to cart.{' '}
              <a href={themeLink('/cart')} className="ef-detail-cart-link">
                View cart
              </a>
            </p>
          )}

          {/* Size Selector */}
          <div className="ef-detail-size-section">
            <div className="ef-mono ef-detail-size-label">SELECT_ATELIER_SIZE</div>
            <div className="ef-detail-size-row">
              {["XS", "S", "M", "L", "XL"].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  className={selectedSize === size ? 'ef-size-btn ef-size-btn-active' : 'ef-size-btn'}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Bespoke Fitting Request */}
          <div className="ef-detail-bespoke">
            <div className="ef-detail-bespoke-header">
              <div className="ef-detail-bespoke-dot" />
              <h3 className="ef-mono" style={{ margin: 0 }}>BESPOKE_TAILORED_FITTING_REQUEST</h3>
            </div>

            {isSubmitted ? (
              <div className="ef-detail-bespoke-success">
                <div className="ef-detail-bespoke-success-icon" aria-hidden="true">✦</div>
                <h4>Inquiry Confirmed</h4>
                <p>
                  Your custom silhouette tailoring specifications have been successfully transmitted. Our atelier node will contact you to align on measurement precision.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBespokeSubmit} className="ef-bespoke-form">
                <div className="ef-bespoke-measurements">
                  <div>
                    <label htmlFor="height-input" className="ef-mono ef-bespoke-label">HEIGHT (CM)</label>
                    <input
                      id="height-input"
                      type="number"
                      name="height"
                      value={form.height}
                      onChange={handleInputChange}
                      placeholder="180"
                      className="ef-bespoke-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="chest-input" className="ef-mono ef-bespoke-label">CHEST (CM)</label>
                    <input
                      id="chest-input"
                      type="number"
                      name="chest"
                      value={form.chest}
                      onChange={handleInputChange}
                      placeholder="96"
                      className="ef-bespoke-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="waist-input" className="ef-mono ef-bespoke-label">WAIST (CM)</label>
                    <input
                      id="waist-input"
                      type="number"
                      name="waist"
                      value={form.waist}
                      onChange={handleInputChange}
                      placeholder="82"
                      className="ef-bespoke-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name-input" className="ef-mono ef-bespoke-label">FULL NAME</label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Alexander McQueen"
                    className="ef-bespoke-input ef-bespoke-input--lg"
                  />
                </div>

                <div>
                  <label htmlFor="email-input" className="ef-mono ef-bespoke-label">EMAIL ADDRESS</label>
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    placeholder="alexander@atelier.luxury"
                    className="ef-bespoke-input ef-bespoke-input--lg"
                  />
                </div>

                <div>
                  <label htmlFor="notes-input" className="ef-mono ef-bespoke-label">FITTING & ADJUSTMENT NOTES</label>
                  <textarea
                    id="notes-input"
                    name="notes"
                    value={form.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Provide shoulder-to-shoulder width, arm length, or specific drape fitting overrides..."
                    className="ef-bespoke-input ef-bespoke-input--lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ef-btn-primary ef-bespoke-submit"
                >
                  {isSubmitting ? "TRANSMITTING INQUIRY..." : "SUBMIT ATELIER SPECS"}
                </button>
                {formError && (
                  <p role="alert" className="ef-bespoke-error">{formError}</p>
                )}
              </form>
            )}
          </div>

        </div>
      </section>

      <section className="ef-detail-tabs-section">
        <div className="ef-detail-tabs" role="tablist" aria-label="Product information">
          {[
            ['details', 'Details'],
            ['reviews', 'Reviews'],
            ['care', 'Care'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={activeTab === key}
              aria-controls={activeTabId}
              className={activeTab === key ? 'ef-detail-tab-active' : undefined}
              onClick={() => setActiveTab(key as typeof activeTab)}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          className="ef-detail-tab-panel"
          role="tabpanel"
          id={activeTabId}
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === 'details' && (
            <>
              <h2>Garment details</h2>
              <p>{product?.description}</p>
              <dl>
                <div><dt>Material</dt><dd>{specs.material}</dd></div>
                <div><dt>Structure</dt><dd>{specs.weight}</dd></div>
                <div><dt>Origin</dt><dd>{specs.origin}</dd></div>
              </dl>
            </>
          )}
          {activeTab === 'reviews' && (
            <>
              <h2>Reviews</h2>
              <p>Review integration is ready for the storefront review system. This product currently uses verified catalog and checkout data.</p>
            </>
          )}
          {activeTab === 'care' && (
            <>
              <h2>Care and fitting</h2>
              <p>{specs.care}. Use the bespoke fitting request to share measurements or adjustment notes before purchase.</p>
            </>
          )}
        </div>
      </section>

      {/* Suggested Looks */}
      <section className="ef-detail-suggestions">
        <div className="ef-detail-suggestions-header">
          <div>
            <div className="ef-mono ef-detail-suggestions-eyebrow">{labelSuggestionsEyebrow}</div>
            <h2 className="ef-heading-xl ef-detail-suggestions-title">
              Complete the <br/><span className="ef-italic">Silhouette.</span>
            </h2>
          </div>
          <div className="ef-mono ef-detail-suggestions-season">{labelSuggestionsSeason}</div>
        </div>
        <div className="ef-detail-suggestions-grid">
          {suggestedLooks.map((item, idx) => (
            <a key={item.slug} href={themeLink(`/product/${item.slug}`)} className="ef-detail-suggestions-link">
              <EditorialLookCard
                name={item.title}
                price={item.price}
                image={item.image}
                lookNumber={`LOOK_0${idx + 7}`}
              />
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
