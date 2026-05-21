import { getActiveTheme } from "@/lib/theme";
import React from 'react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const { layout } = await getActiveTheme();

  try {
    const themeModule = await import(`@/themes/${layout}`);
    
    // Check if the theme exports a dynamic ProductPage subpage template
    const ProductPage = themeModule.ProductPage;
    
    if (!ProductPage) {
      throw new Error(`ProductPage not exported in theme: ${layout}`);
    }

    return <ProductPage slug={slug} />;
  } catch (error) {
    console.warn(`Product details not implemented for theme "${layout}". Falling back to default warning.`, error);
    
    return (
      <div className="p-20 text-center" style={{ fontFamily: 'sans-serif', color: '#666' }}>
        <h1 className="text-2xl font-bold" style={{ color: '#111', marginBottom: '1rem' }}>Listing Details</h1>
        <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
          The product detail page is currently being loaded dynamically from the theme: <strong>{layout}</strong>.
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
