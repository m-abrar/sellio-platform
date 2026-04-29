import type { Metadata } from "next";
import { activeTheme } from "@/lib/theme";
import FashionLayout from "@/themes/fashion/Layout";
import ElectronicsLayout from "@/themes/electronics/Layout";
import GroceryLayout from "@/themes/grocery/Layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sellio Multi-Theme Storefront",
  description: "A premium multi-platform storefront engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Theme Bridge Logic
  let ThemeLayout;
  
  switch (activeTheme) {
    case 'electronics':
      ThemeLayout = ElectronicsLayout;
      break;
    case 'grocery':
      ThemeLayout = GroceryLayout;
      break;
    case 'fashion':
    default:
      ThemeLayout = FashionLayout;
      break;
  }

  return (
    <html lang="en">
      <head>
        {/* Load specific fonts based on theme if needed, or use Google Fonts links */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@400;700&family=Orbitron:wght@400;900&family=Outfit:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeLayout>
          {children}
        </ThemeLayout>
      </body>
    </html>
  );
}
