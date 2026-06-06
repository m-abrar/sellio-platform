'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Theme } from '@sellio/types';
import {
  buildAdminUrls,
  getAdminBaseUrl,
  type AdminUrls,
  type ThemePageLink,
} from '@/lib/admin-urls';
import './admin-bar.css';

export interface AdminMenuLink {
  id: number | null;
  title: string;
  locationKey: string;
}

interface ListingCreateLink {
  module: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminBarClientProps {
  initialAuthenticated: boolean;
  theme: Theme;
  themePages: ThemePageLink[];
  adminMenus: AdminMenuLink[];
  enabledModules?: string[];
  requestHostname?: string;
}

function isModuleEnabled(enabledModules: string[], module: string): boolean {
  return enabledModules.length === 0 || enabledModules.includes(module);
}

function buildListingCreateLinks(urls: AdminUrls): ListingCreateLink[] {
  return [
    {
      module: 'properties',
      label: 'Property Listing',
      href: urls.create.property,
      icon: (
        <>
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4v18" />
        </>
      ),
    },
    {
      module: 'autos',
      label: 'Automotive Asset',
      href: urls.create.auto,
      icon: (
        <>
          <path d="M7 17h10" />
          <path d="M5 17l-2-5h18l-2 5" />
          <circle cx="7.5" cy="17" r="1.5" />
          <circle cx="16.5" cy="17" r="1.5" />
        </>
      ),
    },
    {
      module: 'events',
      label: 'Event / Ticket',
      href: urls.create.event,
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      ),
    },
    {
      module: 'jobs',
      label: 'Job Opportunity',
      href: urls.create.job,
      icon: (
        <>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </>
      ),
    },
    {
      module: 'services',
      label: 'Professional Service',
      href: urls.create.service,
      icon: (
        <>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </>
      ),
    },
    {
      module: 'classifieds',
      label: 'General Classified',
      href: urls.create.classified,
      icon: (
        <>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </>
      ),
    },
    {
      module: 'products',
      label: 'Retail Product',
      href: urls.create.product,
      icon: (
        <>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </>
      ),
    },
  ];
}

type DropdownKey = 'addNew' | 'editContent' | 'menus' | null;

const ADMIN_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="admin-bar-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Dropdown({
  label,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!isOpen || !toggleRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!toggleRef.current) {
        return;
      }

      const rect = toggleRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  return (
    <div className="admin-bar-dropdown">
      <button
        ref={toggleRef}
        type="button"
        className="admin-bar-link admin-bar-dropdown-toggle"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {icon}
        {label}
      </button>
      {isOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="admin-bar-dropdown-menu admin-bar-dropdown-menu-portal"
              style={menuStyle}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export function AdminBarClient({
  initialAuthenticated,
  theme,
  themePages,
  adminMenus,
  enabledModules = [],
  requestHostname,
}: AdminBarClientProps) {
  const [visible, setVisible] = useState(initialAuthenticated);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hostname =
    requestHostname ||
    (typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1');
  const urls: AdminUrls = buildAdminUrls(theme, hostname);
  const listingCreateLinks = buildListingCreateLinks(urls).filter((link) =>
    isModuleEnabled(enabledModules, link.module),
  );

  const verifyAuth = useCallback(async () => {
    if (initialAuthenticated) {
      setVisible(true);
      return;
    }

    const readSession = async (url: string, credentials: RequestCredentials = 'same-origin') => {
      const response = await fetch(url, {
        credentials,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        return false;
      }

      const payload = await response.json();
      return Boolean(payload?.authenticated);
    };

    try {
      if (await readSession('/api/admin-bar/session')) {
        setVisible(true);
        return;
      }

      const directUrl = `${getAdminBaseUrl(hostname)}/admin-bar/status`;
      setVisible(await readSession(directUrl, 'include'));
    } catch {
      setVisible(false);
    }
  }, [hostname, initialAuthenticated]);

  useEffect(() => {
    void verifyAuth();
  }, [verifyAuth]);

  useEffect(() => {
    document.body.classList.toggle('has-admin-bar', visible);
    return () => {
      document.body.classList.remove('has-admin-bar');
    };
  }, [visible]);

  useEffect(() => {
    if (!openDropdown) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideBar = barRef.current?.contains(target);
      const clickedInsideMenu = (target as Element).closest?.('.admin-bar-dropdown-menu-portal');

      if (!clickedInsideBar && !clickedInsideMenu) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [openDropdown]);

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((current) => (current === key ? null : key));
  };

  if (!visible) {
    return null;
  }

  return (
    <div id="admin-bar" ref={barRef} role="navigation" aria-label="Admin Quick Bar">
      <div className="admin-bar-container">
        <div className="admin-bar-left">
          <a href={urls.dashboard} {...ADMIN_LINK_PROPS}>
            <Icon>
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </Icon>
            Dashboard
          </a>

          <span className="separator">|</span>

          <Dropdown
            label="Add New"
            isOpen={openDropdown === 'addNew'}
            onToggle={() => toggleDropdown('addNew')}
            icon={
              <Icon>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </Icon>
            }
          >
            <div className="admin-bar-dropdown-header">New Listing</div>
            {listingCreateLinks.length > 0 ? (
              listingCreateLinks.map((link) => (
                <a
                  key={link.module}
                  className="admin-bar-dropdown-item"
                  href={link.href}
                  {...ADMIN_LINK_PROPS}
                >
                  <Icon>{link.icon}</Icon>
                  {link.label}
                </a>
              ))
            ) : (
              <span className="admin-bar-dropdown-item is-disabled">No listing modules enabled</span>
            )}
            <div className="admin-bar-dropdown-divider" />
            <a className="admin-bar-dropdown-item" href={urls.create.user} {...ADMIN_LINK_PROPS}>
              <Icon>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </Icon>
              New User
            </a>
            <div className="admin-bar-dropdown-divider" />
            <a className="admin-bar-dropdown-item" href={urls.create.page} {...ADMIN_LINK_PROPS}>
              <Icon>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </Icon>
              New Page
            </a>
            <a className="admin-bar-dropdown-item" href={urls.create.blog} {...ADMIN_LINK_PROPS}>
              <Icon>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </Icon>
              New Blog
            </a>
          </Dropdown>

          <span className="separator">|</span>

          <a href={urls.themeEdit} {...ADMIN_LINK_PROPS}>
            <Icon>
              <circle cx="13.5" cy="6.5" r="2.5" />
              <circle cx="19" cy="17" r="2.5" />
              <circle cx="6" cy="12" r="2.5" />
            </Icon>
            <span className="theme-badge">{theme.theme_key}</span>
          </a>

          <span className="separator">|</span>

          <Dropdown
            label="Edit Content"
            isOpen={openDropdown === 'editContent'}
            onToggle={() => toggleDropdown('editContent')}
            icon={
              <Icon>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </Icon>
            }
          >
            {themePages.length > 0 ? (
              themePages.map(({ page }) => (
                <a
                  key={page}
                  className="admin-bar-dropdown-item"
                  href={urls.contentEdit(page)}
                  style={{ textTransform: 'capitalize' }}
                  {...ADMIN_LINK_PROPS}
                >
                  <Icon>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </Icon>
                  {page}
                </a>
              ))
            ) : (
              <span className="admin-bar-dropdown-item is-disabled">
                <Icon>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </Icon>
                No theme pages
              </span>
            )}
            <div className="admin-bar-dropdown-divider" />
            <a className="admin-bar-dropdown-item" href={urls.pagesIndex} {...ADMIN_LINK_PROPS}>
              <Icon>
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </Icon>
              Manage Theme Pages
            </a>
          </Dropdown>

          <span className="separator">|</span>

          <Dropdown
            label="Menus"
            isOpen={openDropdown === 'menus'}
            onToggle={() => toggleDropdown('menus')}
            icon={
              <Icon>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </Icon>
            }
          >
            <div className="admin-bar-dropdown-header">Quick Edit</div>
            {adminMenus.length > 0 ? (
              adminMenus.map((menu) => (
                <a
                  key={menu.id ?? menu.locationKey}
                  className="admin-bar-dropdown-item"
                  href={menu.id ? urls.menuEdit(menu.id) : urls.menuIndex}
                  title={menu.locationKey}
                  {...ADMIN_LINK_PROPS}
                >
                  <Icon>
                    <polyline points="9 18 15 12 9 6" />
                  </Icon>
                  {menu.title}
                </a>
              ))
            ) : (
              <span className="admin-bar-dropdown-item is-disabled">No menus defined</span>
            )}
            <div className="admin-bar-dropdown-divider" />
            <a className="admin-bar-dropdown-item" href={urls.menuIndex} {...ADMIN_LINK_PROPS}>
              <Icon>
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </Icon>
              Manage Theme Menus
            </a>
          </Dropdown>
        </div>

        <div className="admin-bar-right">
          <a href={urls.settings} className="admin-bar-hide-mobile" {...ADMIN_LINK_PROPS}>
            <Icon>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </Icon>
            Settings
          </a>

          <span className="separator admin-bar-hide-mobile">|</span>

          <a href={urls.logout} className="logout-link">
            <Icon>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </Icon>
            Logout
          </a>
        </div>
      </div>
    </div>
  );
}
