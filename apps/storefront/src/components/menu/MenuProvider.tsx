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

  // #region agent log
  React.useEffect(() => {
    fetch('http://127.0.0.1:7444/ingest/7299bd34-d23f-4a85-8035-1e1996ea1a56',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'706e24'},body:JSON.stringify({sessionId:'706e24',location:'MenuProvider.tsx:mount',message:'client menu context',data:{themeKey,menuKeys:Object.keys(menus??{}),mainHeaderCount:menus?.main_header?.items?.length??null,mainHeaderTitles:(menus?.main_header?.items??[]).slice(0,4).map((i)=>i.title)},timestamp:Date.now(),hypothesisId:'C,E'})}).catch(()=>{});
  }, [menus, themeKey]);
  // #endregion

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
