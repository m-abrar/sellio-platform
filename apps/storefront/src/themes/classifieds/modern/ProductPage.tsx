'use client';

import React, { useEffect, useState } from 'react';
import type { ClassifiedListing } from '@sellio/types';
import { ModernHeader, ModernCard, ModernFooter } from './components';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import {
  fetchClassifiedDetail,
  fetchClassifiedsHome,
  getRelatedFromApi,
  resolveClassifiedFailure,
} from '@/themes/classifieds/shared/catalog';
import {
  saveClassifiedInquirySnapshot,
  redirectToClassifiedInquiryConfirmation,
} from '@/themes/classifieds/shared/classified-inquiry-confirmation';
import { submitClassifiedInquiry } from '@/themes/classifieds/shared/submit-inquiry';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [listing, setListing] = useState<ClassifiedListing | null>(null);
  const [relatedListings, setRelatedListings] = useState<ClassifiedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activePhoto, setActivePhoto] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToFeed = () => {
    document.getElementById('cm-feed')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchClassifiedDetail(slug);

      if (result.ok && result.response.data) {
        setListing(result.response.data);
        setActivePhoto(result.response.data.media?.main_photo || '');
        setUseFallback(false);
        setApiError(null);

        setRelatedListings(
          getRelatedFromApi(
            result.response.data,
            result.response.related_classifieds,
            slug,
            undefined,
          ),
        );

        if (!result.response.related_classifieds?.length) {
          const listResult = await fetchClassifiedsHome({ limit: 5 });
          if (listResult.ok && listResult.response.data) {
            setRelatedListings(
              getRelatedFromApi(
                result.response.data,
                undefined,
                slug,
                listResult.response.data,
              ),
            );
          }
        }
      } else {
        const errorMsg = result.ok ? 'Listing not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveClassifiedFailure(slug, allowDemo, 'modern');

        if (resolution.mode === 'demo') {
          setListing(resolution.listing);
          setActivePhoto(resolution.listing.media?.main_photo || '');
          setRelatedListings(resolution.related);
          setUseFallback(true);
        } else if (resolution.mode === 'notFound') {
          setListing(null);
          setNotFound(true);
          setUseFallback(false);
        } else {
          setListing(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    if (slug) {
      loadData();
    }

    setIsFavorite(false);
    setFormError(null);
  }, [slug, allowDemo]);

  useEffect(() => {
    if (listing) {
      setFormNotes(`Hi! I am interested in "${listing.title}". Please share next steps.`);
    }
  }, [listing]);

  if (loading) {
    return (
      <div className="classifieds-modern-wrapper" style={{ padding: '4rem 6%', textAlign: 'center' }}>
        <ModernHeader onPostClick={scrollToFeed} searchTerm="" onSearchChange={() => {}} />
        <div style={{ maxWidth: '1200px', margin: '3rem auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div style={{ height: '450px', backgroundColor: '#e2e8f0', borderRadius: '24px', animation: 'pulse 1.5s infinite' }} />
          <div>
            <div style={{ height: '35px', width: '60%', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '1.5rem', animation: 'pulse 1.5s infinite' }} />
          </div>
        </div>
        <ModernFooter />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="classifieds-modern-wrapper" style={{ padding: '6rem 6%', textAlign: 'center' }}>
        <ModernHeader onPostClick={scrollToFeed} searchTerm="" onSearchChange={() => {}} />
        {(useFallback || apiError) && apiError && (
          <CatalogSyncAlert classPrefix="cm" variant={useFallback ? 'demo' : 'production'} error={apiError} />
        )}
        <h2>{notFound ? 'Item Not Found' : 'Unable to Load Listing'}</h2>
        <p style={{ color: 'var(--cm-text-muted)', marginBottom: '2rem' }}>
          {notFound
            ? 'The requested listing was not found.'
            : 'Check the API connection or refresh the page.'}
        </p>
        <a className="cm-btn cm-btn-primary" href={themeLink('/')}>Back to Catalog</a>
        <ModernFooter />
      </div>
    );
  }

  const basePrice = listing.pricing?.base_price || 0;
  const salePrice = listing.pricing?.sale_price || basePrice;
  const isOnSale = listing.pricing?.is_on_sale || salePrice < basePrice;
  const discountPercent =
    listing.pricing?.discount ||
    (isOnSale && basePrice > 0
      ? Math.round(((basePrice - salePrice) / basePrice) * 100).toString()
      : null);
  const rating = listing.item_specs?.condition_rating || 5;
  const starsArray = Array.from({ length: 5 }, (_, idx) => (idx < Math.floor(rating) ? '★' : '☆'));

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      setFormError('Please complete all required information fields.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const orderId = `CM-BARGAIN-${Math.floor(Math.random() * 900000 + 100000)}`;
    const inquiryMessage = [
      formNotes.trim(),
      `Quantity requested: ${formQuantity}`,
      `Unit price: $${salePrice.toLocaleString()}`,
    ]
      .filter(Boolean)
      .join('\n');

    const result = await submitClassifiedInquiry({
      slug,
      useFallback,
      storageKey: 'sellio_classifieds_modern_orders',
      fullName: formName,
      email: formEmail,
      phone: formPhone,
      message: inquiryMessage,
      offerPrice: String(salePrice * formQuantity),
      demoOrderData: {
        orderId,
        timestamp: new Date().toISOString(),
        listingId: listing.id,
        title: listing.title,
        slug: listing.slug,
        quantity: formQuantity,
        priceEach: salePrice,
        totalPrice: salePrice * formQuantity,
        buyer: {
          name: formName,
          email: formEmail,
          phone: formPhone,
          notes: formNotes,
        },
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    saveClassifiedInquirySnapshot({
      id: result.inquiryId,
      listingId: listing.id,
      listingTitle: listing.title,
      listingSlug: listing.slug,
      contactName: formName,
      contactEmail: formEmail,
      offerPrice: String(salePrice * formQuantity),
      message: inquiryMessage || undefined,
      status: 'pending',
    });
    redirectToClassifiedInquiryConfirmation(themeLink, result.inquiryId);
  };

  return (
    <div className="classifieds-modern-wrapper">
      <ModernHeader onPostClick={scrollToFeed} searchTerm="" onSearchChange={() => {}} />

      {(useFallback || apiError) && apiError && (
        <CatalogSyncAlert
          classPrefix="cm"
          variant={useFallback ? 'demo' : 'production'}
          error={apiError}
        />
      )}

      <main style={{ padding: '3rem 6%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#8892b0', marginBottom: '2.5rem', textTransform: 'capitalize' }}>
          <a href={themeLink('/')} style={{ color: 'inherit', textDecoration: 'none' }}>Catalog Home</a>
          <span>/</span>
          <span style={{ color: 'var(--cm-accent-cyan)' }}>{listing.taxonomy?.category || 'Bargains'}</span>
          <span>/</span>
          <span style={{ color: 'var(--cm-text-dark)' }}>{listing.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start', marginBottom: '5rem' }}>
          <div>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--cm-shadow-md)', border: '1.5px solid var(--cm-border)', position: 'relative', height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                style={{ position: 'absolute', top: '20px', right: '20px', width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#ffffff', border: 'none', boxShadow: 'var(--cm-shadow-md)', cursor: 'pointer', fontSize: '1.3rem', zIndex: 10 }}
              >
                {isFavorite ? '❤️' : '♡'}
              </button>
              <img
                src={activePhoto || listing.media?.main_photo || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600'}
                alt={listing.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {listing.media?.gallery && listing.media.gallery.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {listing.media.gallery.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhoto(photo.url)}
                    style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', border: activePhoto === photo.url ? '3px solid var(--cm-primary-orange)' : '1.5px solid var(--cm-border)', cursor: 'pointer', padding: 0 }}
                  >
                    <img src={photo.url} alt="thumbnail gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1.5px solid var(--cm-border)', boxShadow: 'var(--cm-shadow-md)' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: '1.25', margin: '0 0 1rem 0', color: 'var(--cm-text-dark)' }}>
              {listing.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ color: '#FFB300', fontSize: '1.1rem', display: 'flex', gap: '2px', fontWeight: 700 }}>
                {starsArray.join('')}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cm-text-muted)' }}>
                Condition: {listing.item_specs?.condition_label || 'Excellent'} ({rating}/5 Rating)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', padding: '1.25rem 0', borderTop: '1.5px solid var(--cm-border)', borderBottom: '1.5px solid var(--cm-border)', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--cm-primary-orange)' }}>
                ${salePrice.toLocaleString()}
              </span>
              {isOnSale && (
                <>
                  <span style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--cm-text-muted)', textDecoration: 'line-through' }}>
                    ${basePrice.toLocaleString()}
                  </span>
                  {discountPercent && (
                    <span style={{ backgroundColor: 'rgba(255, 103, 0, 0.1)', color: 'var(--cm-primary-orange)', fontSize: '0.8rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>
                      -{discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6' }}>
              {listing.description}
            </p>

            <button
              onClick={() => setDrawerOpen(true)}
              style={{ width: '100%', marginTop: '1.5rem', padding: '1.1rem', borderRadius: '50px', backgroundColor: 'var(--cm-primary-orange)', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
            >
              Secure This Bargain
            </button>

            {listing.seller && (
              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={listing.seller.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'}
                  alt={listing.seller.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--cm-text-dark)' }}>{listing.seller.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--cm-text-muted)' }}>Listed by seller</div>
                </div>
                <button
                  onClick={scrollToFeed}
                  style={{ marginLeft: 'auto', backgroundColor: 'transparent', border: '1.5px solid var(--cm-accent-cyan)', color: 'var(--cm-accent-cyan)', padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Message
                </button>
              </div>
            )}
          </div>
        </div>

        {relatedListings.length > 0 && (
          <section id="cm-feed" style={{ borderTop: '1.5px solid var(--cm-border)', paddingTop: '4rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--cm-text-dark)', marginBottom: '2rem' }}>
              Related Bargains
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {relatedListings.map((item) => (
                <a key={item.id} href={themeLink(`/product/${item.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <ModernCard
                    title={item.title}
                    price={item.pricing?.formatted_short || item.pricing?.formatted || `$${item.pricing?.sale_price || item.pricing?.base_price}`}
                    location={`${item.location?.city || ''}, ${item.location?.state || ''}`}
                    time={item.status?.is_new_listing ? 'Just Now' : '1d ago'}
                    image={item.media?.thumbnail || item.media?.main_photo || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400'}
                    isFeatured={item.status?.is_featured}
                    isRecent={item.status?.is_new_listing}
                    isSale={item.pricing?.is_on_sale}
                    isFavorite={false}
                    onToggleFavorite={() => {}}
                    onShare={() => {}}
                    onQuickView={() => {}}
                  />
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(33, 37, 41, 0.65)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'flex-end', zIndex: 4000 }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '480px', height: '100%', boxShadow: '-10px 0 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '2rem', borderBottom: '1.5px solid var(--cm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--cm-text-dark)', margin: 0 }}>Secure This Bargain</h3>
              <button onClick={() => { setDrawerOpen(false); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 800, color: 'var(--cm-text-muted)' }}>
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {formError && <p className="cm-form-error" role="alert">{formError}</p>}
                  <input type="text" required placeholder="Full Name" value={formName} onChange={(e) => setFormName(e.target.value)} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem' }} />
                  <input type="email" required placeholder="Email Address" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem' }} />
                  <input type="tel" required placeholder="Phone Number" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem' }} />
                  <select value={formQuantity} onChange={(e) => setFormQuantity(Number(e.target.value))} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem', backgroundColor: '#ffffff' }}>
                    {Array.from({ length: Math.min(listing.item_specs?.quantity || 1, 10) }, (_, i) => i + 1).map((qty) => (
                      <option key={qty} value={qty}>{qty} Unit{qty > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <textarea rows={4} placeholder="Inquiry notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1.5px solid var(--cm-border)', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit' }} />
                  <button type="submit" style={{ padding: '1.1rem', borderRadius: '50px', backgroundColor: 'var(--cm-primary-orange)', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}>
                    Submit Booking Request
                  </button>
                </form>
            </div>
          </div>
        </div>
      )}

      <ModernFooter />
    </div>
  );
}
