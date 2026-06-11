'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MarketplaceHeader, 
  SmCategoryCard, 
  SmProviderCard, 
  MarketplaceFooter,
  SmCategorySkeleton,
  SmProviderSkeleton,
} from './components';
import type { ServiceListing, Category, Location } from '@sellio/types';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/services/shared/CatalogSyncAlert';
import { fetchServicesHome, resolveServicesFailure } from '@/themes/services/shared/catalog';
import {
  getCategoryIcon,
  MARKETPLACE_FALLBACK_CATEGORIES,
} from '@/themes/services/shared/fallback-data';
import { getServiceCategoryLabel } from '@/themes/services/shared/service-utils';
import { useDemoFallbackAllowed } from '@/themes/services/shared/useDemoFallbackAllowed';
import { parseServiceContactInfo } from '@/themes/services/shared/service-utils';
import { api } from '@/lib/storefront-api';

export default function Page() {
  const heroTitle = useThemeContent('hero.title', 'Find Trusted Services Near You');
  const heroDescription = useThemeContent('hero.description', 'Connecting you with skilled professionals, fast and reliably.');
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Browse Services');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'Become a Provider');
  const searchPlaceholder = useThemeContent('search.placeholder', 'Search for services...');
  const categoriesTitle = useThemeContent('categories.title', 'Popular Categories');
  const providersTitle = useThemeContent('providers.title', 'Top Rated Professionals');
  const howTitle = useThemeContent('how_it_works.title', 'How It Works');
  const stepOneTitle = useThemeContent('how_it_works.step_1_title', '1. Search Services');
  const stepOneDescription = useThemeContent('how_it_works.step_1_description', 'Easily search through thousands of verified local professionals.');
  const stepTwoTitle = useThemeContent('how_it_works.step_2_title', '2. Compare Options');
  const stepTwoDescription = useThemeContent('how_it_works.step_2_description', 'Read reviews, compare prices, and check provider portfolios.');
  const stepThreeTitle = useThemeContent('how_it_works.step_3_title', '3. Hire Securely');
  const stepThreeDescription = useThemeContent('how_it_works.step_3_description', 'Book and pay securely through our trusted platform.');
  const testimonialsTitle = useThemeContent('testimonials.title', 'What Our Clients Say');
  const ctaTitle = useThemeContent('cta.title', 'Ready to Hire or Offer Services?');
  const ctaDescription = useThemeContent('cta.description', 'Join our growing community today and connect with thousands of users.');
  const ctaPrimary = useThemeContent('cta.primary_cta_label', 'Find Services');
  const ctaSecondary = useThemeContent('cta.secondary_cta_label', 'Offer Your Services');
  const allowDemo = useDemoFallbackAllowed();
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [locationsList, setLocationsList] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  // Booking Modal Form state
  const [bookingService, setBookingService] = useState<ServiceListing | null>(null);
  const [bookingForm, setBookingForm] = useState({
    candidateName: '',
    serviceDate: '',
    requirements: '',
    contactInfo: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Fetch data
  const fetchServicesData = useCallback(async () => {
    setLoading(true);

    const params: Record<string, string | number> = { per_page: 8 };
    if (searchQuery.trim() !== '') params.search = searchQuery.trim();
    if (selectedCategory !== '') params.category = selectedCategory;
    if (selectedLocation !== '') params.location = selectedLocation;
    if (priceRange !== '') params.price_range = priceRange;
    if (selectedRating !== '') params.rating = selectedRating;

    const result = await fetchServicesHome(params);

    if (result.ok && result.response.data) {
      setServices(result.response.data);
      if (result.response.sidebar?.categories?.length) {
        setCategoriesList(result.response.sidebar.categories);
      }
      if (result.response.sidebar?.locations?.length) {
        setLocationsList(result.response.sidebar.locations);
      }
      setUseFallback(false);
      setApiError(null);
    } else {
      const errorMsg = result.ok ? 'No services returned from API.' : result.error;
      setApiError(errorMsg);
      const resolution = resolveServicesFailure(allowDemo, 'marketplace');

      if (resolution.mode === 'demo') {
        setServices(resolution.services);
        setUseFallback(true);
      } else {
        setServices([]);
        setUseFallback(false);
      }
    }

    setLoading(false);
  }, [searchQuery, selectedCategory, selectedLocation, priceRange, selectedRating, allowDemo]);

  // Initial load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServicesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle direct category badge clicks
  const handleCategoryBadgeClick = (categorySlug: string) => {
    const updatedCategory = selectedCategory === categorySlug ? '' : categorySlug;
    setSelectedCategory(updatedCategory);
    
    // Automatically trigger fetch with updated category selection
    setTimeout(() => {
      document.getElementById('sm-providers-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Re-run search query whenever selection categories change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchServicesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Submit booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingService || !bookingForm.candidateName || !bookingForm.contactInfo) {
      setBookingError('Please enter your name and contact details.');
      return;
    }

    setBookingError(null);

    if (useFallback) {
      try {
        const newBooking = {
          id: `book_${Date.now()}`,
          serviceId: bookingService.id,
          serviceTitle: bookingService.title,
          serviceProvider: getServiceCategoryLabel(
            bookingService.professional?.category,
            'Professional Provider',
          ),
          candidateName: bookingForm.candidateName,
          serviceDate: bookingForm.serviceDate,
          requirements: bookingForm.requirements,
          contactInfo: bookingForm.contactInfo,
          created_at: new Date().toISOString(),
        };

        const storedBookingsJson = localStorage.getItem('sellio_services_marketplace_bookings');
        const currentBookings = storedBookingsJson ? JSON.parse(storedBookingsJson) : [];
        currentBookings.push(newBooking);
        localStorage.setItem('sellio_services_marketplace_bookings', JSON.stringify(currentBookings));

        setBookingSuccess(true);
        setBookingForm({
          candidateName: '',
          serviceDate: '',
          requirements: '',
          contactInfo: '',
        });

        setTimeout(() => {
          setBookingService(null);
          setBookingSuccess(false);
        }, 2500);
      } catch (err) {
        console.error('Failed to record local storage booking details:', err);
        setBookingError('Booking failed. Please try again.');
      }
      return;
    }

    setBookingSubmitting(true);
    try {
      const contact = parseServiceContactInfo(bookingForm.candidateName, bookingForm.contactInfo);
      await api.createServiceConsultation(bookingService.id, {
        ...contact,
        preferred_date: bookingForm.serviceDate || undefined,
        requirements: bookingForm.requirements || undefined,
        topic: `Hire request: ${bookingService.title}`,
      });

      setBookingSuccess(true);
      setBookingForm({
        candidateName: '',
        serviceDate: '',
        requirements: '',
        contactInfo: '',
      });

      setTimeout(() => {
        setBookingService(null);
        setBookingSuccess(false);
      }, 2500);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setBookingError(axiosError.response?.data?.message ?? 'Booking failed. Please try again.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const categoryCards = useFallback
    ? MARKETPLACE_FALLBACK_CATEGORIES
    : categoriesList.map((category) => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
        icon: getCategoryIcon(category.slug, category.title),
      }));

  return (
    <div className="services-marketplace-theme">
      <MarketplaceHeader />

      {/* Hero Section */}
      <section className="sm-hero" id="sm-hero-section" aria-labelledby="sm-hero-title">
        <div className="sm-hero-content">
          <h1 id="sm-hero-title">{heroTitle}</h1>
          <p>{heroDescription}</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '3rem' }}>
            <button 
              className="sm-btn sm-btn-primary"
              onClick={() => document.getElementById('sm-categories-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {heroPrimaryCta}
            </button>
            <button
              type="button"
              className="sm-btn sm-btn-secondary"
              onClick={() => document.getElementById('sm-providers-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {heroSecondaryCta}
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sm-filter-bar" aria-label="Search Filter Bar">
        <input 
          type="search" 
          placeholder={searchPlaceholder} 
          className="sm-filter-input" 
          aria-label="Service Search Input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchServicesData();
            }
          }}
        />
        <select 
          className="sm-filter-select" 
          aria-label="Category Select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {(categoriesList.length > 0
            ? categoriesList
            : useFallback
              ? MARKETPLACE_FALLBACK_CATEGORIES.map((cat) => ({
                  id: cat.id,
                  title: cat.title,
                  slug: cat.slug,
                }))
              : []
          ).map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.title}</option>
          ))}
        </select>
        <select 
          className="sm-filter-select" 
          aria-label="Location Select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {locationsList.map(loc => (
            <option key={loc.id} value={loc.slug}>
              {loc.title} {loc.state ? `, ${loc.state}` : ''}
            </option>
          ))}
        </select>
        <select 
          className="sm-filter-select" 
          aria-label="Price Select"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="">Any Price</option>
          <option value="0-50">Under $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-250">$100 - $250</option>
          <option value="250-10000">Above $250</option>
        </select>
        <select 
          className="sm-filter-select" 
          aria-label="Rating Select"
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="4.5">★ 4.5 & up</option>
          <option value="4.8">★ 4.8 & up</option>
          <option value="5.0">★ 5.0 only</option>
        </select>
        <button 
          className="sm-btn sm-btn-primary" 
          style={{ flex: 1, minWidth: '150px' }} 
          onClick={() => fetchServicesData()}
        >
          Search
        </button>
      </section>

      {apiError && useFallback && (
        <div style={{ padding: '0 5%' }} className="sm-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="sm" />
        </div>
      )}
      {apiError && !useFallback && (
        <div style={{ padding: '0 5%' }} className="sm-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="sm" />
        </div>
      )}

      {/* Categories */}
      <section className="sm-section" id="sm-categories-section" aria-labelledby="sm-categories-title" style={{ paddingTop: '2rem' }}>
        <h2 className="sm-section-title" id="sm-categories-title">{categoriesTitle}</h2>
        <div className="sm-category-grid">
          {loading && categoryCards.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SmCategorySkeleton key={i} />
            ))
          ) : categoryCards.length > 0 ? (
            categoryCards.map((c) => (
              <SmCategoryCard
                key={c.id}
                title={c.title}
                icon={c.icon}
                onClick={() => handleCategoryBadgeClick(c.slug)}
                active={selectedCategory === c.slug}
              />
            ))
          ) : (
            <div className="sm-empty-state" role="status">
              <h3>No categories published yet.</h3>
              <p>Category filters will appear once services are synced from the backend.</p>
            </div>
          )}
        </div>
      </section>

      {/* Providers */}
      <section className="sm-section" id="sm-providers-section" aria-labelledby="sm-providers-title">
        <h2 className="sm-section-title" id="sm-providers-title">{providersTitle}</h2>
        
        {loading ? (
          <div className="sm-provider-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <SmProviderSkeleton key={i} />
            ))}
          </div>
        ) : services.length > 0 ? (
            <div className="sm-provider-grid">
              {services.map((p) => (
                <SmProviderCard 
                  key={p.id} 
                  service={p} 
                  onHire={(service) => setBookingService(service)}
                />
              ))}
            </div>
        ) : (
            <div className="sm-empty-state" role="status">
              <h4>No Providers Found</h4>
              <p>We couldn&apos;t find any professionals matching your exact criteria. Try resetting filters.</p>
              <button
                type="button"
                className="sm-btn sm-btn-primary"
                style={{ marginTop: '1.5rem' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedLocation('');
                  setPriceRange('');
                  setSelectedRating('');
                  setTimeout(() => fetchServicesData(), 50);
                }}
              >
                Reset All Filters
              </button>
            </div>
        )}
      </section>

      {/* Stateful Hiring Concierge Modal Dialog */}
      {bookingService && (
        <div className="sm-modal-backdrop" onClick={() => setBookingService(null)}>
          <div className="sm-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="sm-modal-header">
              <h4 className="sm-modal-title">Book Service Provider</h4>
              <button className="sm-modal-close" onClick={() => setBookingService(null)}>×</button>
            </div>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="sm-modal-body">
                {bookingSuccess ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ fontSize: '3.5rem', color: 'var(--sm-primary)', marginBottom: '1rem' }}>✓</div>
                    <h4 style={{ fontWeight: 800, color: 'var(--sm-primary)', marginBottom: '0.5rem' }}>Booking Request Sent!</h4>
                    <p style={{ color: 'var(--sm-text-muted)', fontSize: '0.9rem' }}>
                      Your service request for <strong>{bookingService.title}</strong> has been logged.
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: '1.5rem', background: 'var(--sm-primary-light)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--sm-primary)' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--sm-primary)' }}>
                        {bookingService.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--sm-text-muted)', marginTop: '0.25rem' }}>
                        Category: {getServiceCategoryLabel(bookingService.professional?.category)}
                      </div>
                    </div>

                    {bookingError && (
                      <p className="sm-form-error" role="alert">{bookingError}</p>
                    )}

                    <div className="sm-form-group">
                      <label className="sm-form-label" htmlFor="booking-name">Your Full Name</label>
                      <input 
                        type="text" 
                        id="booking-name" 
                        className="sm-form-input" 
                        required 
                        placeholder="e.g. John Doe"
                        value={bookingForm.candidateName}
                        onChange={(e) => setBookingForm({...bookingForm, candidateName: e.target.value})}
                      />
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label" htmlFor="booking-date">Preferred Service Date</label>
                      <input 
                        type="date" 
                        id="booking-date" 
                        className="sm-form-input" 
                        required
                        value={bookingForm.serviceDate}
                        onChange={(e) => setBookingForm({...bookingForm, serviceDate: e.target.value})}
                      />
                    </div>

                    <div className="sm-form-group">
                      <label className="sm-form-label" htmlFor="booking-contact">Contact Info (Phone or Email)</label>
                      <input 
                        type="text" 
                        id="booking-contact" 
                        className="sm-form-input" 
                        required 
                        placeholder="e.g. email@example.com"
                        value={bookingForm.contactInfo}
                        onChange={(e) => setBookingForm({...bookingForm, contactInfo: e.target.value})}
                      />
                    </div>

                    <div className="sm-form-group" style={{ marginBottom: 0 }}>
                      <label className="sm-form-label" htmlFor="booking-reqs">Specific Requirements</label>
                      <textarea 
                        id="booking-reqs" 
                        className="sm-form-textarea" 
                        rows={4} 
                        placeholder="Detail your requests or instructions..."
                        value={bookingForm.requirements}
                        onChange={(e) => setBookingForm({...bookingForm, requirements: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </div>

              {!bookingSuccess && (
                <div className="sm-modal-footer">
                  <button type="button" className="sm-btn sm-btn-secondary" style={{ padding: '0.6rem 1.4rem' }} onClick={() => setBookingService(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="sm-btn sm-btn-primary" style={{ padding: '0.6rem 1.4rem' }} disabled={bookingSubmitting}>
                    {bookingSubmitting ? 'Sending...' : 'Confirm Booking'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* How It Works */}
      <section className="sm-section" id="sm-how-it-works" aria-labelledby="sm-how-title">
        <h2 className="sm-section-title" id="sm-how-title">{howTitle}</h2>
        <div className="sm-step-grid">
            <div className="sm-step-card">
                <div className="sm-step-icon">🔍</div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.25rem' }}>{stepOneTitle}</h4>
                <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.6 }}>{stepOneDescription}</p>
            </div>
            <div className="sm-step-arrow" style={{ fontSize: '2.5rem', color: 'var(--sm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➔</div>
            <div className="sm-step-card">
                <div className="sm-step-icon">👥</div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.25rem' }}>{stepTwoTitle}</h4>
                <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.6 }}>{stepTwoDescription}</p>
            </div>
            <div className="sm-step-arrow" style={{ fontSize: '2.5rem', color: 'var(--sm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➔</div>
            <div className="sm-step-card">
                <div className="sm-step-icon">🔒</div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.25rem' }}>{stepThreeTitle}</h4>
                <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.6 }}>{stepThreeDescription}</p>
            </div>
        </div>
      </section>

      <DynamicTestimonials
        title={testimonialsTitle}
        limit={3}
        variant="centered"
        sectionId="sm-testimonials-section"
        sectionClassName="sm-section"
        sectionStyle={{ background: 'white' }}
        titleClassName="sm-section-title"
        layoutClassName="sm-testimonials-layout"
        cardClassName="sm-testimonial-card"
        headingId="sm-testimonials-title"
      />

      {/* CTA */}
      <section className="sm-cta-section">
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>{ctaTitle}</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '3.5rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            {ctaDescription}
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="sm-btn sm-btn-primary" onClick={() => document.getElementById('sm-categories-section')?.scrollIntoView({ behavior: 'smooth' })}>{ctaPrimary}</button>
            <button type="button" className="sm-btn sm-btn-secondary" onClick={() => document.getElementById('sm-providers-section')?.scrollIntoView({ behavior: 'smooth' })}>{ctaSecondary}</button>
        </div>
      </section>

      <MarketplaceFooter />
    </div>
  );
}
