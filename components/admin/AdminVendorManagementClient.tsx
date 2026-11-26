'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createBusinessProfile,
  getCategoryLabelFromSlug,
  getDefaultMockVendor,
  readVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { cn } from '@/lib/utils';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

type AdminVendorStatus =
  | 'PENDING REVIEW'
  | 'CHANGES REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

interface AdminVendorRow {
  id: string;
  applicationId: string;
  businessName: string;
  estLabel: string;
  category: string;
  categoryIcon: string;
  contactName: string;
  contactPhone: string;
  locality: string;
  localitySub: string;
  submittedDate: string;
  submittedTime: string;
  status: AdminVendorStatus;
  imageUrl: string;
  verifiedStar?: boolean;
  verifiedCheck?: boolean;
  pulsingDot?: boolean;
  slug?: string;
}

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
        <span className="ay-dropdown-value min-w-0 flex-1 truncate text-xs font-medium text-text-primary">
          {selected?.label}
        </span>
        <span className="material-symbols-outlined ay-dropdown-chevron text-[18px]" aria-hidden="true">
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

const CATEGORY_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Category: All Categories' },
  { value: 'Wedding Decorators', label: 'Wedding Decorators' },
  { value: 'Wedding Photographers', label: 'Wedding Photographers' },
  { value: 'Caterers', label: 'Caterers & Feasts' },
  { value: 'DJs & Entertainment', label: 'DJs & Sound Production' },
  { value: 'Makeup Artists', label: 'Bridal Makeup Artists' },
  { value: 'Event Venues', label: 'Banquet Halls & Venues' },
];

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'PENDING REVIEW', label: 'Status: Pending Review' },
  { value: 'ALL', label: 'Status: All Statuses' },
  { value: 'APPROVED', label: 'Status: Approved' },
  { value: 'CHANGES REQUESTED', label: 'Status: Changes Requested' },
  { value: 'SUSPENDED', label: 'Status: Suspended' },
];

const LOCALITY_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'City: Hyderabad (All Markets)' },
  { value: 'Banjara Hills', label: 'Banjara Hills' },
  { value: 'Jubilee Hills', label: 'Jubilee Hills' },
  { value: 'Gachibowli', label: 'Gachibowli & Financial Dist' },
  { value: 'Madhapur', label: 'Madhapur & Hitec City' },
  { value: 'Secunderabad', label: 'Secunderabad & Trimulgherry' },
  { value: 'Begumpet', label: 'Begumpet & Somajiguda' },
];

const SORT_FILTER_OPTIONS: SelectOption[] = [
  { value: 'newest', label: 'Sort by: Newest Submission' },
  { value: 'oldest', label: 'Sort by: Oldest First' },
  { value: 'rating', label: 'Sort by: Rating (High to Low)' },
  { value: 'enquiries', label: 'Sort by: Highest Enquiries' },
];

const ROWS_PER_PAGE_OPTIONS: SelectOption[] = [
  { value: '5', label: '5 / page' },
  { value: '10', label: '10 / page' },
  { value: '25', label: '25 / page' },
  { value: '50', label: '50 / page' },
];

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

const HEATMAP_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCIKDRFWOX7RbeiN_Kfn-i8qbJ4wol9zCLn90U7__TPwrlkY8chkCBXtMFzfx-kdpufNMxXjoslpVf1_VIOcZ10JWYBuiHedk5gGKvnPG_8cq_p4lTmulb7kNj8s6-8NV95Ry3tsrwyKwK6h2w87RV_RKtCss2keGpurnoc-F-7C_obR7N51a2md3N5uycdOBXuaT7CQs31EHrXaunsqy6DJrcJZZYaYUntGTvk7AQ';

const BASE_VENDOR_ROWS: AdminVendorRow[] = [
  {
    id: 'row-1',
    applicationId: 'AS-VND-2026-0418',
    businessName: 'Sri Venkateswara Mandap & Floral',
    estLabel: 'Est. 2016',
    category: 'Wedding Decorators',
    categoryIcon: 'filter_vintage',
    contactName: 'Ramesh Rao',
    contactPhone: '+91 98765 43210',
    locality: 'Banjara Hills',
    localitySub: 'Hyderabad (4 hubs)',
    submittedDate: '14 May 2026',
    submittedTime: '11:30 AM (2h ago)',
    status: 'PENDING REVIEW',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBiYOpshfmax9b0rkpXKCF9ifWO7XPK9rJElqfBVsoTVwvjuCeP7jwmK49LgHpYGX1KlWmcuH5Dd4P_fzFM_CuN5tTZkFgu8FFjOBS7LpTRzCfHGMyxcNobyezVK5CM4Q1HsunxwIJ6jfaPUvCgi47d33dQPZgvBQSdKLqtHFGa9_Nwb8yVbWgohwUZOnBLWYiVapkBRvX-YvwLaJSps6CrIRaFDPHy2t96FqHBBbo',
    verifiedStar: true,
    pulsingDot: true,
    slug: 'sri-venkateswara-mandap-floral',
  },
  {
    id: 'row-2',
    applicationId: 'AS-VND-2026-0419',
    businessName: 'Moments & Memories Studio',
    estLabel: 'Est. 2018',
    category: 'Wedding Photographers',
    categoryIcon: 'photo_camera',
    contactName: 'Pooja Hegde',
    contactPhone: '+91 98490 12345',
    locality: 'Jubilee Hills',
    localitySub: 'Hyderabad',
    submittedDate: '14 May 2026',
    submittedTime: '09:15 AM (5h ago)',
    status: 'PENDING REVIEW',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHsQcolCVBgj4LpD6e1hjklqcda_f0IPIsfOkYLLy0JM-nga34gcISLcQyT_zBO3DJq-hwTUKWJ096Ps2YiGBVNeINriZX2QNmRiDu-izBH0Jzf8aFlV5bkwpmRppzY_El-7fdhM3yiG_f2d9A9pA4UTPuSgNcUIFW9QGshGyBUk8eCcU7bfrdw_2C3I__7ZIB4dJhWO6wHc8DZZ2pMFTQ_FsRZ88ti6naes6SEy8',
    slug: 'moments-event-photography-films',
  },
  {
    id: 'row-3',
    applicationId: 'AS-VND-2026-0415',
    businessName: 'Royal Nizami Feast & Catering',
    estLabel: 'Est. 2012',
    category: 'Caterers',
    categoryIcon: 'restaurant',
    contactName: 'Mirza Ahmed',
    contactPhone: '+91 91234 56789',
    locality: 'Madhapur',
    localitySub: 'Hyderabad',
    submittedDate: '13 May 2026',
    submittedTime: '04:45 PM (Yesterday)',
    status: 'CHANGES REQUESTED',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4MPxoULlmcKmMEs-FQbUZUJfUuWSItdLX9HpnEwCJXaUTCtf3TSkiyCFFWL8lAzS0mA_n_-HLVbXBkTbih6nQqTBAbS7w-kRxrJfwmbqMFEYYT8mU0UI_n1SzDD6cau_efS27xhUQy2nCwep7VsWup-pY-8YnKjqHgmqj1Q1ysAEJF6Bivpj39_s22XG047nepezCsU9MNy9Ylzn0W_auPjIzqq9H5adOlfsBeh4',
    slug: 'royal-nizami-daawat-caterers',
  },
  {
    id: 'row-4',
    applicationId: 'AS-VND-2026-0390',
    businessName: 'Navya Grandeur Luxury Weddings',
    estLabel: 'Est. 2015',
    category: 'Wedding Decorators',
    categoryIcon: 'apartment',
    contactName: 'Navya Reddy',
    contactPhone: '+91 98888 77777',
    locality: 'Gachibowli',
    localitySub: 'Hyderabad',
    submittedDate: '10 May 2026',
    submittedTime: '4 days ago',
    status: 'APPROVED',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBELe8aqDCjXm57Qnbicn-FBuKp6ElMF-zH4vlZT5N8UQhnn9_86iJo2b0IAaXoS1raJ__exHh8EibfgICP4hHJUSvrtk9xQL_O7F4jRTZKo4VlJ7obOe2PWjLhQp5-x0moE5D07sC8jfdKqavFng-3t2H2x6F_iNDNJT-6oOKD8l9b6VULYINve3Kd1QwT0Ws9xaTHeclRG9LlyeLxEmOcmiQKBTKQ8uDIwZNTLes',
    verifiedCheck: true,
    slug: 'navya-grandeur-luxury-weddings',
  },
  {
    id: 'row-5',
    applicationId: 'AS-VND-2026-0382',
    businessName: 'SoundVibe DJs & Production',
    estLabel: 'Sangeet & Rec.',
    category: 'DJs & Entertainment',
    categoryIcon: 'speaker',
    contactName: 'Kiran Kumar',
    contactPhone: '+91 97777 66666',
    locality: 'Secunderabad',
    localitySub: 'Twin Cities Central',
    submittedDate: '08 May 2026',
    submittedTime: '6 days ago',
    status: 'SUSPENDED',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFV0qqtKFQBUtdYNBUqyZzXu5ffLUBndFXltlryeErR-pFCedXQPMz2O981Bqq5rlsrVlOj0E0GLjwRuaAKNxpyrVg1MWJM18OYddHB5-jIGYnZl6absVxo5lS2W9Z6IXtaMacSgcEm6rCx3JndEGnhyfA4UtO-kMJuCc1XTloQj4SIaR_QEzEBUyCE5sNoGYNhrCQeufkIhZJuFqselTaSyD_Oys-eyGoJo7mJgo',
    slug: 'soundkraft-pro-dj-truss',
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

export function AdminVendorManagementClient() {
  const defaultVendor = getDefaultMockVendor();
  const [sharedProfile, setSharedProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(defaultVendor)
  );
  const [rows] = useState<AdminVendorRow[]>(BASE_VENDOR_ROWS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeNav, setActiveNav] = useState('Vendor Management');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('PENDING REVIEW');
  const [localityFilter, setLocalityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [rowsPerPage, setRowsPerPage] = useState('5');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const loaded = readVendorBusinessProfileSession(defaultVendor);
    setSharedProfile(loaded);
  }, [defaultVendor]);

  // Keep Row 1 synced with the shared Sri Venkateswara Mandap & Floral profile
  const syncedRows = useMemo(() => {
    const hubCount = sharedProfile.serviceAreas.length + sharedProfile.customServiceAreas.length;
    return rows.map((row) => {
      if (row.id !== 'row-1') return row;
      return {
        ...row,
        businessName: sharedProfile.businessName || row.businessName,
        estLabel: sharedProfile.yearEstablished
          ? `Est. ${sharedProfile.yearEstablished}`
          : row.estLabel,
        category: getCategoryLabelFromSlug(sharedProfile.category) || row.category,
        contactName: sharedProfile.ownerName || row.contactName,
        contactPhone: `+91 ${(sharedProfile.accountMobile || sharedProfile.businessPhone || '98765 43210').replace(/^\+91[\s-]*/, '')}`,
        locality: sharedProfile.areaLocality || row.locality,
        localitySub: `${sharedProfile.city || 'Hyderabad'} (${hubCount || 4} hubs)`,
      };
    });
  }, [rows, sharedProfile]);

  const filteredRows = useMemo(() => {
    return syncedRows.filter((row) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          row.businessName.toLowerCase().includes(q) ||
          row.contactName.toLowerCase().includes(q) ||
          row.applicationId.toLowerCase().includes(q) ||
          row.locality.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (categoryFilter !== 'all') {
        if (!row.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
          return false;
        }
      }

      if (localityFilter !== 'all') {
        if (!row.locality.toLowerCase().includes(localityFilter.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [syncedRows, searchQuery, categoryFilter, localityFilter]);

  function handleNavigate(label: string, href?: string) {
    setMobileNavOpen(false);
    setActiveNav(label);
    if (href && label !== 'Vendor Management') {
      window.location.href = href;
      return;
    }
    if (label !== 'Vendor Management') {
      setToast(`${label} is a mock admin section and will be connected with the next screens.`);
    }
  }

  function handleLogout() {
    setProfileMenuOpen(false);
    setMobileNavOpen(false);
    setToast('Mock sign out only. No real admin authentication session is connected.');
  }

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      setSelectedIds(filteredRows.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  }

  function toggleRowSelection(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleResetFilters() {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('PENDING REVIEW');
    setLocalityFilter('all');
    setSortBy('newest');
  }

  return (
    <div className="min-h-screen bg-brand-ivory text-text-primary">
      {/* Desktop Sidebar (Exact match with VendorBusinessProfileClient) */}
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
        {/* Sticky Top Header (Exact match with VendorBusinessProfileClient) */}
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
                Admin Console · Vendor Operations
              </p>
              <h1 className="truncate text-base font-bold text-brand-green sm:text-lg">
                Vendor Management
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
                    18 vendor applications are awaiting verification in the Hyderabad queue.
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

        {/* Page Container (Matches VendorBusinessProfileClient spacing & typography) */}
        <div className="mx-auto max-w-[1680px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Page Title & Quick Actions */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-green sm:text-3xl">
                Vendor Management
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Review applications, monitor audit trails, and manage vendors listed on AyojanSetu.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setToast('Exported 248 vendor records to CSV.')}
                className="btn btn-sm btn-outline inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">download</span>
                Export CSV
              </button>
              <Link
                href="/vendor/onboarding/registration"
                className="btn btn-sm btn-primary inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">add_circle</span>
                Invite Vendor
              </Link>
            </div>
          </section>

          {/* Summary Metrics Row (5 Cards) */}
          <section
            aria-label="Vendor summary metrics"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
          >
            {/* Total Vendors */}
            <article className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Total Vendors
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="text-2xl font-bold text-brand-green sm:text-3xl">248</p>
                <span className="rounded-full bg-brand-ivory px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                  Active &amp; In-Review
                </span>
              </div>
              <p className="mt-2.5 flex items-center gap-1 text-xs text-text-secondary">
                <span className="material-symbols-outlined text-[15px] text-state-success">
                  trending_up
                </span>
                +12% vs last month
              </p>
            </article>

            {/* Pending Applications */}
            <article className="rounded-xl border border-brand-gold-border bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">
                  Pending Applications
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold-light text-brand-gold-dark">
                  <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="text-2xl font-bold text-brand-gold-dark sm:text-3xl">18</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold-light px-2 py-0.5 text-[11px] font-semibold text-brand-gold-dark">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold-dark" />
                  Requires Action
                </span>
              </div>
              <p className="mt-2.5 flex items-center gap-1 text-xs text-brand-gold-dark">
                <span className="material-symbols-outlined text-[15px]">schedule</span>
                Avg. turn-around: 4.2 hrs
              </p>
            </article>

            {/* Approved Vendors */}
            <article className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Approved Vendors
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-state-success-bg text-state-success">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="text-2xl font-bold text-brand-green sm:text-3xl">210</p>
                <span className="rounded-full bg-state-success-bg px-2 py-0.5 text-[11px] font-semibold text-state-success">
                  Live on Marketplace
                </span>
              </div>
              <p className="mt-2.5 flex items-center gap-1 text-xs text-text-secondary">
                <span className="material-symbols-outlined text-[15px] text-state-success">
                  check_circle
                </span>
                84.6% catalog density
              </p>
            </article>

            {/* Changes Requested */}
            <article className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Changes Requested
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-state-warning-bg text-brand-gold-dark">
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="text-2xl font-bold text-brand-green sm:text-3xl">14</p>
                <span className="rounded-full bg-brand-ivory px-2 py-0.5 text-[11px] font-semibold text-brand-gold-dark">
                  Awaiting Vendor Edit
                </span>
              </div>
              <p className="mt-2.5 flex items-center gap-1 text-xs text-text-secondary">
                <span className="material-symbols-outlined text-[15px]">sync</span>3 re-submitted
                today
              </p>
            </article>

            {/* Rejected Applications */}
            <article className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Rejected Applications
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-ivory text-text-secondary">
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="text-2xl font-bold text-brand-green sm:text-3xl">6</p>
                <span className="rounded-full bg-brand-ivory px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                  Archived Audit
                </span>
              </div>
              <p className="mt-2.5 flex items-center gap-1 text-xs text-text-secondary">
                <span className="material-symbols-outlined text-[15px]">policy</span>
                Low compliance score
              </p>
            </article>
          </section>

          {/* Operational Container: Custom Dropdown Toolbar + Data Table */}
          <section className="rounded-xl border border-border-default bg-brand-white shadow-xs">
            {/* Filter & Query Control Toolbar (Compact Search Bar + Custom Dropdowns in Side-by-Side Columns) */}
            <div className="flex flex-col items-stretch justify-between gap-3 border-b border-border-default p-4 sm:p-5 xl:flex-row xl:items-center">
              {/* Compact Search Input */}
              <div className="relative w-full xl:max-w-[260px]">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-2.5 text-[18px] text-text-secondary">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vendors or ID..."
                  className="h-10 w-full rounded-lg border border-border-default bg-brand-white pl-9 pr-3 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                />
              </div>

              {/* Custom Dropdown Controls */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-nowrap lg:items-center">
                <AdminCustomSelect
                  ariaLabel="Filter by category"
                  value={categoryFilter}
                  options={CATEGORY_FILTER_OPTIONS}
                  onChange={setCategoryFilter}
                  className="!w-full lg:!w-44"
                />
                <AdminCustomSelect
                  ariaLabel="Filter by status"
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={setStatusFilter}
                  className="!w-full lg:!w-40"
                />
                <AdminCustomSelect
                  ariaLabel="Filter by locality"
                  value={localityFilter}
                  options={LOCALITY_FILTER_OPTIONS}
                  onChange={setLocalityFilter}
                  className="!w-full lg:!w-48"
                />
                <AdminCustomSelect
                  ariaLabel="Sort applications"
                  value={sortBy}
                  options={SORT_FILTER_OPTIONS}
                  onChange={setSortBy}
                  className="!w-full lg:!w-44"
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

            {/* Table Container: Zero Horizontal Scrollbar at >= 1024px (incl. 1400px), scrolls only on small screens */}
            <div className="w-full max-lg:overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border-default bg-brand-ivory/70 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          filteredRows.length > 0 && selectedIds.length === filteredRows.length
                        }
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded accent-[#173D32]"
                      />
                    </th>
                    <th className="px-3 py-3">Business &amp; ID</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Primary Contact</th>
                    <th className="px-3 py-3">Locality</th>
                    <th className="px-3 py-3">Submitted Date</th>
                    <th className="px-3 py-3">Application Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border-default text-xs text-text-primary">
                  {filteredRows.map((row) => {
                    const isChecked = selectedIds.includes(row.id);

                    return (
                      <tr
                        key={row.id}
                        className={cn(
                          'group transition-colors hover:bg-brand-ivory/40',
                          isChecked && 'bg-brand-green-light'
                        )}
                      >
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleRowSelection(row.id)}
                            className="h-4 w-4 cursor-pointer rounded accent-[#173D32]"
                          />
                        </td>

                        {/* Business & ID */}
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-ivory">
                              <Image
                                src={row.imageUrl}
                                alt={row.businessName}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="truncate text-xs font-semibold text-brand-green">
                                  {row.businessName}
                                </span>
                                {row.verifiedStar && (
                                  <span
                                    className="material-symbols-outlined text-[15px] text-brand-gold-dark"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                    title="Heritage Verified Partner"
                                  >
                                    stars
                                  </span>
                                )}
                                {row.verifiedCheck && (
                                  <span
                                    className="material-symbols-outlined text-[15px] text-brand-green"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                  >
                                    verified
                                  </span>
                                )}
                              </div>
                              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-secondary">
                                <span className="rounded bg-brand-ivory px-1.5 py-0.5 font-mono text-[10px] font-medium text-text-primary">
                                  {row.applicationId}
                                </span>
                                <span>•</span>
                                <span>{row.estLabel}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-3 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-md border border-border-default bg-brand-ivory px-2 py-1 text-[11px] font-medium text-text-primary">
                            <span className="material-symbols-outlined text-[14px] text-brand-green">
                              {row.categoryIcon}
                            </span>
                            <span className="whitespace-nowrap">{row.category}</span>
                          </span>
                        </td>

                        {/* Primary Contact */}
                        <td className="px-3 py-3.5">
                          <p className="font-semibold text-text-primary">{row.contactName}</p>
                          <p className="mt-0.5 whitespace-nowrap text-[11px] text-text-secondary">
                            <span className="mr-1 font-semibold text-brand-green">IN</span>
                            {row.contactPhone}
                          </p>
                        </td>

                        {/* Locality */}
                        <td className="px-3 py-3.5">
                          <p className="flex items-center gap-1 font-medium text-text-primary">
                            <span className="material-symbols-outlined !text-[13px] leading-none text-text-secondary">
                              location_on
                            </span>
                            <span>{row.locality}</span>
                          </p>
                          <p className="mt-0.5 pl-4 text-[11px] text-text-secondary">
                            {row.localitySub}
                          </p>
                        </td>

                        {/* Submitted Date */}
                        <td className="whitespace-nowrap px-3 py-3.5">
                          <p className="font-medium text-text-primary">{row.submittedDate}</p>
                          <p className="mt-0.5 text-[11px] text-text-secondary">
                            {row.submittedTime}
                          </p>
                        </td>

                        {/* Application Status Badge */}
                        <td className="px-3 py-3.5">
                          {row.status === 'PENDING REVIEW' && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-brand-gold-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                              Pending Review
                            </span>
                          )}

                          {row.status === 'CHANGES REQUESTED' && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-state-warning-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                              Changes Requested
                            </span>
                          )}

                          {row.status === 'APPROVED' && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-state-success-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-state-success">
                              Approved
                            </span>
                          )}

                          {row.status === 'SUSPENDED' && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-state-error-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-state-error">
                              Suspended
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end">
                            {row.status === 'PENDING REVIEW' && (
                              <Link
                                href="/admin/vendors/review"
                                className="rounded-lg bg-brand-green px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-green-hover"
                              >
                                Review
                              </Link>
                            )}

                            {row.status === 'CHANGES REQUESTED' && (
                              <Link
                                href="/admin/vendors/review"
                                className="rounded-lg border border-border-default bg-brand-ivory px-3 py-1.5 text-xs font-semibold text-brand-green transition-colors hover:border-brand-green"
                              >
                                Inspect Resubmission
                              </Link>
                            )}

                            {row.status === 'APPROVED' && (
                              <Link
                                href={
                                  row.slug
                                    ? `/vendors/${row.slug}`
                                    : '/vendor/onboarding/status/approved'
                                }
                                className="rounded-lg border border-border-default bg-brand-white px-3 py-1.5 text-xs font-semibold text-brand-green transition-colors hover:border-brand-green hover:bg-brand-ivory"
                              >
                                View Profile
                              </Link>
                            )}

                            {row.status === 'SUSPENDED' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setToast(`Opened compliance audit log for ${row.businessName}.`)
                                }
                                className="rounded-lg border border-border-default bg-brand-white px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:border-brand-green"
                              >
                                Audit Log
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer & Dynamic Pagination Controls */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-border-default bg-brand-ivory/40 px-5 py-3.5 sm:flex-row">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs text-text-secondary">
                  Showing <span className="font-semibold text-brand-green">1</span> to{' '}
                  <span className="font-semibold text-brand-green">{filteredRows.length}</span> of{' '}
                  <span className="font-semibold text-brand-green">18</span> pending applications
                </p>
                <span className="hidden h-4 w-px bg-border-default sm:block" />
                <div className="hidden items-center gap-2 md:flex">
                  <span className="text-xs text-text-secondary">Rows per page:</span>
                  <AdminCustomSelect
                    ariaLabel="Rows per page"
                    value={rowsPerPage}
                    options={ROWS_PER_PAGE_OPTIONS}
                    onChange={setRowsPerPage}
                    compact
                    className="!w-28"
                  />
                </div>
              </div>

              {/* Navigation Pagers */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-brand-ivory disabled:pointer-events-none disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green text-xs font-semibold text-white shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-text-primary transition-colors hover:bg-brand-ivory"
                >
                  2
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-text-primary transition-colors hover:bg-brand-ivory"
                >
                  3
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-text-primary transition-colors hover:bg-brand-ivory"
                >
                  4
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-brand-ivory"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </section>

          {/* Bottom Contextual Intelligence Module */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Audit Log Feed snippet */}
            <section className="flex flex-col justify-between rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-brand-green">
                      security_update_good
                    </span>
                    <h3 className="text-base font-bold text-brand-green">Compliance Pipeline</h3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-dark">
                    Live Feed
                  </span>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-text-secondary">
                  GSTIN validation checks and Hyderabad police permissions verification via
                  automated DigiLocker sandbox.
                </p>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 rounded-lg bg-brand-ivory p-3">
                    <span className="material-symbols-outlined mt-0.5 text-[18px] text-state-success">
                      verified_user
                    </span>
                    <div>
                      <p className="font-semibold text-text-primary">
                        Auto-verified GSTIN for 3 Decorators
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-secondary">
                        Banjara Hills cluster • 18 mins ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg bg-brand-ivory p-3">
                    <span className="material-symbols-outlined mt-0.5 text-[18px] text-brand-gold-dark">
                      warning
                    </span>
                    <div>
                      <p className="font-semibold text-text-primary">
                        Bank account mismatch detected
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-secondary">
                        Catering lead AS-VND-2026-0415
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-border-default pt-3">
                <a
                  href="#security"
                  onClick={(e) => {
                    e.preventDefault();
                    setToast('Security & Compliance Console preview.');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:text-brand-gold-dark"
                >
                  <span>Open Full Security Console</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </a>
              </div>
            </section>

            {/* Micro-market saturation map teaser */}
            <section className="flex flex-col items-center gap-6 rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6 md:flex-row lg:col-span-2">
              <div className="flex-1 space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                  <span className="material-symbols-outlined text-[14px]">map</span>
                  Hyderabad Event Clusters
                </span>
                <h3 className="text-lg font-bold text-brand-green">
                  Peak Wedding Season Demand Index
                </h3>
                <p className="text-xs leading-relaxed text-text-secondary">
                  Gachibowli and Jubilee Hills have reached a 92% vendor capacity allocation for Q3
                  2026 dates. Prioritize venue and photography onboarding in North Hyderabad.
                </p>
                <div className="flex items-center gap-5 pt-2">
                  <div>
                    <p className="text-2xl font-bold text-brand-green">92%</p>
                    <p className="text-xs text-text-secondary">Hitec City Saturation</p>
                  </div>
                  <div className="h-10 w-px bg-border-default" />
                  <div>
                    <p className="text-2xl font-bold text-brand-gold-dark">4.8h</p>
                    <p className="text-xs text-text-secondary">Mean Approval Speed</p>
                  </div>
                </div>
              </div>

              <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl border border-border-default md:w-64">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${HEATMAP_IMAGE_URL}')` }}
                />
                <div className="pointer-events-none absolute inset-0 bg-brand-green/15" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between rounded-lg bg-brand-white/95 px-3 py-1.5 text-xs font-medium text-text-primary shadow-xs backdrop-blur">
                  <span className="truncate">Micro-Market Heatmap</span>
                  <span className="font-semibold text-brand-green">Live</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Toast Banner (Exact match with VendorBusinessProfileClient) */}
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
