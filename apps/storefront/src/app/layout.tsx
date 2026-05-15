import type { Metadata } from "next";
import { getActiveTheme } from "@/lib/theme";
import UnifiedDefaultLayout from "@/themes/unifieds/default/Layout";
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
  
  // Dynamically resolve the industry-specific layout orchestration
  let IndustryLayout;
  try {
    const themeModule = await import(`@/themes/${layout}`);
    IndustryLayout = themeModule.Layout || UnifiedDefaultLayout;
  } catch (error) {
    console.warn(`Layout for "${layout}" not found, using default.`);
    IndustryLayout = UnifiedDefaultLayout;
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
