'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { ThemeContentResponse } from '@/types';
import { EMPTY_THEME_CONTENT } from '@/lib/theme-content-defaults';

interface ThemeContentContextValue {
  content: ThemeContentResponse;
}

const ThemeContentContext = createContext<ThemeContentContextValue>({
  content: EMPTY_THEME_CONTENT,
});

export function ThemeContentProvider({
  content,
  children,
}: {
  content: ThemeContentResponse;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ content }), [content]);

  return <ThemeContentContext.Provider value={value}>{children}</ThemeContentContext.Provider>;
}

export function useThemeContentContext(): ThemeContentContextValue {
  return useContext(ThemeContentContext);
}

export function useThemeContent(key: string, fallback = ''): string {
  const { content } = useThemeContentContext();
  return content.content[key] ?? content.media[key] ?? fallback;
}

export function useThemeMedia(key: string, fallback = ''): string {
  const { content } = useThemeContentContext();
  return content.media[key] ?? fallback;
}

export function useThemeConfig<T>(key: string, fallback: T): T {
  const { content } = useThemeContentContext();
  return (content.config[key] as T | undefined) ?? fallback;
}
