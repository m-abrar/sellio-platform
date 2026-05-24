'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

interface MarketplaceLead {
  id: string;
  serviceId: number;
  serviceTitle: string;
  contactName: string;
  contactInfo: string;
  serviceDate: string;
  requirements: string;
  created_at: string;
}

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='640' viewBox='0 0 900 640'><rect width='100%' height='100%' fill='%23f8f9fa'/><rect x='90' y='95' width='720' height='450' rx='16' fill='%23ffffff' stroke='%23dee2e6'/><g transform='translate(405,260)' stroke='%23198754' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'><path d='M45 74V18h90v56'/><path d='M63 18V0h54v18'/><path d='M45 74h90'/></g><text x='50%' y='62%' dominant-baseline='middle' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='15' font-weight='700' letter-spacing='2' fill='%23666666'>SERVICE PROVIDER</text></svg>";

function getThemeLink(path: string) {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/preview/')) {
    const themeKey = window.location.pathname.split('/')[2];
    return `/preview/${themeKey}${path}`;
  }
  return path || '/';
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [service, setService] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({
    contactName: '',
    contactInfo: '',
    serviceDate: '',
    requirements: '',
  });
  const [leadSaved, setLeadSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadService() {
      try {
        const fetchedService = await api.getServiceBySlug(slug);
        if (!isMounted) return;
        setService(fetchedService);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (!isMounted) return;
        console.error('Failed to load services marketplace detail:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The service provider could not be synchronized.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadService();
    return () => { isMounted = false; };
  }, [slug]);

  const getServiceImage = (item: ServiceListing) => (
    item.media?.main_photo || item.media?.gallery?.[0]?.url || placeholderImage
  );

  const getServicePrice = (item: ServiceListing) => (
    item.pricing?.formatted || item.pricing?.formatted_short || (
      item.pricing?.base_price ? `$${Number(item.pricing.base_price).toLocaleString()}` : 'Get estimate'
    )
  );

  const getLocationLabel = (item: ServiceListing) => (
    [item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ') || 'Available nationwide'
  );

  const handleLeadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!service) return;

    const newLead: MarketplaceLead = {
      id: `sm_lead_${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      serviceDate: leadForm.serviceDate,
      requirements: leadForm.requirements,
      created_at: new Date().toISOString(),
    };

    try {
      const stored = JSON.parse(localStorage.getItem('sellio_services_marketplace_leads') || '[]') as MarketplaceLead[];
      stored.push(newLead);
      localStorage.setItem('sellio_services_marketplace_leads', JSON.stringify(stored));
      setLeadSaved(true);
      setLeadForm({ contactName: '', contactInfo: '', serviceDate: '', requirements: '' });
    } catch (error) {
      console.error('Failed to persist marketplace service lead:', error);
    }
  };

  if (loading) {
    return (
      <main className="sm-detail-page" aria-busy="true">
        <div className="sm-detail-back-skeleton" />
        <section className="sm-detail-grid">
          <div className="sm-detail-media sm-detail-skeleton" />
          <div className="sm-detail-panel">
            <div className="sm-detail-line sm-detail-line-small" />
            <div className="sm-detail-line sm-detail-line-title" />
            <div className="sm-detail-line sm-detail-line-price" />
            <div className="sm-detail-line" />
            <div className="sm-detail-line sm-detail-line-short" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !service) {
    return (
      <main className="sm-detail-page">
        <section className="sm-detail-state" role="status">
          <div className="sm-detail-kicker">Provider Unavailable</div>
          <h1>Service provider could not be loaded.</h1>
          <p>{errorMessage || 'The requested provider does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="sm-btn sm-btn-primary">Return to Marketplace</a>
        </section>
      </main>
    );
  }

  return (
    <main className="sm-detail-page">
      <a href={getThemeLink('')} className="sm-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to ServiceConnect
      </a>

      <section className="sm-detail-grid" aria-labelledby="sm-detail-title">
        <div className="sm-detail-media">
          <img src={getServiceImage(service)} alt={service.title} />
          {service.status?.is_featured && <div className="sm-detail-badge">TOP PRO</div>}
        </div>

        <article className="sm-detail-panel">
          <div className="sm-detail-kicker">{service.professional?.category || 'Professional Service'}</div>
          <h1 id="sm-detail-title">{service.title}</h1>
          <div className="sm-detail-price">
            {getServicePrice(service)}
            {service.pricing?.billing_type && (
              <span className="sm-detail-price-unit">
                {service.pricing.billing_type.is_project_based ? ' / project' : ' / hr'}
              </span>
            )}
          </div>

          <p className="sm-detail-description">
            {service.description || service.short_description || 'This live service provider profile is synchronized from the Sellio services catalog.'}
          </p>

          <div className="sm-detail-specs" aria-label="Provider metadata">
            <div>
              <span>Availability</span>
              <strong>{service.operations?.is_open ? 'Open now' : 'By appointment'}</strong>
            </div>
            <div>
              <span>Service Area</span>
              <strong>{getLocationLabel(service)}</strong>
            </div>
            <div>
              <span>Provider</span>
              <strong>{service.provider?.name || service.professional?.type || 'Verified Pro'}</strong>
            </div>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="sm-detail-features">
              {service.features.slice(0, 4).map((feature) => (
                <span key={feature.id}>{feature.title}</span>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="sm-detail-lead" aria-labelledby="sm-lead-title">
        <div>
          <div className="sm-detail-kicker">Hire This Provider</div>
          <h2 id="sm-lead-title">Request a booking or quote.</h2>
          <p>Enter your contact details and preferred service date. This records the request locally for the preview flow.</p>
        </div>

        <form onSubmit={handleLeadSubmit}>
          {leadSaved && (
            <div className="sm-detail-success" role="status">
              Booking request saved.
            </div>
          )}
          <label>
            Full Name
            <input
              required
              type="text"
              value={leadForm.contactName}
              onChange={(event) => setLeadForm({ ...leadForm, contactName: event.target.value })}
            />
          </label>
          <label>
            Phone or Email
            <input
              required
              type="text"
              value={leadForm.contactInfo}
              onChange={(event) => setLeadForm({ ...leadForm, contactInfo: event.target.value })}
            />
          </label>
          <label>
            Preferred Service Date
            <input
              required
              type="date"
              value={leadForm.serviceDate}
              onChange={(event) => setLeadForm({ ...leadForm, serviceDate: event.target.value })}
            />
          </label>
          <label>
            Requirements
            <textarea
              rows={4}
              value={leadForm.requirements}
              onChange={(event) => setLeadForm({ ...leadForm, requirements: event.target.value })}
            />
          </label>
          <button className="sm-btn sm-btn-primary" type="submit">Send Booking Request</button>
        </form>
      </section>
    </main>
  );
}
