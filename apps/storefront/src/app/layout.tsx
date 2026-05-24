import type { Metadata } from "next";
import { getActiveTheme } from "@/lib/theme";
import { getMenus } from "@/lib/menu";
import { MenuProvider } from "@/components/menu/MenuProvider";
import UnifiedDefaultLayout from "@/themes/unifieds/default/Layout";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
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
  const { menus } = await getMenus(MENU_LOCATIONS, theme.theme_key);

  // #region agent log
  fetch('http://127.0.0.1:7444/ingest/7299bd34-d23f-4a85-8035-1e1996ea1a56',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'706e24'},body:JSON.stringify({sessionId:'706e24',location:'layout.tsx:root',message:'layout menu bootstrap',data:{themeKey:theme.theme_key,layout,databaseOffline,mainHeaderCount:menus?.main_header?.items?.length??null,mainHeaderTitles:(menus?.main_header?.items??[]).slice(0,4).map((i)=>i.title)},timestamp:Date.now(),hypothesisId:'A,C'})}).catch(()=>{});
  // #endregion
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
        <MenuProvider menus={menus} themeKey={theme.theme_key}>
          <IndustryLayout>
            {children}
          </IndustryLayout>
        </MenuProvider>
        {databaseOffline && <DatabaseOfflineResilience errorDetails={errorDetails} />}
        <ThemeSwitcher />
      </body>
    </html>
  );
}
