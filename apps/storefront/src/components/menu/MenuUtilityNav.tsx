'use client';

import React from 'react';
import type { MenuLocationKey } from '@/types';
import { MenuNav } from '@/components/menu/MenuNav';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

interface MenuUtilityNavProps {
  location?: MenuLocationKey;
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}

export function MenuUtilityNav({
  location = 'utility_header',
  className,
  linkClassName,
  onNavigate,
}: MenuUtilityNavProps) {
  return (
    <MenuNav
      location={location}
      flat
      className={className}
      linkClassName={linkClassName}
      onNavigate={onNavigate}
      renderItem={defaultNavItemRenderer}
    />
  );
}
