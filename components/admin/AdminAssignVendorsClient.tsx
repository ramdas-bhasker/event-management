'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createBusinessProfile,
  getDefaultMockVendor,
  readVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { cn } from '@/lib/utils';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

interface SelectOption {
  value: string;
  label: string;
}

interface AdminCustomSelectProps {
  value: string;
  options: SelectOption[];
  ariaLabel: string;
  className?: string;
  compact?: boolean;
  onChange: (value: string) => void;
}

function AdminCustomSelect({
  value,
  options,
  ariaLabel,
  className,
  compact = false,
  onChange,
}: AdminCustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutsideClickAndEscape(rootRef, close, open);
  const selected = options.find((item) => item.value === value) ?? options[0];

  return (
    <div ref={rootRef} className={cn('ay-dropdown', open && 'is-open', className)}>
      <button
        type="button"
        className={cn(
          'ay-dropdown-trigger is-form-control !bg-brand-white',
          compact ? '!h-8 !min-h-8 !px-2.5 !py-1 !text-xs' : '!h-10 !min-h-10 !px-3 !text-xs'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="ay-dropdown-value min-w-0 flex-1 truncate text-left text-xs font-medium text-text-primary">
          {selected?.label}
        </span>
        <span
          className="material-symbols-outlined ay-dropdown-chevron text-[18px]"
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="ay-dropdown-menu !min-w-[200px]" role="listbox" aria-label={ariaLabel}>
          <div className="ay-dropdown-list">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'ay-dropdown-item w-full justify-start text-left',
                  option.value === value && 'is-selected'
                )}
              >
                <span className="ay-dropdown-item-title flex-1 text-left text-xs">
                  {option.label}
                </span>
                {option.value === value && (
                  <span
                    className="material-symbols-outlined ml-auto text-[16px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const ADMIN_NAV_ITEMS = [
  { label: 'Overview', icon: 'space_dashboard', href: '/admin/vendors' },
  { label: 'Vendor Management', icon: 'storefront', href: '/admin/vendors' },
  { label: 'Enquiry Management', icon: 'inbox', href: '/admin/enquiries' },
  { label: 'Categories & Services', icon: 'category' },
  { label: 'Featured Vendors', icon: 'stars' },
  { label: 'Customer Management', icon: 'group' },
  { label: 'Reports & Analytics', icon: 'insights' },
  { label: 'Settings', icon: 'settings' },
];

const CATEGORY_FOCUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Category: Wedding Decorators (Pre-matched)' },
  { value: 'Mandap', label: 'Mandap Artists & Crafts' },
  { value: 'Lighting', label: 'Event Lighting & Production' },
  { value: 'Photographers', label: 'Traditional Photographers' },
  { value: 'Catering', label: 'Catering & Sadya Services' },
];

const LOCALITY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Locality: All Hyderabad Markets' },
  { value: 'Financial District', label: 'Financial District (< 3 km)' },
  { value: 'Gachibowli', label: 'Gachibowli & Hitec City' },
  { value: 'Jubilee Hills', label: 'Jubilee Hills' },
  { value: 'Banjara Hills', label: 'Banjara Hills' },
  { value: 'Madhapur', label: 'Madhapur' },
  { value: 'Begumpet', label: 'Begumpet' },
];

const PRICE_SCALE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Package: Any Pricing Tier' },
  { value: 'under-75k', label: 'Under ₹75,000' },
  { value: '75k-150k', label: '₹75,000 – ₹1,50,000' },
  { value: '150k-300k', label: '₹1,50,000 – ₹3,00,000' },
];

const SORT_PRIORITY_OPTIONS: SelectOption[] = [
  { value: 'proximity', label: 'Sort: Best Micro-Market Proximity' },
  { value: 'rating', label: 'Sort: Highest Customer Rating' },
  { value: 'price-asc', label: 'Sort: Starting Rate (Low to High)' },
];

interface MatchingVendorCandidate {
  id: string;
  businessName: string;
  vendorCode?: string;
  alreadyAssigned?: boolean;
  highlightBadge: string;
  highlightTone: 'green' | 'gold' | 'neutral';
  secondaryBadge?: string;
  categoryLabel: string;
  localityLabel: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  rateLabel: string;
  rateTitle: string;
  rateNumeric: number;
  availabilityText: string;
  imageUrl: string;
}

const BASE_CANDIDATE_VENDORS: MatchingVendorCandidate[] = [
  {
    id: 'cand-1',
    businessName: 'Sri Venkateswara Mandap & Floral',
    vendorCode: 'ID: HYD-VN-882',
    alreadyAssigned: true,
    highlightBadge: 'Already Assigned',
    highlightTone: 'green',
    categoryLabel: 'Wedding Decorators & Mandap',
    localityLabel: 'Banjara Hills (4.2 km)',
    distanceKm: 4.2,
    rating: 4.9,
    reviewCount: 128,
    tags: ['Temple Mandaps', 'Fresh Jasmine & Marigold', 'Eco-Friendly setups'],
    rateTitle: 'Contract Value',
    rateLabel: '₹65,000 base decor',
    rateNumeric: 65000,
    availabilityText: 'Dispatched 14 May',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQbiq2xq1MjvPqNj2iT_ipcij71WycGZ6tSZWZmq8w7UXjfLIN1G02iyFVqf6GlPU9S3DCyLWZl8zQ9ZK4xaALsWb95jMCVGwhT83raqGS4U7Yu99hjMjxuAkGXSylyka55rE_uEI3oSn6GfqcaazDntPndJ8h4feKTOKB0zC4zfhQGDxxD1S8CW50mP5BR1bXLDXHu7Km4O52NyB8AyKfV_nszYtJfDMe0-W6hNY',
  },
  {
    id: 'cand-2',
    businessName: 'Prakriti Eco Celebrations & Decor',
    highlightBadge: 'Sustainable Specialist',
    highlightTone: 'green',
    categoryLabel: 'Wedding Decorators',
    localityLabel: 'Jubilee Hills (5.8 km)',
    distanceKm: 5.8,
    rating: 4.8,
    reviewCount: 94,
    tags: ['Sustainable Botanical Decor', 'Terracotta', 'Bamboo Mandaps'],
    rateTitle: 'Starting Rate',
    rateLabel: '₹75,000 base',
    rateNumeric: 75000,
    availabilityText: 'Available on Dec 14',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAZT2MMC7odbYaFDy_cNIhXjPCjfr5ZIHlaO2QE449T4wx5xno1OaNlKLyeTLkuqUxvDrOmO_v5Simc1DCVRAdr63OLsR0veirMiZnCAdrF2OEOy33CfkvVufbZHTPxed4CCi1VT4_ik3_BD2XgCsrjfh-tv0qLMn-_ifK4bgv5teXCqI3iNKqQq1H-lnqJgDBGbaaIDLSLjwVOgRFkB4HdTdpW6WdpqKrOGrHIDRs',
  },
  {
    id: 'cand-3',
    businessName: 'Vedic Crafts & Royal Mandapam',
    highlightBadge: 'Nearest Match (2.1 km)',
    highlightTone: 'gold',
    secondaryBadge: 'High Capacity (800+)',
    categoryLabel: 'Traditional Mandap Specialists',
    localityLabel: 'Gachibowli (2.1 km)',
    distanceKm: 2.1,
    rating: 4.9,
    reviewCount: 162,
    tags: ['Grand Tirupati Style Mandapam', 'Brass Lamp Accents', 'Floral Canopies'],
    rateTitle: 'Starting Rate',
    rateLabel: '₹1,10,000 base',
    rateNumeric: 110000,
    availabilityText: 'Immediate Confirmation',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvmbvBQorsNu6aqtBAdIIdcDOpFr43CynIyJHJmxJYzD_PV7t2gkXOGqWVjGArqkiQWamkxKkGEXGXi-y-rQGRK-AbRniWK2PYppGiO4DZRUty_FcO1Cyqy7I2jjC28nA5-ef0bRp2CFp9HX7mOiwbfkF2An7gcdej7t_xNCDxNSgZG24ujiPn6m-JZkyRzcxRXrZErGQsxQJVX5n1EsGChNUsE5KTBBgaofrL9NE',
  },
  {
    id: 'cand-4',
    businessName: 'Illumina Luxe Event Lighting & Sound',
    highlightBadge: 'Cross-Category Match',
    highlightTone: 'gold',
    categoryLabel: 'Event Lighting & Production',
    localityLabel: 'Madhapur (4.0 km)',
    distanceKm: 4.0,
    rating: 4.7,
    reviewCount: 81,
    tags: ['Warm Fairy Canopies', 'Architectural Uplighting', 'Muhurtham Spotlight'],
    rateTitle: 'Starting Rate',
    rateLabel: '₹45,000 base',
    rateNumeric: 45000,
    availabilityText: 'Available on Dec 14',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8qmCRy2jgLJuDwlPiXv47iXugyyEr5fn25Q0ibbXGliLlFsbTaWcfl0r0xSfKbYPYjnY8VAJ0Z1Pa_UfMUS1-sFlbeV8tk7ZoQWN6O6PKiL9yLd1tBWFch__twzSYRU6aHSSKNHp7M0EP0Wr_9DT8xVur1kYsrP2kh6Cn9vmsj-luroaw_Mbk-SEQFkeTSNtdEUphqRPdOnh4dZwgREF494MyN5NJGccLZJbTgTQ',
  },
  {
    id: 'cand-5',
    businessName: 'Sanskriti Wedding Planners & Decor',
    highlightBadge: 'Full Coordination',
    highlightTone: 'neutral',
    categoryLabel: 'Wedding Decorators',
    localityLabel: 'Begumpet (14.5 km)',
    distanceKm: 14.5,
    rating: 4.6,
    reviewCount: 52,
    tags: ['Royal Entrance Portals', 'Theme Backdrops'],
    rateTitle: 'Starting Rate',
    rateLabel: '₹1,50,000 base',
    rateNumeric: 150000,
    availabilityText: 'Available on Dec 14',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDUIM6dz2DEvDs3jdpSToEz5Hwaqsh_oAVrxLoQ9PI047WY7xdMt5Bt-Dy0oZMd2qJ-bj2WpTpx1LczhU-cYFZI6WBx9c7RTVkobLA6mFSg23Dy73YSdyytWMynRFumF_lNl9oo0HQ8ndq_jTtf6E3DpV8f6qYPk2rYuVOYNGPpRWKFuKAYu7oa95QIS83-oJUjc7j_-xsO2NTcc1LrgVBlKYXcggiX47eYN4Q9egA',
  },
];

function AdminSidebarContents({
  activeNav,
  onNavigate,
  onLogout,
}: {
  activeNav: string;
  onNavigate: (label: string, href?: string) => void;
  onLogout: () => void;
}) {
  return (
    <>
      <Link
        href="/"
        className="flex items-center gap-3 border-b border-white/10 px-5 py-5"
        aria-label="AyojanSetu home"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold text-base font-bold text-brand-green">
          A
        </span>
        <span className="text-lg font-bold tracking-tight text-white">
          Ayojan<span className="text-brand-gold">Setu</span>
        </span>
        <span className="ml-auto rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-gold">
          Admin
        </span>
      </Link>

      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-sm font-bold text-white">
          RV
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-white">Rajesh V.</span>
          <span className="mt-0.5 block text-xs text-white/60">Super Admin · Hyd Market</span>
        </span>
      </div>

      <nav aria-label="Admin dashboard" className="flex-1 space-y-1 px-3 py-5">
        {ADMIN_NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-current={activeNav === item.label ? 'page' : undefined}
            onClick={() => onNavigate(item.label, item.href)}
            className={cn(
              'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors',
              activeNav === item.label
                ? 'bg-white font-semibold text-brand-green'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            )}
          >
            <span className="material-symbols-outlined text-[19px]" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <span className="material-symbols-outlined text-[19px]" aria-hidden="true">
            logout
          </span>
          Mock sign out
        </button>
      </div>
    </>
  );
}

export function AdminAssignVendorsClient() {
  const defaultVendor = getDefaultMockVendor();
  const [sharedProfile, setSharedProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(defaultVendor)
  );
  const [activeNav, setActiveNav] = useState('Enquiry Management');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Pre-selected: Vedic Crafts (cand-3) and Illumina Luxe (cand-4) as in Stitch design
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>(['cand-3', 'cand-4']);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFocus, setCategoryFocus] = useState('all');
  const [localityFilter, setLocalityFilter] = useState('all');
  const [priceScale, setPriceScale] = useState('all');
  const [sortPriority, setSortPriority] = useState('proximity');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [instantWhatsapp, setInstantWhatsapp] = useState(true);

  useEffect(() => {
    setSharedProfile(readVendorBusinessProfileSession(defaultVendor));
  }, [defaultVendor]);

  const candidates = useMemo(() => {
    return BASE_CANDIDATE_VENDORS.map((vendor) => {
      if (vendor.id !== 'cand-1') return vendor;
      return {
        ...vendor,
        businessName: sharedProfile.businessName || vendor.businessName,
        rateLabel: sharedProfile.startingPrice
          ? `₹${Number(sharedProfile.startingPrice).toLocaleString('en-IN')} base decor`
          : vendor.rateLabel,
      };
    });
  }, [sharedProfile.businessName, sharedProfile.startingPrice]);

  const filteredCandidates = useMemo(() => {
    const filtered = candidates.filter((v) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          v.businessName.toLowerCase().includes(q) ||
          v.categoryLabel.toLowerCase().includes(q) ||
          v.localityLabel.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }

      if (categoryFocus !== 'all') {
        if (!v.categoryLabel.toLowerCase().includes(categoryFocus.toLowerCase())) return false;
      }

      if (localityFilter !== 'all') {
        if (!v.localityLabel.toLowerCase().includes(localityFilter.toLowerCase())) return false;
      }

      if (priceScale !== 'all') {
        if (priceScale === 'under-75k' && v.rateNumeric >= 75000) return false;
        if (priceScale === '75k-150k' && (v.rateNumeric < 75000 || v.rateNumeric > 150000))
          return false;
        if (priceScale === '150k-300k' && v.rateNumeric < 150000) return false;
      }

      return true;
    });

    if (sortPriority === 'rating') {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }
    if (sortPriority === 'price-asc') {
      return [...filtered].sort((a, b) => a.rateNumeric - b.rateNumeric);
    }
    return filtered;
  }, [candidates, searchQuery, categoryFocus, localityFilter, priceScale, sortPriority]);

  const selectedVendorObjects = useMemo(
    () => candidates.filter((v) => selectedVendorIds.includes(v.id)),
    [candidates, selectedVendorIds]
  );

  const alreadyAssignedCount = 2; // Sri Venkateswara + Navya Grandeur
  const maxSlots = 5;
  const remainingSlotsAfterSelection = Math.max(
    0,
    maxSlots - alreadyAssignedCount - selectedVendorIds.length
  );

  function handleNavigate(label: string, href?: string) {
    setMobileNavOpen(false);
    setActiveNav(label);
    if (href) {
      window.location.href = href;
      return;
    }
    setToast(`${label} is a mock admin section and will be connected with the next screens.`);
  }

  function handleLogout() {
    setProfileMenuOpen(false);
    setMobileNavOpen(false);
    setToast('Mock sign out only. No real admin authentication session is connected.');
  }

  function toggleVendorSelection(id: string) {
    setSelectedVendorIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (alreadyAssignedCount + prev.length >= maxSlots) {
        setToast('Maximum 5 vendors can be assigned to a single enquiry.');
        return prev;
      }
      return [...prev, id];
    });
  }

  function handleResetFilters() {
    setSearchQuery('');
    setCategoryFocus('all');
    setLocalityFilter('all');
    setPriceScale('all');
    setSortPriority('proximity');
  }

  function handleConfirmDispatch() {
    setConfirmModalOpen(false);
    const names = selectedVendorObjects.map((v) => v.businessName).join(', ');
    setToast(
      `Assignment complete! Dispatched Enquiry AS-ENQ-2026-1042 to ${selectedVendorObjects.length} vendor(s): ${names}.`
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory text-text-primary">
      {/* Desktop Sidebar (Identical across all Admin Console pages) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-green lg:flex">
        <AdminSidebarContents
          activeNav={activeNav}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(19rem,86vw)] flex-col bg-brand-green shadow-xl">
            <div className="flex justify-end px-3 pt-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <AdminSidebarContents
              activeNav={activeNav}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="min-w-0 lg:ml-64">
        {/* Sticky Top Header (Identical across all Admin Console pages) */}
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border-default bg-brand-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-default text-brand-green lg:hidden"
              aria-label="Open admin navigation"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gold-dark sm:text-[11px]">
                Admin Console · Enquiry Operations
              </p>
              <h1 className="truncate text-base font-bold text-brand-green sm:text-lg">
                Assign Vendors to Enquiry
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen((open) => !open);
                  setProfileMenuOpen(false);
                }}
                aria-label="Notifications"
                aria-expanded={notificationOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-brand-ivory hover:text-brand-green"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold" />
              </button>
              {notificationOpen && (
                <div className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-border-default bg-brand-white p-4 shadow-lg">
                  <p className="text-sm font-semibold text-brand-green">Notifications</p>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                    3 slots open for Enquiry AS-ENQ-2026-1042 (Ananya Reddy — 14 Dec 2026).
                  </p>
                </div>
              )}
            </div>

            {/* Admin Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((open) => !open);
                  setNotificationOpen(false);
                }}
                aria-expanded={profileMenuOpen}
                className="flex h-10 items-center gap-2 rounded-full border border-border-default bg-brand-white pl-1 pr-2 hover:bg-brand-ivory sm:pr-3"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-brand-green text-xs font-bold text-white">
                  RV
                </span>
                <span className="hidden max-w-36 truncate text-xs font-semibold text-brand-green sm:block">
                  Rajesh V.
                </span>
                <span className="material-symbols-outlined hidden text-[18px] text-text-secondary sm:block">
                  expand_more
                </span>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-12 z-30 w-60 rounded-xl border border-border-default bg-brand-white p-2 shadow-lg">
                  <div className="border-b border-border-default px-3 py-2">
                    <p className="truncate text-sm font-semibold text-brand-green">Rajesh V.</p>
                    <p className="text-xs text-text-secondary">Super Admin · Hyd Market Central</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-state-error hover:bg-brand-ivory"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Mock sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Container */}
        <div className="mx-auto max-w-[1680px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Top Breadcrumb & Workflow Heading Matrix */}
          <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="mb-1.5 flex flex-wrap items-center gap-1.5 text-xs text-text-secondary"
              >
                <Link href="/admin/enquiries" className="hover:text-brand-green">
                  Enquiry Management
                </Link>
                <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
                <Link
                  href="/admin/enquiries/details"
                  className="font-mono font-medium text-text-primary hover:text-brand-green"
                >
                  AS-ENQ-2026-1042
                </Link>
                <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
                <span className="font-semibold text-brand-gold-dark">Assign Vendors</span>
              </nav>

              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-bold tracking-tight text-brand-green sm:text-3xl">
                  Assign Vendors to Enquiry
                </h2>
                <span className="rounded-full bg-brand-gold-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-gold-dark">
                  Multi-Match Mode
                </span>
              </div>
            </div>

            {/* Action Status Pill & Quick SLA Marker */}
            <div className="flex items-center gap-3 self-start rounded-xl border border-border-default bg-brand-white px-4 py-2.5 shadow-2xs md:self-auto">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-gold-dark" />
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  Disposal SLA
                </span>
                <span className="text-xs font-bold text-brand-green">2h 45m remaining</span>
              </div>
              <span className="h-6 w-px bg-border-default" />
              <Link
                href="/admin/enquiries/details"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-brand-ivory hover:text-brand-green"
                title="View Enquiry Activity & Details"
              >
                <span className="material-symbols-outlined !text-[19px]">history</span>
              </Link>
            </div>
          </section>

          {/* Top Enquiry Summary Bar */}
          <section className="overflow-hidden rounded-xl border border-border-default bg-brand-white shadow-xs">
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-green via-brand-gold to-brand-green" />
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
                {/* Lead & Client Identity */}
                <div className="flex items-center gap-3.5 lg:col-span-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green text-brand-gold shadow-xs">
                    <span className="material-symbols-outlined !text-[24px]">celebration</span>
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-brand-ivory px-2 py-0.5 font-mono text-[11px] font-semibold text-text-primary">
                        AS-ENQ-2026-1042
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark">
                        Verified Client
                      </span>
                    </div>
                    <h3 className="mt-1 truncate text-lg font-bold text-brand-green">
                      Ananya Reddy
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
                      <span className="material-symbols-outlined !text-[14px] text-brand-gold-dark">
                        location_on
                      </span>
                      <span>Financial District, Hyderabad</span>
                    </p>
                  </div>
                </div>

                {/* Event Specifications */}
                <div className="grid grid-cols-2 gap-3.5 rounded-xl bg-brand-ivory p-4 sm:grid-cols-3 lg:col-span-4">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                      Occasion &amp; Date
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-bold text-text-primary">
                      Telugu Wedding
                    </span>
                    <span className="text-xs font-semibold text-brand-green">14 Dec 2026</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                      Budget &amp; Scale
                    </span>
                    <span className="mt-0.5 block text-xs font-bold text-brand-gold-dark">
                      ₹5,50,000
                    </span>
                    <span className="text-xs text-text-secondary">600 Guests</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                      Required Roles
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-text-primary">
                      Decorators, Mandap, Lighting
                    </span>
                  </div>
                </div>

                {/* Allocation Capacity Gauge */}
                <div className="flex w-full flex-col justify-between rounded-xl border border-border-default bg-brand-ivory p-4 lg:col-span-4">
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                    <span className="whitespace-nowrap text-xs font-bold text-text-primary">
                      Lead Assignment Slot
                    </span>
                    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-brand-green px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      2 of 5 Max Assigned
                    </span>
                  </div>
                  <div className="flex h-2.5 w-full gap-1 overflow-hidden rounded-full bg-border-default p-0.5">
                    <div className="h-full w-2/5 rounded-full bg-brand-gold-dark transition-all" />
                    <div className="h-full w-3/5 rounded-full bg-brand-gold-light" />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-3 text-[11px]">
                    <span className="min-w-0 truncate text-text-secondary">
                      Sri Venkateswara, Navya Grandeur
                    </span>
                    <span className="shrink-0 whitespace-nowrap font-semibold text-brand-gold-dark">
                      3 Slots Open
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Operational Container: Compact Search + Custom Dropdowns Toolbar & Matching Vendors List */}
          <section className="overflow-hidden rounded-xl border border-border-default bg-brand-white shadow-xs">
            {/* Enforced Rule Strip + Compact Search & Side-by-Side Custom Dropdowns */}
            <div className="space-y-3 border-b border-border-default p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined !text-[19px] text-brand-green">
                    assignment_turned_in
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-brand-green sm:text-base">
                      Matching Approved Vendors
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Review real-time calendar availability for Dec 14, 2026 before dispatch
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green-light px-3 py-1.5 text-xs font-semibold text-brand-green">
                    <span
                      className="material-symbols-outlined !text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified_user
                    </span>
                    <span>Approved &amp; Active Only (Enforced)</span>
                  </div>
                  <span className="rounded-full bg-brand-gold-light px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark">
                    {selectedVendorIds.length} Pending Dispatch
                  </span>
                </div>
              </div>

              {/* Filter & Query Control Toolbar (Same compact search + custom left-aligned dropdowns + Clear button) */}
              <div className="flex flex-col items-stretch justify-between gap-3 pt-1 xl:flex-row xl:items-center">
                <div className="relative w-full xl:max-w-[260px]">
                  <span className="material-symbols-outlined pointer-events-none absolute left-3 top-2.5 text-[18px] text-text-secondary">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search approved vendors..."
                    className="h-10 w-full rounded-lg border border-border-default bg-brand-white pl-9 pr-3 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-nowrap lg:items-center">
                  <AdminCustomSelect
                    ariaLabel="Filter by category focus"
                    value={categoryFocus}
                    options={CATEGORY_FOCUS_OPTIONS}
                    onChange={setCategoryFocus}
                    className="!w-full lg:!w-52"
                  />
                  <AdminCustomSelect
                    ariaLabel="Filter by locality"
                    value={localityFilter}
                    options={LOCALITY_OPTIONS}
                    onChange={setLocalityFilter}
                    className="!w-full lg:!w-48"
                  />
                  <AdminCustomSelect
                    ariaLabel="Filter by starting package scale"
                    value={priceScale}
                    options={PRICE_SCALE_OPTIONS}
                    onChange={setPriceScale}
                    className="!w-full lg:!w-44"
                  />
                  <AdminCustomSelect
                    ariaLabel="Sort vendors"
                    value={sortPriority}
                    options={SORT_PRIORITY_OPTIONS}
                    onChange={setSortPriority}
                    className="!w-full lg:!w-48"
                  />
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    title="Reset all applied filters"
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-lg border border-border-default bg-brand-white px-3 text-xs font-semibold text-text-secondary transition-colors hover:border-state-error hover:bg-state-error-bg hover:text-state-error"
                  >
                    <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Vendor Checklist Rows */}
            <div className="divide-y divide-border-default">
              {filteredCandidates.map((vendor) => {
                const isSelected = selectedVendorIds.includes(vendor.id);

                return (
                  <div
                    key={vendor.id}
                    className={cn(
                      'flex flex-col justify-between gap-4 p-4 transition-colors sm:p-5 lg:flex-row lg:items-center',
                      vendor.alreadyAssigned
                        ? 'bg-brand-ivory opacity-85'
                        : isSelected
                          ? 'bg-brand-green-light'
                          : 'hover:bg-brand-ivory'
                    )}
                  >
                    <div className="flex flex-1 items-start gap-3.5">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          id={`chk-${vendor.id}`}
                          disabled={vendor.alreadyAssigned}
                          checked={vendor.alreadyAssigned ? true : isSelected}
                          onChange={() => toggleVendorSelection(vendor.id)}
                          className={cn(
                            'h-4 w-4 rounded accent-[#173D32]',
                            vendor.alreadyAssigned ? 'cursor-not-allowed' : 'cursor-pointer'
                          )}
                        />
                      </div>

                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border-default bg-brand-ivory">
                        <Image
                          src={vendor.imageUrl}
                          alt={vendor.businessName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            htmlFor={`chk-${vendor.id}`}
                            className={cn(
                              'text-sm font-bold text-brand-green',
                              !vendor.alreadyAssigned && 'cursor-pointer hover:underline'
                            )}
                          >
                            {vendor.businessName}
                          </label>

                          {/* Clean badge without inner icons/dots */}
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                              vendor.alreadyAssigned
                                ? 'bg-brand-green text-white'
                                : vendor.highlightTone === 'green'
                                  ? 'bg-state-success-bg text-state-success'
                                  : vendor.highlightTone === 'gold'
                                    ? 'bg-brand-gold-light text-brand-gold-dark'
                                    : 'bg-brand-ivory text-text-secondary'
                            )}
                          >
                            {vendor.highlightBadge}
                          </span>

                          {vendor.vendorCode && (
                            <span className="rounded bg-brand-ivory px-2 py-0.5 font-mono text-[10px] font-semibold text-text-secondary">
                              {vendor.vendorCode}
                            </span>
                          )}

                          {vendor.secondaryBadge && (
                            <span className="rounded bg-brand-ivory px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                              {vendor.secondaryBadge}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
                          <span className="font-semibold text-brand-green">
                            {vendor.categoryLabel}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="material-symbols-outlined !text-[13px] leading-none text-brand-gold-dark">
                              pin_drop
                            </span>
                            {vendor.localityLabel}
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-brand-gold-dark">
                            ★ {vendor.rating} ({vendor.reviewCount} reviews)
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {vendor.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-border-default bg-brand-ivory px-2 py-0.5 text-[11px] text-text-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-end justify-between gap-1 lg:flex-col lg:justify-center lg:pl-6">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                        {vendor.rateTitle}
                      </span>
                      <span className="text-sm font-bold text-brand-green">{vendor.rateLabel}</span>
                      <span className="text-xs font-medium text-text-secondary">
                        {vendor.availabilityText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dispatch Action Bar Footer */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-border-default bg-brand-ivory px-5 py-4 sm:flex-row sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                  {selectedVendorIds.length}
                </span>
                <div>
                  <p className="text-sm font-bold text-brand-green">
                    {selectedVendorIds.length}{' '}
                    {selectedVendorIds.length === 1 ? 'Vendor' : 'Vendors'} Ready for Immediate
                    Assignment
                  </p>
                  <p className="text-xs text-text-secondary">
                    Slots remaining for this lead: {remainingSlotsAfterSelection} of 5 available
                  </p>
                </div>
              </div>

              <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">
                <Link
                  href="/admin/enquiries/details"
                  className="btn btn-sm btn-outline flex-1 text-center sm:flex-initial"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  disabled={selectedVendorIds.length === 0}
                  onClick={() => setConfirmModalOpen(true)}
                  className="btn btn-sm btn-primary inline-flex flex-1 items-center justify-center gap-1.5 disabled:pointer-events-none disabled:opacity-50 sm:flex-initial"
                >
                  <span>
                    Confirm &amp; Assign {selectedVendorIds.length}{' '}
                    {selectedVendorIds.length === 1 ? 'Vendor' : 'Vendors'}
                  </span>
                  <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Confirmation Modal Overlay Drawer */}
      {confirmModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Vendor Assignment"
        >
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border-default bg-brand-white p-6 shadow-2xl sm:p-7">
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-brand-green via-brand-gold to-brand-green" />

            <button
              type="button"
              onClick={() => setConfirmModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-brand-ivory hover:text-text-primary"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined !text-[20px]">close</span>
            </button>

            <div className="mb-5 flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold-light text-brand-gold-dark">
                <span className="material-symbols-outlined !text-[24px]">forward_to_inbox</span>
              </span>
              <div>
                <h3 className="text-lg font-bold text-brand-green">Confirm Vendor Assignment</h3>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  You are about to assign {selectedVendorObjects.length} additional approved{' '}
                  {selectedVendorObjects.length === 1 ? 'vendor' : 'vendors'} to Enquiry{' '}
                  <strong className="font-mono font-semibold text-brand-green">
                    AS-ENQ-2026-1042
                  </strong>{' '}
                  (Ananya Reddy).
                </p>
              </div>
            </div>

            {/* Selected Vendors List Preview */}
            <div className="mb-4 rounded-xl bg-brand-ivory p-4">
              <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Selected Target Partners ({selectedVendorObjects.length})
              </span>
              <div className="space-y-2">
                {selectedVendorObjects.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border-default bg-brand-white px-3 py-2.5 text-xs shadow-2xs"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="material-symbols-outlined !text-[18px] text-brand-gold-dark">
                        storefront
                      </span>
                      <span className="truncate font-semibold text-brand-green">
                        {vendor.businessName}
                      </span>
                    </div>
                    <span className="shrink-0 text-[11px] text-text-secondary">
                      {vendor.localityLabel.split(' (')[0]} • {vendor.rateLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory / Disclosure Notice */}
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-border-default bg-brand-ivory/60 p-3.5 text-xs text-text-secondary">
              <span className="material-symbols-outlined mt-0.5 !text-[18px] text-brand-gold-dark">
                info
              </span>
              <p className="leading-relaxed">
                Selected vendors will receive an automated lead notification via AyojanSetu Vendor
                Portal &amp; SMS/WhatsApp. Customer contact details will be shared according to
                standard lead disclosure rules.
              </p>
            </div>

            {/* Operational Checkbox */}
            <label className="mb-6 flex cursor-pointer items-start gap-2.5 text-xs text-text-primary">
              <input
                type="checkbox"
                checked={instantWhatsapp}
                onChange={(e) => setInstantWhatsapp(e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-[#173D32]"
              />
              <span className="font-medium leading-snug">
                Send instant notification to vendor emergency helpline numbers &amp; WhatsApp
                Business API channels
              </span>
            </label>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="btn btn-sm btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                className="btn btn-sm btn-primary inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined !text-[16px]">check_circle</span>
                <span>
                  Confirm Assignment ({selectedVendorObjects.length}{' '}
                  {selectedVendorObjects.length === 1 ? 'Vendor' : 'Vendors'})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Banner */}
      {toast && (
        <div
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-lg items-start gap-3 rounded-xl bg-brand-green px-4 py-3 text-sm text-white shadow-lg sm:left-auto sm:right-6"
          role="status"
        >
          <span className="material-symbols-outlined text-[19px] text-brand-gold">info</span>
          <p className="flex-1 text-xs leading-relaxed">{toast}</p>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setToast('')}
            className="text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
