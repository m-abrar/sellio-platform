'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { EstateCard } from './components';
import { useClassicThemeLink } from './hooks/useClassicThemeLink';

interface AgentBioPageProps {
  agentId: string;
}

export default function AgentBioPage({ agentId }: AgentBioPageProps) {
  const themeLink = useClassicThemeLink();
  const fallbackPhoto = useThemeMedia('agent.photo', '/themes/properties/classic/agent.webp');
  const agentName = useThemeContent('agent.name', 'Heritage Specialist');
  const agentTitle = useThemeContent('agent.title', 'Senior Estate Advisor');
  const agentYears = useThemeContent('agent.years_experience', '');
  const agentQuote = useThemeContent('agent.quote', 'Every great estate carries a story worth preserving.');
  const agentPhone = useThemeContent('agent.phone', '');
  const agentEmail = useThemeContent('agent.email', '');
  const agentBio = useThemeContent('agent.bio', '');
  const specialtiesRaw = useThemeContent('agent.specialties', 'Georgian Architecture|Victorian Estates|Heritage Conservation');

  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const params: Record<string, unknown> = { per_page: 4 };
        if (agentId) params.agent_id = agentId;
        const response = await api.getProperties(params);
        setListings(response?.data ?? []);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [agentId]);

  const displaySpecialties = specialtiesRaw.split('|').filter(Boolean);

  if (loading) {
    return (
      <div className="pc-agent-page pc-page-shell">
        <div className="pc-section">
          <div className="pc-skeleton-card" style={{ height: '200px', maxWidth: '600px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="pc-agent-page">
      <div className="pc-agent-hero">
        <div className="pc-agent-photo-wrap">
          <img
            src={fallbackPhoto}
            alt={agentName}
            className="pc-agent-photo"
            loading="eager"
          />
        </div>
        <div className="pc-agent-hero-info">
          <h1 className="pc-agent-name">{agentName}</h1>
          <p className="pc-agent-title">
            {agentTitle}
            {agentYears ? ` · ${agentYears} Years` : ''}
          </p>
          <div className="pc-agent-contact-row">
            {agentPhone && (
              <a href={`tel:${agentPhone}`} className="pc-agent-contact-btn">
                {agentPhone}
              </a>
            )}
            {agentEmail && (
              <a href={`mailto:${agentEmail}`} className="pc-agent-contact-btn">
                {agentEmail}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="pc-agent-body">
        <div className="pc-agent-sidebar">
          <blockquote className="pc-agent-quote">"{agentQuote}"</blockquote>
          {displaySpecialties.length > 0 && (
            <div>
              <div className="pc-caps pc-section-eyebrow">Specialties</div>
              <div className="pc-agent-specialties">
                {displaySpecialties.map((s) => (
                  <span key={s} className="pc-agent-specialty-tag">{s}</span>
                ))}
              </div>
            </div>
          )}
          {agentBio && (
            <div>
              <div className="pc-caps pc-section-eyebrow">About</div>
              <p className="pc-listing-prose-body">{agentBio}</p>
            </div>
          )}
        </div>

        <div>
          <div className="pc-caps pc-section-eyebrow">Recent Listings</div>
          {listings.length > 0 ? (
            <div className="pc-agent-listings-grid">
              {listings.map((property) => (
                <EstateCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="pc-agent-empty">
              <p>No active listings at this time.</p>
            </div>
          )}
          <div style={{ marginTop: '2rem' }}>
            <a href={themeLink('/explore')} className="pc-btn-outline">
              Browse All Estates
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
