'use client';

import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { Navigation } from '@/components/layout/Navigation';
import {
  EVENT_CATEGORIES_MEGA_LINKS,
  EXPLORE_VENDORS_MEGA_LINKS,
} from '@/lib/constants';
import { useUiStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

export function Header() {
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const isMobileMenuOpen = useUiStore((s) => s.isMobileMenuOpen);
  const toggleMobileMenu = useUiStore((s) => s.toggleMobileMenu);
  const closeMobileMenu = useUiStore((s) => s.closeMobileMenu);
  const setSelectedService = useUiStore((s) => s.setSelectedService);
  const setSelectedEventType = useUiStore((s) => s.setSelectedEventType);
  const activateSearchPrototype = useUiStore((s) => s.activateSearchPrototype);

  return (
    <header className="site-header">
      <Container className="site-header-inner">
        {/* Brand Identity & Location Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link href="/" className="brand-logo" onClick={closeMobileMenu}>
            <div className="brand-mark">अ</div>
            <div className="brand-text-group">
              <span className="brand-title">AyojanSetu</span>
              <span className="brand-tagline">
                Every Event. Every Occasion. One Platform.
              </span>
            </div>
          </Link>
          <div className="location-pill">
            <span className="material-symbols-outlined">location_on</span>
            <span>Hyderabad</span>
          </div>
        </div>

        {/* Primary Desktop Navigation with Mega-Dropdowns */}
        <Navigation />

        {/* Header CTAs & Mobile Toggle */}
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={openAuthModal}
          >
            Login / Sign Up
          </button>
          <Link
            href="/#vendor-cta"
            className="btn btn-md btn-primary"
            onClick={closeMobileMenu}
          >
            <span>List Your Business</span>
          </Link>
          <button
            type="button"
            className="btn-icon mobile-menu-toggle"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </Container>

      {/* Responsive Mobile Navigation Drawer (<=1024px) */}
      <div className={cn('mobile-nav-drawer', isMobileMenuOpen && 'is-open')}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid var(--border-default)',
            }}
          >
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <Link
                href="/"
                className="text-label"
                style={{ fontWeight: 600, color: 'var(--brand-green)' }}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/#how-it-works"
                className="text-label"
                style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                onClick={closeMobileMenu}
              >
                How It Works
              </Link>
            </div>
            <span className="badge badge-gold">Hyderabad</span>
          </div>

          <div>
            <p
              className="text-badge"
              style={{
                color: 'var(--brand-gold-dark)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-2)',
              }}
            >
              Find Vendors
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px',
              }}
            >
              {EXPLORE_VENDORS_MEGA_LINKS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="nav-mega-link"
                  onClick={() => {
                    setSelectedService(item.serviceId);
                    activateSearchPrototype();
                    closeMobileMenu();
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: '13px' }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div
            style={{
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--border-default)',
            }}
          >
            <p
              className="text-badge"
              style={{
                color: 'var(--brand-gold-dark)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-2)',
              }}
            >
              Explore Events
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px',
              }}
            >
              {EVENT_CATEGORIES_MEGA_LINKS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="nav-mega-link"
                  onClick={() => {
                    setSelectedEventType(item.eventFilter);
                    closeMobileMenu();
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: '13px' }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
