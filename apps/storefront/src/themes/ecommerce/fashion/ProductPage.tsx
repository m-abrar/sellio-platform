'use client';

import React, { useState, useEffect } from 'react';
import type { Product } from '@sellio/types';
import { EditorialLookCard } from './components';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductDetail, resolveProductFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { addProductToCart } from '@/themes/unifieds/shared/cart';

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

  // Generic fallback if slug isn't matched directly
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

const SUGGESTED_LOOKS = [
  { title: "Silk Drape Blazer", price: "$1,250.00", slug: "silk-drape-blazer", image: "/themes/ecommerce/fashion/11.webp" },
  { title: "Monolith Chelsea Boots", price: "$850.00", slug: "monolith-chelsea-boots", image: "/themes/ecommerce/fashion/12.webp" },
  { title: "Oversized Cashmere Coat", price: "$3,200.00", slug: "oversized-cashmere-coat", image: "/themes/ecommerce/fashion/14.webp" }
];

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartNotice, setCartNotice] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'care'>('details');

  // Bespoke form states
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
    setActiveImage(null);
    setActiveTab('details');
  }, [slug]);

  // Sync selected standard size to form
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
      // Create order object
      const newOrder = {
        id: `ATELIER-${Date.now()}`,
        productSlug: slug,
        productTitle: product?.title || slug,
        price: product?.pricing?.formatted || (product?.price ? `$${product.price}` : "$0.00"),
        customizations: { ...form },
        timestamp: new Date().toISOString()
      };

      // Push to localStorage
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


  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes efSpinnerRotate {
            to { transform: rotate(360deg); }
          }
          .ef-loading-spinner {
            width: 50px;
            height: 50px;
            border: 1px solid var(--ef-border);
            border-top: 1px solid var(--ef-champagne);
            border-radius: 50%;
            animation: efSpinnerRotate 1s linear infinite;
          }
        ` }} />
        <div className="ef-loading-spinner" />
        <div className="ef-mono" style={{ marginTop: '2.5rem', opacity: 0.5 }}>LOADING_ATELIER_NODE</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
        <h2 style={{ fontFamily: 'var(--ef-serif)', fontSize: '2rem' }}>Garment not found</h2>
        <p style={{ opacity: 0.6, margin: '1rem 0 2rem' }}>{apiError || 'This lookbook item could not be loaded.'}</p>
        <a href={themeLink('/explore')} className="ef-btn-primary" style={{ textDecoration: 'none' }}>Browse lookbook</a>
      </div>
    );
  }

  const priceFormatted = product?.pricing?.formatted ||
    (typeof product?.price === 'number' ? `$${product.price.toLocaleString()}` : "$0.00");
  
  // Clean fallback values for specifications
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
        <div style={{ padding: '0 6% 2rem', maxWidth: '1800px', margin: '0 auto' }}>
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ef" />
        </div>
      )}

      {/* Back to Atelier Catalog Navigation */}
      <div style={{ padding: '4rem 6% 1rem', maxWidth: '1800px', margin: '0 auto' }}>
        <a
          href={themeLink('/')}
          style={{
            fontFamily: 'var(--ef-sans)',
            fontWeight: 800,
            fontSize: '0.65rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: 'var(--ef-ebony)',
            textDecoration: 'none',
          }}
        >
          <span>&larr;</span> Back to catalog
        </a>
      </div>

      {/* Product Detail Layout */}
      <section className="ef-section" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '8rem', paddingTop: '2rem', paddingBottom: '10rem' }}>
        
        {/* Left: Garment Image Visual */}
        <div>
          <div style={{
            width: '100%',
            aspectRatio: '3/4',
            background: 'var(--ef-oyster)',
            overflow: 'hidden',
            border: '1px solid var(--ef-border)',
            position: 'relative'
          }}>
            <img
              src={selectedImage}
              alt={product?.title} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div className="ef-mono" style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: '#ffffff', padding: '0.5rem 1.5rem', fontSize: '0.6rem' }}>
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
          
          {/* Garment Specifications Details Grid */}
          <div style={{ marginTop: '5rem', borderTop: '1px solid var(--ef-border)', paddingTop: '4rem' }}>
            <h3 style={{ fontFamily: 'var(--ef-serif)', fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem' }}>
              Atelier Garment Blueprint
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div>
                <div className="ef-mono" style={{ fontSize: '0.55rem', opacity: 0.4, marginBottom: '0.5rem' }}>MATERIAL_PROFILE</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{specs.material}</div>
              </div>
              <div>
                <div className="ef-mono" style={{ fontSize: '0.55rem', opacity: 0.4, marginBottom: '0.5rem' }}>STRUCTURE_WEIGHT</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{specs.weight}</div>
              </div>
              <div>
                <div className="ef-mono" style={{ fontSize: '0.55rem', opacity: 0.4, marginBottom: '0.5rem' }}>ORIGIN_ATELIER</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{specs.origin}</div>
              </div>
              <div>
                <div className="ef-mono" style={{ fontSize: '0.55rem', opacity: 0.4, marginBottom: '0.5rem' }}>CARE_INSTRUCTION</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{specs.care}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Garment Title, Price, Sizes and Custom Order Form */}
        <div>
          <div style={{ position: 'sticky', top: '150px' }}>
            
            {/* Metadata and Title */}
            <div className="ef-mono" style={{ marginBottom: '1.5rem', fontSize: '0.6rem' }}>READY_TO_WEAR_CATALOG</div>
            <h1 style={{ fontFamily: 'var(--ef-serif)', fontSize: '4rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem' }}>
              {product?.title}
            </h1>
            
            {/* Price */}
            <div style={{
              fontFamily: 'var(--ef-serif)',
              fontSize: '2.2rem',
              color: 'var(--ef-champagne)',
              fontWeight: 700,
              marginBottom: '3rem',
              borderBottom: '1px solid var(--ef-border)',
              paddingBottom: '2.5rem'
            }}>
              {priceFormatted}
            </div>

            {/* Description */}
            <p className="ef-detail-summary" style={{
              fontSize: '0.95rem',
              lineHeight: 1.9,
              opacity: 0.7,
              marginBottom: '2rem'
            }}>
              {product?.description}
            </p>

            <button
              type="button"
              className="ef-btn-primary"
              style={{ width: '100%', padding: '1.4rem', marginBottom: cartNotice ? '1rem' : '4rem' }}
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding...' : 'Add to cart'}
            </button>
            {cartNotice && (
              <p role="status" style={{ marginBottom: '4rem', fontSize: '0.9rem', opacity: 0.7 }}>
                Added to cart.{' '}
                <a href={themeLink('/cart')} style={{ color: 'var(--ef-champagne)', fontWeight: 700 }}>
                  View cart
                </a>
              </p>
            )}

            {/* Size Selector */}
            <div style={{ marginBottom: '4rem' }}>
              <div className="ef-mono" style={{ fontSize: '0.55rem', opacity: 0.4, marginBottom: '1.5rem' }}>SELECT_ATELIER_SIZE</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {["XS", "S", "M", "L", "XL"].map(size => {
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      style={{
                        width: '55px',
                        height: '55px',
                        border: isActive ? '1px solid var(--ef-ebony)' : '1px solid var(--ef-border)',
                        background: isActive ? 'var(--ef-ebony)' : '#ffffff',
                        color: isActive ? '#ffffff' : 'var(--ef-ebony)',
                        fontFamily: 'var(--ef-sans)',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Atelier Bespoke Inquiries */}
            <div style={{ borderTop: '1px solid var(--ef-border)', paddingTop: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '3px', background: 'var(--ef-champagne)' }} />
                <h3 className="ef-mono" style={{ fontSize: '0.65rem', margin: 0 }}>BESPOKE_TAILORED_FITTING_REQUEST</h3>
              </div>

              {isSubmitted ? (
                <div style={{ background: 'var(--ef-oyster)', border: '1px solid var(--ef-champagne)', padding: '2.5rem', textAlign: 'center' }}>
                  <div style={{ color: 'var(--ef-champagne)', fontSize: '2.5rem', marginBottom: '1rem' }}>✦</div>
                  <h4 style={{ fontFamily: 'var(--ef-serif)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>
                    Inquiry Confirmed
                  </h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
                    Your custom silhouette tailoring specifications have been successfully transmitted. Our atelier node will contact you to align on measurement precision.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBespokeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Grid Inputs for Height, Chest, Waist */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    <div>
                      <label className="ef-mono" style={{ fontSize: '0.5rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>HEIGHT (CM)</label>
                      <input 
                        type="number" 
                        name="height"
                        value={form.height}
                        onChange={handleInputChange}
                        placeholder="180"
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '1px solid var(--ef-border)',
                          fontFamily: 'var(--ef-sans)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label className="ef-mono" style={{ fontSize: '0.5rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>CHEST (CM)</label>
                      <input 
                        type="number" 
                        name="chest"
                        value={form.chest}
                        onChange={handleInputChange}
                        placeholder="96"
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '1px solid var(--ef-border)',
                          fontFamily: 'var(--ef-sans)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label className="ef-mono" style={{ fontSize: '0.5rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>WAIST (CM)</label>
                      <input 
                        type="number" 
                        name="waist"
                        value={form.waist}
                        onChange={handleInputChange}
                        placeholder="82"
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '1px solid var(--ef-border)',
                          fontFamily: 'var(--ef-sans)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <label className="ef-mono" style={{ fontSize: '0.5rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>FULL NAME</label>
                    <input 
                      type="text" 
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Alexander McQueen"
                      style={{
                        width: '100%',
                        padding: '1.2rem',
                        border: '1px solid var(--ef-border)',
                        fontFamily: 'var(--ef-sans)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label className="ef-mono" style={{ fontSize: '0.5rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      placeholder="alexander@atelier.luxury"
                      style={{
                        width: '100%',
                        padding: '1.2rem',
                        border: '1px solid var(--ef-border)',
                        fontFamily: 'var(--ef-sans)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label className="ef-mono" style={{ fontSize: '0.5rem', opacity: 0.5, display: 'block', marginBottom: '0.5rem' }}>FITTING & ADJUSTMENT NOTES</label>
                    <textarea 
                      name="notes"
                      value={form.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Provide shoulder-to-shoulder width, arm length, or specific drape fitting overrides..."
                      style={{
                        width: '100%',
                        padding: '1.2rem',
                        border: '1px solid var(--ef-border)',
                        fontFamily: 'var(--ef-sans)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ef-btn-primary"
                    style={{ width: '100%', padding: '1.6rem', marginTop: '1rem', position: 'relative' }}
                  >
                    {isSubmitting ? "TRANSMITTING INQUIRY..." : "SUBMIT ATELIER SPECS"}
                  </button>
                  {formError && (
                    <p role="alert" style={{ marginTop: '1rem', color: '#b45309', fontSize: '0.85rem', textAlign: 'center' }}>
                      {formError}
                    </p>
                  )}
                </form>
              )}
            </div>

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
              aria-selected={activeTab === key}
              className={activeTab === key ? 'ef-detail-tab-active' : undefined}
              onClick={() => setActiveTab(key as typeof activeTab)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ef-detail-tab-panel">
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

      {/* Suggested Looks Carousel */}
      <section style={{ borderTop: '1px solid var(--ef-border)', paddingTop: '10rem', maxWidth: '1800px', margin: '0 auto', paddingLeft: '6%', paddingRight: '6%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
          <div>
            <div className="ef-mono" style={{ marginBottom: '1.5rem' }}>LOOKBOOK_CURATION</div>
            <h2 className="ef-heading-xl" style={{ fontSize: '4.5rem' }}>Complete the <br/><span className="ef-italic">Silhouette.</span></h2>
          </div>
          <div className="ef-mono" style={{ opacity: 0.3, fontSize: '0.65rem' }}>AUTUMN_WINTER_2026_CURATIONS</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
          {SUGGESTED_LOOKS.map((item, idx) => (
            <a key={item.slug} href={themeLink(`/product/${item.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
