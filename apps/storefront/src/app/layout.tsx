import type { Metadata } from "next";
import { getActiveTheme } from "@/lib/theme";
import FashionLayout from "@/themes/fashion/Layout";
import ElectronicsLayout from "@/themes/electronics/Layout";
import GroceryLayout from "@/themes/grocery/Layout";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sellio Multi-Theme Storefront",
  description: "A premium multi-platform storefront engine",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Resolve Theme
  const { theme, layout } = await getActiveTheme();
  
  // 2. Select Layout Component
  let IndustryLayout;
  switch (layout) {
    case 'electronics': IndustryLayout = ElectronicsLayout; break;
    case 'grocery': IndustryLayout = GroceryLayout; break;
    case 'fashion': 
    default: IndustryLayout = FashionLayout; break;
  }

  // 3. Prepare Dynamic Styles (Injected from DB variables)
  const dynamicStyles = theme.variables ? Object.entries(theme.variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ') : '';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&family=Orbitron:wght@400;900&family=Outfit:wght@400;700&display=swap" rel="stylesheet" />
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
