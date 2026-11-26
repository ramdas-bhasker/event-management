'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { SidebarContents } from '@/components/vendor-dashboard/VendorDashboardClient';
import { readVendorBusinessProfileSession } from '@/data/vendor-business-profile';
import type { VendorRecord } from '@/types/vendor';

const navItems = [
  { label: 'Overview', href: '/vendor/dashboard' },
  { label: 'Enquiries', href: '/vendor/dashboard/enquiries' },
  { label: 'Business Profile', href: '/vendor/dashboard/business-profile' },
  { label: 'Services & Pricing', href: '/vendor/dashboard/services-pricing' },
  { label: 'Portfolio', href: '/vendor/dashboard/portfolio' },
  { label: 'Account Settings', href: '/vendor/dashboard/account-settings' },
] as const;

type NavLabel = (typeof navItems)[number]['label'];
type Props = {
  vendor: VendorRecord;
  activeItem: NavLabel;
  title?: string;
  businessName?: string;
  children: ReactNode;
};

export function VendorWorkspaceShell({
  vendor, activeItem, title = activeItem, businessName, children,
}: Props) {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showSignOutNotice, setShowSignOutNotice] = useState(false);
  const [storedName, setStoredName] = useState(vendor.businessName);

  useEffect(() => {
    if (businessName === undefined) {
      setStoredName(readVendorBusinessProfileSession(vendor).businessName || vendor.businessName);
    }
  }, [businessName, vendor]);

  const sidebarVendor = { ...vendor, businessName: businessName ?? storedName };
  const handleLogout = () => setShowSignOutNotice(true);

  function handleNavigate(label: string) {
    setMobileNavOpen(false);
    const destination = navItems.find((item) => item.label === label);
    if (destination) router.push(destination.href);
  }

  return (
    <div className="min-h-screen bg-brand-ivory text-text-primary">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-green lg:flex"><SidebarContents vendor={sidebarVendor} activeItem={activeItem} onNavigate={handleNavigate} onLogout={handleLogout} /></aside>
      {mobileNavOpen && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard navigation"><button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} /><aside className="absolute inset-y-0 left-0 flex w-[min(19rem,86vw)] flex-col bg-brand-green shadow-xl"><div className="flex justify-end px-3 pt-3"><button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"><span className="material-symbols-outlined">close</span></button></div><SidebarContents vendor={sidebarVendor} activeItem={activeItem} onNavigate={handleNavigate} onLogout={handleLogout} /></aside></div>}
      <main className="min-w-0 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border-default bg-brand-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setMobileNavOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-default text-brand-green lg:hidden" aria-label="Open dashboard navigation"><span className="material-symbols-outlined">menu</span></button><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gold-dark sm:text-[11px]">Vendor workspace Mock account</p><h1 className="truncate text-base font-bold text-brand-green sm:text-lg">{title}</h1></div></div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative"><button type="button" onClick={() => { setNotificationOpen((open) => !open); setProfileMenuOpen(false); }} aria-label="Notifications" aria-expanded={notificationOpen} className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-brand-ivory hover:text-brand-green"><span className="material-symbols-outlined">notifications</span><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold" /></button>{notificationOpen && <div className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-border-default bg-brand-white p-4 shadow-lg"><p className="text-sm font-semibold text-brand-green">Notifications</p><p className="mt-2 text-xs leading-relaxed text-text-secondary">Notifications are a visual preview and are not connected yet.</p></div>}</div>
            <div className="relative"><button type="button" onClick={() => { setProfileMenuOpen((open) => !open); setNotificationOpen(false); }} aria-expanded={profileMenuOpen} className="flex h-10 items-center gap-2 rounded-full border border-border-default bg-brand-white pl-1 pr-2 hover:bg-brand-ivory sm:pr-3"><span className="relative h-8 w-8 overflow-hidden rounded-full bg-brand-green-light">{vendor.portfolioImages[0] ? <Image src={vendor.portfolioImages[0]} alt="" fill sizes="32px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-xs font-bold text-brand-green">SV</span>}</span><span className="hidden max-w-36 truncate text-xs font-semibold text-brand-green sm:block">{sidebarVendor.businessName}</span><span className="material-symbols-outlined hidden text-[18px] text-text-secondary sm:block">expand_more</span></button>{profileMenuOpen && <div className="absolute right-0 top-12 z-30 w-60 rounded-xl border border-border-default bg-brand-white p-2 shadow-lg"><div className="border-b border-border-default px-3 py-2"><p className="truncate text-sm font-semibold text-brand-green">{sidebarVendor.businessName}</p><p className="text-xs text-text-secondary">Mock vendor account</p></div><button type="button" onClick={handleLogout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-state-error hover:bg-brand-ivory"><span className="material-symbols-outlined text-[18px]">logout</span>Mock sign out</button></div>}</div>
          </div>
        </header>

        <div className="mx-auto max-w-[1680px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
      {showSignOutNotice && (
        <div role="status" className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-lg items-center gap-3 rounded-xl bg-brand-green px-4 py-3 text-sm text-white shadow-lg sm:left-auto sm:right-6">
          <span className="material-symbols-outlined text-[19px] text-brand-gold" aria-hidden="true">info</span>
          <p className="flex-1">This is a mock vendor account.</p>
          <button type="button" aria-label="Dismiss message" onClick={() => setShowSignOutNotice(false)}>
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
