
import React from 'react';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

export const GeographicFooter = () => {
  const themeLink = usePropertyThemeLink();

  return (
    <footer className="pm-footer">
      <div className="pm-footer-grid">
        <div className="pm-footer-brand">
          <a href={themeLink('/')} className="pm-footer-logo">MAP<span>NEXUS</span></a>
          <p className="pm-footer-desc">
            Find your next home with map-first property search. Browse listings by location,
            price, and property type across every neighbourhood.
          </p>
        </div>
        <div>
          <h4 className="pm-footer-heading">Search</h4>
          <a href={themeLink('/explore')} className="pm-footer-link">Browse All</a>
          <a href={themeLink('/explore')} className="pm-footer-link">Buy</a>
          <a href={themeLink('/explore')} className="pm-footer-link">Rent</a>
          <a href={themeLink('/explore')} className="pm-footer-link">New Listings</a>
        </div>
        <div>
          <h4 className="pm-footer-heading">Property Types</h4>
          <a href={themeLink('/explore')} className="pm-footer-link">Houses</a>
          <a href={themeLink('/explore')} className="pm-footer-link">Apartments</a>
          <a href={themeLink('/explore')} className="pm-footer-link">Condos</a>
          <a href={themeLink('/explore')} className="pm-footer-link">Commercial</a>
        </div>
        <div>
          <h4 className="pm-footer-heading">Company</h4>
          <a href={themeLink('/')} className="pm-footer-link">About</a>
          <a href={themeLink('/')} className="pm-footer-link">Agents</a>
          <a href={themeLink('/')} className="pm-footer-link">Contact</a>
        </div>
      </div>
      <div className="pm-footer-bottom">
        <span>© 2026 Sellio. All rights reserved.</span>
      </div>
    </footer>
  );
};
