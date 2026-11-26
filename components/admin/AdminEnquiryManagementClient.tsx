'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createBusinessProfile,
  getDefaultMockVendor,
  readVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { getMockEnquiries } from '@/lib/mock-enquiry-service';
import { cn } from '@/lib/utils';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

type AdminEnquiryStatus =
  | 'NEW'
  | 'QUOTATION RECEIVED'
  | 'BOOKED'
  | 'CONTACTED'
  | 'NOT CONVERTED';

interface AdminEnquiryRow {
  id: string;
  enquiryId: string;
  sourceChannel: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventTitle: string;
  eventCategory: string;
  eventDate: string;
  locality: string;
  budgetDisplay: string;
  budgetNumeric: number;
  guestCountDisplay: string;
  guestCountNumeric: number;
  vendorsSummary: string;
  vendorsList: string;
  vendorsDotColor: 'gold' | 'green' | 'error';
  submittedDate: string;
  submittedTime: string;
  statusKey: AdminEnquiryStatus;
  statusLabel: string;
  actionLabel: string;
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

const EVENT_TYPE_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Event Type: All Events' },
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Reception', label: 'Reception' },
  { value: 'Sangeet', label: 'Sangeet' },
  { value: 'Birthday', label: 'Birthday' },
  { value: 'Corporate Gala', label: 'Corporate Gala' },
  { value: 'Half Saree', label: 'Half Saree / Traditional' },
];

const MICRO_MARKET_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Hyd Micro-Market (All)' },
  { value: 'Jubilee Hills', label: 'Jubilee Hills' },
  { value: 'Banjara Hills', label: 'Banjara Hills' },
  { value: 'Gachibowli', label: 'Gachibowli' },
  { value: 'Madhapur', label: 'Madhapur' },
  { value: 'Hitec City', label: 'Hitec City' },
  { value: 'Secunderabad', label: 'Secunderabad' },
];

const BUDGET_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Budget (All)' },
  { value: 'under-1l', label: '< ₹1,00,000' },
  { value: '1l-3l', label: '₹1L – ₹3L' },
  { value: '3l-6l', label: '₹3L – ₹6L' },
  { value: 'above-6l', label: '₹6,00,000+' },
];

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'ALL', label: 'Status: All Statuses' },
  { value: 'NEW', label: 'Status: New' },
  { value: 'CONTACTED', label: 'Status: Contacted' },
  { value: 'QUOTATION RECEIVED', label: 'Status: Quotation Received' },
  { value: 'BOOKED', label: 'Status: Booked' },
  { value: 'NOT CONVERTED', label: 'Status: Not Converted' },
];

const SORT_FILTER_OPTIONS: SelectOption[] = [
  { value: 'newest', label: 'Sort: Newest First' },
  { value: 'budget-desc', label: 'Budget: High to Low' },
  { value: 'guests-desc', label: 'Guest Count: Largest' },
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

const BASE_ENQUIRY_ROWS: AdminEnquiryRow[] = [
  {
    id: 'enq-row-1',
    enquiryId: 'AS-ENQ-2026-1042',
    sourceChannel: 'Direct Portal',
    customerName: 'Ananya Reddy',
    customerPhone: '+91 98490 12345',
    customerEmail: 'ananya.r@gmail.com',
    eventTitle: 'Grand Wedding & Mandap',
    eventCategory: 'Wedding',
    eventDate: '14 Dec 2026',
    locality: 'Jubilee Hills, Hyd',
    budgetDisplay: '₹5,50,000',
    budgetNumeric: 550000,
    guestCountDisplay: '600 Guests',
    guestCountNumeric: 600,
    vendorsSummary: '3 Vendors Assigned',
    vendorsList: 'Sri Venkateswara Mandap & Floral, Navya Grandeur...',
    vendorsDotColor: 'gold',
    submittedDate: 'Today',
    submittedTime: '09:30 AM',
    statusKey: 'NEW',
    statusLabel: 'New (Triage Needed)',
    actionLabel: 'Assign Vendors',
  },
  {
    id: 'enq-row-2',
    enquiryId: 'AS-ENQ-2026-1039',
    sourceChannel: 'WhatsApp Flow',
    customerName: 'Rahul & Sneha V.',
    customerPhone: '+91 91772 88410',
    customerEmail: 'rahul.v@outlook.com',
    eventTitle: 'Sangeet & Cocktail Night',
    eventCategory: 'Sangeet',
    eventDate: '28 Oct 2026',
    locality: 'Gachibowli, Hyd',
    budgetDisplay: '₹3,20,000',
    budgetNumeric: 320000,
    guestCountDisplay: '350 Guests',
    guestCountNumeric: 350,
    vendorsSummary: '2 Vendors Responded',
    vendorsList: 'SoundVibe DJs, Royal Nizami Catering',
    vendorsDotColor: 'green',
    submittedDate: 'Yesterday',
    submittedTime: '04:15 PM',
    statusKey: 'QUOTATION RECEIVED',
    statusLabel: 'Quotation Recv. (₹3.1L)',
    actionLabel: 'View Quotes',
  },
  {
    id: 'enq-row-3',
    enquiryId: 'AS-ENQ-2026-1035',
    sourceChannel: 'Corporate Account',
    customerName: 'Dr. Sandeep Rao',
    customerPhone: '+91 99881 20034',
    customerEmail: 'sandeep.rao@hydtech.org',
    eventTitle: 'Corporate Annual Gala',
    eventCategory: 'Corporate Gala',
    eventDate: '15 Sep 2026',
    locality: 'Hitec City Convention',
    budgetDisplay: '₹8,00,000',
    budgetNumeric: 800000,
    guestCountDisplay: '800 Guests',
    guestCountNumeric: 800,
    vendorsSummary: '4 Vendors Confirmed',
    vendorsList: 'AV Masters, Deccan Hospitality...',
    vendorsDotColor: 'green',
    submittedDate: '12 May 2026',
    submittedTime: '10:00 AM',
    statusKey: 'BOOKED',
    statusLabel: 'Booked (Confirmed)',
    actionLabel: 'View Details',
  },
  {
    id: 'enq-row-4',
    enquiryId: 'AS-ENQ-2026-1028',
    sourceChannel: 'Direct Portal',
    customerName: 'Priya Hegde',
    customerPhone: '+91 97014 55678',
    customerEmail: 'priya.hegde@gmail.com',
    eventTitle: '1st Birthday & Cradle Ceremony',
    eventCategory: 'Birthday',
    eventDate: '04 Jun 2026',
    locality: 'Madhapur, Hyd',
    budgetDisplay: '₹95,000',
    budgetNumeric: 95000,
    guestCountDisplay: '150 Guests',
    guestCountNumeric: 150,
    vendorsSummary: '1 Vendor Contacted',
    vendorsList: 'Pastel Themes Decor',
    vendorsDotColor: 'gold',
    submittedDate: '11 May 2026',
    submittedTime: '02:40 PM',
    statusKey: 'CONTACTED',
    statusLabel: 'Contacted',
    actionLabel: 'View Details',
  },
  {
    id: 'enq-row-5',
    enquiryId: 'AS-ENQ-2026-1014',
    sourceChannel: 'Referral Inbound',
    customerName: 'Vikramaditya K.',
    customerPhone: '+91 94402 77890',
    customerEmail: 'vikram.k@yahoo.in',
    eventTitle: 'Half Saree Ceremony',
    eventCategory: 'Half Saree',
    eventDate: '22 Jul 2026',
    locality: 'Secunderabad, Hyd',
    budgetDisplay: '₹2,10,000',
    budgetNumeric: 210000,
    guestCountDisplay: '250 Guests',
    guestCountNumeric: 250,
    vendorsSummary: '2 Vendors Assigned',
    vendorsList: 'Varun Decors, Sri Sai Caterers',
    vendorsDotColor: 'error',
    submittedDate: '09 May 2026',
    submittedTime: '11:15 AM',
    statusKey: 'NOT CONVERTED',
    statusLabel: 'Not Converted (Budget)',
    actionLabel: 'View Log',
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

export function AdminEnquiryManagementClient() {
  const defaultVendor = getDefaultMockVendor();
  const [sharedProfile, setSharedProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(defaultVendor)
  );
  const [rows, setRows] = useState<AdminEnquiryRow[]>(BASE_ENQUIRY_ROWS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeNav, setActiveNav] = useState('Enquiry Management');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [microMarketFilter, setMicroMarketFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [rowsPerPage, setRowsPerPage] = useState('5');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const loadedProfile = readVendorBusinessProfileSession(defaultVendor);
    setSharedProfile(loadedProfile);

    // Also include any prototype customer enquiries submitted during this browser session
    const sessionEnquiries = getMockEnquiries();
    if (sessionEnquiries.length > 0) {
      const mappedSessionRows: AdminEnquiryRow[] = sessionEnquiries.map((rec, index) => ({
        id: `session-enq-${rec.id}-${index}`,
        enquiryId: rec.id,
        sourceChannel: 'Direct Portal',
        customerName: rec.fullName || 'Customer Lead',
        customerPhone: `+91 ${(rec.mobileNumber || '98490 00000').replace(/^\+91[\s-]*/, '')}`,
        customerEmail: rec.email || 'customer@ayojansetu.in',
        eventTitle: rec.eventType || 'Celebration Enquiry',
        eventCategory: rec.eventType || 'Wedding',
        eventDate: rec.eventDate || 'Upcoming 2026',
        locality: `${rec.eventLocation || rec.otherLocation || 'Jubilee Hills'}, Hyd`,
        budgetDisplay: rec.budget || '₹3,50,000',
        budgetNumeric: 350000,
        guestCountDisplay: rec.guestCount ? `${rec.guestCount} Guests` : '300 Guests',
        guestCountNumeric: Number(rec.guestCount) || 300,
        vendorsSummary: '1 Vendor Assigned',
        vendorsList: loadedProfile.businessName,
        vendorsDotColor: 'gold',
        submittedDate: 'Today',
        submittedTime: 'Just now',
        statusKey: 'NEW',
        statusLabel: 'New (Triage Needed)',
        actionLabel: 'Assign Vendors',
      }));
      setRows([...mappedSessionRows, ...BASE_ENQUIRY_ROWS]);
    }
  }, [defaultVendor]);

  // Keep Row 1 vendor list synced with shared Sri Venkateswara Mandap & Floral business name
  const syncedRows = useMemo(() => {
    return rows.map((row) => {
      if (row.id !== 'enq-row-1') return row;
      return {
        ...row,
        vendorsList: `${sharedProfile.businessName || 'Sri Venkateswara Mandap & Floral'}, Navya Grandeur...`,
      };
    });
  }, [rows, sharedProfile.businessName]);

  const filteredRows = useMemo(() => {
    const matching = syncedRows.filter((row) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          row.enquiryId.toLowerCase().includes(q) ||
          row.customerName.toLowerCase().includes(q) ||
          row.customerPhone.toLowerCase().includes(q) ||
          row.eventTitle.toLowerCase().includes(q) ||
          row.locality.toLowerCase().includes(q) ||
          row.vendorsList.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (eventTypeFilter !== 'all') {
        const matchEvent =
          row.eventCategory.toLowerCase().includes(eventTypeFilter.toLowerCase()) ||
          row.eventTitle.toLowerCase().includes(eventTypeFilter.toLowerCase());
        if (!matchEvent) return false;
      }

      if (microMarketFilter !== 'all') {
        if (!row.locality.toLowerCase().includes(microMarketFilter.toLowerCase())) {
          return false;
        }
      }

      if (budgetFilter !== 'all') {
        if (budgetFilter === 'under-1l' && row.budgetNumeric >= 100000) return false;
        if (budgetFilter === '1l-3l' && (row.budgetNumeric < 100000 || row.budgetNumeric > 300000))
          return false;
        if (budgetFilter === '3l-6l' && (row.budgetNumeric < 300000 || row.budgetNumeric > 600000))
          return false;
        if (budgetFilter === 'above-6l' && row.budgetNumeric < 600000) return false;
      }

      if (statusFilter !== 'ALL') {
        if (row.statusKey !== statusFilter) return false;
      }

      return true;
    });

    if (sortBy === 'budget-desc') {
      return [...matching].sort((a, b) => b.budgetNumeric - a.budgetNumeric);
    }
    if (sortBy === 'guests-desc') {
      return [...matching].sort((a, b) => b.guestCountNumeric - a.guestCountNumeric);
    }
    return matching;
  }, [
    syncedRows,
    searchQuery,
    eventTypeFilter,
    microMarketFilter,
    budgetFilter,
    statusFilter,
    sortBy,
  ]);

  function handleNavigate(label: string, href?: string) {
    setMobileNavOpen(false);
    setActiveNav(label);
    if (href && label !== 'Enquiry Management') {
      window.location.href = href;
      return;
    }
    if (label !== 'Enquiry Management') {
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
    setEventTypeFilter('all');
    setMicroMarketFilter('all');
    setBudgetFilter('all');
    setStatusFilter('ALL');
    setSortBy('newest');
  }

  return (
    <div className="min-h-screen bg-brand-ivory text-text-primary">
      {/* Desktop Sidebar (Identical across all Admin & Vendor Workspace pages) */}
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
        {/* Sticky Top Header (Identical across all Admin pages — no duplicate top search bar) */}
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
                Enquiry Management
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
                    48 new customer enquiries require vendor triage in the Hyderabad cluster.
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
          {/* Page Title & Quick Actions */}
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-bold tracking-tight text-brand-green sm:text-3xl">
                  Enquiry Management
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold-border bg-brand-gold-light px-2.5 py-0.5 text-[11px] font-semibold text-brand-gold-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold-dark" />
                  Demo Audit Data • Live Stream Active
                </span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                Monitor customer enquiries and track their progress across vendors in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setToast('Exported 1,420 enquiry records to CSV.')}
                className="btn btn-sm btn-outline inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">download</span>
                Export CSV
              </button>
              <Link
                href="/enquiry"
                className="btn btn-sm btn-primary inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">add</span>
                Manual Enquiry Entry
              </Link>
            </div>
          </section>

          {/* Summary Metrics Row (6 Cards) */}
          <section
            aria-label="Enquiry summary metrics"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          >
            {/* Card 1: Total Enquiries */}
            <article className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Total Enquiries
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                  <span className="material-symbols-outlined text-[18px]">assignment</span>
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-brand-green sm:text-3xl">1,420</p>
              <p className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-state-success">
                <span className="material-symbols-outlined text-[15px]">trending_up</span>
                +14% vs last mo
              </p>
            </article>

            {/* Card 2: New Enquiries */}
            <article className="rounded-xl border border-brand-gold-border bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">
                  New Enquiries
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold-light text-brand-gold-dark">
                  <span className="material-symbols-outlined text-[18px]">
                    notifications_active
                  </span>
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-brand-gold-dark sm:text-3xl">48</p>
              <p className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-brand-gold-dark">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold-dark" />
                Requires Triage
              </p>
            </article>

            {/* Card 3: Assigned to Vendors */}
            <article className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Assigned to Vendors
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-ivory text-brand-green">
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-brand-green sm:text-3xl">312</p>
              <p className="mt-2.5 text-xs text-text-secondary">Active Outreach</p>
            </article>

            {/* Card 4: Responded */}
            <article className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Responded
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-ivory text-brand-green">
                  <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-brand-green sm:text-3xl">580</p>
              <p className="mt-2.5 text-xs text-text-secondary">Quotes &amp; Contacted</p>
            </article>

            {/* Card 5: Converted / Booked */}
            <article className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Converted / Booked
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-state-success-bg text-state-success">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-brand-green sm:text-3xl">340</p>
              <p className="mt-2.5 text-xs font-semibold text-state-success">24.2% Conv. Rate</p>
            </article>

            {/* Card 6: Not Converted / Closed */}
            <article className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Not Converted / Closed
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-state-error-bg text-state-error">
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-brand-green sm:text-3xl">140</p>
              <p className="mt-2.5 text-xs text-text-secondary">Lost / Cancelled</p>
            </article>
          </section>

          {/* Operational Container: Custom Dropdown Toolbar + Data Table */}
          <section className="rounded-xl border border-border-default bg-brand-white shadow-xs">
            {/* Filter & Query Control Toolbar (Compact Search Bar + Custom Left-Aligned Dropdowns in Side-by-Side Columns) */}
            <div className="flex flex-col items-stretch justify-between gap-3 border-b border-border-default p-4 sm:p-5 xl:flex-row xl:items-center">
              {/* Compact Search Input */}
              <div className="relative w-full xl:max-w-[250px]">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-2.5 text-[18px] text-text-secondary">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Enquiry ID or customer..."
                  className="h-10 w-full rounded-lg border border-border-default bg-brand-white pl-9 pr-3 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                />
              </div>

              {/* Custom Dropdown Controls in Columns */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-nowrap lg:items-center">
                <AdminCustomSelect
                  ariaLabel="Filter by event type"
                  value={eventTypeFilter}
                  options={EVENT_TYPE_FILTER_OPTIONS}
                  onChange={setEventTypeFilter}
                  className="!w-full lg:!w-44"
                />
                <AdminCustomSelect
                  ariaLabel="Filter by Hyderabad micro-market"
                  value={microMarketFilter}
                  options={MICRO_MARKET_FILTER_OPTIONS}
                  onChange={setMicroMarketFilter}
                  className="!w-full lg:!w-44"
                />
                <AdminCustomSelect
                  ariaLabel="Filter by budget"
                  value={budgetFilter}
                  options={BUDGET_FILTER_OPTIONS}
                  onChange={setBudgetFilter}
                  className="!w-full lg:!w-36"
                />
                <AdminCustomSelect
                  ariaLabel="Filter by status"
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={setStatusFilter}
                  className="!w-full lg:!w-40"
                />
                <AdminCustomSelect
                  ariaLabel="Sort enquiries"
                  value={sortBy}
                  options={SORT_FILTER_OPTIONS}
                  onChange={setSortBy}
                  className="!w-full lg:!w-40"
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
                    <th className="px-3 py-3">Enquiry ID</th>
                    <th className="px-3 py-3">Customer Details</th>
                    <th className="px-3 py-3">Event &amp; Locality</th>
                    <th className="px-3 py-3">Scale &amp; Budget</th>
                    <th className="px-3 py-3">Vendors Engaged</th>
                    <th className="px-3 py-3">Submitted</th>
                    <th className="px-3 py-3">Status</th>
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

                        {/* Enquiry ID */}
                        <td className="whitespace-nowrap px-3 py-3.5">
                          <Link
                            href="/admin/enquiries/details"
                            className="font-mono text-xs font-bold text-brand-green hover:underline"
                          >
                            {row.enquiryId}
                          </Link>
                          <div className="mt-0.5 text-[11px] text-text-secondary">
                            {row.sourceChannel}
                          </div>
                        </td>

                        {/* Customer Details */}
                        <td className="px-3 py-3.5">
                          <div className="font-semibold text-text-primary">{row.customerName}</div>
                          <div className="mt-0.5 whitespace-nowrap text-[11px] text-text-secondary">
                            {row.customerPhone}
                          </div>
                          <div className="max-w-[155px] truncate text-[11px] text-text-secondary">
                            {row.customerEmail}
                          </div>
                        </td>

                        {/* Event & Locality */}
                        <td className="px-3 py-3.5">
                          <div className="font-semibold text-text-primary">{row.eventTitle}</div>
                          <div className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[11px] text-text-secondary">
                            <span className="material-symbols-outlined !text-[12px] leading-none text-brand-gold-dark">
                              calendar_today
                            </span>
                            <span>{row.eventDate}</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[11px] text-text-secondary">
                            <span className="material-symbols-outlined !text-[12px] leading-none">
                              location_on
                            </span>
                            <span>{row.locality}</span>
                          </div>
                        </td>

                        {/* Scale & Budget */}
                        <td className="whitespace-nowrap px-3 py-3.5">
                          <div className="font-semibold text-brand-green">{row.budgetDisplay}</div>
                          <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-text-secondary">
                            <span className="material-symbols-outlined !text-[12px] leading-none">
                              groups
                            </span>
                            <span>{row.guestCountDisplay}</span>
                          </div>
                        </td>

                        {/* Vendors Engaged */}
                        <td className="max-w-[195px] px-3 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'h-2 w-2 shrink-0 rounded-full',
                                row.vendorsDotColor === 'gold' && 'bg-brand-gold-dark',
                                row.vendorsDotColor === 'green' && 'bg-state-success',
                                row.vendorsDotColor === 'error' && 'bg-state-error'
                              )}
                            />
                            <span className="truncate font-semibold text-text-primary">
                              {row.vendorsSummary}
                            </span>
                          </div>
                          <div
                            className="mt-0.5 truncate text-[11px] text-text-secondary"
                            title={row.vendorsList}
                          >
                            {row.vendorsList}
                          </div>
                        </td>

                        {/* Submitted */}
                        <td className="whitespace-nowrap px-3 py-3.5">
                          <div className="font-medium text-text-primary">{row.submittedDate}</div>
                          <div className="mt-0.5 text-[11px] text-text-secondary">
                            {row.submittedTime}
                          </div>
                        </td>

                        {/* Status Badge (Clean pill without icons/dots inside, per user preference) */}
                        <td className="px-3 py-3.5">
                          {row.statusKey === 'NEW' && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-brand-gold-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                              {row.statusLabel}
                            </span>
                          )}

                          {row.statusKey === 'QUOTATION RECEIVED' && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-brand-green-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-green">
                              {row.statusLabel}
                            </span>
                          )}

                          {row.statusKey === 'BOOKED' && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-state-success-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-state-success">
                              {row.statusLabel}
                            </span>
                          )}

                          {row.statusKey === 'CONTACTED' && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-brand-ivory px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-primary">
                              {row.statusLabel}
                            </span>
                          )}

                          {row.statusKey === 'NOT CONVERTED' && (
                            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-state-error-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-state-error">
                              {row.statusLabel}
                            </span>
                          )}
                        </td>

                        {/* Actions (Clean button without trailing icons, per user preference) */}
                        <td className="whitespace-nowrap px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end">
                            {row.statusKey === 'NEW' ? (
                              <Link
                                href="/admin/enquiries/assign"
                                className="rounded-lg bg-brand-green px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-green-hover"
                              >
                                {row.actionLabel}
                              </Link>
                            ) : (
                              <Link
                                href="/admin/enquiries/details"
                                className="rounded-lg border border-border-default bg-brand-white px-3 py-1.5 text-xs font-semibold text-brand-green transition-colors hover:border-brand-green hover:bg-brand-ivory"
                              >
                                {row.actionLabel}
                              </Link>
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
                  <span className="font-semibold text-brand-green">48</span> New Enquiries
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
                <span className="px-1 text-xs text-text-secondary">...</span>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-text-primary transition-colors hover:bg-brand-ivory"
                >
                  10
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

          {/* Bottom Operational Widget: Quick Enquiry Health Monitor & High-Value Triage Queue */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Health Overview Bento 1 (8 cols) */}
            <section className="flex flex-col justify-between rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6 lg:col-span-8">
              <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-brand-gold-dark">
                      speed
                    </span>
                    <h3 className="text-base font-bold text-brand-green">
                      Enquiry SLA &amp; Micro-Market Demand Velocity
                    </h3>
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    Telangana State Event Orchestration SLA Benchmarks
                  </p>
                </div>
                <span className="self-start rounded-full bg-state-success-bg px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-state-success sm:self-auto">
                  Healthy State
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Turnaround Metric */}
                <div className="rounded-lg bg-brand-ivory p-3.5">
                  <span className="text-xs text-text-secondary">Vendor 1st Contact Time</span>
                  <p className="mt-1 text-xl font-bold text-brand-green">3.8 hrs</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-state-success">
                    <span className="material-symbols-outlined text-[13px]">arrow_downward</span>
                    -28m faster than target (4.0h)
                  </p>
                </div>

                {/* Micro-market leader */}
                <div className="rounded-lg bg-brand-ivory p-3.5">
                  <span className="text-xs text-text-secondary">Top Micro-Market Lead</span>
                  <p className="mt-1 text-base font-bold text-brand-green">
                    Jubilee &amp; Gachibowli
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-text-secondary">
                    42% of volume (avg budget ₹4.8L)
                  </p>
                </div>

                {/* Assignment Efficiency */}
                <div className="rounded-lg bg-brand-ivory p-3.5">
                  <span className="text-xs text-text-secondary">Auto-Dispatch Rate</span>
                  <p className="mt-1 text-xl font-bold text-brand-green">89.4%</p>
                  <p className="mt-1 text-[11px] font-medium text-text-secondary">
                    Rule-based routing to verified tiers
                  </p>
                </div>
              </div>

              {/* Weekly Turnaround Bar Sparkline SVG */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-text-secondary">
                    Hourly Triage Cadence (Last 7 Days):
                  </span>
                  <svg
                    className="h-6 w-36 text-brand-green"
                    fill="none"
                    viewBox="0 0 144 24"
                    aria-hidden="true"
                  >
                    <rect
                      fill="currentColor"
                      fillOpacity="0.3"
                      height="16"
                      rx="2"
                      width="10"
                      x="2"
                      y="8"
                    />
                    <rect
                      fill="currentColor"
                      fillOpacity="0.4"
                      height="19"
                      rx="2"
                      width="10"
                      x="22"
                      y="5"
                    />
                    <rect
                      fill="currentColor"
                      fillOpacity="0.3"
                      height="13"
                      rx="2"
                      width="10"
                      x="42"
                      y="11"
                    />
                    <rect
                      fill="currentColor"
                      fillOpacity="0.6"
                      height="21"
                      rx="2"
                      width="10"
                      x="62"
                      y="3"
                    />
                    <rect
                      fill="currentColor"
                      fillOpacity="0.5"
                      height="18"
                      rx="2"
                      width="10"
                      x="82"
                      y="6"
                    />
                    <rect
                      fill="currentColor"
                      fillOpacity="0.8"
                      height="22"
                      rx="2"
                      width="10"
                      x="102"
                      y="2"
                    />
                    <rect fill="currentColor" height="20" rx="2" width="10" x="122" y="4" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-brand-gold-dark">
                  99.2% Admin Resolution SLA Met
                </span>
              </div>
            </section>

            {/* Mini Priority Outreach Callout Bento 2 (4 cols) */}
            <section className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-brand-green p-5 text-white shadow-xs sm:p-6 lg:col-span-4">
              <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-brand-gold/20 blur-2xl" />
              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="rounded bg-brand-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green">
                    Admin Action
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-brand-gold">
                    assignment_late
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">High-Value Triage Queue</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/80">
                  3 enquiries exceeding <strong className="text-white">₹5,00,000</strong> are
                  awaiting premier vendor allocation for peak wedding dates in December 2026.
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-ping rounded-full bg-brand-gold" />
                  <span className="text-xs font-medium text-brand-gold">
                    Pending: 18m remaining
                  </span>
                </div>
                <Link
                  href="/admin/enquiries/assign"
                  className="rounded-lg bg-brand-gold px-3.5 py-1.5 text-xs font-bold text-brand-green shadow-xs transition-colors hover:bg-brand-gold/90"
                >
                  Bulk Assign
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

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
