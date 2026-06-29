'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Menu, MenuItem, MenuLocationKey, MenuMap } from '@/types';
import { getDefaultMenu } from '@/lib/menu-defaults';

interface MenuContextValue {
  menus: MenuMap;
  themeKey?: string;
  isPreview?: boolean;
}

const MenuContext = createContext<MenuContextValue>({
  menus: {},
  isPreview: false,
});

export function MenuProvider({
  menus,
  themeKey,
  isPreview = false,
  children,
}: {
  menus: MenuMap;
  themeKey?: string;
  isPreview?: boolean;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ menus, themeKey, isPreview }), [menus, themeKey, isPreview]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenuContext(): MenuContextValue {
  return useContext(MenuContext);
}

export function useMenu(location: MenuLocationKey): MenuItem[] {
  const { menus, themeKey } = useMenuContext();
  const items = menus[location]?.items;
  return items && items.length > 0 ? items : getDefaultMenu(location, themeKey).items;
}

export function useMenuTitle(location: MenuLocationKey): string {
  const { menus, themeKey } = useMenuContext();
  return menus[location]?.title ?? getDefaultMenu(location, themeKey).title;
}

export function useMenuData(location: MenuLocationKey): Menu {
  const { menus, themeKey } = useMenuContext();
  return menus[location] ?? getDefaultMenu(location, themeKey);
}
