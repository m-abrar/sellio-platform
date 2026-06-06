import Link from 'next/link';
import React from 'react';

interface ThemeSubpageUnavailableProps {
  layout: string;
  pageName: string;
}

export function ThemeSubpageUnavailable({ layout, pageName }: ThemeSubpageUnavailableProps) {
  return (
    <div className="p-20 text-center" style={{ fontFamily: 'sans-serif', color: '#666' }}>
      <h1 className="text-2xl font-bold" style={{ color: '#111', marginBottom: '1rem' }}>
        {pageName}
      </h1>
      <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
        No {pageName.toLowerCase()} template is available for theme <strong>{layout}</strong>.
      </p>
      <Link href="/" style={{ textDecoration: 'none', color: '#4F46E5', fontWeight: 600 }}>
        &larr; Back to homepage
      </Link>
    </div>
  );
}
