'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MarketplaceHeader, 
  SmCategoryCard, 
  SmProviderCard, 
  MarketplaceFooter,
  SmCategorySkeleton,
  SmProviderSkeleton
} from './components';
import { api } from '@sellio/api-client';
import type { ServiceListing, Category, Location } from '@sellio/types';
import { DynamicTestimonials } from '@/components/testimonials/DynamicTestimonials';

const FALLBACK_CATEGORIES = [
  { id: 1, title: "Home Repair", slug: "home-repair", icon: "🛠️" },
  { id: 2, title: "Design", slug: "design", icon: "🎨" },
  { id: 3, title: "Education", slug: "education", icon: "🎓" },
  { id: 4, title: "Health", slug: "health", icon: "❤️" },
  { id: 5, title: "Events", slug: "events", icon: "📅" },
  { id: 6, title: "Tech Support", slug: "tech-support", icon: "💻" }
];

const FALLBACK_PROVIDERS: any[] = [
  { 
    id: 991, 
    title: "Anna J.", 
    professional: { category: "Professional Designer" }, 
    status: { is_featured: true }, 
    media: { main_photo: "/themes/services/marketplace/15.webp" },
    pricing: { base_price: 75, billing_type: { is_project_based: false } }
  },
  { 
    id: 992, 
    title: "Mark T.", 
    professional: { category: "24/7 Plumber Expert" }, 
    status: { is_featured: true }, 
    media: { main_photo: "/themes/services/marketplace/16.webp" },
    pricing: { base_price: 120, billing_type: { is_project_based: false } }
  },
  { 
    id: 993, 
    title: "Ben L.", 
    professional: { category: "Advanced Math Tutor" }, 
    status: { is_featured: true }, 
    media: { main_photo: "/themes/services/marketplace/17.webp" },
    pricing: { base_price: 50, billing_type: { is_project_based: false } }
  },
  { 
    id: 994, 
    title: "Laura S.", 
    professional: { category: "Certified Electrician" }, 
    status: { is_featured: true }, 
    media: { main_photo: "/themes/services/marketplace/18.webp" },
    pricing: { base_price: 90, billing_type: { is_project_based: false } }
  }
];

export default function Page() {
  // Dynamic collections
  const [services, setServices] = useState<ServiceListing[] | null>(null);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [locationsList, setLocationsList] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch data
  const fetchServicesData = useCallback(async (isSearchClick = false) => {
    try {
      setLoading(true);
      setError(null);

      // Map active UI filter selections to API search params
      const params: Record<string, any> = {
        per_page: 8
      };

      if (searchQuery.trim() !== '') {
        params.search = searchQuery.trim();
      }
      if (selectedCategory !== '') {
        params.category = selectedCategory;
      }
      if (selectedLocation !== '') {
        params.location = selectedLocation;
      }
      if (priceRange !== '') {
        params.price_range = priceRange;
      }
      if (selectedRating !== '') {
        params.rating = selectedRating;
      }

      const response = await api.getServices(params);

      if (response && response.data) {
        setServices(response.data);
      } else {
        setServices([]);
      }

      // Populate filters sidebar metadata dynamically from the first API client return
      if (response && response.sidebar) {
        if (response.sidebar.categories && response.sidebar.categories.length > 0) {
          setCategoriesList(response.sidebar.categories);
        }
        if (response.sidebar.locations && response.sidebar.locations.length > 0) {
          setLocationsList(response.sidebar.locations);
        }
      }
    } catch (err: any) {
      console.error("Failed to load live services backend, loading offline resilience backups:", err);
      setError(err.message || 'Service backend database node is currently offline.');
      // Load fallback mockups for resilient failover
      setServices(FALLBACK_PROVIDERS);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedLocation, priceRange, selectedRating]);

  // Initial load
  useEffect(() => {
    fetchServicesData();
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
    fetchServicesData();
  }, [selectedCategory]);

  // Submit booking
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingService) return;

    try {
      const newBooking = {
        id: `book_${Date.now()}`,
        serviceId: bookingService.id,
        serviceTitle: bookingService.title,
        serviceProvider: bookingService.professional?.category || 'Professional Provider',
        candidateName: bookingForm.candidateName,
        serviceDate: bookingForm.serviceDate,
        requirements: bookingForm.requirements,
        contactInfo: bookingForm.contactInfo,
        created_at: new Date().toISOString()
      };

      // Read, append, and save state to LocalStorage
      const storedBookingsJson = localStorage.getItem('sellio_services_marketplace_bookings');
      const currentBookings = storedBookingsJson ? JSON.parse(storedBookingsJson) : [];
      currentBookings.push(newBooking);
      localStorage.setItem('sellio_services_marketplace_bookings', JSON.stringify(currentBookings));

      setBookingSuccess(true);
      setBookingForm({
        candidateName: '',
        serviceDate: '',
        requirements: '',
        contactInfo: ''
      });

      // Clear success and close modal after brief delay
      setTimeout(() => {
        setBookingService(null);
        setBookingSuccess(false);
      }, 2500);

    } catch (err) {
      console.error("Failed to record local storage booking details:", err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="services-marketplace-theme">
      <MarketplaceHeader />

      {/* Hero Section */}
      <section className="sm-hero" id="sm-hero-section" aria-labelledby="sm-hero-title">
        <div className="sm-hero-content">
          <h1 id="sm-hero-title">Find Trusted Services Near You</h1>
          <p>Connecting you with skilled professionals, fast and reliably.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '3rem' }}>
            <button 
              className="sm-btn sm-btn-primary"
              onClick={() => document.getElementById('sm-categories-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Services
            </button>
            <button 
              className="sm-btn sm-btn-secondary"
              onClick={() => alert('Becoming a provider flow starting...')}
            >
              Become a Provider
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sm-filter-bar" aria-label="Search Filter Bar">
        <input 
          type="search" 
          placeholder="Search for services..." 
          className="sm-filter-input" 
          aria-label="Service Search Input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchServicesData(true);
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
          {categoriesList.length > 0 ? (
            categoriesList.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.title}</option>
            ))
          ) : (
            FALLBACK_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.title}</option>
            ))
          )}
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
          onClick={() => fetchServicesData(true)}
        >
          Search
        </button>
      </section>

      {/* Connection Diagnostics Recovery Notification */}
      {error && (
        <div style={{ padding: '0 5%' }}>
          <div className="sm-offline-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <div style={{ fontWeight: 800, letterSpacing: '0.5px', color: '#dc2626' }}>
                DATABASE_OFFLINE_DIAGNOSTICS_TRACE
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.6, color: '#4b5563' }}>
              STATUS: [OFFLINE] | LATENCY: [TIMEOUT] | REASON: [{error}]
              <br/>
              ACTION: Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <section className="sm-section" id="sm-categories-section" aria-labelledby="sm-categories-title" style={{ paddingTop: '2rem' }}>
        <h2 className="sm-section-title" id="sm-categories-title">Popular Categories</h2>
        <div className="sm-category-grid">
          {loading && categoriesList.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SmCategorySkeleton key={i} />
            ))
          ) : (
            categoriesList.length > 0 ? (
              categoriesList.map((c) => {
                // Find matching emoji for fallback
                const fallbackMatch = FALLBACK_CATEGORIES.find(f => f.slug === c.slug || c.title.toLowerCase().includes(f.title.toLowerCase()));
                const icon = fallbackMatch ? fallbackMatch.icon : "💼";
                return (
                  <SmCategoryCard 
                    key={c.id} 
                    title={c.title} 
                    icon={icon} 
                    onClick={() => handleCategoryBadgeClick(c.slug)}
                    active={selectedCategory === c.slug}
                  />
                );
              })
            ) : (
              FALLBACK_CATEGORIES.map((c) => (
                <SmCategoryCard 
                  key={c.id} 
                  title={c.title} 
                  icon={c.icon} 
                  onClick={() => handleCategoryBadgeClick(c.slug)}
                  active={selectedCategory === c.slug}
                />
              ))
            )
          )}
        </div>
      </section>

      {/* Providers */}
      <section className="sm-section" id="sm-providers-section" aria-labelledby="sm-providers-title">
        <h2 className="sm-section-title" id="sm-providers-title">Top Rated Professionals</h2>
        
        {loading ? (
          <div className="sm-provider-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <SmProviderSkeleton key={i} />
            ))}
          </div>
        ) : (
          services && services.length > 0 ? (
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
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid var(--sm-border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No Providers Found</h4>
              <p style={{ color: 'var(--sm-text-muted)', fontSize: '0.95rem' }}>
                We couldn't find any professionals matching your exact criteria. Try resetting filters.
              </p>
              <button 
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
          )
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
                        Category: {bookingService.professional?.category || 'Professional Service'}
                      </div>
                    </div>

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
                  <button type="submit" className="sm-btn sm-btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
                    Confirm Booking
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* How It Works */}
      <section className="sm-section" id="sm-how-it-works" aria-labelledby="sm-how-title">
        <h2 className="sm-section-title" id="sm-how-title">How It Works</h2>
        <div className="sm-step-grid">
            <div className="sm-step-card">
                <div className="sm-step-icon">🔍</div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.25rem' }}>1. Search Services</h4>
                <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.6 }}>Easily search through thousands of verified local professionals.</p>
            </div>
            <div className="sm-step-arrow" style={{ fontSize: '2.5rem', color: 'var(--sm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➔</div>
            <div className="sm-step-card">
                <div className="sm-step-icon">👥</div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.25rem' }}>2. Compare Options</h4>
                <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.6 }}>Read reviews, compare prices, and check provider portfolios.</p>
            </div>
            <div className="sm-step-arrow" style={{ fontSize: '2.5rem', color: 'var(--sm-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➔</div>
            <div className="sm-step-card">
                <div className="sm-step-icon">🔒</div>
                <h4 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: '1.25rem' }}>3. Hire Securely</h4>
                <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.6 }}>Book and pay securely through our trusted platform.</p>
            </div>
        </div>
      </section>

      <DynamicTestimonials
        title="What Our Clients Say"
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
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready to Hire or Offer Services?</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '3.5rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Join our growing community today and connect with thousands of users.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="sm-btn sm-btn-primary" onClick={() => document.getElementById('sm-categories-section')?.scrollIntoView({ behavior: 'smooth' })}>Find Services</button>
            <button className="sm-btn sm-btn-secondary" onClick={() => alert('Provider signup wizard opened.')}>Offer Your Services</button>
        </div>
      </section>

      <MarketplaceFooter />
    </div>
  );
}
