import { getActiveTheme } from "@/lib/theme";
import React from 'react';

export default async function Home() {
  const { layout } = await getActiveTheme();

  // Orchestrate dynamic loading of the vertical-specific theme
  try {
    // Attempt to load the dedicated theme component
    const { default: ThemeComponent } = await import(`@/themes/${layout}`);
    return <ThemeComponent />;
  } catch (error) {
    console.warn(`Theme layout "${layout}" not found, falling back to default.`);
    
    // Fallback to the foundational unified default theme
    try {
      const { default: FallbackComponent } = await import(`@/themes/unifieds_default`);
      return <FallbackComponent />;
    } catch (fallbackError) {
      return (
        <div className="p-20 text-center">
          <h1 className="text-2xl font-bold">Theme System Error</h1>
          <p className="text-gray-500">Could not load theme: {layout}</p>
        </div>
      );
    }
  }
}
