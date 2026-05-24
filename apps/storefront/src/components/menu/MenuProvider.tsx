'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Menu, MenuItem, MenuLocationKey, MenuMap } from '@sellio/types';
import { getDefaultMenu } from '@/lib/menu-defaults';

interface MenuContextValue {
  menus: MenuMap;
  themeKey?: string;
}

const MenuContext = createContext<MenuContextValue>({
  menus: {},
});

export function MenuProvider({
  menus,
  themeKey,
  children,
}: {
  menus: MenuMap;
  themeKey?: string;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ menus, themeKey }), [menus, themeKey]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenuContext(): MenuContextValue {
  return useContext(MenuContext);
}

export function useMenu(location: MenuLocationKey): MenuItem[] {
  const { menus, themeKey } = useMenuContext();
  return menus[location]?.items ?? getDefaultMenu(location, themeKey).items;
}

export function useMenuTitle(location: MenuLocationKey): string {
  const { menus, themeKey } = useMenuContext();
  return menus[location]?.title ?? getDefaultMenu(location, themeKey).title;
}

export function useMenuData(location: MenuLocationKey): Menu {
  const { menus, themeKey } = useMenuContext();
  return menus[location] ?? getDefaultMenu(location, themeKey);
}
