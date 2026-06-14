'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClassifiedListing } from '@sellio/types';
import { DealsHeader, DealCard, DealsFooter, CountdownTimer } from './components';
import { CatalogSyncAlert } from '@/themes/classifieds/shared/CatalogSyncAlert';
import {
  fetchClassifiedDetail,
  fetchClassifiedsHome,
  getRelatedFromApi,
  resolveClassifiedFailure,
} from '@/themes/classifieds/shared/catalog';
import { submitClassifiedInquiry } from '@/themes/classifieds/shared/submit-inquiry';
import { useClassifiedsThemeLink } from '@/themes/classifieds/shared/useClassifiedsThemeLink';
import { useDemoFallbackAllowed } from '@/themes/classifieds/shared/useDemoFallbackAllowed';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const router = useRouter();
  const themeLink = useClassifiedsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [deal, setDeal] = useState<ClassifiedListing | null>(null);
  const [related, setRelated] = useState<ClassifiedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Inquiry Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [buyerNotes, setBuyerNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    async function loadDeal() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchClassifiedDetail(slug);

      if (result.ok && result.response.data) {
        setDeal(result.response.data);
        setActivePhoto(result.response.data.media?.main_photo || '');
        setRelated(
          getRelatedFromApi(
            result.response.data,
            result.response.related_classifieds,
            slug,
            undefined,
          ),
        );
        setUseFallback(false);
        setApiError(null);

        if (!result.response.related_classifieds?.length) {
          const listResult = await fetchClassifiedsHome({ limit: 4 });
          if (listResult.ok && listResult.response.data) {
            setRelated(
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
        const resolution = resolveClassifiedFailure(slug, allowDemo, 'deals');

        if (resolution.mode === 'demo') {
          setDeal(resolution.listing);
          setActivePhoto(resolution.listing.media?.main_photo || '');
          setRelated(resolution.related);
          setUseFallback(true);
        } else if (resolution.mode === 'notFound') {
          setDeal(null);
          setNotFound(true);
          setUseFallback(false);
        } else {
          setDeal(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    if (slug) {
      loadDeal();
    }
  }, [slug, allowDemo]);

  const scrollToInquiryForm = () => {
    document.getElementById('cd-deal-inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSnagDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || quantity <= 0) {
      setFormError('Please complete all required checkout inquiry fields.');
      return;
    }

    setFormError(null);

    if (!deal) return;

    const priceEach = deal.pricing?.sale_price || deal.pricing?.base_price || 0;
    const orderId = `DEAL-${Math.floor(Math.random() * 900000 + 100000)}`;
    const inquiryMessage = [
      buyerNotes.trim(),
      `Quantity: ${quantity}`,
      `Price each: $${priceEach.toLocaleString()}`,
    ]
      .filter(Boolean)
      .join('\n');

    setIsSubmitting(true);

    const result = await submitClassifiedInquiry({
      slug,
      useFallback,
      storageKey: 'sellio_classifieds_deals_orders',
      fullName,
      email,
      phone,
      message: inquiryMessage,
      offerPrice: String(priceEach * quantity),
      demoOrderData: {
        orderId,
        timestamp: new Date().toISOString(),
        dealId: deal.id,
        dealTitle: deal.title,
        dealSlug: deal.slug,
        quantity,
        priceEach,
        totalPrice: priceEach * quantity,
        buyer: {
          fullName,
          email,
          phone,
          notes: buyerNotes,
        },
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setFormSubmitted(true);
  };

  if (loading) {
    return (
      <div style={{ background: '#111827', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--cd-font)', color: '#ffffff' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cd-primary-red)' }}>LOCKING IN PROVENANCE...</h2>
        <div style={{ width: '120px', height: '4px', background: 'var(--cd-primary-red)', marginTop: '1.5rem', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: '50px', height: '100%', backgroundColor: 'var(--cd-secondary-yellow)', animation: 'cdShimmer 1.5s infinite linear' }} />
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cdShimmer {
            0% { left: -50px; }
            100% { left: 120px; }
          }
        `}} />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="classifieds-deals-wrapper">
        <DealsHeader onSearch={() => {}} onSelectCategory={() => router.push(themeLink('/'))} selectedCategory="all" />
        {(useFallback || apiError) && apiError && (
          <CatalogSyncAlert classPrefix="cd" variant={useFallback ? 'demo' : 'production'} error={apiError} />
        )}
        <div style={{ background: '#111827', minHeight: '50vh', padding: '6rem 2rem', textAlign: 'center', color: '#ffffff', fontFamily: 'var(--cd-font)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--cd-primary-red)', marginBottom: '1.5rem' }}>
            {notFound ? 'BARGAIN NOT FOUND' : 'UNABLE TO LOAD BARGAIN'}
          </h2>
          <p style={{ color: 'var(--cd-text-muted)', marginBottom: '3rem' }}>
            {notFound
              ? 'The requested bargain listing is either expired or offline.'
              : 'Check the API connection or refresh the page.'}
          </p>
          <a href={themeLink('/')} className="cd-btn-post" style={{ textDecoration: 'none' }}>Return to Listings</a>
        </div>
        <DealsFooter />
      </div>
    );
  }

  const discountVal = deal.pricing?.discount || (deal.pricing?.base_price && deal.pricing?.sale_price 
    ? Math.round(((deal.pricing.base_price - deal.pricing.sale_price) / deal.pricing.base_price) * 100).toString() 
    : '0');

  // Star ratings builder
  const ratingStars = [];
  const ratingVal = deal.item_specs?.condition_rating || 5;
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(ratingVal)) {
      ratingStars.push('★');
    } else {
      ratingStars.push('☆');
    }
  }

  const galleryPhotos = deal.media?.gallery || [];
  const hasPhotos = galleryPhotos.length > 0;

  return (
    <div className="classifieds-deals-wrapper">
      <DealsHeader 
        onSearch={() => {}} 
        onSelectCategory={(cat) => {
          if (cat === 'all') {
            router.push(themeLink('/'));
          } else {
            router.push(themeLink(`/?cat=${cat}`));
          }
        }} 
        selectedCategory="all" 
      />

      {(useFallback || apiError) && apiError && (
        <CatalogSyncAlert
          classPrefix="cd"
          variant={useFallback ? 'demo' : 'production'}
          error={apiError}
        />
      )}

      {/* Main Single Page Content */}
      <main style={{ padding: '0 5%', marginTop: '2rem' }}>
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--cd-text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          <a href={themeLink('/')} style={{ color: 'inherit', textDecoration: 'none' }}>Feed</a>
          <span>&gt;</span>
          <span style={{ color: 'var(--cd-primary-red)', textTransform: 'capitalize' }}>{deal.taxonomy?.category || 'Bargains'}</span>
          <span>&gt;</span>
          <span style={{ color: 'var(--cd-text-main)' }}>{deal.title}</span>
        </div>

        {/* Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(320px, 400px)', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Details block */}
          <div style={{ backgroundColor: 'var(--cd-bg-card)', borderRadius: '16px', border: '1px solid var(--cd-border)', padding: '2.5rem', boxShadow: 'var(--cd-shadow-sm)' }}>
            
            {/* Title & Badges Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ display: 'inline-block', backgroundColor: 'var(--cd-primary-red)', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {deal.taxonomy?.brand || 'Premium Deal'}
                </span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: '1.2', color: 'var(--cd-dark-slate)', margin: '0 0 0.5rem 0' }}>{deal.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--cd-secondary-yellow)', fontWeight: 700, fontSize: '1.2rem', display: 'flex', gap: '2px' }}>
                    {ratingStars.join('')}
                    <span style={{ color: 'var(--cd-text-muted)', fontSize: '0.85rem', fontWeight: 600, marginLeft: '6px' }}>({deal.item_specs?.condition_rating || 5} Rating)</span>
                  </div>
                  <span style={{ color: 'var(--cd-text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>🏷️ {deal.taxonomy?.category}</span>
                </div>
              </div>

              {/* Discount Tag */}
              <div style={{ backgroundColor: 'var(--cd-secondary-yellow)', color: 'var(--cd-dark-slate)', padding: '10px 20px', borderRadius: '8px', textAlign: 'center', boxShadow: 'var(--cd-shadow-sm)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>FLASH DISC</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--cd-primary-red)', lineHeight: '1' }}>-{discountVal}%</div>
              </div>
            </div>

            {/* Media Gallery */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{
                height: '420px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--cd-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img src={activePhoto} alt={deal.title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                  ⚡ HIGH-VELOCITY IMAGE PREVIEW
                </div>
              </div>

              {/* Thumbnails */}
              {hasPhotos && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  <div 
                    onClick={() => setActivePhoto(deal.media?.main_photo || '')}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      border: activePhoto === deal.media?.main_photo ? '3px solid var(--cd-primary-red)' : '1px solid var(--cd-border)',
                      padding: '4px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img src={deal.media?.main_photo || ''} alt="main thumbnail" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  {galleryPhotos.map((photo, i) => (
                    <div 
                      key={photo.id || i}
                      onClick={() => setActivePhoto(photo.url)}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        border: activePhoto === photo.url ? '3px solid var(--cd-primary-red)' : '1px solid var(--cd-border)',
                        padding: '4px',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img src={photo.url} alt={`gallery thumbnail ${i}`} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Overview */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cd-dark-slate)', borderBottom: '2px solid var(--cd-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>BARGAIN DESCRIPTION</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--cd-text-main)', whiteSpace: 'pre-line' }}>{deal.description}</p>
            </div>

            {/* Premium Item Specifications Grid */}
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cd-dark-slate)', borderBottom: '2px solid var(--cd-border)', paddingBottom: '0.5rem', marginBottom: '1.2rem' }}>
                ITEM SPECIFICATIONS
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                
                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', borderLeft: '4px solid var(--cd-primary-red)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Condition Rating</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cd-dark-slate)', marginTop: '2px' }}>
                    {deal.item_specs?.condition_label || 'Pristine'} ({deal.item_specs?.condition_rating || 5}/5)
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', borderLeft: '4px solid var(--cd-secondary-yellow)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Item Age</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cd-dark-slate)', marginTop: '2px' }}>
                    {deal.item_specs?.age_years ? `${deal.item_specs.age_years} Year(s) old` : 'Almost Brand New'}
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', borderLeft: '4px solid var(--cd-dark-slate)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Quantity Available</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cd-dark-slate)', marginTop: '2px' }}>
                    {deal.item_specs?.quantity || 1} Unit(s) In Stock
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Warranty Status</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cd-dark-slate)', marginTop: '2px' }}>
                    {deal.item_specs?.warranty || 'No Warranty'}
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--cd-bg-main)', borderRadius: '8px', gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Dimensions / Specs</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--cd-dark-slate)', marginTop: '4px' }}>
                    {deal.item_specs?.dimensions || 'Standard retail dimensions apply.'}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Checkout & Seller Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Flash Buy/Reservation Card */}
            <div style={{ backgroundColor: '#111827', color: '#ffffff', borderRadius: '16px', padding: '2rem', border: '2px solid var(--cd-primary-red)', boxShadow: 'var(--cd-shadow-md)' }} id="cd-deal-inquiry">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--cd-secondary-yellow)', textTransform: 'uppercase' }}>Flash Price Drop</div>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff' }}>
                    ${deal.pricing?.sale_price || deal.pricing?.base_price}
                  </span>
                </div>
                <div style={{ textDecoration: 'line-through', color: 'var(--cd-text-muted)', fontSize: '1.2rem', fontWeight: 700 }}>
                  ${deal.pricing?.base_price}
                </div>
              </div>

              {/* Countdown */}
              <div style={{ backgroundColor: '#1e293b', border: '1px solid rgba(231,29,54,0.3)', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2rem' }}>
                <span style={{ color: 'var(--cd-secondary-yellow)' }}>⚡ EXPIRES SOON:</span>
                <span style={{ color: '#ffffff', fontFamily: 'monospace', letterSpacing: '1px' }}>
                  <CountdownTimer hours={4} seconds={33} />
                </span>
              </div>

              {/* "Snag This Deal" Checkout Form */}
              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--cd-secondary-yellow)', marginBottom: '0.5rem' }}>DEAL RESERVED!</h3>
                  <p style={{ fontSize: '0.85rem', color: '#e5e7eb', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    Your flash reservation has been locked in locally! The order has been written to the LocalStorage checkout registry under <code>sellio_classifieds_deals_orders</code>.
                  </p>
                  <button onClick={() => setFormSubmitted(false)} className="cd-search-btn" style={{ width: '100%', borderRadius: '8px' }}>
                    Resnag This Deal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSnagDealSubmit}>
                  {formError && <div className="cd-form-error">{formError}</div>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="e.g. john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="e.g. +1 555 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: '80px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Qty *</label>
                        <input 
                          type="number" 
                          required 
                          min={1} 
                          max={deal.item_specs?.quantity || 5}
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          style={{ width: '100%', padding: '0.65rem 0.5rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', textAlign: 'center', outline: 'none' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase' }}>Subtotal</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--cd-secondary-yellow)', marginTop: '4px' }}>
                          ${((deal.pricing?.sale_price || deal.pricing?.base_price || 0) * quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Inquiry Notes</label>
                      <textarea 
                        placeholder="Any special notes for delivery or negotiation..."
                        rows={2}
                        value={buyerNotes}
                        onChange={(e) => setBuyerNotes(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
                      />
                    </div>

                  </div>

                  <button type="submit" className="cd-btn-post" style={{ width: '100%', padding: '1rem', borderRadius: '8px', fontSize: '1rem', justifyContent: 'center', boxShadow: '0 8px 24px rgba(231, 29, 54, 0.4)' }}>
                    Snag This Deal ⚡
                  </button>
                </form>
              )}

            </div>

            {/* Seller profile card */}
            <div style={{ backgroundColor: 'var(--cd-bg-card)', border: '1px solid var(--cd-border)', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--cd-shadow-sm)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--cd-text-muted)', textTransform: 'uppercase', borderBottom: '2px solid var(--cd-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                Seller Information
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--cd-bg-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: 'var(--cd-text-muted)',
                  border: '2px solid var(--cd-border)'
                }}>
                  {deal.seller?.name?.charAt(0) || '👤'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--cd-dark-slate)' }}>
                    {deal.seller?.name || 'Verified DealDash Seller'}
                  </h4>
                  <div style={{ color: 'var(--cd-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
                    ★ Premium Verified Merchant
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`cd-btn-follow ${isFollowing ? 'cd-following' : ''}`}
                  style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  {isFollowing ? '✓ Following Seller' : 'Follow Seller'}
                </button>
                <button 
                  onClick={scrollToInquiryForm}
                  style={{
                    flex: 1,
                    padding: '0.6rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    backgroundColor: 'var(--cd-dark-slate)',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'var(--cd-transition)'
                  }}
                >
                  Message
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Suggestion drawer / Related Deals carousel */}
        {related.length > 0 && (
          <section className="cd-section" style={{ marginTop: '4rem' }}>
            <div className="cd-section-header">
              <div className="cd-section-title-wrap">
                <span style={{ fontSize: '1.5rem' }}>🔥</span>
                <h2 className="cd-section-title">RELATED BARGAINS</h2>
              </div>
              <span style={{ color: 'var(--cd-primary-red)', fontWeight: 800, fontSize: '0.85rem' }}>CUSTOM COMPONENT DRAWER</span>
            </div>

            <div className="cd-deals-grid">
              {related.map((item, idx) => {
                const disc = item.pricing?.discount || (item.pricing?.base_price && item.pricing?.sale_price 
                  ? Math.round(((item.pricing.base_price - item.pricing.sale_price) / item.pricing.base_price) * 100).toString() 
                  : '0');
                
                return (
                  <a key={idx} href={themeLink(`/product/${item.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <DealCard
                      title={item.title}
                      currentPrice={item.pricing?.formatted || `$${item.pricing?.sale_price || item.pricing?.base_price}`}
                      originalPrice={`$${item.pricing?.base_price}`}
                      discount={disc}
                      image={item.media?.main_photo || ''}
                      seller={item.seller?.name || 'DealDash'}
                      isTopSeller={true}
                      category={item.taxonomy?.category || 'all'}
                      slug={item.slug}
                      isHotBargain={Number(disc) >= 42}
                    />
                  </a>
                );
              })}
            </div>
          </section>
        )}

      </main>

      <DealsFooter />
    </div>
  );
}
