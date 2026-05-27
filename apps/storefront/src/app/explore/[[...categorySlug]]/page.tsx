import { getActiveTheme } from "@/lib/theme";
import React from 'react';

interface PageProps {
  params: Promise<{
    categorySlug?: string[];
  }>;
}

export default async function ExplorePage({ params }: PageProps) {
  const { layout } = await getActiveTheme();
  const { categorySlug } = await params;
  const initialCategorySlug = categorySlug && categorySlug.length > 0 ? categorySlug[0] : undefined;

  try {
    const themeModule = await import(`@/themes/${layout}`);
    
    // Check if the theme exports a dynamic ExplorePage subpage template
    const ThemeExplorePage = themeModule.ExplorePage;
    
    if (!ThemeExplorePage) {
      throw new Error(`ExplorePage not exported in theme: ${layout}`);
    }

    return <ThemeExplorePage initialCategorySlug={initialCategorySlug} />;
  } catch (error) {
    console.warn(`Explore not implemented for theme "${layout}". Falling back to default warning.`, error);
    
    return (
      <div 
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top left, #1e1b4b, #0f172a)',
          color: '#f8fafc',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          padding: '2rem'
        }}
      >
        <div 
          style={{
            maxWidth: '500px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div 
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Explore Catalogue
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '2rem' }}>
            The search directory is currently being loaded dynamically from the theme: <strong style={{ color: '#e2e8f0' }}>{layout}</strong>.
          </p>
          <a 
            href={`/preview/${layout.replace('/', '_')}`} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              gap: '0.5rem'
            }}
          >
            &larr; Back to Catalog Homepage
          </a>
        </div>
      </div>
    );
  }
}
