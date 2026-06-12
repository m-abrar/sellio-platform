'use client';

import React, { useEffect, useState } from 'react';
import type { ServiceListing } from '@sellio/types';
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
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

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

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useServicesThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [service, setService] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [leadForm, setLeadForm] = useState({
    contactName: '',
    contactInfo: '',
    requirements: '',
  });
  const [leadSaved, setLeadSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchServiceDetail(slug);

      if (result.ok && result.service) {
        setService(result.service);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'Service not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveServiceFailure(slug, allowDemo, 'corporate');

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
  }, [slug, allowDemo]);

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!service || !leadForm.contactName || !leadForm.contactInfo) {
      setFormError('Please enter your name and contact details.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const result = await submitServiceConsultation({
      serviceId: service.id,
      useFallback,
      storageKey: 'sellio_services_corporate_leads',
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      requirements: leadForm.requirements,
      topic: `Consultation request: ${service.title}`,
      demoRecord: {
        id: `service_lead_${Date.now()}`,
        serviceId: service.id,
        serviceTitle: service.title,
        contactName: leadForm.contactName,
        contactInfo: leadForm.contactInfo,
        requirements: leadForm.requirements,
        created_at: new Date().toISOString(),
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setLeadSaved(true);
    setLeadForm({ contactName: '', contactInfo: '', requirements: '' });
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

  if (notFound || !service) {
    return (
      <main className="sc-detail-page">
        <section className="sc-detail-state" role="status">
          <div className="sc-service-kicker">Service Unavailable</div>
          <h1>Service could not be loaded.</h1>
          <p>{apiError || 'The requested service does not exist or has been removed.'}</p>
          <a href={themeLink('')} className="sc-btn sc-btn-primary">Return to Services</a>
        </section>
      </main>
    );
  }

  return (
    <main className="sc-detail-page">
      <a href={themeLink('')} className="sc-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Services
      </a>

      {apiError && useFallback && (
        <div className="sc-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="sc" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="sc-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="sc" />
        </div>
      )}

      <section className="sc-detail-grid" aria-labelledby="sc-detail-title">
        <div className="sc-detail-media">
          <img src={getServiceImage(service)} alt={service.title} />
        </div>

        <article className="sc-detail-panel">
          <div className="sc-service-kicker">{getServiceCategoryLabel(service.professional?.category, 'Corporate Service')}</div>
          <h1 id="sc-detail-title">{service.title}</h1>
          <div className="sc-detail-price">{getServicePriceLabel(service)}</div>

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
              <strong>{getServiceLocationLabel(service)}</strong>
            </div>
            <div>
              <span>Provider</span>
              <strong>{getServiceProviderLabel(service, 'Corporate Team')}</strong>
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
          {formError && <p className="sc-form-error" role="alert">{formError}</p>}
          <button className="sc-btn sc-btn-primary" type="submit">Request Consultation</button>
        </form>
      </section>
    </main>
  );
}
