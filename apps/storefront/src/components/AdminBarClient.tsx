'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Theme } from '@sellio/types';
import {
  buildAdminUrls,
  type AdminUrls,
  type ThemePageLink,
} from '@/lib/admin-urls';
import './admin-bar.css';

export interface AdminMenuLink {
  title: string;
  locationKey: string;
}

interface AdminBarClientProps {
  initialAuthenticated: boolean;
  theme: Theme;
  themePages: ThemePageLink[];
  adminMenus: AdminMenuLink[];
}

type DropdownKey = 'addNew' | 'editContent' | 'menus' | null;

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
  return (
    <div className="admin-bar-dropdown">
      <button
        type="button"
        className="admin-bar-link admin-bar-dropdown-toggle"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {icon}
        {label}
      </button>
      {isOpen ? <div className="admin-bar-dropdown-menu">{children}</div> : null}
    </div>
  );
}

export function AdminBarClient({
  initialAuthenticated,
  theme,
  themePages,
  adminMenus,
}: AdminBarClientProps) {
  const [visible, setVisible] = useState(initialAuthenticated);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const urls: AdminUrls = buildAdminUrls(theme);

  const verifyAuth = useCallback(async () => {
    if (initialAuthenticated) {
      setVisible(true);
      return;
    }

    try {
      const response = await fetch('/api/admin-bar/session', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        setVisible(false);
        return;
      }

      const payload = await response.json();
      setVisible(Boolean(payload?.authenticated));
    } catch {
      setVisible(false);
    }
  }, [initialAuthenticated]);

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
      if (!barRef.current?.contains(event.target as Node)) {
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
          <a href={urls.dashboard}>
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
            <span className="admin-bar-dropdown-item is-disabled">
              <Icon>
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
              </Icon>
              New Listing
            </span>
            <span className="admin-bar-dropdown-item is-disabled">
              <Icon>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </Icon>
              New User
            </span>
            <div className="admin-bar-dropdown-divider" />
            <span className="admin-bar-dropdown-item is-disabled">
              <Icon>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </Icon>
              New Page
            </span>
            <span className="admin-bar-dropdown-item is-disabled">
              <Icon>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </Icon>
              New Blog
            </span>
          </Dropdown>

          <span className="separator">|</span>

          <a href={urls.themeEdit}>
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
            <a className="admin-bar-dropdown-item" href={urls.pagesIndex}>
              <Icon>
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </Icon>
              Manage Pages
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
                  key={menu.locationKey}
                  className="admin-bar-dropdown-item"
                  href={urls.menuIndex}
                  title={menu.locationKey}
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
            <a className="admin-bar-dropdown-item" href={urls.menuIndex}>
              <Icon>
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </Icon>
              Manage All Menus
            </a>
          </Dropdown>
        </div>

        <div className="admin-bar-right">
          <a href={urls.settings} className="admin-bar-hide-mobile">
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
