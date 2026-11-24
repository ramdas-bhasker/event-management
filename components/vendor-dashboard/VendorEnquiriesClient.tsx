'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SidebarContents } from '@/components/vendor-dashboard/VendorDashboardClient';
import { SAMPLE_VENDOR_DASHBOARD_ENQUIRIES } from '@/data/vendor-dashboard-sample';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { getMockEnquiries } from '@/lib/mock-enquiry-service';
import { cn } from '@/lib/utils';
import type { MockEnquiryRecord } from '@/types/enquiry';
import type { VendorRecord } from '@/types/vendor';
import type { VendorDashboardEnquiry, VendorEnquiryStatus } from '@/types/vendor-dashboard';

const STATUSES: VendorEnquiryStatus[] = ['New', 'Contacted', 'Quotation Sent', 'Booked', 'Not Converted'];
const STATUS_STORE_PREFIX = 'ayojansetu_vendor_enquiry_statuses_';

function fromSubmission(record: MockEnquiryRecord): VendorDashboardEnquiry {
  return {
    id: record.id,
    vendorId: record.vendorId,
    customerName: record.fullName,
    eventType: record.otherEventType || record.eventType,
    eventDate: record.dateNotFinalised ? 'Not finalised' : record.eventDate || '—',
    eventLocation: record.eventLocation === 'Other location' ? record.otherLocation : record.eventLocation,
    budget: record.budget,
    receivedAt: record.submittedAt,
    status: 'New',
    guestCount: record.guestCount,
    services: record.services,
    message: record.message,
    mobileNumber: record.mobileNumber,
    email: record.email,
  };
}

function formatDate(value: string) {
  if (!value || value === '—' || value === 'Not finalised') return value || '—';
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(date);
}

function StatusBadge({ status }: { status: VendorEnquiryStatus }) {
  const styles: Record<VendorEnquiryStatus, string> = {
    New: 'bg-state-info-bg text-state-info',
    Contacted: 'bg-state-warning-bg text-state-warning-text',
    'Quotation Sent': 'bg-brand-gold-light text-brand-gold-dark',
    Booked: 'bg-state-success-bg text-state-success',
    'Not Converted': 'bg-brand-ivory text-text-secondary',
  };
  return <span className={cn('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold', styles[status])}>{status}</span>;
}

interface DashboardDropdownProps {
  value: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  ariaLabel: string;
  compact?: boolean;
  onChange: (value: string) => void;
}

function DashboardDropdown({ value, placeholder, options, ariaLabel, compact = false, onChange }: DashboardDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeDropdown = useCallback(() => setOpen(false), []);
  useOutsideClickAndEscape(rootRef, closeDropdown, open);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={rootRef} className={cn('ay-dropdown', compact ? 'w-36 min-w-36' : 'w-full', open && 'is-open')}>
      <button
        type="button"
        className={cn('ay-dropdown-trigger is-form-control', compact ? 'h-9 !px-2.5 text-[11px]' : 'h-11')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="ay-dropdown-value min-w-0 flex-1 truncate">{selectedOption?.label ?? placeholder}</span>
        <span className="material-symbols-outlined ay-dropdown-chevron" aria-hidden="true">expand_more</span>
      </button>
      {open && <div role="listbox" aria-label={ariaLabel} className={cn('ay-dropdown-menu', compact && 'align-right')}>
        <div className="ay-dropdown-list">
          {options.map((option) => <button
            type="button"
            key={option.value}
            role="option"
            aria-selected={option.value === value}
            onClick={() => { onChange(option.value); setOpen(false); }}
            className={cn('ay-dropdown-item', option.value === value && 'is-selected')}
          >
            <span className="ay-dropdown-item-title">{option.label}</span>
            {option.value === value && <span className="material-symbols-outlined ml-auto text-[18px]" aria-hidden="true">check</span>}
          </button>)}
        </div>
      </div>}
    </div>
  );
}

interface Props { vendor: VendorRecord }

export function VendorEnquiriesClient({ vendor }: Props) {
  const [enquiries, setEnquiries] = useState<VendorDashboardEnquiry[]>([]);
  const [usingSampleData, setUsingSampleData] = useState(true);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selected, setSelected] = useState<VendorDashboardEnquiry | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const sessionRecords = getMockEnquiries()
      .filter((record) => record.vendorId === vendor.slug || record.vendorId === vendor.id)
      .map(fromSubmission);
    const baseRows = sessionRecords.length
      ? sessionRecords.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
      : SAMPLE_VENDOR_DASHBOARD_ENQUIRIES.filter((record) => record.vendorId === vendor.slug);
    setUsingSampleData(sessionRecords.length === 0);
    try {
      const overrides = JSON.parse(sessionStorage.getItem(`${STATUS_STORE_PREFIX}${vendor.slug}`) || '{}') as Record<string, VendorEnquiryStatus>;
      setEnquiries(baseRows.map((row) => ({ ...row, status: STATUSES.includes(overrides[row.id]) ? overrides[row.id] : row.status })));
    } catch {
      setEnquiries(baseRows);
    }
    setReady(true);
  }, [vendor.id, vendor.slug]);

  const eventTypes = useMemo(() => [...new Set(enquiries.map((item) => item.eventType).filter(Boolean))].sort(), [enquiries]);
  const filteredEnquiries = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return enquiries
      .filter((item) => !normalizedSearch || item.customerName.toLocaleLowerCase().includes(normalizedSearch))
      .filter((item) => !statusFilter || item.status === statusFilter)
      .filter((item) => !eventFilter || item.eventType === eventFilter)
      .sort((a, b) => sortOrder === 'newest' ? b.receivedAt.localeCompare(a.receivedAt) : a.receivedAt.localeCompare(b.receivedAt));
  }, [enquiries, search, statusFilter, eventFilter, sortOrder]);

  const updateStatus = useCallback((id: string, status: VendorEnquiryStatus) => {
    setEnquiries((current) => {
      const updated = current.map((item) => item.id === id ? { ...item, status } : item);
      try {
        const previous = JSON.parse(sessionStorage.getItem(`${STATUS_STORE_PREFIX}${vendor.slug}`) || '{}') as Record<string, VendorEnquiryStatus>;
        sessionStorage.setItem(`${STATUS_STORE_PREFIX}${vendor.slug}`, JSON.stringify({ ...previous, [id]: status }));
      } catch { /* Status still updates in the current page state. */ }
      return updated;
    });
    setSelected((current) => current?.id === id ? { ...current, status } : current);
    setToast('Status updated in this browser session only.');
  }, [vendor.slug]);

  const handleNavigate = (label: string, target?: string) => {
    setMobileNavOpen(false);
    if (target === 'overview' || label === 'Overview') window.location.href = '/vendor/dashboard';
    else if (target === 'enquiries' || label === 'Enquiries') window.location.href = '/vendor/dashboard/enquiries';
    else if (label === 'Business Profile') window.location.href = '/vendor/dashboard/business-profile';
    else setToast(`${label} is a mock dashboard section and is not connected yet.`);
  };
  const handleLogout = () => setToast('Mock sign out only. No real vendor authentication session is connected.');
  const clearFilters = () => { setSearch(''); setStatusFilter(''); setEventFilter(''); setSortOrder('newest'); };

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selected]);

  return (
    <div className="min-h-screen bg-brand-ivory text-text-primary">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-green lg:flex"><SidebarContents vendor={vendor} activeItem="Enquiries" onNavigate={handleNavigate} onLogout={handleLogout} /></aside>
      {mobileNavOpen && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard navigation"><button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} /><aside className="absolute inset-y-0 left-0 flex w-[min(19rem,86vw)] flex-col bg-brand-green shadow-xl"><div className="flex justify-end px-3 pt-3"><button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"><span className="material-symbols-outlined">close</span></button></div><SidebarContents vendor={vendor} activeItem="Enquiries" onNavigate={handleNavigate} onLogout={handleLogout} /></aside></div>}

      <main className="min-w-0 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border-default bg-brand-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setMobileNavOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-default text-brand-green lg:hidden" aria-label="Open dashboard navigation"><span className="material-symbols-outlined">menu</span></button><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gold-dark sm:text-[11px]">Vendor workspace · Mock account</p><h1 className="truncate text-base font-bold text-brand-green sm:text-lg">Enquiries</h1></div></div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative"><button type="button" onClick={() => { setNotificationOpen((open) => !open); setProfileMenuOpen(false); }} aria-label="Notifications" aria-expanded={notificationOpen} className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-brand-ivory hover:text-brand-green"><span className="material-symbols-outlined">notifications</span><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold" /></button>{notificationOpen && <div className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-border-default bg-brand-white p-4 shadow-lg"><p className="text-sm font-semibold text-brand-green">Notifications</p><p className="mt-2 text-xs leading-relaxed text-text-secondary">Notifications are a visual preview and are not connected yet.</p></div>}</div>
            <div className="relative"><button type="button" onClick={() => { setProfileMenuOpen((open) => !open); setNotificationOpen(false); }} aria-expanded={profileMenuOpen} className="flex h-10 items-center gap-2 rounded-full border border-border-default bg-brand-white pl-1 pr-2 hover:bg-brand-ivory sm:pr-3"><span className="relative h-8 w-8 overflow-hidden rounded-full bg-brand-green-light">{vendor.portfolioImages[0] ? <Image src={vendor.portfolioImages[0]} alt="" fill sizes="32px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-xs font-bold text-brand-green">SV</span>}</span><span className="hidden max-w-36 truncate text-xs font-semibold text-brand-green sm:block">{vendor.businessName}</span><span className="material-symbols-outlined hidden text-[18px] text-text-secondary sm:block">expand_more</span></button>{profileMenuOpen && <div className="absolute right-0 top-12 z-30 w-60 rounded-xl border border-border-default bg-brand-white p-2 shadow-lg"><div className="border-b border-border-default px-3 py-2"><p className="truncate text-sm font-semibold text-brand-green">{vendor.businessName}</p><p className="text-xs text-text-secondary">Mock vendor account</p></div><button type="button" onClick={handleLogout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-state-error hover:bg-brand-ivory"><span className="material-symbols-outlined text-[18px]">logout</span>Mock sign out</button></div>}</div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-text-secondary">Manage customer requests for</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-green sm:text-3xl">{vendor.businessName}</h2><p className="mt-2 text-sm text-text-secondary">Review details and track each enquiry through your workflow.</p></div><Link href="/vendor/dashboard" className="btn btn-sm btn-outline inline-flex w-fit items-center gap-2"><span className="material-symbols-outlined text-[17px]">arrow_back</span>Dashboard overview</Link></section>

          <div className={cn('flex items-start gap-3 rounded-xl border px-4 py-3 text-xs leading-relaxed sm:text-sm', usingSampleData ? 'border-brand-gold-border bg-brand-gold-light text-brand-gold-dark' : 'border-state-info/20 bg-state-info-bg text-state-info')} role="note"><span className="material-symbols-outlined mt-0.5 text-[18px]" aria-hidden="true">info</span><p>{usingSampleData ? 'Sample dashboard data: the rows below are illustrative examples, not customer submissions.' : 'Prototype submissions in this browser session are shown below. They were validated locally and have not been delivered to a vendor.'} Status edits are temporary browser-session state; no backend is connected.</p></div>

          <section aria-label="Enquiry filters" className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.4fr)_repeat(3,minmax(150px,1fr))_auto]">
              <label className="relative block"><span className="sr-only">Search customer name</span><span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-text-muted">search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer name" className="h-11 w-full rounded-lg border border-border-default bg-brand-white pl-10 pr-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10" /></label>
              <DashboardDropdown value={statusFilter} placeholder="All statuses" ariaLabel="Filter by status" options={[{ value: '', label: 'All statuses' }, ...STATUSES.map((status) => ({ value: status, label: status }))]} onChange={setStatusFilter} />
              <DashboardDropdown value={eventFilter} placeholder="All event types" ariaLabel="Filter by event type" options={[{ value: '', label: 'All event types' }, ...eventTypes.map((type) => ({ value: type, label: type }))]} onChange={setEventFilter} />
              <DashboardDropdown value={sortOrder} ariaLabel="Sort enquiries" options={[{ value: 'newest', label: 'Newest first' }, { value: 'oldest', label: 'Oldest first' }]} onChange={(value) => setSortOrder(value as 'newest' | 'oldest')} />
              <button type="button" onClick={clearFilters} className="h-11 whitespace-nowrap rounded-lg px-3 text-sm font-semibold text-brand-green hover:bg-brand-ivory">Clear filters</button>
            </div>
            <p className="mt-3 text-xs text-text-secondary">Showing {filteredEnquiries.length} of {enquiries.length} {enquiries.length === 1 ? 'enquiry' : 'enquiries'}</p>
          </section>

          <section aria-label="Vendor enquiries" className="overflow-hidden rounded-xl border border-border-default bg-brand-white shadow-xs">
            <div className="flex flex-col justify-between gap-2 border-b border-border-default px-4 py-4 sm:flex-row sm:items-center sm:px-5"><div><h2 className="text-base font-bold text-brand-green">All Enquiries</h2><p className="mt-0.5 text-xs text-text-secondary">{usingSampleData ? 'Illustrative sample records' : 'Local prototype submissions'} · {filteredEnquiries.length} shown</p></div></div>
            {!ready ? <div className="px-5 py-14 text-center text-sm text-text-secondary">Loading browser-session enquiries…</div> : filteredEnquiries.length === 0 ? <div className="px-5 py-14 text-center"><span className="material-symbols-outlined text-3xl text-text-muted">filter_list_off</span><h3 className="mt-2 text-sm font-semibold text-brand-green">No enquiries match these filters</h3><p className="mt-1 text-xs text-text-secondary">Try another search or clear the filters to see all enquiries.</p><button type="button" onClick={clearFilters} className="mt-4 text-xs font-semibold text-brand-green underline underline-offset-2">Clear filters</button></div> : <div className="overflow-x-auto"><table className="w-full min-w-[1160px] border-collapse text-left"><thead className="bg-brand-ivory/70 text-[10px] font-semibold uppercase tracking-wide text-text-secondary"><tr>{['Customer Name', 'Event Type', 'Event Date', 'Event Location', 'Guest Count', 'Estimated Budget', 'Enquiry Received Date', 'Status', 'Actions'].map((heading) => <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border-default">{filteredEnquiries.map((item) => <tr key={item.id} className="text-xs text-text-primary hover:bg-brand-ivory/40"><td className="px-4 py-3 font-semibold text-brand-green">{item.customerName}</td><td className="px-4 py-3">{item.eventType || '—'}</td><td className="whitespace-nowrap px-4 py-3">{formatDate(item.eventDate)}</td><td className="max-w-48 truncate px-4 py-3" title={item.eventLocation}>{item.eventLocation || '—'}</td><td className="whitespace-nowrap px-4 py-3">{item.guestCount || '—'}</td><td className="whitespace-nowrap px-4 py-3">{item.budget || '—'}</td><td className="whitespace-nowrap px-4 py-3">{formatDate(item.receivedAt)}</td><td className="px-4 py-3"><DashboardDropdown compact value={item.status} ariaLabel={`Update ${item.customerName} enquiry status`} options={STATUSES.map((status) => ({ value: status, label: status }))} onChange={(value) => updateStatus(item.id, value as VendorEnquiryStatus)} /></td><td className="px-4 py-3"><button type="button" onClick={() => setSelected(item)} className="whitespace-nowrap font-semibold text-brand-green underline underline-offset-2 hover:text-brand-gold-dark">View Details</button></td></tr>)}</tbody></table></div>}
          </section>
        </div>
      </main>

      {toast && <div className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-lg items-start gap-3 rounded-xl bg-brand-green px-4 py-3 text-sm text-white shadow-lg sm:left-auto sm:right-6"><span className="material-symbols-outlined text-[19px] text-brand-gold">info</span><p className="flex-1 text-xs leading-relaxed">{toast}</p><button type="button" aria-label="Dismiss message" onClick={() => setToast('')} className="text-white/70 hover:text-white"><span className="material-symbols-outlined text-[18px]">close</span></button></div>}

      {selected && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section role="dialog" aria-modal="true" aria-labelledby="enquiry-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-brand-white p-5 shadow-xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">{selected.sampleRecord ? 'Sample enquiry' : 'Prototype submission'}</p><h2 id="enquiry-detail-title" className="mt-1 text-xl font-bold text-brand-green">{selected.customerName}</h2></div><button type="button" onClick={() => setSelected(null)} aria-label="Close enquiry details" className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-brand-ivory"><span className="material-symbols-outlined">close</span></button></div><div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{[['Event type', selected.eventType], ['Event date', formatDate(selected.eventDate)], ['Event location', selected.eventLocation], ['Guest count', selected.guestCount], ['Estimated budget', selected.budget], ['Received date', formatDate(selected.receivedAt)], ['Mobile number', selected.mobileNumber], ['Email', selected.email || 'Not provided']].map(([label, value]) => <div key={label} className="rounded-lg bg-brand-ivory p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">{label}</p><p className="mt-1 break-words text-sm font-medium text-brand-green">{value || '—'}</p></div>)}</div>{selected.services.length > 0 && <div className="mt-4"><p className="text-xs font-semibold text-brand-green">Selected service requirements</p><p className="mt-1 text-sm text-text-secondary">{selected.services.join(', ')}</p></div>}{selected.message && <div className="mt-4"><p className="text-xs font-semibold text-brand-green">Additional requirements</p><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{selected.message}</p></div>}<div className="mt-5 flex flex-col gap-3 border-t border-border-default pt-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold text-brand-green">Current status</p><div className="mt-1"><StatusBadge status={selected.status} /></div></div><div className="flex items-center gap-2"><span className="text-xs font-medium text-text-secondary">Update status</span><DashboardDropdown compact value={selected.status} ariaLabel="Update enquiry status" options={STATUSES.map((status) => ({ value: status, label: status }))} onChange={(value) => updateStatus(selected.id, value as VendorEnquiryStatus)} /></div></div><p className="mt-5 rounded-lg border border-brand-gold-border bg-brand-gold-light px-3 py-2 text-xs text-brand-gold-dark">Prototype view only. No enquiry data is connected to a backend or delivered to a vendor.</p></section></div>}
    </div>
  );
}
