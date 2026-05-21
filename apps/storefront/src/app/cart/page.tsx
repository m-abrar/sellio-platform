import { getActiveTheme } from "@/lib/theme";
import React from 'react';

export default async function CartPage() {
  const { layout } = await getActiveTheme();

  try {
    const themeModule = await import(`@/themes/${layout}`);
    
    // Check if the theme exports a dynamic CartPage subpage template
    const ThemeCartPage = themeModule.CartPage;
    
    if (!ThemeCartPage) {
      throw new Error(`CartPage not exported in theme: ${layout}`);
    }

    return <ThemeCartPage />;
  } catch (error) {
    console.warn(`Cart not implemented for theme "${layout}". Falling back to default warning.`, error);
    
    return (
      <div className="p-20 text-center" style={{ fontFamily: 'sans-serif', color: '#666' }}>
        <h1 className="text-2xl font-bold" style={{ color: '#111', marginBottom: '1rem' }}>Shopping Cart</h1>
        <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
          The shopping cart is currently being loaded dynamically from the theme: <strong>{layout}</strong>.
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
