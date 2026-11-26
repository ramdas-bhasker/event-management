'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import {
  EVENT_CATEGORIES_MEGA_LINKS,
  EXPLORE_VENDORS_MEGA_LINKS,
} from '@/lib/constants';
import { useUiStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import type { EventTypeFilter, ServiceId } from '@/types';

type ActiveMegaMenu = 'vendors' | 'categories' | null;

export function Navigation() {
  const pathname = usePathname();
  const [activeMegaMenu, setActiveMegaMenu] = useState<ActiveMegaMenu>(null);
  const navRef = useRef<HTMLElement>(null);
  const setSelectedService = useUiStore((s) => s.setSelectedService);
  const setSelectedEventType = useUiStore((s) => s.setSelectedEventType);
  const activateSearchPrototype = useUiStore((s) => s.activateSearchPrototype);

  const handleCloseMenu = useCallback(() => {
    setActiveMegaMenu(null);
  }, []);

  useOutsideClickAndEscape(navRef, handleCloseMenu, activeMegaMenu !== null);

  function toggleMenu(menu: 'vendors' | 'categories') {
    setActiveMegaMenu((prev) => (prev === menu ? null : menu));
  }

  function handleVendorLinkClick(serviceId: ServiceId) {
    setSelectedService(serviceId);
    activateSearchPrototype();
    setActiveMegaMenu(null);
  }

  function handleEventLinkClick(eventFilter: EventTypeFilter) {
    setSelectedEventType(eventFilter);
    setActiveMegaMenu(null);
  }

  const isHome = pathname === '/';
  const isVendors = pathname?.startsWith('/vendors');

  return (
    <nav ref={navRef} className="site-nav" aria-label="Primary Navigation">
      <Link href="/" className={cn('site-nav-link', isHome && 'is-active')}>
        Home
      </Link>

      {/* Mega-Dropdown 1: Find Vendors (8 General Event Marketplace Categories) */}
      <div
        className={cn('nav-dropdown', activeMegaMenu === 'vendors' && 'is-open')}
        data-nav-dropdown
      >
        <button
          type="button"
          className={cn('nav-dropdown-trigger', isVendors && 'text-brand-green font-semibold')}
          aria-expanded={activeMegaMenu === 'vendors'}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu('vendors');
          }}
        >
          <span>Find Vendors</span>
          <span className="material-symbols-outlined nav-dropdown-chevron">
            expand_more
          </span>
        </button>
        <div className="nav-mega-panel">
          <h3 className="nav-mega-title">Browse event professionals by service</h3>
          <div className="nav-mega-grid">
            {EXPLORE_VENDORS_MEGA_LINKS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="nav-mega-link"
                data-select-service={item.serviceId}
                onClick={() => handleVendorLinkClick(item.serviceId)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mega-Dropdown 2: Explore Events (8 All-Event Categories) */}
      <div
        className={cn('nav-dropdown', activeMegaMenu === 'categories' && 'is-open')}
        data-nav-dropdown
      >
        <button
          type="button"
          className="nav-dropdown-trigger"
          aria-expanded={activeMegaMenu === 'categories'}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu('categories');
          }}
        >
          <span>Explore Events</span>
          <span className="material-symbols-outlined nav-dropdown-chevron">
            expand_more
          </span>
        </button>
        <div className="nav-mega-panel">
          <h3 className="nav-mega-title">Explore celebrations &amp; occasions</h3>
          <div className="nav-mega-grid">
            {EVENT_CATEGORIES_MEGA_LINKS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="nav-mega-link"
                onClick={() => handleEventLinkClick(item.eventFilter)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Link href="/#how-it-works" className="site-nav-link">
        How It Works
      </Link>
    </nav>
  );
}
