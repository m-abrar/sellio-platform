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
      <div className="p-20 text-center" style={{ fontFamily: 'sans-serif', color: '#666' }}>
        <h1 className="text-2xl font-bold" style={{ color: '#111', marginBottom: '1rem' }}>Browse Directory</h1>
        <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
          The search directory is currently being loaded dynamically from the theme: <strong>{layout}</strong>.
        </p>
        <a 
          href={`/preview/${layout.replace('/', '_')}`} 
          style={{ textDecoration: 'none', color: '#4F46E5', fontWeight: 600 }}
        >
          &larr; Back to Catalog Homepage
        </a>
      </div>
    );
  }
}
