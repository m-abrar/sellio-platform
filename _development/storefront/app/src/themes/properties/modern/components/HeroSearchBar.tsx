'use client';

import React, { useState } from 'react';
import { useModernThemeLink } from '../hooks/useModernThemeLink';

interface HeroSearchBarProps {
  placeholder?: string;
}

export function HeroSearchBar({
  placeholder = 'Search by city, neighborhood, or property name...',
}: HeroSearchBarProps) {
  const themeLink = useModernThemeLink();
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    const suffix = params.toString() ? `?${params.toString()}` : '';
    window.location.href = themeLink(`/explore${suffix}`);
  };

  return (
    <form className="pm-hero-search" onSubmit={handleSubmit}>
      <input
        type="search"
        className="pm-hero-search__input"
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search properties"
      />
      <button type="submit" className="urban-btn-primary pm-hero-search__btn">
        Search
      </button>
    </form>
  );
}
