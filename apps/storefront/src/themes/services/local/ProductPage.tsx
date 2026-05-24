'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

interface LocalLead {
  id: string;
  serviceId: number;
  serviceTitle: string;
  contactName: string;
  contactInfo: string;
  address: string;
  notes: string;
  created_at: string;
}

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='640' viewBox='0 0 900 640'><rect width='100%' height='100%' fill='%23f8f9fa'/><rect x='90' y='95' width='720' height='450' rx='16' fill='%23ffffff' stroke='%23dee2e6'/><g transform='translate(405,260)' stroke='%23198754' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'><path d='M45 74V18h90v56'/><path d='M63 18V0h54v18'/><path d='M45 74h90'/></g><text x='50%' y='62%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='15' font-weight='700' letter-spacing='2' fill='%23666666'>LOCAL SERVICE</text></svg>";

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
  const [leadForm, setLeadForm] = useState({ contactName: '', contactInfo: '', address: '', notes: '' });
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
        console.error('Failed to load services local detail:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The local service could not be synchronized.');
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
    [item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ') || 'Your neighborhood'
  );

  const handleLeadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!service) return;

    const newLead: LocalLead = {
      id: `local_lead_${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      address: leadForm.address,
      notes: leadForm.notes,
      created_at: new Date().toISOString(),
    };

    try {
      const stored = JSON.parse(localStorage.getItem('sellio_services_local_leads') || '[]') as LocalLead[];
      stored.push(newLead);
      localStorage.setItem('sellio_services_local_leads', JSON.stringify(stored));
      setLeadSaved(true);
      setLeadForm({ contactName: '', contactInfo: '', address: '', notes: '' });
    } catch (error) {
      console.error('Failed to persist local service lead:', error);
    }
  };

  if (loading) {
    return (
      <main className="local-detail-page" aria-busy="true">
        <div className="local-detail-back-skeleton" />
        <section className="local-detail-grid">
          <div className="local-detail-media local-detail-skeleton" />
          <div className="local-detail-panel">
            <div className="local-detail-line local-detail-line-small" />
            <div className="local-detail-line local-detail-line-title" />
            <div className="local-detail-line local-detail-line-price" />
            <div className="local-detail-line" />
            <div className="local-detail-line local-detail-line-short" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !service) {
    return (
      <main className="local-detail-page">
        <section className="local-detail-state" role="status">
          <div className="local-detail-kicker">Service Unavailable</div>
          <h1>Service could not be loaded.</h1>
          <p>{errorMessage || 'The requested local service does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="local-btn local-btn-primary">Return to Services</a>
        </section>
      </main>
    );
  }

  return (
    <main className="local-detail-page">
      <a href={getThemeLink('')} className="local-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Local Services
      </a>

      <section className="local-detail-grid" aria-labelledby="local-detail-title">
        <div className="local-detail-media">
          <img src={getServiceImage(service)} alt={service.title} />
        </div>

        <article className="local-detail-panel">
          <div className="local-detail-kicker">{service.professional?.category || 'Local Service'}</div>
          <h1 id="local-detail-title">{service.title}</h1>
          <div className="local-detail-price">{getServicePrice(service)}</div>

          <p className="local-detail-description">
            {service.description || service.short_description || 'This live local service is synchronized from the Sellio services catalog.'}
          </p>

          <div className="local-detail-specs" aria-label="Service metadata">
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
              <strong>{service.provider?.name || service.professional?.type || 'Local Pro'}</strong>
            </div>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="local-detail-features">
              {service.features.slice(0, 4).map((feature) => (
                <span key={feature.id}>{feature.title}</span>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="local-detail-lead" aria-labelledby="local-lead-title">
        <div>
          <div className="local-detail-kicker">Book Local Service</div>
          <h2 id="local-lead-title">Request a visit or quote.</h2>
          <p>Enter your contact details and service address. This records the request locally for the preview flow.</p>
        </div>

        <form onSubmit={handleLeadSubmit}>
          {leadSaved && (
            <div className="local-detail-success" role="status">
              Service request saved.
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
            Service Address
            <input
              required
              type="text"
              value={leadForm.address}
              onChange={(event) => setLeadForm({ ...leadForm, address: event.target.value })}
            />
          </label>
          <label>
            Notes
            <textarea
              rows={4}
              value={leadForm.notes}
              onChange={(event) => setLeadForm({ ...leadForm, notes: event.target.value })}
            />
          </label>
          <button className="local-btn local-btn-primary" type="submit">Request Service</button>
        </form>
      </section>
    </main>
  );
}
