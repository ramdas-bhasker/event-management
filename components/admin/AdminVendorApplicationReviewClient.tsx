'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import {
  createBusinessProfile,
  DEFAULT_ONBOARDING_PORTFOLIO_ITEMS,
  getCategoryLabelFromSlug,
  getDefaultMockVendor,
  getServiceAreaLabel,
  readVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { cn } from '@/lib/utils';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

type ModalActionType = 'approve' | 'request_changes' | 'reject' | null;
type ReviewStatusState = 'Pending Review' | 'Changes Requested' | 'Approved' | 'Rejected';

interface InternalNote {
  id: string;
  author: string;
  timestamp: string;
  content: string;
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

const REJECTION_REASONS = [
  'Unverifiable business location / fake profile',
  'Copyright infringement in portfolio images',
  'Pricing structure violates platform guidelines',
  'Duplicate entity already registered',
  'Other / Compliance mismatch',
];

const GEO_MAP_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB_F90XgHT_tfFs1axGXekcDhRgzIdexw1vGAdQW9hajWnOjEmQK-2U1P2AEklnkNSdWU-ly7hPhG1mkIM1eaqgipRnk5NnCDZvQif_nk1GGli1s404UfuA5-cHk4bWFJaEZ_9B2wTmbx5OX-lIsnRBbH0nSzdhWiw1IlhPhXeKxZxG4a6uAjgYtAPd4pPDPsei2TRqQOdWJMuxAN6B25LplwsWhoWPiZKiesBD05I';

const PORTFOLIO_DIMENSIONS = [
  { res: '4032 × 3024 px', tag: 'Exif Verified', featured: true },
  { res: '3840 × 2160 px', tag: 'Original File', featured: false },
  { res: '3024 × 4032 px', tag: 'Portrait Format', featured: false },
];

function RejectionReasonSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutsideClickAndEscape(rootRef, close, open);

  return (
    <div ref={rootRef} className={cn('ay-dropdown', open && 'is-open')}>
      <button
        type="button"
        className="ay-dropdown-trigger is-form-control !h-10 !min-h-10 !bg-brand-white !px-3 !text-xs"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((c) => !c)}
      >
        <span className="ay-dropdown-value min-w-0 flex-1 truncate text-left text-xs font-medium text-text-primary">
          {value}
        </span>
        <span className="material-symbols-outlined ay-dropdown-chevron text-[18px]">
          expand_more
        </span>
      </button>
      {open && (
        <div className="ay-dropdown-menu" role="listbox" aria-label="Primary rejection reason">
          <div className="ay-dropdown-list">
            {REJECTION_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                role="option"
                aria-selected={reason === value}
                onClick={() => {
                  onChange(reason);
                  setOpen(false);
                }}
                className={cn(
                  'ay-dropdown-item w-full justify-start text-left',
                  reason === value && 'is-selected'
                )}
              >
                <span className="ay-dropdown-item-title flex-1 text-left text-xs">{reason}</span>
                {reason === value && (
                  <span className="material-symbols-outlined ml-auto text-[16px]">check</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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

export function AdminVendorApplicationReviewClient() {
  const defaultVendor = getDefaultMockVendor();
  const [profile, setProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(defaultVendor)
  );
  const [activeNav, setActiveNav] = useState('Vendor Management');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  const [reviewStatus, setReviewStatus] = useState<ReviewStatusState>('Pending Review');
  const [checklist, setChecklist] = useState([
    {
      id: 'chk-1',
      title: 'Business details formatted correctly',
      subtitle: 'Name matches GST registry and contains no spam tags',
      checked: true,
    },
    {
      id: 'chk-2',
      title: 'Valid Hyderabad contact & address',
      subtitle: 'Physical warehouse verified in Banjara Hills Road #12',
      checked: true,
    },
    {
      id: 'chk-3',
      title: 'High-res portfolio photos (3/3)',
      subtitle: 'Zero watermarks, high visual quality for showcase',
      checked: true,
    },
    {
      id: 'chk-4',
      title: 'Transparent starting price listed',
      subtitle: '₹65,000 threshold aligns with wedding market metrics',
      checked: true,
    },
  ]);

  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState<InternalNote[]>([
    {
      id: 'note-1',
      author: 'Rajesh V. (Super Admin)',
      timestamp: 'Today, 12:15 PM',
      content:
        'Cross-checked their Banjara Hills studio with Google Maps Streetview. Business sign and workshop facility are genuine. Recommend approval for the upcoming wedding season.',
    },
  ]);

  const [modalType, setModalType] = useState<ModalActionType>(null);
  const [changeRequestNotes, setChangeRequestNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0]);
  const [rejectionRemark, setRejectionRemark] = useState('');
  const [zoomedImage, setZoomedImage] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    setProfile(readVendorBusinessProfileSession(defaultVendor));
  }, [defaultVendor]);

  const categoryLabel = getCategoryLabelFromSlug(profile.category);
  const serviceAreaLabels = [
    ...profile.serviceAreas.map((slug) => getServiceAreaLabel(slug)),
    ...profile.customServiceAreas,
  ];
  const portfolioItems =
    profile.portfolioItems.length > 0
      ? profile.portfolioItems
      : DEFAULT_ONBOARDING_PORTFOLIO_ITEMS;

  const passedChecksCount = checklist.filter((c) => c.checked).length;

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

  function toggleChecklistItem(id: string) {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }

  function handleAddNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = noteInput.trim();
    if (!trimmed) return;
    setNotes((prev) => [
      {
        id: `note-${Date.now()}`,
        author: 'Rajesh V. (Super Admin)',
        timestamp: 'Just now',
        content: trimmed,
      },
      ...prev,
    ]);
    setNoteInput('');
    setToast('Internal evaluation note saved to audit record.');
  }

  function handleConfirmModalAction() {
    if (modalType === 'approve') {
      setReviewStatus('Approved');
      setToast('Application AS-VND-2026-0418 approved! Storefront is now live.');
    } else if (modalType === 'request_changes') {
      setReviewStatus('Changes Requested');
      if (changeRequestNotes.trim()) {
        setNotes((prev) => [
          {
            id: `note-${Date.now()}`,
            author: 'Rajesh V. (Change Request Sent)',
            timestamp: 'Just now',
            content: changeRequestNotes.trim(),
          },
          ...prev,
        ]);
      }
      setToast('Change request dispatched to vendor via SMS & Email.');
    } else if (modalType === 'reject') {
      setReviewStatus('Rejected');
      setToast(`Application AS-VND-2026-0418 rejected (${rejectionReason}).`);
    }
    setModalType(null);
    setChangeRequestNotes('');
    setRejectionRemark('');
  }

  const tenureYears = profile.yearEstablished
    ? `${Math.max(1, 2026 - Number(profile.yearEstablished))} years`
    : '10 years';

  return (
    <div className="min-h-screen bg-brand-ivory text-text-primary">
      {/* Desktop Sidebar (Identical to AdminVendorManagementClient & VendorBusinessProfileClient) */}
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
        {/* Sticky Top Header (Identical to AdminVendorManagementClient & VendorBusinessProfileClient) */}
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
                Vendor Application Review
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

        {/* Page Container */}
        <div className="mx-auto max-w-[1680px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Breadcrumbs & Context Header */}
          <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="mb-1.5 flex flex-wrap items-center gap-1 text-xs text-text-secondary"
              >
                <Link href="/admin/vendors" className="hover:text-brand-green">
                  Vendor Management
                </Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <Link href="/admin/vendors" className="hover:text-brand-green">
                  Applications
                </Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="font-semibold text-brand-green">AS-VND-2026-0418</span>
              </nav>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-bold tracking-tight text-brand-green sm:text-3xl">
                  Vendor Application Review
                </h2>
                <span className="rounded-full border border-border-default bg-brand-white px-2.5 py-0.5 text-[11px] font-semibold text-text-secondary">
                  v1.2 Audit Mode
                </span>
              </div>
              <p className="mt-1.5 text-sm text-text-secondary">
                Detailed review of onboarding submission for{' '}
                <strong className="font-semibold text-text-primary">{profile.businessName}</strong>.
                Verify details and select an action.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="hidden text-right sm:block">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  Queue Position
                </span>
                <span className="text-xs font-semibold text-text-primary">
                  #03 of 18 Pending Approvals
                </span>
              </div>
              <span className="hidden h-8 w-px bg-border-default sm:inline-flex" />
              <button
                type="button"
                onClick={() => setToast('Showing latest submission v1.2 (no prior diff revisions).')}
                className="btn btn-sm btn-outline inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">history</span>
                <span>Version Diff</span>
              </button>
            </div>
          </section>

          {/* Top Application Header Banner */}
          <section className="relative overflow-hidden rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
            <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-brand-green sm:text-2xl">
                    {profile.businessName}
                  </h3>
                  {reviewStatus === 'Pending Review' && (
                    <span className="rounded-full bg-brand-gold-light px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                      Pending Review
                    </span>
                  )}
                  {reviewStatus === 'Changes Requested' && (
                    <span className="rounded-full bg-state-warning-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                      Changes Requested
                    </span>
                  )}
                  {reviewStatus === 'Approved' && (
                    <span className="rounded-full bg-state-success-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-state-success">
                      Approved
                    </span>
                  )}
                  {reviewStatus === 'Rejected' && (
                    <span className="rounded-full bg-state-error-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-state-error">
                      Rejected
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-state-success-bg px-2.5 py-1 text-[10px] font-semibold text-state-success">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    OTP Verified Contact
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
                  <div className="flex items-center gap-1">
                    <span>Category:</span>
                    <span className="font-semibold text-text-primary">{categoryLabel}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span>Application ID:</span>
                    <span className="font-mono font-semibold text-brand-green">
                      AS-VND-2026-0418
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span>Submitted:</span>
                    <span className="text-text-primary">14 May 2026, 11:30 AM IST</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span>Market:</span>
                    <span className="font-semibold text-text-primary">Hyderabad Urban Region</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Cluster */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalType('reject')}
                  className="btn btn-sm btn-danger-ghost inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">close</span>
                  <span>Reject Application</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType('request_changes')}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-brand-gold-border bg-brand-gold-light px-3.5 text-xs font-semibold text-brand-gold-dark transition-colors hover:bg-brand-gold/25"
                >
                  <span className="material-symbols-outlined text-[17px]">edit_note</span>
                  <span>Request Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType('approve')}
                  className="btn btn-sm btn-primary inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">check_circle</span>
                  <span>Approve Application</span>
                </button>
              </div>
            </div>
          </section>

          {/* Two-Column Content Layout (8 Cols Left + 4 Cols Right) */}
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
            {/* Left Column: Submitted Application Data (8 cols) */}
            <div className="space-y-5 xl:col-span-8">
              {/* Section A: Account Information */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border-default pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                      <span className="material-symbols-outlined text-[19px]">badge</span>
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-brand-green">
                        Section A: Account Information
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Primary administrative contact registered with AyojanSetu
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-state-success-bg px-2.5 py-0.5 text-[10px] font-semibold text-state-success">
                    Identity Matched
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
                  <div className="rounded-lg bg-brand-ivory p-3.5">
                    <span className="block text-[11px] font-medium text-text-secondary">
                      Contact Person
                    </span>
                    <p className="mt-1 text-sm font-semibold text-text-primary">
                      {profile.ownerName || 'Ramesh Rao'}
                    </p>
                    <span className="mt-0.5 block text-xs text-text-secondary">
                      Owner / Proprietor
                    </span>
                  </div>

                  <div className="rounded-lg bg-brand-ivory p-3.5">
                    <span className="block text-[11px] font-medium text-text-secondary">
                      Mobile Number
                    </span>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-text-primary">
                        +91{' '}
                        {(
                          profile.accountMobile ||
                          profile.businessPhone ||
                          '98765 43210'
                        ).replace(/^\+91[\s-]*/, '')}
                      </span>
                      <span
                        className="material-symbols-outlined text-[15px] text-brand-green"
                        title="OTP Verified"
                      >
                        verified
                      </span>
                    </div>
                    <span className="mt-0.5 block text-[11px] font-semibold text-state-success">
                      Verified via OTP (Auth Token #9042)
                    </span>
                  </div>

                  <div className="rounded-lg bg-brand-ivory p-3.5">
                    <span className="block text-[11px] font-medium text-text-secondary">
                      Email Address
                    </span>
                    <p
                      className="mt-1 truncate text-sm font-semibold text-text-primary"
                      title={profile.accountEmail || 'ramesh@srivenkateswaramandap.in'}
                    >
                      {profile.accountEmail || 'ramesh@srivenkateswaramandap.in'}
                    </p>
                    <span className="mt-0.5 block text-xs text-text-secondary">
                      Deliverability: High (DKIM verified)
                    </span>
                  </div>
                </div>
              </section>

              {/* Section B: Business Information */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border-default pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                      <span className="material-symbols-outlined text-[19px]">storefront</span>
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-brand-green">
                        Section B: Business Information
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Public listing brand identity and operational entity facts
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-text-secondary">
                    Est. {profile.yearEstablished || '2016'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    <div>
                      <span className="mb-1 block text-xs font-medium text-text-secondary">
                        Registered Business Name
                      </span>
                      <div className="rounded-lg bg-brand-ivory p-3 text-sm font-semibold text-text-primary">
                        {profile.businessName}
                      </div>
                    </div>

                    <div>
                      <span className="mb-1 block text-xs font-medium text-text-secondary">
                        Vendor Category
                      </span>
                      <div className="flex items-center justify-between rounded-lg bg-brand-ivory p-3 text-sm font-semibold text-text-primary">
                        <span>{categoryLabel}</span>
                        <span className="rounded bg-brand-green-light px-2 py-0.5 text-[10px] font-semibold text-brand-green">
                          Core Category
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="mb-1 block text-xs font-medium text-text-secondary">
                      Business Description
                    </span>
                    <div className="rounded-lg bg-brand-ivory p-3.5 text-sm leading-relaxed text-text-primary">
                      “{profile.description}”
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                    <div className="rounded-lg bg-brand-ivory p-3">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                        Tenure
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold text-text-primary">
                        {tenureYears}
                      </span>
                      <span className="block text-xs text-text-secondary">
                        Since {profile.yearEstablished || '2016'}
                      </span>
                    </div>

                    <div className="rounded-lg bg-brand-ivory p-3">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                        Business Email
                      </span>
                      <span
                        className="mt-0.5 block truncate text-sm font-semibold text-text-primary"
                        title={profile.businessEmail}
                      >
                        {profile.businessEmail}
                      </span>
                      <span className="block text-xs text-text-secondary">Sales Inbox</span>
                    </div>

                    <div className="rounded-lg bg-brand-ivory p-3">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                        Primary Helpline
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold text-text-primary">
                        +91 {(profile.businessPhone || '98490 54321').replace(/^\+91[\s-]*/, '')}
                      </span>
                      <span className="block text-xs text-text-secondary">
                        Alt: +91{' '}
                        {(profile.alternativePhone || '91234 56789').replace(/^\+91[\s-]*/, '')}
                      </span>
                    </div>

                    <div className="rounded-lg bg-brand-ivory p-3">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                        Digital Handle
                      </span>
                      <a
                        href={profile.websiteUrl || 'https://www.srivenkateswaramandap.in'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 flex items-center gap-1 truncate text-sm font-semibold text-brand-green hover:underline"
                      >
                        <span>Domain Link</span>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                      <span className="block text-xs text-text-secondary">Active SSL</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section C: Services & Specialities */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex items-center gap-2.5 border-b border-border-default pb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                    <span className="material-symbols-outlined text-[19px]">local_florist</span>
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-brand-green">
                      Section C: Services &amp; Specialities
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Taxonomy mapping and specialized cultural craft proficiencies
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="mb-2 block text-xs font-medium text-text-secondary">
                      Selected Standard Services
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {profile.keySpecialties.map((service) => (
                        <span
                          key={service}
                          className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold-light px-3 py-1.5 text-xs font-semibold text-brand-gold-dark"
                        >
                          <span className="material-symbols-outlined text-[15px]">celebration</span>
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                    <div className="rounded-lg bg-brand-ivory p-3.5">
                      <span className="mb-1 block text-xs font-medium text-text-secondary">
                        Custom / Bespoke Services
                      </span>
                      <p className="text-xs font-semibold leading-relaxed text-text-primary">
                        Temple Muhurtham Floral Archways, Fresh Lotus Themed Pellikuthuru Setups
                      </p>
                    </div>

                    <div className="rounded-lg bg-brand-ivory p-3.5">
                      <span className="mb-1 block text-xs font-medium text-text-secondary">
                        Business Specialities
                      </span>
                      <p className="text-xs leading-relaxed text-text-primary">
                        {profile.specialtiesDescription?.trim() ||
                          'Specialist in traditional Andhra & Telangana wedding rituals, sustainable eco-friendly banana stem structures, and grand indoor floral backdrops.'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section D: Business Location & Service Areas */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border-default pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                      <span className="material-symbols-outlined text-[19px]">pin_drop</span>
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-brand-green">
                        Section D: Business Location &amp; Service Areas
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Hub operational headquarters and active customer dispatch radius
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-green-light px-2.5 py-0.5 text-[10px] font-semibold text-brand-green">
                    Tier-1 Micro-Hub
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-brand-ivory p-3.5">
                    <span className="mb-1 block text-xs font-medium text-text-secondary">
                      Primary Warehouse / Studio Address
                    </span>
                    <p className="text-sm font-semibold text-text-primary">
                      {profile.businessAddress}
                      {profile.pinCode && !profile.businessAddress.includes(profile.pinCode)
                        ? ` - ${profile.pinCode}`
                        : ''}
                    </p>
                  </div>

                  {/* Mini Map Geo-Tag Visualization */}
                  <div
                    className="relative flex h-44 w-full items-end overflow-hidden rounded-xl border border-border-default bg-cover bg-center p-4"
                    style={{ backgroundImage: `url('${GEO_MAP_IMAGE_URL}')` }}
                  >
                    <div className="flex items-center gap-2 rounded-lg bg-brand-white/95 px-3.5 py-1.5 text-xs font-semibold text-text-primary shadow-xs backdrop-blur">
                      <span className="material-symbols-outlined text-[17px] text-brand-green">
                        location_on
                      </span>
                      <span>Geo-Coordinate Lock: 17.4156° N, 78.4357° E</span>
                    </div>
                  </div>

                  <div>
                    <span className="mb-2 block text-xs font-medium text-text-secondary">
                      Serviceable Hyderabad Micro-Markets
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {serviceAreaLabels.map((area) => (
                        <span
                          key={area}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border-default bg-brand-ivory px-2.5 py-1 text-xs font-medium text-text-primary"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                          {area}
                        </span>
                      ))}
                      <span className="inline-flex items-center rounded-md bg-brand-ivory px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                        + Secunderabad (On Enquiry)
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section E: Pricing Information */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex items-center gap-2.5 border-b border-border-default pb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                    <span className="material-symbols-outlined text-[19px]">currency_rupee</span>
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-brand-green">
                      Section E: Pricing Information
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Listing pricing card tiering and transparency parameters
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
                    <div className="rounded-lg bg-brand-ivory p-3.5">
                      <span className="block text-xs font-medium text-text-secondary">
                        Pricing Model
                      </span>
                      <p className="mt-1 text-sm font-semibold text-text-primary">
                        {profile.pricingModel} Basis
                      </p>
                      <span className="mt-0.5 block text-xs text-text-secondary">
                        Custom quotes allowed
                      </span>
                    </div>

                    <div className="rounded-lg bg-brand-ivory p-3.5">
                      <span className="block text-xs font-medium text-text-secondary">
                        Starting Price
                      </span>
                      <p className="mt-1 text-lg font-bold text-brand-green">
                        ₹{profile.startingPrice || '65,000'}
                      </p>
                      <span className="mt-0.5 block text-xs text-text-secondary">
                        Intimate decor base tier
                      </span>
                    </div>

                    <div className="rounded-lg bg-brand-ivory p-3.5">
                      <span className="block text-xs font-medium text-text-secondary">
                        Public Marketplace Visibility
                      </span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand-gold-dark" />
                        <span className="text-sm font-semibold text-text-primary">
                          {profile.displayPricePublicly ? 'Enabled & Verified' : 'On Request Only'}
                        </span>
                      </div>
                      <span className="mt-0.5 block text-xs text-text-secondary">
                        Will display on vendor card
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-brand-ivory p-3.5">
                    <span className="mb-1 block text-xs font-medium text-text-secondary">
                      Pricing Notes &amp; Scope Clauses
                    </span>
                    <p className="text-xs leading-relaxed text-text-primary">
                      “
                      {profile.pricingNotes?.trim() ||
                        'Base packages start at ₹65,000 for intimate house ceremonies. Full wedding venue setups range between ₹1.8L to ₹4.5L depending on fresh flower varieties and seasonal availability.'}
                      ”
                    </p>
                  </div>
                </div>
              </section>

              {/* Section F: Portfolio Images Gallery */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border-default pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                      <span className="material-symbols-outlined text-[19px]">photo_library</span>
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-brand-green">
                        Section F: Portfolio Images Gallery
                      </h3>
                      <p className="text-xs text-text-secondary">
                        {portfolioItems.length} submitted visual verification proofs (Min required:
                        3)
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-state-success-bg px-2.5 py-0.5 text-[10px] font-semibold text-state-success">
                    All Assets Passed Resolution Checks
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {portfolioItems.slice(0, 3).map((item, idx) => {
                    const meta = PORTFOLIO_DIMENSIONS[idx] ?? PORTFOLIO_DIMENSIONS[0];
                    return (
                      <div
                        key={item.id}
                        className="group flex flex-col overflow-hidden rounded-xl border border-border-default bg-brand-ivory shadow-xs"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {meta.featured && (
                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-brand-green px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                              <span className="material-symbols-outlined text-[12px]">star</span>
                              Featured Lead
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setZoomedImage({ title: item.title, url: item.imageUrl })
                            }
                            aria-label={`Zoom ${item.title}`}
                            className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-white/90 text-text-primary shadow-xs hover:bg-brand-white"
                          >
                            <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                          </button>
                        </div>

                        <div className="flex flex-1 flex-col justify-between p-3">
                          <div>
                            <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                              Category: {item.category}
                            </span>
                            <h4 className="mt-0.5 text-xs font-semibold text-text-primary">
                              {item.title}
                            </h4>
                          </div>
                          <div className="mt-2.5 flex items-center justify-between border-t border-border-default pt-2 text-[11px] text-text-secondary">
                            <span>{meta.res}</span>
                            <span className="font-semibold text-brand-green">{meta.tag}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section G: Declaration & Timestamps */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
                <div className="mb-4 flex items-center gap-2.5 border-b border-border-default pb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                    <span className="material-symbols-outlined text-[19px]">
                      assignment_turned_in
                    </span>
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-brand-green">
                      Section G: Declaration &amp; Timestamps
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Legal submission affirmation and platform compliance disclaimer
                    </p>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg bg-brand-ivory p-4">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-[19px] text-brand-green">
                      verified_user
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        Accuracy Declaration Confirmed
                      </p>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        Digitally acknowledged by{' '}
                        <strong className="text-text-primary">
                          {profile.ownerName || 'Ramesh Rao'}
                        </strong>{' '}
                        on <strong className="text-text-primary">14 May 2026, 11:28 AM IST</strong>{' '}
                        via authenticated session (IP: 49.205.142.18, Hyderabad ISP).
                      </p>
                    </div>
                  </div>
                  <p className="border-t border-border-default pt-2.5 text-xs italic text-text-secondary">
                    Notice: Approval grants immediate marketplace catalog visibility. Platform KYC,
                    GSTIN clearance, and bank nodal disbursements are processed through compliance
                    queue ID #CQ-8812.
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column: Admin Review & Verification Controls (4 cols) */}
            <aside className="space-y-5 xl:sticky xl:top-24 xl:col-span-4">
              {/* Review Checklist Card */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs">
                <div className="mb-4 flex items-center justify-between border-b border-border-default pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-state-success-bg text-state-success">
                      <span className="material-symbols-outlined text-[18px]">checklist</span>
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-brand-green">Review Checklist</h3>
                      <p className="text-xs text-text-secondary">
                        Quality control checks ({passedChecksCount} of {checklist.length} passed)
                      </p>
                    </div>
                  </div>
                  <span className="rounded bg-state-success-bg px-2 py-0.5 text-[10px] font-semibold text-state-success">
                    {Math.round((passedChecksCount / checklist.length) * 100)}% Ready
                  </span>
                </div>

                <div className="space-y-2.5">
                  {checklist.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-brand-ivory p-3 transition-colors hover:bg-brand-ivory-hover"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-[#173D32]"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-semibold text-text-primary">
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-text-secondary">
                          {item.subtitle}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* SVG Mini Completion Arc Gauge */}
                <div className="mt-4 flex items-center justify-between rounded-lg border border-border-default bg-brand-ivory p-3.5">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                      Auto Score Rating
                    </span>
                    <span className="text-lg font-bold text-brand-green">96 / 100</span>
                    <span className="block text-xs text-text-secondary">
                      Low-risk application tier
                    </span>
                  </div>
                  <div className="relative h-14 w-14 shrink-0">
                    <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 36 36">
                      <path
                        className="text-border-default"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      />
                      <path
                        className="text-brand-green"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="96, 100"
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-green">
                      96%
                    </div>
                  </div>
                </div>
              </section>

              {/* Admin Internal Notes Panel */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs">
                <div className="mb-3 flex items-center justify-between border-b border-border-default pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-brand-green">Admin Internal Notes</h3>
                      <p className="text-xs text-text-secondary">
                        Confidential team remarks &amp; audit tracking
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-text-secondary">
                    visibility_off
                  </span>
                </div>

                <form onSubmit={handleAddNote} className="space-y-2.5">
                  <textarea
                    rows={3}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add internal evaluation notes before approving or requesting corrections..."
                    className="w-full resize-none rounded-lg border border-border-default bg-brand-white p-3 text-xs text-text-primary outline-none placeholder:text-text-muted focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-text-secondary">
                      Internal visibility only
                    </span>
                    <button type="submit" className="btn btn-sm btn-outline">
                      Save Note
                    </button>
                  </div>
                </form>

                {/* Existing Internal Thread */}
                <div className="mt-4 space-y-2.5 border-t border-border-default pt-4">
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-lg bg-brand-ivory p-3">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-text-secondary">
                        <span className="font-semibold text-brand-green">{note.author}</span>
                        <span>{note.timestamp}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-text-primary">{note.content}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Audit Activity Summary Card */}
              <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs">
                <div className="mb-3 flex items-center justify-between border-b border-border-default pb-3">
                  <h3 className="text-sm font-bold text-brand-green">Audit Activity Summary</h3>
                  <span className="material-symbols-outlined text-[18px] text-text-secondary">
                    schedule
                  </span>
                </div>

                <div className="relative space-y-4 pl-4 before:absolute before:bottom-2 before:left-1.5 before:top-2 before:w-0.5 before:bg-border-default">
                  <div className="relative">
                    <span className=" absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-brand-green ring-4 ring-brand-white" />
                    <p className="text-xs font-semibold text-text-primary">Application Received</p>
                    <p className="text-[11px] text-text-secondary">
                      14 May 2026 • 11:30 AM IST
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-brand-gold-dark ring-4 ring-brand-white" />
                    <p className="text-xs font-semibold text-text-primary">OTP Authenticated</p>
                    <p className="text-[11px] text-text-secondary">
                      14 May 2026 • 11:27 AM IST
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-text-secondary ring-4 ring-brand-white" />
                    <p className="text-xs font-semibold text-text-primary">
                      Onboarding Form Initiated
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      14 May 2026 • 10:45 AM IST
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-border-default pt-3">
                  <a
                    href="#activity-history"
                    onClick={(e) => {
                      e.preventDefault();
                      setToast('Full audit history log loaded.');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:text-brand-gold-dark"
                  >
                    <span>View Full Activity History</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </a>
                </div>
              </section>

              {/* Quick Escalation Hotline Widget */}
              <section className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
                    <span className="material-symbols-outlined text-[19px]">phone_in_talk</span>
                  </span>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">
                      Vendor Helpline
                    </span>
                    <p className="text-sm font-semibold text-brand-green">
                      +91 {(profile.businessPhone || '98490 54321').replace(/^\+91[\s-]*/, '')}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Call vendor directly for verification
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {/* Interactive Action Confirmation Modal */}
      {modalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-border-default bg-brand-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-border-default pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    modalType === 'approve' && 'bg-state-success-bg text-state-success',
                    modalType === 'request_changes' && 'bg-brand-gold-light text-brand-gold-dark',
                    modalType === 'reject' && 'bg-state-error-bg text-state-error'
                  )}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {modalType === 'approve'
                      ? 'verified'
                      : modalType === 'request_changes'
                        ? 'edit_note'
                        : 'block'}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-green">
                    {modalType === 'approve'
                      ? 'Approve Application'
                      : modalType === 'request_changes'
                        ? 'Request Information Updates'
                        : 'Reject Vendor Application'}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {modalType === 'approve'
                      ? `Grant ${profile.businessName} immediate marketplace visibility`
                      : modalType === 'request_changes'
                        ? 'Notify vendor about required documentation corrections'
                        : 'Permanent rejection of submission AS-VND-2026-0418'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-brand-ivory"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {modalType === 'approve' && (
              <div className="mb-6 space-y-2 rounded-lg bg-brand-ivory p-4 text-xs text-text-primary">
                <p className="text-sm font-medium">
                  Are you sure you want to approve application <strong>AS-VND-2026-0418</strong>?
                </p>
                <ul className="list-disc space-y-1 pl-4 text-text-secondary">
                  <li>Listing goes live instantly in Banjara Hills &amp; Hyderabad categories.</li>
                  <li>An automated WhatsApp &amp; SMS welcome dispatch will be triggered.</li>
                  <li>Direct customer enquiry routing will be enabled.</li>
                </ul>
              </div>
            )}

            {modalType === 'request_changes' && (
              <div className="mb-6 space-y-2">
                <label className="block text-xs font-semibold text-text-primary">
                  Correction Notes to Vendor
                </label>
                <textarea
                  rows={3}
                  value={changeRequestNotes}
                  onChange={(e) => setChangeRequestNotes(e.target.value)}
                  placeholder="e.g., Please provide higher resolution photo for Sangeet stage..."
                  className="w-full rounded-lg border border-border-default bg-brand-white p-3 text-xs text-text-primary outline-none focus:border-brand-green"
                />
                <p className="text-[11px] text-text-secondary">
                  The vendor will receive an actionable update link via SMS &amp; Email.
                </p>
              </div>
            )}

            {modalType === 'reject' && (
              <div className="mb-6 space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-text-primary">
                    Select Primary Rejection Reason
                  </label>
                  <RejectionReasonSelect value={rejectionReason} onChange={setRejectionReason} />
                </div>
                <textarea
                  rows={2}
                  value={rejectionRemark}
                  onChange={(e) => setRejectionRemark(e.target.value)}
                  placeholder="Mandatory internal audit remark..."
                  className="w-full rounded-lg border border-border-default bg-brand-white p-3 text-xs text-text-primary outline-none focus:border-state-error"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="btn btn-sm btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmModalAction}
                className={cn(
                  'btn btn-sm',
                  modalType === 'approve' && 'btn-primary',
                  modalType === 'request_changes' &&
                    '!border-brand-gold-border !bg-brand-gold-dark !text-white',
                  modalType === 'reject' && 'btn-danger'
                )}
              >
                {modalType === 'approve'
                  ? 'Yes, Approve Vendor'
                  : modalType === 'request_changes'
                    ? 'Send Change Request'
                    : 'Reject Submission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-3xl overflow-hidden rounded-2xl bg-brand-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-sm font-semibold text-brand-green">{zoomedImage.title}</p>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-brand-ivory"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="relative aspect-[16/10] w-[min(720px,88vw)] overflow-hidden rounded-xl">
              <Image src={zoomedImage.url} alt={zoomedImage.title} fill className="object-cover" />
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
