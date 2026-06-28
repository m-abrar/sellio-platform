'use client';
import React from 'react';

interface PremiumCardProps {
  title: string;
  price: string;
  category: string;
  image: string;
  isFavorite: boolean;
  onQuickView: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
  onClick?: () => void;
}

export const PremiumCard = ({
  title,
  price,
  category,
  image,
  isFavorite,
  onQuickView,
  onToggleFavorite,
  onShare,
  onClick,
}: PremiumCardProps) => {
  return (
    <div className="elite-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="elite-card-img-wrapper">
        <img src={image} className="elite-card-img" alt={title} />

        <div className="elite-card-overlay" onClick={(e) => e.stopPropagation()}>
          <button className="elite-action-btn" title="Quick View" onClick={onQuickView}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </button>
          <button className="elite-action-btn" title="Toggle Favorite" onClick={onToggleFavorite} style={{ color: isFavorite ? '#ef4444' : 'var(--prem-accent)' }}>
            {isFavorite ? '❤️' : '♡'}
          </button>
          <button className="elite-action-btn" title="Share Asset" onClick={onShare}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="elite-card-content">
        <span className="elite-card-tag">{category}</span>
        <h3 className="elite-card-title">{title}</h3>
        <p className="elite-card-price">{price}</p>
      </div>
    </div>
  );
};

export { DiamondFooter } from './DiamondFooter';
export { EliteHeader } from './EliteHeader';
