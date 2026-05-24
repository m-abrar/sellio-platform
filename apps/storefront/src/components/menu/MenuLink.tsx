'use client';

import React from 'react';
import type { MenuItem } from '@sellio/types';
import { getThemeLink } from '@/lib/links';
import { useNavActive } from '@/lib/navigation';

interface MenuLinkProps {
  item: MenuItem;
  themeKey?: string;
  className?: string;
  activeClassName?: string;
  onNavigate?: () => void;
  render?: (item: MenuItem, props: {
    href: string;
    isActive: boolean;
    className: string;
    onNavigate?: () => void;
  }) => React.ReactNode;
}

export function MenuLink({
  item,
  themeKey,
  className,
  activeClassName = 'active',
  onNavigate,
  render,
}: MenuLinkProps) {
  const href = getThemeLink(item.url, themeKey);
  const isActive = useNavActive(item.url, themeKey);
  const resolvedClassName = [className, isActive ? activeClassName : undefined].filter(Boolean).join(' ');

  if (render) {
    return <>{render(item, { href, isActive, className: resolvedClassName, onNavigate })}</>;
  }

  return (
    <a
      href={href}
      className={resolvedClassName}
      target={item.target === '_blank' ? '_blank' : undefined}
      rel={item.target === '_blank' ? 'noreferrer noopener' : undefined}
      onClick={onNavigate}
    >
      {item.title}
    </a>
  );
}
