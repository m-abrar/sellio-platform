import type { Metadata, Viewport } from "next";
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
import { MENU_LOCATIONS } from "@/types";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export async function generateMetadata(): Promise<Metadata> {
  const { theme } = await getActiveTheme();
  const s = theme.app_settings;
  const siteName = s?.site_name || "Sellio";
  const title = s?.meta_title || siteName;
  const description = s?.meta_description || "A premium multi-platform storefront engine";
  const favicon = s?.site_favicon;

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    ...(favicon && {
      icons: {
        icon: favicon,
        shortcut: favicon,
        apple: favicon,
      },
    }),
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, layout, databaseOffline, errorDetails } = await getActiveTheme();
  const [{ menus }, rawThemeContent] = await Promise.all([
    getMenus(MENU_LOCATIONS, theme.theme_key),
    getThemeContent('home', theme.theme_key),
  ]);

  const themeContent = {
    ...rawThemeContent,
    content: {
      ...(theme.app_settings?.site_name ? { site_name: theme.app_settings.site_name } : {}),
      ...(theme.app_settings?.hide_site_name ? { hide_site_name: theme.app_settings.hide_site_name } : {}),
      ...rawThemeContent.content,
    },
    media: {
      ...(theme.app_settings?.site_logo ? { site_logo: theme.app_settings.site_logo } : {}),
      ...rawThemeContent.media,
    },
  };
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Orbitron:wght@400;900&family=Outfit:wght@400;700&family=Montserrat:wght@400;900&display=swap" rel="stylesheet" />
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
