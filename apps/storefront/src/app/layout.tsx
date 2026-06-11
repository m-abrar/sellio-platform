import type { Metadata } from "next";
import { headers } from "next/headers";
import { getActiveTheme } from "@/lib/theme";
import { getMenus } from "@/lib/menu";
import { getThemeContent } from "@/lib/theme-content";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { MenuProvider } from "@/components/menu/MenuProvider";
import { ThemeContentProvider } from "@/components/theme-content/ThemeContentProvider";
import UnifiedDefaultLayout from "@/themes/unifieds/default/Layout";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AdminBar } from "@/components/AdminBar";
import DatabaseOfflineResilience from "@/components/DatabaseOfflineResilience";
import { MENU_LOCATIONS } from "@sellio/types";
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
  const { theme, layout, databaseOffline, errorDetails } = await getActiveTheme();
  const [{ menus }, themeContent] = await Promise.all([
    getMenus(MENU_LOCATIONS, theme.theme_key),
    getThemeContent('home', theme.theme_key),
  ]);
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') ?? '';
  const isPreview = headerList.get('x-preview-mode') === '1' || pathname.startsWith('/preview/');
  
  // Dynamically resolve the industry-specific layout orchestration
  let IndustryLayout;
  try {
    const themeModule = await import(`@/themes/${layout}`);
    IndustryLayout = themeModule.Layout || UnifiedDefaultLayout;
  } catch {
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
      <body suppressHydrationWarning>
        <AdminBar theme={theme} />
        <AuthProvider>
          <MenuProvider menus={menus} themeKey={theme.theme_key} isPreview={isPreview}>
            <ThemeContentProvider content={themeContent}>
              <IndustryLayout>
                {children}
              </IndustryLayout>
            </ThemeContentProvider>
          </MenuProvider>
        </AuthProvider>
        {databaseOffline && <DatabaseOfflineResilience errorDetails={errorDetails} />}
        <ThemeSwitcher />
      </body>
    </html>
  );
}
