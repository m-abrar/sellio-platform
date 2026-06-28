'use client';

import React from 'react';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useModernThemeLink } from './hooks/useModernThemeLink';

export default function AboutPage() {
  const themeLink = useModernThemeLink();
  const kicker = useThemeContent('about.kicker', 'Our story');
  const title = useThemeContent('about.title', 'Built for serious property search');
  const body = useThemeContent('about.body', 'We started Sellio Urban to solve a simple problem: finding the right property takes too long, costs too much, and involves too many middlemen. Our platform cuts the noise and puts serious buyers, renters, and sellers in direct contact.');
  const statsRaw = useThemeContent('about.stats', '12,000+|Properties listed|400+|Partner agents|8|Cities covered');
  const teamTitle = useThemeContent('about.team_title', 'Meet the team');
  const teamMembersRaw = useThemeContent('about.team_members', 'Sarah Chen|Head of Product|Alex Torres|Lead Engineer|Maria Rossi|Client Relations');
  const ctaTitle = useThemeContent('about.cta_title', 'Ready to find your next property?');
  const ctaLabel = useThemeContent('about.cta_label', 'Browse listings');

  const statParts = statsRaw.split('|');
  const stats: { value: string; label: string }[] = [];
  for (let i = 0; i + 1 < statParts.length; i += 2) {
    stats.push({ value: statParts[i] ?? '', label: statParts[i + 1] ?? '' });
  }

  const teamParts = teamMembersRaw.split('|');
  const teamMembers: { name: string; role: string }[] = [];
  for (let i = 0; i + 1 < teamParts.length; i += 2) {
    teamMembers.push({ name: teamParts[i] ?? '', role: teamParts[i + 1] ?? '' });
  }

  return (
    <div className="pm-about-page">
      <section className="pm-about-hero">
        <span className="urban-section-kicker">{kicker}</span>
        <h1 className="pm-about-title">{title}</h1>
        <p className="pm-about-body">{body}</p>
      </section>

      <section className="pm-about-stats" aria-label="Key figures">
        {stats.map(({ value, label }) => (
          <div key={label} className="pm-about-stat">
            <strong className="pm-about-stat__value">{value}</strong>
            <span className="pm-about-stat__label">{label}</span>
          </div>
        ))}
      </section>

      <section className="pm-about-team" aria-labelledby="pm-about-team-title">
        <h2 id="pm-about-team-title" className="pm-about-team-heading">{teamTitle}</h2>
        <div className="pm-about-team-grid">
          {teamMembers.map(({ name, role }) => (
            <div key={name} className="pm-about-team-card">
              <div className="pm-about-team-avatar" aria-hidden="true" />
              <strong className="pm-about-team-name">{name}</strong>
              <span className="pm-about-team-role">{role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pm-about-cta">
        <h2 className="pm-about-cta__title">{ctaTitle}</h2>
        <a href={themeLink('/explore')} className="urban-btn-primary">
          {ctaLabel}
        </a>
      </section>
    </div>
  );
}
