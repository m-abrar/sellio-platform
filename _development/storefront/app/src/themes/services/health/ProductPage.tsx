'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';
import { getServiceTaxonomyLabel } from './components';

interface ProductPageProps {
  slug: string;
}

interface HealthLead {
  id: string;
  serviceId: number;
  serviceTitle: string;
  contactName: string;
  contactInfo: string;
  symptoms: string;
  created_at: string;
}

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='640' viewBox='0 0 900 640'><rect width='100%' height='100%' fill='%23f8fafc'/><rect x='90' y='95' width='720' height='450' rx='20' fill='%23ffffff' stroke='%23e2e8f0'/><g transform='translate(405,260)' stroke='%230d9488' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'><path d='M0 74V18h90v56'/><path d='M18 18V0h54v18'/><path d='M0 74h90'/></g><text x='50%' y='62%' dominant-baseline='middle' text-anchor='middle' font-family='Outfit, Arial, sans-serif' font-size='15' font-weight='700' letter-spacing='2' fill='%2364748b'>PRACTITIONER</text></svg>";

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
  const [leadForm, setLeadForm] = useState({ contactName: '', contactInfo: '', symptoms: '' });
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
        console.error('Failed to load services health detail:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The practitioner record could not be synchronized.');
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
      item.pricing?.base_price ? `$${Number(item.pricing.base_price).toLocaleString()}` : 'Consultation fee on request'
    )
  );

  const getLocationLabel = (item: ServiceListing) => (
    [item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ') || 'Clinic / Telehealth'
  );

  const handleLeadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!service) return;

    const newLead: HealthLead = {
      id: `health_lead_${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      symptoms: leadForm.symptoms,
      created_at: new Date().toISOString(),
    };

    try {
      const stored = JSON.parse(localStorage.getItem('sellio_services_health_leads') || '[]') as HealthLead[];
      stored.push(newLead);
      localStorage.setItem('sellio_services_health_leads', JSON.stringify(stored));
      setLeadSaved(true);
      setLeadForm({ contactName: '', contactInfo: '', symptoms: '' });
    } catch (error) {
      console.error('Failed to persist health consultation lead:', error);
    }
  };

  if (loading) {
    return (
      <main className="sh-detail-page" aria-busy="true">
        <div className="sh-detail-back-skeleton" />
        <section className="sh-detail-grid">
          <div className="sh-detail-media sh-detail-skeleton" />
          <div className="sh-detail-panel">
            <div className="sh-detail-line sh-detail-line-small" />
            <div className="sh-detail-line sh-detail-line-title" />
            <div className="sh-detail-line sh-detail-line-price" />
            <div className="sh-detail-line" />
            <div className="sh-detail-line sh-detail-line-short" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !service) {
    return (
      <main className="sh-detail-page">
        <section className="sh-detail-state" role="status">
          <div className="sh-detail-kicker">Practitioner Unavailable</div>
          <h1>Record could not be loaded.</h1>
          <p>{errorMessage || 'The requested practitioner does not exist or has been removed.'}</p>
          <a href={getThemeLink('')} className="sh-btn-primary">Return to Registry</a>
        </section>
      </main>
    );
  }

  return (
    <main className="sh-detail-page">
      <a href={getThemeLink('')} className="sh-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Practitioner Registry
      </a>

      <section className="sh-detail-grid" aria-labelledby="sh-detail-title">
        <div className="sh-detail-media">
          <img src={getServiceImage(service)} alt={service.title} />
        </div>

        <article className="sh-detail-panel">
          <div className="sh-detail-kicker">
            {getServiceTaxonomyLabel(service.professional?.category, 'Healthcare Specialist')}
          </div>
          <h1 id="sh-detail-title">{service.title}</h1>
          <div className="sh-detail-price">{getServicePrice(service)}</div>

          <p className="sh-detail-description">
            {service.description || service.short_description || 'This live practitioner profile is synchronized from the Sellio services catalog.'}
          </p>

          <div className="sh-detail-specs" aria-label="Practitioner metadata">
            <div>
              <span>Availability</span>
              <strong>{service.operations?.is_open ? 'Accepting patients' : 'By appointment'}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{getLocationLabel(service)}</strong>
            </div>
            <div>
              <span>Specialist</span>
              <strong>
                {service.provider?.name ||
                  getServiceTaxonomyLabel(service.professional?.type, 'Licensed Practitioner')}
              </strong>
            </div>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="sh-detail-features">
              {service.features.slice(0, 4).map((feature) => (
                <span key={feature.id}>{feature.title}</span>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="sh-detail-lead" aria-labelledby="sh-lead-title">
        <div>
          <div className="sh-detail-kicker">Book Consultation</div>
          <h2 id="sh-lead-title">Schedule a wellness consultation.</h2>
          <p>Share your contact details and reason for visit. This records the inquiry locally for the preview flow.</p>
        </div>

        <form onSubmit={handleLeadSubmit}>
          {leadSaved && (
            <div className="sh-detail-success" role="status">
              Consultation request saved.
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
            Reason for Visit
            <textarea
              rows={5}
              value={leadForm.symptoms}
              onChange={(event) => setLeadForm({ ...leadForm, symptoms: event.target.value })}
            />
          </label>
          <button className="sh-btn-primary" type="submit">Request Consultation</button>
        </form>
      </section>
    </main>
  );
}
