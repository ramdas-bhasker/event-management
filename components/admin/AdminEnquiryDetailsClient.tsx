'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
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

const PIPELINE_STATUS_OPTIONS: SelectOption[] = [
  { value: 'new', label: 'New / Triage' },
  { value: 'assigned', label: 'Assigned to Vendors (3)' },
  { value: 'contacted', label: 'Customer Contacted' },
  { value: 'quote_received', label: 'Quotation Received' },
  { value: 'booked', label: 'Booked & Contracted' },
  { value: 'unconverted', label: 'Not Converted' },
  { value: 'closed', label: 'Closed / Archived' },
];

const RESPONSE_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Quotation Sent', label: 'Quotation Sent' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Assigned', label: 'Assigned' },
];

const MOODBOARD_REFERENCES = [
  {
    id: 'ref-1',
    title: 'Mandap Ref 1',
    alt: 'Traditional South Indian temple wedding mandap in Hyderabad with dense marigold garland pillars and brass lamps',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCNx4ZivvKbwe98VJlV2NQZBhE59VnSmug-6MDjXkvYKLEZL-rL-AjoUgrCaz1mvqJ3uXsxIWYT5qUaDIjRq9_CVS4tWrWCJi0aXqDVAD-C2ZH-b8KgC4hkRHBoyUcGorJKldrd9c7XC5NT9yeHO2Ymbj8FY4SlcYcS2fcS84agOlg2NOJYhbucXh51lguzj0VFFsPRCPzWScp4h0KLl_IZ6yrRCzB5z4g8lvqTE5c',
  },
  {
    id: 'ref-2',
    title: 'Entrance Arch',
    alt: 'Elegant Indian wedding floral walkway pathway lined with fresh fragrant jasmine strings and bronze samai tall lamps',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKahPHPxduRdVGF2FtYahvUlTiztR2Umnxk1VG2Q2NXSJ3Hl8_TmksQJgjG61o5XeKSOtysiTMUp3Du-CB9I6NbW8qT_wbGf8BsDCgQ_jI0zQn1bOp8d_TgD5lKjvwne5i9xwpa_0V94_j-dO1lDbSf4ilVITwtrjalj-AbeW6fk_ZYDUnmdaettaPhXskP3eUZGnPQHUDDxZ0R953mdufWVi-_UW7PfMaGRU9cSE',
  },
  {
    id: 'ref-3',
    title: 'Lawn Lighting',
    alt: 'Evening outdoor wedding lawn in Hyderabad illuminated with thousands of warm fairy canopy lights',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAwuBZxi0z-_yPERiqCDjIp5-uMKYJ6-SUHsJuUihsE4c4qI6b5dpQeVpXVLFrHafpRSglGncab82n_ntVMudT-4pIcxiTNeLgoT1kQ9l41NZue0r-YaVXvBASGNcPL8ZefA5Jt9WfAwiFY7gVTGXrNfnuC_OXEG3XvBuKugvY6zAT6XykcgAsUd2tR1qFjCnFzD8MYT3KZfx9feXRysOyPK7K41XiwWkven33jxbY',
  },
];

interface AssignedVendorItem {
  id: string;
  initials: string;
  badgeStyle: 'green' | 'gold' | 'neutral';
  businessName: string;
  categoryAndLocality: string;
  ratingText: string;
  assignedOn: string;
  assignedSub: string;
  responseStatus: 'Quotation Sent' | 'Contacted' | 'Assigned';
  quotationValue: string;
  quotationSub?: string;
  actionLabel: string;
  actionTone: 'primary' | 'outline' | 'danger';
  slug?: string;
}

interface InternalAdminNote {
  id: string;
  author: string;
  time: string;
  text: string;
  isSystem?: boolean;
}

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

export function AdminEnquiryDetailsClient() {
  const defaultVendor = getDefaultMockVendor();
  const [sharedProfile, setSharedProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(defaultVendor)
  );
  const [activeNav, setActiveNav] = useState('Enquiry Management');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  const [pipelineStatus, setPipelineStatus] = useState('new');
  const [responseFilter, setResponseFilter] = useState('all');
  const [noteInput, setNoteInput] = useState('');
  const [zoomedMoodboard, setZoomedMoodboard] = useState<{
    title: string;
    imageUrl: string;
  } | null>(null);

  const [notes, setNotes] = useState<InternalAdminNote[]>([
    {
      id: 'note-1',
      author: 'Rajesh V. (Super Admin)',
      time: '10:05 AM',
      text: 'Spoke with Ananya via phone. She preferred Banjara Hills & Gachibowli vendors with verified temple mandap portfolios. Pushed to Sri Venkateswara & Navya Grandeur.',
    },
    {
      id: 'note-2',
      author: 'Auto-System Bot',
      time: '09:30 AM',
      text: 'High-intent lead score generated based on complete budget specification and verified mobile.',
      isSystem: true,
    },
  ]);

  useEffect(() => {
    setSharedProfile(readVendorBusinessProfileSession(defaultVendor));
  }, [defaultVendor]);

  const assignedVendors: AssignedVendorItem[] = useMemo(
    () => [
      {
        id: 'av-1',
        initials: 'SV',
        badgeStyle: 'green',
        businessName: sharedProfile.businessName || 'Sri Venkateswara Mandap & Floral',
        categoryAndLocality: `Wedding Decorators • ${sharedProfile.areaLocality || 'Banjara Hills'}, Hyd`,
        ratingText: '★ 4.9 (128 reviews)',
        assignedOn: '14 May, 09:45 AM',
        assignedSub: 'Auto-routed via criteria',
        responseStatus: 'Quotation Sent',
        quotationValue: '₹5,25,000',
        quotationSub: 'Within Target Range',
        actionLabel: 'View Quote',
        actionTone: 'primary',
        slug: 'sri-venkateswara-mandap-floral',
      },
      {
        id: 'av-2',
        initials: 'NG',
        badgeStyle: 'gold',
        businessName: 'Navya Grandeur Luxury Weddings',
        categoryAndLocality: 'Wedding Decorators • Gachibowli, Hyd',
        ratingText: '★ 4.8 (94 reviews)',
        assignedOn: '14 May, 09:45 AM',
        assignedSub: 'Dispatched via Super Admin',
        responseStatus: 'Contacted',
        quotationValue: 'Drafting Quote',
        actionLabel: 'Follow-up Ping',
        actionTone: 'outline',
        slug: 'navya-grandeur-luxury-weddings',
      },
      {
        id: 'av-3',
        initials: 'MM',
        badgeStyle: 'neutral',
        businessName: 'Moments & Memories Studio',
        categoryAndLocality: 'Wedding Photographers • Jubilee Hills, Hyd',
        ratingText: '★ 4.7 (72 reviews)',
        assignedOn: '14 May, 10:10 AM',
        assignedSub: 'Manual add by Rajesh V.',
        responseStatus: 'Assigned',
        quotationValue: 'Awaiting Lead Open',
        actionLabel: 'Reassign',
        actionTone: 'danger',
        slug: 'moments-event-photography-films',
      },
    ],
    [sharedProfile.areaLocality, sharedProfile.businessName]
  );

  const filteredAssignedVendors = useMemo(() => {
    if (responseFilter === 'all') return assignedVendors;
    return assignedVendors.filter((v) => v.responseStatus === responseFilter);
  }, [assignedVendors, responseFilter]);

  const statusBadgeText = useMemo(() => {
    const found = PIPELINE_STATUS_OPTIONS.find((item) => item.value === pipelineStatus);
    return pipelineStatus === 'new'
      ? 'New (Triage & Assignment)'
      : found?.label || 'New (Triage & Assignment)';
  }, [pipelineStatus]);

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

  function handleSaveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = noteInput.trim();
    if (!trimmed) return;
    setNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        author: 'Rajesh V. (Super Admin)',
        time: 'Just now',
        text: trimmed,
      },
      ...prev,
    ]);
    setNoteInput('');
    setToast('Confidential internal admin note saved to enquiry record.');
  }

  return (
    <div className="min-h-screen bg-brand-ivory text-text-primary">
      {/* Desktop Sidebar (Identical across all Admin Console screens) */}
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
                Enquiry Details &amp; Vendor Tracking
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
                    Sri Venkateswara Mandap &amp; Floral submitted quotation ₹5,25,000 for
                    AS-ENQ-2026-1042.
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
          {/* Top Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary"
          >
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1 hover:text-brand-green"
            >
              <span className="material-symbols-outlined !text-[15px]">home</span>
              <span>Enquiry Management</span>
            </Link>
            <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
            <span className="font-mono font-medium text-text-primary">AS-ENQ-2026-1042</span>
            <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
            <span className="font-semibold text-brand-green">Details</span>
          </nav>

          {/* Header Actions & Meta Block */}
          <section className="flex flex-col justify-between gap-4 rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-brand-green sm:text-2xl">
                  Traditional Telugu Wedding &amp; Mandap Decor
                </h2>
                <span className="rounded-full bg-brand-gold-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                  {statusBadgeText}
                </span>
                <span className="rounded bg-brand-ivory px-2 py-0.5 font-mono text-xs font-semibold text-text-primary">
                  AS-ENQ-2026-1042
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined !text-[14px] text-brand-gold-dark">
                    schedule
                  </span>
                  Submitted: Today, 14 May 2026 • 09:30 AM IST
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined !text-[14px]">sync_alt</span>
                  Last Updated: 15 mins ago by Auto-Triage
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-medium text-brand-green">
                  <span className="material-symbols-outlined !text-[14px]">location_on</span>
                  Financial District, Hyderabad
                </span>
              </div>
            </div>

            {/* Action Button Group */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPipelineStatus('closed');
                  setToast('Enquiry AS-ENQ-2026-1042 marked as Closed / Archived.');
                }}
                className="btn btn-sm btn-danger-ghost inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined !text-[16px]">block</span>
                <span>Close Enquiry</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPipelineStatus('assigned');
                  setToast('Pipeline status synced across assigned vendors.');
                }}
                className="btn btn-sm btn-outline inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined !text-[16px]">tune</span>
                <span>Update Status</span>
              </button>
              <Link
                href="/admin/enquiries/assign"
                className="btn btn-sm btn-primary inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined !text-[16px]">person_add</span>
                <span>+ Assign Vendors</span>
              </Link>
            </div>
          </section>

          {/* Primary 2-Column Workspace Grid (8 cols Left + 4 cols Right) */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
            {/* LEFT MAIN COLUMN: 8 Columns */}
            <div className="space-y-6 xl:col-span-8">
              {/* CARD A: Customer Profile */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border-default pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                      <span className="material-symbols-outlined !text-[18px]">person</span>
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-brand-green">Customer Profile</h3>
                      <p className="text-xs text-text-secondary">
                        Verified direct consumer account
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-gold-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                    First-time Marketplace Planner
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-brand-ivory p-4">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      Host &amp; Organizer
                    </span>
                    <p className="mt-1 text-lg font-bold text-brand-green">Ananya Reddy</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
                      <span className="material-symbols-outlined !text-[14px] text-brand-gold-dark">
                        explore
                      </span>
                      <span>Banjara Hills, Road No. 12, Hyderabad</span>
                    </p>
                  </div>

                  <div className="rounded-lg bg-brand-ivory p-4">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      Direct Contacts
                    </span>
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined !text-[16px] text-brand-green">
                          call
                        </span>
                        <span className="text-sm font-semibold text-text-primary">
                          +91 98490 12345
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-state-success-bg px-2 py-0.5 text-[10px] font-semibold text-state-success">
                          OTP OK
                        </span>
                        <span className="rounded bg-brand-green-light px-2 py-0.5 text-[10px] font-semibold text-brand-green">
                          WhatsApp
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs">
                      <span className="material-symbols-outlined !text-[15px] text-text-secondary">
                        mail
                      </span>
                      <a
                        href="mailto:ananya.reddy@gmail.com"
                        className="font-medium text-brand-green hover:underline"
                      >
                        ananya.reddy@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Customer Stated Preference Note */}
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-brand-gold-border bg-brand-gold-light/40 p-4">
                  <span className="material-symbols-outlined mt-0.5 !text-[20px] text-brand-gold-dark">
                    format_quote
                  </span>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark">
                      Customer Requirement Note
                    </span>
                    <p className="mt-1 text-xs italic leading-relaxed text-text-primary sm:text-sm">
                      “Looking for traditional South Indian fresh flower mandap with tuberose &amp;
                      marigold, along with ambient evening lawn lighting for 600 guests.”
                    </p>
                  </div>
                </div>
              </section>

              {/* CARD B: Event Specifications */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border-default pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold-light text-brand-gold-dark">
                      <span className="material-symbols-outlined !text-[18px]">celebration</span>
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-brand-green">Event Specifications</h3>
                      <p className="text-xs text-text-secondary">
                        Operational constraints and budget parameters
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-state-success-bg px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-state-success">
                    Confirmed Date
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-4">
                  <div className="rounded-lg bg-brand-ivory p-3.5">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      Occasion
                    </span>
                    <span className="mt-1 block text-sm font-bold text-text-primary">
                      Wedding &amp; Reception
                    </span>
                    <span className="mt-1 block text-xs font-medium text-brand-green">
                      Muhurtham: 8:45 AM
                    </span>
                  </div>

                  <div className="rounded-lg bg-brand-ivory p-3.5">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      Target Date
                    </span>
                    <span className="mt-1 block text-sm font-bold text-text-primary">
                      14 Dec 2026
                    </span>
                    <span className="mt-1 block text-xs text-text-secondary">
                      Winter Auspicious Window
                    </span>
                  </div>

                  <div className="rounded-lg bg-brand-ivory p-3.5">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      Guest Count
                    </span>
                    <span className="mt-1 block text-lg font-bold text-brand-green">
                      600{' '}
                      <span className="text-xs font-normal text-text-secondary">Guests</span>
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-brand-gold-dark">
                      Peak Attendance
                    </span>
                  </div>

                  <div className="rounded-lg bg-brand-green p-3.5 text-white shadow-xs">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/75">
                      Est. Budget
                    </span>
                    <span className="mt-1 block text-lg font-bold text-white">₹5,50,000</span>
                    <span className="mt-0.5 block text-xs font-medium text-brand-gold">
                      Flexible (±10%)
                    </span>
                  </div>
                </div>

                {/* Venue Details Banner */}
                <div className="mt-4 flex flex-col justify-between gap-3 rounded-lg bg-brand-ivory p-4 md:flex-row md:items-center">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-white text-brand-green shadow-2xs">
                      <span className="material-symbols-outlined !text-[20px]">apartment</span>
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-text-primary">
                          Classic Convention Three
                        </span>
                        <span className="rounded border border-border-default bg-brand-white px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                          Lawn + Main Hall
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        Financial District, Nanakramguda, Hyderabad, Telangana — 500032
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setToast(
                        'Classic Convention Three: 24ft ceiling clearance, 600-pax lawn + pillarless hall.'
                      )
                    }
                    className="inline-flex shrink-0 items-center gap-1 self-start text-xs font-semibold text-brand-green hover:text-brand-gold-dark md:self-auto"
                  >
                    <span>View Venue Specs</span>
                    <span className="material-symbols-outlined !text-[15px]">north_east</span>
                  </button>
                </div>

                {/* Service Tag Pills */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-default pt-4">
                  <span className="mr-1 text-xs font-medium text-text-secondary">
                    Scope Requested:
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-brand-ivory px-3 py-1 text-xs font-medium text-text-primary">
                    <span className="material-symbols-outlined !text-[14px] text-brand-gold-dark">
                      yard
                    </span>
                    Wedding Decorators
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-brand-ivory px-3 py-1 text-xs font-medium text-text-primary">
                    <span className="material-symbols-outlined !text-[14px] text-brand-gold-dark">
                      temple_hindu
                    </span>
                    Traditional Mandap Artists
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-brand-ivory px-3 py-1 text-xs font-medium text-text-primary">
                    <span className="material-symbols-outlined !text-[14px] text-brand-gold-dark">
                      flare
                    </span>
                    Ambient Event Lighting
                  </span>
                </div>
              </section>

              {/* CARD C: Detailed Scope & Deliverables */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border-default pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                      <span className="material-symbols-outlined !text-[18px]">palette</span>
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-brand-green">
                        Detailed Scope &amp; Deliverables
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Customized setup protocols and timeline requirements
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                    Telugu Traditional Style
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
                  <div className="rounded-lg bg-brand-ivory p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-green">
                      <span className="material-symbols-outlined !text-[16px]">
                        temple_buddhist
                      </span>
                      <span>Mandap Core Structure</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                      South Indian temple pillar aesthetics. Banana tree trunks with woven fresh
                      coconut palm leaf base, yellow &amp; orange marigold hangings.
                    </p>
                  </div>

                  <div className="rounded-lg bg-brand-ivory p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-green">
                      <span className="material-symbols-outlined !text-[16px]">nature_people</span>
                      <span>Pathway &amp; Floral Accents</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                      Floral walkway with hanging tuberose (sampangi) strands, jasmine tassels, and
                      polished gold brass samai lamps at 6-foot intervals.
                    </p>
                  </div>

                  <div className="rounded-lg bg-brand-ivory p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-green">
                      <span className="material-symbols-outlined !text-[16px]">light</span>
                      <span>Stage &amp; Ambient Lighting</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                      Warm 2700K fairy string canopy for cocktail lawn, focus warm framing lights on
                      deity backdrop, zero blue or ultraviolet lights.
                    </p>
                  </div>
                </div>

                {/* Venue Access Protocol Strip */}
                <div className="mt-4 flex items-start gap-3 rounded-lg border border-brand-gold-border bg-brand-gold-light/40 p-4">
                  <span className="material-symbols-outlined mt-0.5 !text-[20px] text-brand-gold-dark">
                    timer
                  </span>
                  <div className="text-xs leading-relaxed text-text-primary">
                    <span className="block font-bold text-brand-gold-dark">
                      Rigid Execution Timeline
                    </span>
                    <p className="mt-0.5">
                      Venue accessible from <strong>4:00 AM on 14 Dec 2026</strong>. Mandap setup,
                      priest seating arrangements, and floral backdrops{' '}
                      <strong className="text-state-error">MUST finish by 7:30 AM sharp</strong>{' '}
                      prior to bride arrival and Muhurtham rituals (08:45 AM).
                    </p>
                  </div>
                </div>

                {/* Reference Moodboard Showcase */}
                <div className="mt-5">
                  <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    Customer Uploaded Moodboard / References
                  </span>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                    {MOODBOARD_REFERENCES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setZoomedMoodboard({ title: item.title, imageUrl: item.imageUrl })
                        }
                        className="group relative h-32 overflow-hidden rounded-lg border border-border-default bg-brand-ivory text-left"
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-brand-green/25 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined text-white">zoom_in</span>
                        </div>
                        <span className="absolute bottom-2 left-2 rounded bg-brand-green/85 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* CARD D: Assigned Approved Vendors & Response Tracking */}
              <section className="overflow-hidden rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex flex-col justify-between gap-3 border-b border-border-default pb-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green text-white">
                      <span className="material-symbols-outlined !text-[18px]">handshake</span>
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-brand-green">
                          Assigned Approved Vendors
                        </h3>
                        <span className="rounded-full bg-brand-green-light px-2.5 py-0.5 text-[10px] font-bold text-brand-green">
                          3 of 5 Max
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Active dispatch tracking &amp; quotation progress
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <AdminCustomSelect
                      ariaLabel="Filter assigned vendors by response status"
                      value={responseFilter}
                      options={RESPONSE_FILTER_OPTIONS}
                      onChange={setResponseFilter}
                      className="!w-40"
                    />
                    <Link
                      href="/admin/enquiries/assign"
                      className="btn btn-sm btn-primary inline-flex h-10 items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined !text-[16px]">add_business</span>
                      <span>Match Vendor</span>
                    </Link>
                  </div>
                </div>

                {/* Vendor Dispatch Notice Banner */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-brand-ivory px-3.5 py-2.5 text-xs text-text-secondary">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined !text-[15px] text-brand-gold-dark">
                      info
                    </span>
                    Only approved AyojanSetu vendors can be assigned. One enquiry can be matched
                    with up to 5 verified vendors.
                  </span>
                  <span className="font-semibold text-brand-gold-dark">2 Slots Remaining</span>
                </div>

                {/* Assigned Vendors Data Table (No horizontal scrollbar on desktop, clean status badges, clean single action buttons) */}
                <div className="w-full max-lg:overflow-x-auto">
                  <table className="w-full table-fixed border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border-default bg-brand-ivory text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                        <th className="w-[34%] px-3 py-3">Vendor Business &amp; Hub</th>
                        <th className="w-[18%] px-2.5 py-3">Assigned On</th>
                        <th className="w-[16%] px-2.5 py-3">Response Status</th>
                        <th className="w-[16%] px-2.5 py-3">Quotation</th>
                        <th className="w-[16%] px-3 py-3 text-right">Admin Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border-default text-xs text-text-primary">
                      {filteredAssignedVendors.map((vendor) => (
                        <tr
                          key={vendor.id}
                          className="transition-colors hover:bg-brand-ivory"
                        >
                          <td className="px-3 py-3.5">
                            <div className="flex items-start gap-2.5">
                              <span
                                className={cn(
                                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                                  vendor.badgeStyle === 'green' &&
                                    'bg-brand-green-light text-brand-green',
                                  vendor.badgeStyle === 'gold' &&
                                    'bg-brand-gold-light text-brand-gold-dark',
                                  vendor.badgeStyle === 'neutral' &&
                                    'bg-brand-ivory text-text-primary'
                                )}
                              >
                                {vendor.initials}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="truncate font-semibold text-brand-green">
                                    {vendor.businessName}
                                  </span>
                                  <span
                                    className="material-symbols-outlined shrink-0 !text-[14px] text-brand-gold-dark"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                  >
                                    verified
                                  </span>
                                </div>
                                <span className="block truncate text-[11px] text-text-secondary">
                                  {vendor.categoryAndLocality}
                                </span>
                                <span className="mt-0.5 block text-[11px] font-medium text-brand-gold-dark">
                                  {vendor.ratingText}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-2.5 py-3.5">
                            <span className="block font-medium text-text-primary">
                              {vendor.assignedOn}
                            </span>
                            <span className="mt-0.5 block truncate text-[11px] text-text-secondary">
                              {vendor.assignedSub}
                            </span>
                          </td>

                          {/* Clean Status Badge (no inner dot/icon per user standing preference) */}
                          <td className="px-2.5 py-3.5">
                            {vendor.responseStatus === 'Quotation Sent' && (
                              <span className="inline-flex items-center whitespace-nowrap rounded-full bg-state-success-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-state-success">
                                Quotation Sent
                              </span>
                            )}
                            {vendor.responseStatus === 'Contacted' && (
                              <span className="inline-flex items-center whitespace-nowrap rounded-full bg-brand-gold-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                                Contacted
                              </span>
                            )}
                            {vendor.responseStatus === 'Assigned' && (
                              <span className="inline-flex items-center whitespace-nowrap rounded-full bg-brand-ivory px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                                Assigned
                              </span>
                            )}
                          </td>

                          <td className="px-2.5 py-3.5">
                            <span
                              className={cn(
                                'block font-semibold',
                                vendor.quotationSub ? 'text-brand-green' : 'text-text-secondary'
                              )}
                            >
                              {vendor.quotationValue}
                            </span>
                            {vendor.quotationSub && (
                              <span className="mt-0.5 block text-[11px] font-medium text-state-success">
                                {vendor.quotationSub}
                              </span>
                            )}
                          </td>

                          {/* Clean Action Button (no extra icon clutter on right) */}
                          <td className="px-3 py-3.5 text-right">
                            {vendor.actionTone === 'primary' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setToast(
                                    `Opened ₹5,25,000 itemised quotation from ${vendor.businessName}.`
                                  )
                                }
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-brand-green px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-green-hover"
                              >
                                {vendor.actionLabel}
                              </button>
                            )}
                            {vendor.actionTone === 'outline' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setToast(
                                    `Dispatched follow-up reminder to ${vendor.businessName}.`
                                  )
                                }
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-border-default bg-brand-white px-2.5 py-1.5 text-xs font-semibold text-brand-green transition-colors hover:border-brand-green hover:bg-brand-ivory"
                              >
                                {vendor.actionLabel}
                              </button>
                            )}
                            {vendor.actionTone === 'danger' && (
                              <Link
                                href="/admin/enquiries/assign"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-border-default bg-brand-white px-3 py-1.5 text-xs font-semibold text-state-error transition-colors hover:border-state-error hover:bg-state-error-bg"
                              >
                                {vendor.actionLabel}
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR COLUMN: 4 Columns */}
            <div className="space-y-6 xl:col-span-4">
              {/* WIDGET 1: Lifecycle & Triage + Internal Admin Notes */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-border-default pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[20px] text-brand-green">
                      toggle_on
                    </span>
                    <h3 className="text-base font-bold text-brand-green">Lifecycle &amp; Triage</h3>
                  </div>
                  <span className="rounded bg-brand-gold-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                    Admin Only
                  </span>
                </div>

                {/* Custom Dropdown Status Switcher */}
                <div className="mb-5">
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    Current Pipeline Status
                  </label>
                  <AdminCustomSelect
                    ariaLabel="Current pipeline status"
                    value={pipelineStatus}
                    options={PIPELINE_STATUS_OPTIONS}
                    onChange={(val) => {
                      setPipelineStatus(val);
                      const label =
                        PIPELINE_STATUS_OPTIONS.find((item) => item.value === val)?.label || val;
                      setToast(`Enquiry status updated to "${label}".`);
                    }}
                    className="!w-full"
                  />
                </div>

                {/* Internal Admin Notes */}
                <div className="space-y-3 border-t border-border-default pt-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                      <span className="material-symbols-outlined !text-[15px] text-brand-gold-dark">
                        lock
                      </span>
                      Internal Admin Notes
                    </span>
                    <span className="text-[11px] text-text-secondary">Confidential</span>
                  </div>

                  <form onSubmit={handleSaveNote} className="space-y-2.5">
                    <textarea
                      rows={3}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add confidential note regarding customer, vendor pricing negotiations, or special instructions..."
                      className="w-full resize-none rounded-lg border border-border-default bg-brand-ivory p-3 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-brand-green focus:bg-brand-white focus:ring-2 focus:ring-brand-green/10"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary inline-flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined !text-[15px]">add_comment</span>
                        <span>Save Note</span>
                      </button>
                    </div>
                  </form>

                  {/* Note Log History */}
                  <div className="space-y-2.5 pt-2">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className={cn(
                          'rounded-lg p-3 text-xs',
                          note.isSystem ? 'bg-brand-ivory/60' : 'bg-brand-ivory'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'font-semibold',
                              note.isSystem ? 'text-text-secondary' : 'text-brand-green'
                            )}
                          >
                            {note.author}
                          </span>
                          <span className="text-[11px] text-text-secondary">{note.time}</span>
                        </div>
                        <p className="mt-1 leading-relaxed text-text-secondary">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* WIDGET 2: Activity Timeline */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex items-center justify-between border-b border-border-default pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[20px] text-brand-gold-dark">
                      history
                    </span>
                    <h3 className="text-base font-bold text-brand-green">Activity Timeline</h3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    Real-time Feed
                  </span>
                </div>

                <div className="relative space-y-4 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-border-default">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-brand-green ring-4 ring-brand-white" />
                    <p className="text-xs font-semibold text-text-primary">
                      Moments &amp; Memories Studio assigned
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      10:10 AM • by Rajesh V. (Admin)
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-brand-gold-dark ring-4 ring-brand-white" />
                    <p className="text-xs font-semibold text-text-primary">
                      {sharedProfile.businessName || 'Sri Venkateswara Mandap'} sent Quotation
                    </p>
                    <p className="text-[11px] font-semibold text-brand-green">
                      ₹5,25,000 • 09:52 AM
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-border-default ring-4 ring-brand-white" />
                    <p className="text-xs font-semibold text-text-primary">
                      Enquiry dispatched to 2 Vendors
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      09:45 AM • Auto-Triage Router
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-state-success ring-4 ring-brand-white" />
                    <p className="text-xs font-semibold text-text-primary">
                      Customer Mobile Authenticated
                    </p>
                    <p className="text-[11px] text-text-secondary">09:35 AM • via OTP (#9042)</p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-brand-green-light ring-4 ring-brand-white" />
                    <p className="text-xs font-semibold text-text-primary">
                      Enquiry AS-ENQ-2026-1042 created
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      09:30 AM • Ananya Reddy (Marketplace Web)
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-border-default pt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setToast('Showing complete audit trail for AS-ENQ-2026-1042.')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:text-brand-gold-dark"
                  >
                    <span>View Full Audit Log</span>
                    <span className="material-symbols-outlined !text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </section>

              {/* WIDGET 3: Customer History */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-3.5 flex items-center justify-between border-b border-border-default pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[20px] text-text-secondary">
                      account_box
                    </span>
                    <h3 className="text-base font-bold text-brand-green">Customer History</h3>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-text-secondary">
                    ID: CUST-8831
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-brand-ivory px-3.5 py-2.5">
                    <span className="text-text-secondary">Lifetime Enquiries</span>
                    <span className="font-bold text-text-primary">
                      1 <span className="font-normal text-text-secondary">(Active)</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-brand-ivory px-3.5 py-2.5">
                    <span className="text-text-secondary">Platform Join Date</span>
                    <span className="font-semibold text-text-primary">14 May 2026</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-brand-ivory px-3.5 py-2.5">
                    <span className="text-text-secondary">Concierge Support</span>
                    <span className="rounded-full bg-brand-gold-light px-2.5 py-0.5 text-[10px] font-semibold text-brand-gold-dark">
                      Requested Hyd Desk
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg border border-border-default bg-brand-ivory/60 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[18px] text-brand-gold-dark">
                      support_agent
                    </span>
                    <span className="text-xs font-medium text-text-primary">
                      AyojanSetu Hyderabad Concierge
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setToast('Connected bridge call to Ananya Reddy (+91 98490 12345).')
                    }
                    className="text-xs font-semibold text-brand-green hover:text-brand-gold-dark"
                  >
                    Initiate Call
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Moodboard Lightbox Modal */}
      {zoomedMoodboard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={zoomedMoodboard.title}
        >
          <div className="relative max-w-2xl overflow-hidden rounded-2xl bg-brand-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-bold text-brand-green">{zoomedMoodboard.title}</h4>
              <button
                type="button"
                onClick={() => setZoomedMoodboard(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-brand-ivory"
              >
                <span className="material-symbols-outlined !text-[18px]">close</span>
              </button>
            </div>
            <div className="relative h-80 w-[min(36rem,82vw)] overflow-hidden rounded-xl bg-brand-ivory sm:h-96">
              <Image
                src={zoomedMoodboard.imageUrl}
                alt={zoomedMoodboard.title}
                fill
                sizes="600px"
                className="object-cover"
              />
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
