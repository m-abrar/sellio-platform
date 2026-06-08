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
} from '@/themes/services/shared/service-utils';
import { useDemoFallbackAllowed } from '@/themes/services/shared/useDemoFallbackAllowed';
import { useServicesThemeLink } from '@/themes/services/shared/useServicesThemeLink';

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

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useServicesThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [service, setService] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [leadForm, setLeadForm] = useState({ contactName: '', contactInfo: '', brief: '' });
  const [leadSaved, setLeadSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
        const errorMsg = result.ok ? 'Creative profile not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveServiceFailure(slug, allowDemo, 'creative');

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

  const handleLeadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!service || !leadForm.contactName || !leadForm.contactInfo) {
      setFormError('Please enter your name and contact details.');
      return;
    }

    setFormError(null);

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
      setFormError('Could not save your project brief locally. Please try again.');
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

  if (notFound || !service) {
    return (
      <main className="crtv-detail-page">
        <section className="crtv-detail-state" role="status">
          <div className="crtv-detail-kicker">Creative Unavailable</div>
          <h1>Profile could not be loaded.</h1>
          <p>{apiError || 'The requested creative does not exist or has been removed.'}</p>
          <a href={themeLink('')} className="crtv-btn crtv-btn-gradient">Return to Creatives</a>
        </section>
      </main>
    );
  }

  return (
    <main className="crtv-detail-page">
      <a href={themeLink('')} className="crtv-detail-back">
        <span aria-hidden="true">&larr;</span>
        Back to Creatives
      </a>

      {apiError && useFallback && (
        <div className="crtv-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="crtv" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="crtv-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="crtv" />
        </div>
      )}

      <section className="crtv-detail-grid" aria-labelledby="crtv-detail-title">
        <div className="crtv-detail-media">
          <img src={service.media?.main_photo || service.provider?.avatar || getServiceImage(service)} alt={service.title} />
        </div>

        <article className="crtv-detail-panel">
          <div className="crtv-detail-kicker">{getServiceCategoryLabel(service.professional?.category, 'Creative Professional')}</div>
          <h1 id="crtv-detail-title">{service.title}</h1>
          <div className="crtv-detail-price">{getServicePriceLabel(service)}</div>

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
              <strong>{getServiceLocationLabel(service)}</strong>
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
          {formError && <p className="crtv-form-error" role="alert">{formError}</p>}
          <button className="crtv-btn crtv-btn-gradient" type="submit">Send Brief</button>
        </form>
      </section>
    </main>
  );
}
