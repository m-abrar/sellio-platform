import type { Metadata } from "next";
import { getActiveTheme } from "@/lib/theme";
import FashionLayout from "@/themes/ecommerce/fashion/Layout";
import ElectronicsLayout from "@/themes/ecommerce/electronics/Layout";
import GroceryLayout from "@/themes/ecommerce/grocery/Layout";
import UnifiedDefaultLayout from "@/themes/unified/default/Layout";
import UnifiedModernLayout from "@/themes/unified/modern/Layout";
import UnifiedMinimalLayout from "@/themes/unified/minimal/Layout";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { theme } = await getActiveTheme();
  return {
    title: theme.app_settings?.site_name || "Sellio Platform",
    description: "A premium multi-platform storefront engine",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, layout } = await getActiveTheme();
  
  // Select Layout Component
  let IndustryLayout;
  switch (layout) {
    case 'ecommerce/electronics': IndustryLayout = ElectronicsLayout; break;
    case 'ecommerce/grocery': IndustryLayout = GroceryLayout; break;
    case 'ecommerce/fashion': IndustryLayout = FashionLayout; break;
    case 'unified/modern': IndustryLayout = UnifiedModernLayout; break;
    case 'unified/minimal': IndustryLayout = UnifiedMinimalLayout; break;
    case 'unified/default': 
    default: IndustryLayout = UnifiedDefaultLayout; break;
  }

  const dynamicStyles = theme.variables ? Object.entries(theme.variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ') : '';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=Playfair+Display:wght@400;700&family=Orbitron:wght@400;900&family=Outfit:wght@400;700&family=Montserrat:wght@400;900&display=swap" rel="stylesheet" />
        {dynamicStyles && (
          <style dangerouslySetInnerHTML={{ __html: `:root { ${dynamicStyles} }` }} />
        )}
      </head>
      <body>
        <IndustryLayout>
          {children}
        </IndustryLayout>
        <ThemeSwitcher />
      </body>
    </html>
  );
}
