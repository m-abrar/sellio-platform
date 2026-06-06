'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

interface CreativeLead {
  id: string;
  serviceId: number;
  serviceTitle: string;
  contactName: string;
  contactInfo: string;
  brief: string;
  created_at: string;
}

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='640' viewBox='0 0 900 640'><rect width='100%' height='100%' fill='%23f8f9fa'/><rect x='90' y='95' width='720' height='450' rx='20' fill='%23ffffff' stroke='%23dee2e6'/><g transform='translate(405,260)' stroke='%23ff69b4' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'><path d='M0 74V18h90v56'/><path d='M18 18V0h54v18'/><path d='M0 74h90'/></g><text x='50%' y='62%' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat, Arial, sans-serif' font-size='15' font-weight='700' letter-spacing='2' fill='%23666666'>CREATIVE RECORD</text></svg>";

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
  const [leadForm, setLeadForm] = useState({ contactName: '', contactInfo: '', brief: '' });
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
        console.error('Failed to load services creative detail:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The creative profile could not be synchronized.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadService();
    return () => { isMounted = false; };
  }, [slug]);

  const getServiceImage = (item: ServiceListing) => (
    item.media?.main_photo || item.media?.gallery?.[0]?.url || item.provider?.avatar || placeholderImage
  );

  const getServicePrice = (item: ServiceListing) => (
    item.pricing?.formatted || item.pricing?.formatted_short || (
      item.pricing?.base_price ? `$${Number(item.pricing.base_price).toLocaleString()}/hr` : 'Request quote'
    )
  );

  const getLocationLabel = (item: ServiceListing) => (
    [item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ') || 'Remote / On-site'
  );

  const handleLeadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!service) return;

    const newLead: CreativeLead = {
      id: `creative_lead_${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      brief: leadForm.brief,
      created_at: new Date().toISOString(),
    };

    try {
      const stored = JSON.parse(localStorage.getItem('sellio_services_creative_leads') || '[]') as CreativeLead[];
      stored.push(newLead);
      localStorage.setItem('sellio_services_creative_leads', JSON.stringify(stored));
      setLeadSaved(true);
      setLeadForm({ contactName: '', contactInfo: '', brief: '' });
    } catch (error) {
      console.error('Failed to persist creative lead:', error);
    }
  };

  if (loading) {
    return (
      <main className="crtv-detail-page" aria-busy="true">
        <div className="crtv-detail-back-skeleton" />
        <section className="crtv-detail-grid">
          <div className="crtv-detail-media crtv-detail-skeleton" />
          <div className="crtv-detail-panel">
            <div className="crtv-detail-line crtv-detail-line-small" />
            <div className="crtv-detail-line crtv-detail-line-title" />
            <div className="crtv-detail-line crtv-detail-line-price" />
            <div className="crtv-detail-line" />
            <div className="crtv-detail-line crtv-detail-line-short" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !service) {
    return (
      <main className="crtv-detail-page">
        <section className="crtv-detail-state" role="status">
          <div className="crtv-detail-kicker">Creative Unavailable</div>
          <h1>Profile could not be loaded.</h1>
          <p>{errorMessage || 'The requested creative does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="crtv-btn crtv-btn-gradient">Return to Creatives</a>
        </section>
      </main>
    );
  }

  return (
    <main className="crtv-detail-page">
      <a href={getThemeLink('')} className="crtv-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Creatives
      </a>

      <section className="crtv-detail-grid" aria-labelledby="crtv-detail-title">
        <div className="crtv-detail-media">
          <img src={getServiceImage(service)} alt={service.title} />
        </div>

        <article className="crtv-detail-panel">
          <div className="crtv-detail-kicker">{service.professional?.category || 'Creative Professional'}</div>
          <h1 id="crtv-detail-title">{service.title}</h1>
          <div className="crtv-detail-price">{getServicePrice(service)}</div>

          <p className="crtv-detail-description">
            {service.description || service.short_description || 'This live creative profile is synchronized from the Sellio services catalog.'}
          </p>

          <div className="crtv-detail-specs" aria-label="Creative metadata">
            <div>
              <span>Availability</span>
              <strong>{service.operations?.is_open ? 'Open now' : 'By appointment'}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{getLocationLabel(service)}</strong>
            </div>
            <div>
              <span>Provider</span>
              <strong>{service.provider?.name || service.professional?.type || 'Creative Studio'}</strong>
            </div>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="crtv-detail-features">
              {service.features.slice(0, 4).map((feature) => (
                <span key={feature.id}>{feature.title}</span>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="crtv-detail-lead" aria-labelledby="crtv-lead-title">
        <div>
          <div className="crtv-detail-kicker">Project Brief</div>
          <h2 id="crtv-lead-title">Start a creative collaboration.</h2>
          <p>Share your project details and contact info. This records the inquiry locally for the preview flow.</p>
        </div>

        <form onSubmit={handleLeadSubmit}>
          {leadSaved && (
            <div className="crtv-detail-success" role="status">
              Project brief saved.
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
            Project Brief
            <textarea
              rows={5}
              value={leadForm.brief}
              onChange={(event) => setLeadForm({ ...leadForm, brief: event.target.value })}
            />
          </label>
          <button className="crtv-btn crtv-btn-gradient" type="submit">Send Brief</button>
        </form>
      </section>
    </main>
  );
}
