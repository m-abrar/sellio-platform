'use client';

import React, { useEffect, useState } from 'react';
import type { ServiceListing } from '@sellio/types';
import { getServiceTaxonomyLabel } from './components';
import { CatalogSyncAlert } from '@/themes/services/shared/CatalogSyncAlert';
import { fetchServiceDetail, resolveServiceFailure } from '@/themes/services/shared/catalog';
import {
  getServiceImage,
  getServiceLocationLabel,
  getServicePriceLabel,
} from '@/themes/services/shared/service-utils';
import { useDemoFallbackAllowed } from '@/themes/services/shared/useDemoFallbackAllowed';
import { submitServiceConsultation } from '@/themes/services/shared/submit-service-consultation';
import {
  saveServiceConsultationSnapshot,
  redirectToServiceConsultationConfirmation,
} from '@/themes/services/shared/service-consultation-confirmation';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

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

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useServicesThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [service, setService] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [leadForm, setLeadForm] = useState({ contactName: '', contactInfo: '', symptoms: '' });
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
        const errorMsg = result.ok ? 'Practitioner not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveServiceFailure(slug, allowDemo, 'health');

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
      storageKey: 'sellio_services_health_leads',
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      requirements: leadForm.symptoms,
      topic: `Health consultation: ${service.title}`,
      demoRecord: {
        id: `health_lead_${Date.now()}`,
        serviceId: service.id,
        serviceTitle: service.title,
        contactName: leadForm.contactName,
        contactInfo: leadForm.contactInfo,
        symptoms: leadForm.symptoms,
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
      requirements: leadForm.symptoms,
      topic: `Health consultation: ${service.title}`,
      status: 'pending',
      demo: useFallback,
    });

    redirectToServiceConsultationConfirmation(themeLink, result.consultationId);
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

  if (notFound || !service) {
    return (
      <main className="sh-detail-page">
        <section className="sh-detail-state" role="status">
          <div className="sh-detail-kicker">Practitioner Unavailable</div>
          <h1>Record could not be loaded.</h1>
          <p>{apiError || 'The requested practitioner does not exist or has been removed.'}</p>
          <a href={themeLink('/')} className="sh-btn-primary">Return to Registry</a>
        </section>
      </main>
    );
  }

  return (
    <main className="sh-detail-page">
      <a href={themeLink('/')} className="sh-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Practitioner Registry
      </a>

      {apiError && useFallback && (
        <div className="sh-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="sh" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="sh-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="sh" />
        </div>
      )}

      <section className="sh-detail-grid" aria-labelledby="sh-detail-title">
        <div className="sh-detail-media">
          <img src={service.media?.main_photo || service.provider?.avatar || getServiceImage(service)} alt={service.title} />
        </div>

        <article className="sh-detail-panel">
          <div className="sh-detail-kicker">
            {getServiceTaxonomyLabel(service.professional?.category, 'Healthcare Specialist')}
          </div>
          <h1 id="sh-detail-title">{service.title}</h1>
          <div className="sh-detail-price">{getServicePriceLabel(service)}</div>

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
              <strong>{getServiceLocationLabel(service)}</strong>
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
          {formError && <p className="sh-form-error" role="alert">{formError}</p>}
          <button className="sh-btn-primary" type="submit">Request Consultation</button>
        </form>
      </section>
    </main>
  );
}
