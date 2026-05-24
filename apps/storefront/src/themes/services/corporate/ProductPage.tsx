'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { ServiceListing } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

interface ServiceLead {
  id: string;
  serviceId: number;
  serviceTitle: string;
  contactName: string;
  contactInfo: string;
  requirements: string;
  created_at: string;
}

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='640' viewBox='0 0 900 640'><rect width='100%' height='100%' fill='%23f8f9fa'/><rect x='90' y='95' width='720' height='450' rx='20' fill='%23ffffff' stroke='%23eeeeee'/><g transform='translate(405,260)' stroke='%23007bff' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'><path d='M0 74V18h90v56'/><path d='M18 18V0h54v18'/><path d='M0 74h90'/></g><text x='50%' y='62%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='15' font-weight='700' letter-spacing='2' fill='%23666666'>SERVICE RECORD</text></svg>";

export default function ProductPage({ slug }: ProductPageProps) {
  const [service, setService] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({
    contactName: '',
    contactInfo: '',
    requirements: ''
  });
  const [leadSaved, setLeadSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadService() {
      try {
        const fetchedService = await api.getServiceBySlug(slug);
        if (!isMounted) {
          return;
        }

        setService(fetchedService);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load services corporate detail:', error);
        setErrorMessage(error instanceof Error ? error.message : 'The service record could not be synchronized.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadService();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const getServiceImage = (item: ServiceListing) => (
    item.media?.main_photo || item.media?.gallery?.[0]?.url || placeholderImage
  );

  const getServicePrice = (item: ServiceListing) => (
    item.pricing?.formatted || item.pricing?.formatted_short || (
      item.pricing?.base_price ? `$${Number(item.pricing.base_price).toLocaleString()}` : 'Request quote'
    )
  );

  const getLocationLabel = (item: ServiceListing) => (
    [item.location?.city, item.location?.state, item.location?.country].filter(Boolean).join(', ') || 'Remote / On-site'
  );

  const handleLeadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!service) {
      return;
    }

    const newLead: ServiceLead = {
      id: `service_lead_${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      requirements: leadForm.requirements,
      created_at: new Date().toISOString()
    };

    try {
      const storedLeads = JSON.parse(localStorage.getItem('sellio_services_corporate_leads') || '[]') as ServiceLead[];
      storedLeads.push(newLead);
      localStorage.setItem('sellio_services_corporate_leads', JSON.stringify(storedLeads));
      setLeadSaved(true);
      setLeadForm({ contactName: '', contactInfo: '', requirements: '' });
    } catch (error) {
      console.error('Failed to persist services corporate lead:', error);
    }
  };

  if (loading) {
    return (
      <main className="sc-detail-page" aria-busy="true">
        <div className="sc-detail-back-skeleton" />
        <section className="sc-detail-grid">
          <div className="sc-detail-media sc-detail-skeleton" />
          <div className="sc-detail-panel">
            <div className="sc-detail-line sc-detail-line-small" />
            <div className="sc-detail-line sc-detail-line-title" />
            <div className="sc-detail-line sc-detail-line-price" />
            <div className="sc-detail-line" />
            <div className="sc-detail-line sc-detail-line-short" />
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage || !service) {
    return (
      <main className="sc-detail-page">
        <section className="sc-detail-state" role="status">
          <div className="sc-service-kicker">Service Unavailable</div>
          <h1>Service could not be loaded.</h1>
          <p>{errorMessage || 'The requested service does not exist or has been removed.'}</p>
          <a href="/preview/services_corporate" className="sc-btn sc-btn-primary">Return to Services</a>
        </section>
      </main>
    );
  }

  return (
    <main className="sc-detail-page">
      <a href="/preview/services_corporate" className="sc-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Services
      </a>

      <section className="sc-detail-grid" aria-labelledby="sc-detail-title">
        <div className="sc-detail-media">
          <img src={getServiceImage(service)} alt={service.title} />
        </div>

        <article className="sc-detail-panel">
          <div className="sc-service-kicker">{service.professional?.category || 'Corporate Service'}</div>
          <h1 id="sc-detail-title">{service.title}</h1>
          <div className="sc-detail-price">{getServicePrice(service)}</div>

          <p className="sc-detail-description">
            {service.description || service.short_description || 'This live service record is synchronized from the Sellio service catalog and ready for client inquiries.'}
          </p>

          <div className="sc-detail-specs" aria-label="Service metadata">
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
              <strong>{service.provider?.name || service.professional?.type || 'Corporate Team'}</strong>
            </div>
          </div>

          {service.features && service.features.length > 0 && (
            <div className="sc-detail-features">
              {service.features.slice(0, 4).map((feature) => (
                <span key={feature.id}>{feature.title}</span>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="sc-detail-lead" aria-labelledby="sc-lead-title">
        <div>
          <div className="sc-service-kicker">Consultation Request</div>
          <h2 id="sc-lead-title">Start a conversation with our advisory team.</h2>
          <p>Send your contact details and requirements. This records the inquiry locally for the preview flow.</p>
        </div>

        <form onSubmit={handleLeadSubmit}>
          {leadSaved && (
            <div className="sc-detail-success" role="status">
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
            Requirements
            <textarea
              rows={5}
              value={leadForm.requirements}
              onChange={(event) => setLeadForm({ ...leadForm, requirements: event.target.value })}
            />
          </label>
          <button className="sc-btn sc-btn-primary" type="submit">Request Consultation</button>
        </form>
      </section>
    </main>
  );
}
