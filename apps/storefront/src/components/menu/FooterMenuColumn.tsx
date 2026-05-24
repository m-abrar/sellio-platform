'use client';

import React from 'react';
import type { MenuItem, MenuLocationKey } from '@sellio/types';
import { useMenu, useMenuTitle } from '@/components/menu/MenuProvider';
import { MenuLink } from '@/components/menu/MenuLink';
import { useMenuContext } from '@/components/menu/MenuProvider';

interface FooterMenuColumnProps {
  location: MenuLocationKey;
  title?: string;
  linkClassName?: string;
}

export function FooterMenuColumn({ location, title, linkClassName }: FooterMenuColumnProps) {
  const items = useMenu(location);
  const menuTitle = useMenuTitle(location);
  const { themeKey } = useMenuContext();

  return (
    <div>
      <h6>{title ?? menuTitle}</h6>
      <nav aria-label={menuTitle}>
        {items.map((item: MenuItem) => (
          <MenuLink
            key={`${item.id ?? item.title}-${item.url}`}
            item={item}
            themeKey={themeKey}
            className={linkClassName}
          />
        ))}
      </nav>
    </div>
  );
}
