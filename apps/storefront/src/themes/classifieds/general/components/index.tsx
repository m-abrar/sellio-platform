'use client';
import React, { useState } from 'react';

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
      
      <nav className="cg-nav">
        <a href="#" className="cg-nav-link" onClick={(e) => { e.preventDefault(); alert("Login service dynamically integrated."); }}>Log In</a>
        <a href="#" className="cg-nav-link" onClick={(e) => { e.preventDefault(); alert("Registration wizard launched."); }}>Sign Up</a>
        <a 
          href="#" 
          className="cg-btn cg-btn-primary" 
          onClick={(e) => { e.preventDefault(); alert("Post Classified Ad: Redirecting to partner dashboard in sandbox mode."); }}
        >
          <span>➕</span> Post Ad
        </a>
      </nav>
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
    <div className="cg-footer-links">
      <a href="#" className="cg-footer-link" onClick={(e) => e.preventDefault()}>About Us</a>
      <a href="#" className="cg-footer-link" onClick={(e) => e.preventDefault()}>Help & Support</a>
      <a href="#" className="cg-footer-link" onClick={(e) => e.preventDefault()}>Trust & Safety Guidelines</a>
      <a href="#" className="cg-footer-link" onClick={(e) => e.preventDefault()}>Terms of Service</a>
      <a href="#" className="cg-footer-link" onClick={(e) => e.preventDefault()}>Privacy Protection Policy</a>
    </div>
    <p style={{ color: 'var(--cg-text-muted)', fontSize: '0.8rem', marginTop: '1.25rem', fontWeight: 500 }}>
      &copy; 2026 ClasaFind Classifieds Suite. All rights reserved. Engineered to Elite Standards.
    </p>
  </footer>
);
