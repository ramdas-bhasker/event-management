'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { SAMPLE_VENDOR_DASHBOARD_ENQUIRIES } from '@/data/vendor-dashboard-sample';
import { calculateProfileCompletion, createBusinessProfile, readVendorBusinessProfileSession, toPublicProfilePreview } from '@/data/vendor-business-profile';
import { getMockEnquiries } from '@/lib/mock-enquiry-service';
import type { MockEnquiryRecord } from '@/types/enquiry';
import type { VendorRecord } from '@/types/vendor';
import type { VendorDashboardEnquiry, VendorEnquiryStatus } from '@/types/vendor-dashboard';
import { cn } from '@/lib/utils';

interface VendorDashboardClientProps { vendor: VendorRecord }

const NAV_ITEMS = [
  { label: 'Overview', icon: 'space_dashboard', target: 'overview' },
  { label: 'Enquiries', icon: 'inbox', target: 'enquiries' },
  { label: 'Business Profile', icon: 'storefront', target: 'business-profile' },
  { label: 'Services & Pricing', icon: 'sell' },
  { label: 'Portfolio', icon: 'photo_library' },
  { label: 'Account Settings', icon: 'settings' },
];

function toDashboardEnquiry(record: MockEnquiryRecord): VendorDashboardEnquiry {
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
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  }).format(date);
}

function StatusBadge({ status }: { status: VendorEnquiryStatus }) {
  const statusClasses: Record<VendorEnquiryStatus, string> = {
    New: 'bg-state-info-bg text-state-info',
    Contacted: 'bg-state-warning-bg text-state-warning-text',
    'Quotation Sent': 'bg-brand-gold-light text-brand-gold-dark',
    Booked: 'bg-state-success-bg text-state-success',
    'Not Converted': 'bg-brand-ivory text-text-secondary',
  };
  return <span className={cn('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold', statusClasses[status])}>{status}</span>;
}

export interface SidebarProps {
  vendor: VendorRecord;
  activeItem: string;
  onNavigate: (label: string, target?: string) => void;
  onLogout: () => void;
}

export function SidebarContents({ vendor, activeItem, onNavigate, onLogout }: SidebarProps) {
  return (
    <>
      <Link href="/" className="flex items-center gap-3 border-b border-white/10 px-5 py-5" aria-label="AyojanSetu home">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold text-base font-bold text-brand-green">A</span>
        <span className="text-lg font-bold tracking-tight text-white">Ayojan<span className="text-brand-gold">Setu</span></span>
      </Link>
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
          {vendor.portfolioImages[0] ? <Image src={vendor.portfolioImages[0]} alt="" fill sizes="44px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-sm font-bold text-white">SV</span>}
        </span>
        <span className="min-w-0"><span className="block truncate text-sm font-semibold text-white">{vendor.businessName}</span><span className="mt-0.5 block text-xs text-white/60">Mock vendor account</span></span>
      </div>
      <nav aria-label="Vendor dashboard" className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map((item) => <button key={item.label} type="button" aria-current={activeItem === item.label ? 'page' : undefined} onClick={() => onNavigate(item.label, item.target)} className={cn('flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors', activeItem === item.label ? 'bg-white text-brand-green font-semibold' : 'text-white/75 hover:bg-white/10 hover:text-white')}><span className="material-symbols-outlined text-[19px]" aria-hidden="true">{item.icon}</span><span>{item.label}</span></button>)}
      </nav>
      <div className="border-t border-white/10 p-3"><button type="button" onClick={onLogout} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-white/70 hover:bg-white/10 hover:text-white"><span className="material-symbols-outlined text-[19px]" aria-hidden="true">logout</span>Mock sign out</button></div>
    </>
  );
}

export function VendorDashboardClient({ vendor }: VendorDashboardClientProps) {
  const sampleEnquiries = useMemo(() => SAMPLE_VENDOR_DASHBOARD_ENQUIRIES.filter((item) => item.vendorId === vendor.slug), [vendor.slug]);
  const [enquiries, setEnquiries] = useState<VendorDashboardEnquiry[]>(sampleEnquiries);
  const [usingSampleData, setUsingSampleData] = useState(true);
  const [activeItem, setActiveItem] = useState('Overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<VendorDashboardEnquiry | null>(null);
  const [businessProfile, setBusinessProfile] = useState(() => createBusinessProfile(vendor));

  useEffect(() => {
    const vendorRecords = getMockEnquiries().filter((record) => record.vendorId === vendor.slug || record.vendorId === vendor.id);
    if (vendorRecords.length > 0) {
      setEnquiries(vendorRecords.map(toDashboardEnquiry).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt)));
      setUsingSampleData(false);
    } else {
      setEnquiries(sampleEnquiries);
      setUsingSampleData(true);
    }
  }, [vendor.id, vendor.slug, sampleEnquiries]);

  useEffect(() => {
    setBusinessProfile(readVendorBusinessProfileSession(vendor));
  }, [vendor.id, vendor.slug, vendor]);

  const metrics = [
    { label: 'Total Enquiries', value: enquiries.length, icon: 'mail', tone: 'bg-brand-green-light text-brand-green' },
    { label: 'New Enquiries', value: enquiries.filter((item) => item.status === 'New').length, icon: 'mark_email_unread', tone: 'bg-state-info-bg text-state-info' },
    { label: 'Quotations Sent', value: enquiries.filter((item) => item.status === 'Quotation Sent').length, icon: 'request_quote', tone: 'bg-brand-gold-light text-brand-gold-dark' },
    { label: 'Booked Events', value: enquiries.filter((item) => item.status === 'Booked').length, icon: 'event_available', tone: 'bg-state-success-bg text-state-success' },
  ];
  const dashboardProfile = useMemo(() => ({ ...vendor, ...businessProfile, ...toPublicProfilePreview(businessProfile) }), [businessProfile, vendor]);
  const profileCompletion = calculateProfileCompletion(businessProfile).percentage;

  function showNotice(message: string) { setToast(message); }
  function handleNavigate(label: string, target?: string) {
    setActiveItem(label);
    setMobileNavOpen(false);
    if (label === 'Enquiries') {
      window.location.href = '/vendor/dashboard/enquiries';
      return;
    }
    if (label === 'Business Profile') {
      window.location.href = '/vendor/dashboard/business-profile';
      return;
    }
    if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else showNotice(`${label} is a mock dashboard section and is not connected yet.`);
  }
  function handleLogout() {
    setProfileMenuOpen(false);
    setMobileNavOpen(false);
    showNotice('Mock sign out only. No real vendor authentication session is connected.');
  }
  function closeEnquiryDetails() { setSelectedEnquiry(null); }

  useEffect(() => {
    if (!selectedEnquiry) return;
    function onKeyDown(event: KeyboardEvent) { if (event.key === 'Escape') closeEnquiryDetails(); }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedEnquiry]);

  return (
    <div className="min-h-screen bg-brand-ivory text-text-primary">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-green lg:flex"><SidebarContents vendor={dashboardProfile} activeItem={activeItem} onNavigate={handleNavigate} onLogout={handleLogout} /></aside>
      {mobileNavOpen && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard navigation"><button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} /><aside className="absolute inset-y-0 left-0 flex w-[min(19rem,86vw)] flex-col bg-brand-green shadow-xl"><div className="flex justify-end px-3 pt-3"><button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"><span className="material-symbols-outlined">close</span></button></div><SidebarContents vendor={dashboardProfile} activeItem={activeItem} onNavigate={handleNavigate} onLogout={handleLogout} /></aside></div>}

      <main className="min-w-0 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border-default bg-brand-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setMobileNavOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-default text-brand-green lg:hidden" aria-label="Open dashboard navigation"><span className="material-symbols-outlined">menu</span></button><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gold-dark sm:text-[11px]">Vendor workspace · Mock account</p><h1 className="truncate text-base font-bold text-brand-green sm:text-lg">Overview</h1></div></div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative"><button type="button" onClick={() => { setNotificationOpen((open) => !open); setProfileMenuOpen(false); }} aria-label="Notifications" aria-expanded={notificationOpen} className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-brand-ivory hover:text-brand-green"><span className="material-symbols-outlined">notifications</span><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold" /></button>{notificationOpen && <div className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-border-default bg-brand-white p-4 shadow-lg"><p className="text-sm font-semibold text-brand-green">Notifications</p><p className="mt-2 text-xs leading-relaxed text-text-secondary">Notifications are a visual preview and are not connected yet.</p></div>}</div>
            <div className="relative"><button type="button" onClick={() => { setProfileMenuOpen((open) => !open); setNotificationOpen(false); }} aria-expanded={profileMenuOpen} className="flex h-10 items-center gap-2 rounded-full border border-border-default bg-brand-white pl-1 pr-2 hover:bg-brand-ivory sm:pr-3"><span className="relative h-8 w-8 overflow-hidden rounded-full bg-brand-green-light">{vendor.portfolioImages[0] ? <Image src={vendor.portfolioImages[0]} alt="" fill sizes="32px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-xs font-bold text-brand-green">SV</span>}</span><span className="hidden max-w-36 truncate text-xs font-semibold text-brand-green sm:block">{vendor.businessName}</span><span className="material-symbols-outlined hidden text-[18px] text-text-secondary sm:block">expand_more</span></button>{profileMenuOpen && <div className="absolute right-0 top-12 z-30 w-60 rounded-xl border border-border-default bg-brand-white p-2 shadow-lg"><div className="border-b border-border-default px-3 py-2"><p className="truncate text-sm font-semibold text-brand-green">{vendor.businessName}</p><p className="text-xs text-text-secondary">Mock vendor account</p></div><button type="button" onClick={handleLogout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-state-error hover:bg-brand-ivory"><span className="material-symbols-outlined text-[18px]">logout</span>Mock sign out</button></div>}</div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section id="overview" className="scroll-mt-24 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-text-secondary">Welcome back,</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-green sm:text-3xl">{dashboardProfile.businessName}</h2><p className="mt-2 text-sm text-text-secondary">Here’s a summary of your vendor workspace.</p></div><Link href={`/vendors/${vendor.slug}`} className="btn btn-sm btn-outline inline-flex w-fit items-center gap-2"><span className="material-symbols-outlined text-[17px]">open_in_new</span>View Public Profile</Link></section>

          <div className={cn('flex items-start gap-3 rounded-xl border px-4 py-3 text-xs leading-relaxed sm:text-sm', usingSampleData ? 'border-brand-gold-border bg-brand-gold-light text-brand-gold-dark' : 'border-state-info/20 bg-state-info-bg text-state-info')} role="note"><span className="material-symbols-outlined mt-0.5 text-[18px]" aria-hidden="true">info</span><p>{usingSampleData ? 'Sample dashboard data: the enquiry rows below are illustrative examples, not customer submissions.' : 'Prototype submissions in this browser session are shown below. They were validated locally and have not been delivered to a vendor.'} This is a mock vendor account; authentication and live notifications are not connected.</p></div>

          <section aria-label="Enquiry summary" className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <article key={metric.label} className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs sm:p-5"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium text-text-secondary sm:text-sm">{metric.label}</span><span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', metric.tone)}><span className="material-symbols-outlined text-[19px]">{metric.icon}</span></span></div><p className="mt-3 text-2xl font-bold text-brand-green sm:text-3xl">{metric.value}</p></article>)}</section>

          <section id="enquiries" className="scroll-mt-24 overflow-hidden rounded-xl border border-border-default bg-brand-white shadow-xs">
            <div className="flex flex-col justify-between gap-3 border-b border-border-default px-4 py-4 sm:flex-row sm:items-center sm:px-5"><div><h2 className="text-base font-bold text-brand-green">Recent Enquiries</h2><p className="mt-0.5 text-xs text-text-secondary">{usingSampleData ? 'Illustrative sample records' : 'Local prototype submissions'} · {enquiries.length} total</p></div><Link href="/vendor/dashboard/enquiries" className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-brand-green hover:text-brand-gold-dark">View all enquiries <span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link></div>
            {enquiries.length === 0 ? <div className="px-5 py-12 text-center"><span className="material-symbols-outlined text-3xl text-text-muted">inbox</span><h3 className="mt-2 text-sm font-semibold text-brand-green">No enquiries yet</h3><p className="mt-1 text-xs text-text-secondary">New enquiries will appear here when available in this prototype.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-left"><thead className="bg-brand-ivory/70 text-[10px] font-semibold uppercase tracking-wide text-text-secondary"><tr>{['Customer Name', 'Event Type', 'Event Date', 'Event Location', 'Budget', 'Received Date', 'Status', 'Action'].map((heading) => <th key={heading} scope="col" className="whitespace-nowrap px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border-default">{enquiries.slice(0, 8).map((enquiry) => <tr key={enquiry.id} className="text-xs text-text-primary hover:bg-brand-ivory/40"><td className="px-4 py-3 font-semibold text-brand-green">{enquiry.customerName}</td><td className="px-4 py-3">{enquiry.eventType}</td><td className="whitespace-nowrap px-4 py-3">{formatDate(enquiry.eventDate)}</td><td className="max-w-48 truncate px-4 py-3" title={enquiry.eventLocation}>{enquiry.eventLocation || '—'}</td><td className="whitespace-nowrap px-4 py-3">{enquiry.budget || '—'}</td><td className="whitespace-nowrap px-4 py-3">{formatDate(enquiry.receivedAt)}</td><td className="px-4 py-3"><StatusBadge status={enquiry.status} /></td><td className="px-4 py-3"><button type="button" onClick={() => setSelectedEnquiry(enquiry)} className="whitespace-nowrap font-semibold text-brand-green underline underline-offset-2 hover:text-brand-gold-dark">View Details</button></td></tr>)}</tbody></table></div>}
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section id="business-profile" className="scroll-mt-24 rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-dark">Business profile</p><h2 className="mt-1 text-base font-bold text-brand-green">Profile Summary</h2></div><Link href="/vendor/dashboard/business-profile" className="text-xs font-semibold text-brand-green underline underline-offset-2">Edit Profile</Link></div><div className="mt-5 flex items-center gap-4"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-ivory">{vendor.portfolioImages[0] ? <Image src={vendor.portfolioImages[0]} alt={`${dashboardProfile.businessName} profile`} fill sizes="64px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-lg font-bold text-brand-green">SV</span>}</div><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-brand-green">{dashboardProfile.businessName}</h3><p className="mt-1 text-xs text-text-secondary">{dashboardProfile.categoryLabel}</p><p className="mt-0.5 truncate text-xs text-text-secondary">{dashboardProfile.location}</p></div></div><div className="mt-5"><div className="flex items-center justify-between text-xs"><span className="font-medium text-text-secondary">Profile completion</span><span className="font-bold text-brand-green">{profileCompletion}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-ivory"><div className="h-full rounded-full bg-brand-green" style={{ width: `${profileCompletion}%` }} /></div></div><div className="mt-5 flex items-center justify-between border-t border-border-default pt-4"><span className="text-xs text-text-secondary">Approval status</span><span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', vendor.verified ? 'bg-state-success-bg text-state-success' : 'bg-state-warning-bg text-state-warning-text')}>{vendor.verified ? 'Approved (Demo Data)' : 'Pending (Demo Data)'}</span></div></section>

            <section aria-labelledby="quick-actions-heading" className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6"><div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-dark">Workspace shortcuts</p><h2 id="quick-actions-heading" className="mt-1 text-base font-bold text-brand-green">Quick Actions</h2></div><div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2"><Link href={`/vendors/${vendor.slug}`} className="flex min-h-12 items-center gap-3 rounded-lg border border-border-default px-3 text-xs font-semibold text-brand-green hover:border-brand-gold hover:bg-brand-ivory"><span className="material-symbols-outlined text-[19px]">open_in_new</span>View Public Profile</Link><button type="button" onClick={() => showNotice('Services & pricing management is a mock dashboard section.')} className="flex min-h-12 items-center gap-3 rounded-lg border border-border-default px-3 text-left text-xs font-semibold text-brand-green hover:border-brand-gold hover:bg-brand-ivory"><span className="material-symbols-outlined text-[19px]">sell</span>Manage Services</button><button type="button" onClick={() => showNotice('Portfolio updates are not connected in this prototype.')} className="flex min-h-12 items-center gap-3 rounded-lg border border-border-default px-3 text-left text-xs font-semibold text-brand-green hover:border-brand-gold hover:bg-brand-ivory"><span className="material-symbols-outlined text-[19px]">photo_library</span>Update Portfolio</button><Link href="/vendor/dashboard/enquiries" className="flex min-h-12 items-center gap-3 rounded-lg border border-border-default px-3 text-xs font-semibold text-brand-green hover:border-brand-gold hover:bg-brand-ivory"><span className="material-symbols-outlined text-[19px]">inbox</span>View All Enquiries</Link></div></section>
          </div>
        </div>
      </main>

      {toast && <div className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-lg items-start gap-3 rounded-xl bg-brand-green px-4 py-3 text-sm text-white shadow-lg sm:left-auto sm:right-6"><span className="material-symbols-outlined text-[19px] text-brand-gold">info</span><p className="flex-1 text-xs leading-relaxed">{toast}</p><button type="button" aria-label="Dismiss message" onClick={() => setToast('')} className="text-white/70 hover:text-white"><span className="material-symbols-outlined text-[18px]">close</span></button></div>}

      {selectedEnquiry && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEnquiryDetails(); }}><section role="dialog" aria-modal="true" aria-labelledby="enquiry-detail-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-brand-white p-5 shadow-xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">{selectedEnquiry.sampleRecord ? 'Sample enquiry' : 'Prototype submission'}</p><h2 id="enquiry-detail-title" className="mt-1 text-xl font-bold text-brand-green">{selectedEnquiry.customerName}</h2></div><button type="button" onClick={closeEnquiryDetails} aria-label="Close enquiry details" className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-brand-ivory"><span className="material-symbols-outlined">close</span></button></div><div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{[['Event', selectedEnquiry.eventType], ['Date', formatDate(selectedEnquiry.eventDate)], ['Location', selectedEnquiry.eventLocation], ['Budget', selectedEnquiry.budget], ['Expected guests', selectedEnquiry.guestCount], ['Mobile', selectedEnquiry.mobileNumber], ['Email', selectedEnquiry.email || 'Not provided'], ['Status', selectedEnquiry.status]].map(([label, value]) => <div key={label} className="rounded-lg bg-brand-ivory p-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">{label}</p><p className="mt-1 break-words text-sm font-medium text-brand-green">{value}</p></div>)}</div>{selectedEnquiry.services.length > 0 && <div className="mt-4"><p className="text-xs font-semibold text-brand-green">Requested services</p><p className="mt-1 text-sm text-text-secondary">{selectedEnquiry.services.join(', ')}</p></div>}{selectedEnquiry.message && <div className="mt-4"><p className="text-xs font-semibold text-brand-green">Additional requirements</p><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{selectedEnquiry.message}</p></div>}<p className="mt-5 rounded-lg border border-brand-gold-border bg-brand-gold-light px-3 py-2 text-xs text-brand-gold-dark">Prototype view only. This enquiry has not been sent to the vendor.</p></section></div>}
    </div>
  );
}
