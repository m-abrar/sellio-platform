'use client';

import React, { useEffect, useState } from 'react';
import type { ServiceListing } from '@/types';
import { CatalogSyncAlert } from '@/themes/services/shared/CatalogSyncAlert';
import { fetchServiceDetail, resolveServiceFailure } from '@/themes/services/shared/catalog';
import {
  getServiceCategoryLabel,
  getServiceImage,
  getServiceLocationLabel,
  getServicePriceLabel,
  getServiceProviderLabel,
} from '@/themes/services/shared/service-utils';
import { useDemoFallbackAllowed } from '@/themes/services/shared/useDemoFallbackAllowed';
import { submitServiceConsultation } from '@/themes/services/shared/submit-service-consultation';
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';
import {
  saveServiceConsultationSnapshot,
  redirectToServiceConsultationConfirmation,
} from '@/themes/services/shared/service-consultation-confirmation';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

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

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useServicesThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [service, setService] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [leadForm, setLeadForm] = useState({ contactName: '', contactInfo: '', address: '', notes: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadService() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchServiceDetail(slug);

      if (!isMounted) return;

      if (result.ok && result.service) {
        setService(result.service);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'Service not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveServiceFailure(slug, allowDemo, 'local');

        if (resolution.mode === 'demo') {
          setService(resolution.service);
          setUseFallback(true);
        } else if (resolution.mode === 'notFound') {
          setService(null);
          setNotFound(true);
          setUseFallback(false);
        } else {
          setService(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadService();
    return () => { isMounted = false; };
  }, [slug, allowDemo]);

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!service || !leadForm.contactName || !leadForm.contactInfo || !leadForm.address) {
      setFormError('Please enter your name, contact details, and service address.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const result = await submitServiceConsultation({
      serviceId: service.id,
      useFallback,
      storageKey: 'sellio_services_local_leads',
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      requirements: [leadForm.address, leadForm.notes].filter(Boolean).join('\n'),
      topic: `Local service request: ${service.title}`,
      demoRecord: {
        id: `local_lead_${Date.now()}`,
        serviceId: service.id,
        serviceTitle: service.title,
        contactName: leadForm.contactName,
        contactInfo: leadForm.contactInfo,
        address: leadForm.address,
        notes: leadForm.notes,
        created_at: new Date().toISOString(),
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    saveServiceConsultationSnapshot({
      id: result.consultationId,
      serviceId: service.id,
      serviceTitle: service.title,
      serviceSlug: service.slug,
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      requirements: [leadForm.address, leadForm.notes].filter(Boolean).join('\n'),
      topic: `Local service request: ${service.title}`,
      status: 'pending',
      demo: useFallback,
    });

    redirectToServiceConsultationConfirmation(themeLink, result.consultationId);
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

  if (notFound || !service) {
    return (
      <main className="local-detail-page">
        <section className="local-detail-state" role="status">
          <div className="local-detail-kicker">Service Unavailable</div>
          <h1>Service could not be loaded.</h1>
          <p>{apiError || 'The requested local service does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="local-btn local-btn-primary">Return to Services</a>
        </section>
      </main>
    );
  }

  return (
    <main className="local-detail-page">
      <a href={themeLink('/')} className="local-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Local Services
      </a>

      {apiError && useFallback && (
        <div className="local-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="local" />
        </div>
      )}

      <section className="local-detail-grid" aria-labelledby="local-detail-title">
        <div className="local-detail-media">
          <img src={getServiceImage(service)} alt={service.title} />
        </div>

        <article className="local-detail-panel">
          <div className="local-detail-kicker">{getServiceCategoryLabel(service.professional?.category, 'Local Service')}</div>
          <h1 id="local-detail-title">{service.title}</h1>
          <div className="local-detail-price">{getServicePriceLabel(service)}</div>

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
              <strong>{getServiceLocationLabel(service)}</strong>
            </div>
            <div>
              <span>Provider</span>
              <strong>{getServiceProviderLabel(service, 'Local Pro')}</strong>
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
          {formError && <p className="local-form-error" role="alert">{formError}</p>}
          <button className="local-btn local-btn-primary" type="submit">Request Service</button>
        </form>

        <div className="sl-chat-section">
          <p className="sl-chat-section-label">Have questions?</p>
          <LiveChatWidget vertical="services" listingId={service.id} listingTitle={service.title} />
        </div>
      </section>
    </main>
  );
}
