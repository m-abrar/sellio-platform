'use client';
import React, { useState } from 'react';
import { MenuUtilityNav } from '@/components/menu/MenuUtilityNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { MenuNav } from '@/components/menu/MenuNav';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onReset: () => void;
}

export const GeneralHeader = ({ searchTerm, onSearchChange, onReset }: HeaderProps) => {
  return (
    <header className="cg-header">
      <a href="#" className="cg-logo" onClick={(e) => { e.preventDefault(); onReset(); }}>
        <div className="cg-logo-icon">📦</div>
        <span>CLASA</span>FIND
      </a>
      
      <div className="cg-search-bar">
        <span style={{ fontSize: '1rem', color: 'var(--cg-text-muted)', userSelect: 'none' }}>🔍</span>
        <input 
          type="text" 
          className="cg-search-input" 
          placeholder="Search for anything..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="cg-nav">
        <MenuUtilityNav
          className="cg-nav"
          linkClassName="cg-nav-link"
        />
        <MenuActionButtons
          linkClassName="cg-btn cg-btn-primary"
          renderItem={(item, { href, className, onNavigate }) => (
            <a
              href={href}
              className={className}
              onClick={(e) => {
                e.preventDefault();
                alert("Post Classified Ad: Redirecting to partner dashboard in sandbox mode.");
                onNavigate?.();
              }}
            >
              <span>➕</span> {item.title}
            </a>
          )}
        />
      </div>
    </header>
  );
};

interface ListingCardProps {
  title: string;
  price: string;
  image: string;
  seller: string;
  isSaved: boolean;
  category: string;
  onMessageClick: () => void;
  onToggleSave: () => void;
  onClick?: () => void;
}

export const ListingCard = ({ title, price, image, seller, isSaved, onMessageClick, onToggleSave, onClick }: ListingCardProps) => {
  return (
    <div className="cg-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="cg-card-img-wrap">
        <img src={image} className="cg-card-img" alt={title} />
      </div>
      
      <div className="cg-card-body">
        <h3 className="cg-card-title" title={title}>{title}</h3>
        <div className="cg-card-price">{price}</div>
        
        <div className="cg-card-footer">
          <div className="cg-seller-info">
            <div className="cg-seller-avatar">👤</div>
            <span>{seller}</span>
          </div>
          
          <div className="cg-action-buttons">
            <button 
              className="cg-action-btn" 
              title="Message Seller" 
              onClick={(e) => { e.stopPropagation(); onMessageClick(); }}
            >
              ✉️
            </button>
            <button 
              className={`cg-action-btn cg-action-btn-heart ${isSaved ? 'active' : ''}`}
              title="Save Listing" 
              onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
            >
              {isSaved ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GeneralFooter = () => (
  <footer className="cg-footer">
    <MenuNav
      location="footer_bottom_bar"
      flat
      className="cg-footer-links"
      linkClassName="cg-footer-link"
      renderItem={defaultNavItemRenderer}
    />
    <p style={{ color: 'var(--cg-text-muted)', fontSize: '0.8rem', marginTop: '1.25rem', fontWeight: 500 }}>
      &copy; 2026 ClasaFind Classifieds Suite. All rights reserved. Engineered to Elite Standards.
    </p>
  </footer>
);
