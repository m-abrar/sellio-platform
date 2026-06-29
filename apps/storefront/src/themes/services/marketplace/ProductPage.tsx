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
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';
import { submitServiceConsultation } from '@/themes/services/shared/submit-service-consultation';
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';
import {
  redirectToServiceConsultationConfirmation,
  saveServiceConsultationSnapshot,
} from '@/themes/services/shared/service-consultation-confirmation';
import { MarketplaceHeader, MarketplaceFooter } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

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

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useServicesThemeLink();
  const brandLabel = useThemeContent('header.brand_label', 'ServiceConnect');
  const allowDemo = useDemoFallbackAllowed();
  const [service, setService] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [leadForm, setLeadForm] = useState({
    contactName: '',
    contactInfo: '',
    serviceDate: '',
    requirements: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
        const resolution = resolveServiceFailure(slug, allowDemo, 'marketplace');

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
    if (!service || !leadForm.contactName || !leadForm.contactInfo) {
      setFormError('Please enter your name and contact details.');
      return;
    }

    setFormError(null);

    setIsSubmitting(true);

    const result = await submitServiceConsultation({
      serviceId: service.id,
      useFallback,
      storageKey: 'sellio_services_marketplace_leads',
      contactName: leadForm.contactName,
      contactInfo: leadForm.contactInfo,
      preferredDate: leadForm.serviceDate,
      requirements: leadForm.requirements,
      topic: `Booking request: ${service.title}`,
      demoRecord: {
        id: `sm_lead_${Date.now()}`,
        serviceId: service.id,
        serviceTitle: service.title,
        contactName: leadForm.contactName,
        contactInfo: leadForm.contactInfo,
        serviceDate: leadForm.serviceDate,
        requirements: leadForm.requirements,
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
      preferredDate: leadForm.serviceDate,
      requirements: leadForm.requirements,
      topic: `Booking request: ${service.title}`,
      status: 'pending',
      demo: useFallback,
    });

    redirectToServiceConsultationConfirmation(themeLink, result.consultationId);
  };

  if (loading) {
    return (
      <>
        <MarketplaceHeader />
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
        <MarketplaceFooter />
      </>
    );
  }

  if (notFound || !service) {
    return (
      <>
        <MarketplaceHeader />
        <main className="sm-detail-page">
          <section className="sm-detail-state" role="status">
            <div className="sm-detail-kicker">Provider Unavailable</div>
            <h1>Service provider could not be loaded.</h1>
            <p>{apiError || 'The requested provider does not exist or has been removed.'}</p>
            <a href={themeLink('/')} className="sm-btn sm-btn-primary">Return to Marketplace</a>
          </section>
        </main>
        <MarketplaceFooter />
      </>
    );
  }

  return (
    <>
      <MarketplaceHeader />
      <main className="sm-detail-page">
      <a href={themeLink('/')} className="sm-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to {brandLabel}
      </a>

      {apiError && useFallback && (
        <div className="sm-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="sm" />
        </div>
      )}

      <section className="sm-detail-grid" aria-labelledby="sm-detail-title">
        <div className="sm-detail-media">
          <img src={getServiceImage(service)} alt={service.title} />
          {service.status?.is_featured && <div className="sm-detail-badge">TOP PRO</div>}
        </div>

        <article className="sm-detail-panel">
          <div className="sm-detail-kicker">{getServiceCategoryLabel(service.professional?.category)}</div>
          <h1 id="sm-detail-title">{service.title}</h1>
          <div className="sm-detail-price">
            {getServicePriceLabel(service)}
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
              <strong>{getServiceLocationLabel(service)}</strong>
            </div>
            <div>
              <span>Provider</span>
              <strong>{getServiceProviderLabel(service)}</strong>
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
          <p>Enter your contact details and preferred service date. {useFallback ? 'Demo mode saves requests locally.' : 'Your request is sent directly to the provider.'}</p>
        </div>

        <form onSubmit={handleLeadSubmit}>
          {formError && (
            <p className="sm-form-error" role="alert">{formError}</p>
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
          <button className="sm-btn sm-btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Booking Request'}
          </button>
        </form>

        <div className="sl-chat-section">
          <p className="sl-chat-section-label">Have questions?</p>
          <LiveChatWidget vertical="services" listingId={service.id} listingTitle={service.title} />
        </div>
      </section>
      </main>
      <MarketplaceFooter />
    </>
  );
}
