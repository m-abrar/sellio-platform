import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers';
import { api, setThemeKey } from '@/lib/api-client';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const themeKey = headerList.get('x-theme-key') || 'unifieds_default';
  
  try {
    setThemeKey(themeKey);
    const { data: app } = await api.themes.active();
    return {
      title: app.title,
      description: `Marketplace for ${app.vertical}`,
    };
  } catch (error) {
    return {
      title: "Sellio Storefront",
      description: "Unified Marketplace Engine",
    };
  }
}

import { Header } from "@/components/layout/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const themeKey = headerList.get('x-theme-key') || 'unifieds_default';

  let appConfig = null;
  try {
    setThemeKey(themeKey);
    const { data: app } = await api.themes.active();
    appConfig = app;
  } catch (e) {
    console.error("Failed to load app config", e);
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          '--primary-color': appConfig?.variables?.primary_color || '#000000',
          '--accent-color': appConfig?.variables?.accent_color || '#3b82f6',
        } as React.CSSProperties}
      >
        <Header appConfig={appConfig} />
        <main className={`theme-${appConfig?.vertical || 'ecommerce'}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
