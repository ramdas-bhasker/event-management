'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { SidebarContents } from '@/components/vendor-dashboard/VendorDashboardClient';
import {
  BUSINESS_PROFILE_PREVIEW_COOKIE,
  calculateProfileCompletion,
  createBusinessProfile,
  discardVendorBusinessProfileDraft,
  getServiceAreaLabel,
  PROFILE_COMPLETION_FIELDS,
  readSavedVendorBusinessProfile,
  readVendorBusinessProfileSession,
  saveVendorBusinessProfileSession,
  toPublicProfilePreview,
} from '@/data/vendor-business-profile';
import { EVENT_CATEGORY_OPTIONS, LOCATION_AREA_OPTIONS, VENDOR_CATEGORY_OPTIONS } from '@/data/mock-vendors';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { cn } from '@/lib/utils';
import type { VendorRecord } from '@/types/vendor';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

const PROFILE_FIELD_IDS: Partial<Record<keyof VendorBusinessProfile, string>> = {
  businessName: 'business-name', category: 'vendor-category', description: 'business-description',
  yearEstablished: 'year-established', businessEmail: 'business-email', businessPhone: 'business-phone',
  state: 'state', city: 'city', areaLocality: 'area-locality', businessAddress: 'business-address', pinCode: 'pin-code',
};

const CAPACITY_OPTIONS: { value: VendorRecord['guestCapacity'][number]; label: string }[] = [
  { value: 'intimate', label: 'Intimate' },
  { value: 'medium', label: 'Medium' },
  { value: 'grand', label: 'Grand' },
];

interface Option { value: string; label: string }
interface ProfileSelectProps { id?: string; value: string; options: Option[]; placeholder: string; label: string; invalid?: boolean; onChange: (value: string) => void }

function ProfileSelect({ id, value, options, placeholder, label, invalid = false, onChange }: ProfileSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutsideClickAndEscape(rootRef, close, open);
  const selected = options.find((item) => item.value === value);
  return (
    <div ref={rootRef} className={cn('ay-dropdown', open && 'is-open')}>
      <button id={id} type="button" className={cn('ay-dropdown-trigger is-form-control', invalid && '!border-state-error')} aria-haspopup="listbox" aria-expanded={open} data-invalid={invalid || undefined} aria-label={label} onClick={() => setOpen((current) => !current)}>
        <span className={cn('ay-dropdown-value min-w-0 flex-1 truncate', !selected && 'text-text-muted')}>{selected?.label ?? placeholder}</span>
        <span className="material-symbols-outlined ay-dropdown-chevron" aria-hidden="true">expand_more</span>
      </button>
      {open && <div className="ay-dropdown-menu" role="listbox" aria-label={label}><div className="ay-dropdown-list">{options.map((option) => <button key={option.value} type="button" role="option" aria-selected={option.value === value} onClick={() => { onChange(option.value); setOpen(false); }} className={cn('ay-dropdown-item', option.value === value && 'is-selected')}><span className="ay-dropdown-item-title">{option.label}</span>{option.value === value && <span className="material-symbols-outlined ml-auto text-[18px]" aria-hidden="true">check</span>}</button>)}</div></div>}
    </div>
  );
}

interface ProfileMultiSelectProps { values: string[]; options: Option[]; label: string; placeholder: string; invalid?: boolean; onChange: (values: string[]) => void }

function ProfileMultiSelect({ values, options, label, placeholder, invalid = false, onChange }: ProfileMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useOutsideClickAndEscape(rootRef, close, open);
  const selectedLabels = options.filter((option) => values.includes(option.value)).map((option) => option.label);
  const summary = selectedLabels.length > 0 ? selectedLabels.slice(0, 2).join(', ') + (selectedLabels.length > 2 ? ` +${selectedLabels.length - 2}` : '') : placeholder;
  function toggle(value: string) { onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]); }
  return (
    <div ref={rootRef} className={cn('ay-dropdown', open && 'is-open')}>
      <button type="button" className={cn('ay-dropdown-trigger is-form-control', invalid && '!border-state-error')} aria-haspopup="listbox" aria-expanded={open} data-invalid={invalid || undefined} aria-label={label} onClick={() => setOpen((current) => !current)}><span className={cn('ay-dropdown-value min-w-0 flex-1 truncate', !selectedLabels.length && 'text-text-muted')}>{summary}</span><span className="material-symbols-outlined ay-dropdown-chevron" aria-hidden="true">expand_more</span></button>
      {open && <div className="ay-dropdown-menu" role="listbox" aria-label={label} aria-multiselectable="true"><div className="ay-dropdown-list">{options.map((option) => { const checked = values.includes(option.value); return <button key={option.value} type="button" role="option" aria-selected={checked} onClick={() => toggle(option.value)} className={cn('ay-dropdown-item', checked && 'is-selected')}><span className={cn('flex h-4 w-4 items-center justify-center rounded border', checked ? 'border-brand-green bg-brand-green text-white' : 'border-border-default bg-white')}><span className="material-symbols-outlined text-[14px]" aria-hidden="true">{checked ? 'check' : ''}</span></span><span className="ay-dropdown-item-title">{option.label}</span></button>; })}</div><div className="border-t border-border-default px-3 py-2 text-[11px] text-text-secondary">Select all areas that apply</div></div>}
    </div>
  );
}

interface ChipEditorProps { label: string; values: string[]; placeholder: string; onChange: (values: string[]) => void }

function ChipEditor({ label, values, placeholder, onChange }: ChipEditorProps) {
  const [input, setInput] = useState('');
  function addValue() {
    const next = input.trim().replace(/,$/, '').trim();
    if (next && !values.some((value) => value.toLowerCase() === next.toLowerCase())) onChange([...values, next]);
    setInput('');
  }
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); addValue(); }
    if (event.key === 'Backspace' && input.length === 0 && values.length > 0) onChange(values.slice(0, -1));
  }
  return <div><label className="mb-1.5 block text-sm font-semibold text-text-primary">{label}</label><div className="min-h-11 rounded-lg border border-border-default bg-brand-white px-3 py-2 focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/10"><div className="flex flex-wrap gap-2">{values.map((value) => <span key={value} className="inline-flex items-center gap-1 rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green">{value}<button type="button" onClick={() => onChange(values.filter((item) => item !== value))} aria-label={`Remove ${value}`} className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full hover:bg-brand-green/10"><span className="material-symbols-outlined text-[14px]">close</span></button></span>)}<input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} onBlur={() => { if (input.trim()) addValue(); }} aria-label={label} placeholder={values.length ? 'Add anotherâ€¦' : placeholder} className="min-w-32 flex-1 border-0 bg-transparent p-1 text-sm outline-none placeholder:text-text-muted" /></div></div><p className="mt-1 text-[11px] text-text-secondary">Type a value and press Enter or comma.</p></div>;
}

interface ToggleProps { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }

function PreferenceToggle({ label, description, checked, onChange }: ToggleProps) {
  return <label className="flex cursor-pointer items-start justify-between gap-4 py-3"><span><span className="block text-sm font-semibold text-text-primary">{label}</span><span className="mt-0.5 block text-xs leading-relaxed text-text-secondary">{description}</span></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#173D32]" /></label>;
}

interface Props { vendor: VendorRecord }

export function VendorBusinessProfileClient({ vendor }: Props) {
  const baseProfile = useMemo(() => createBusinessProfile(vendor), [vendor]);
  const [profile, setProfile] = useState<VendorBusinessProfile>(baseProfile);
  const [savedProfile, setSavedProfile] = useState<VendorBusinessProfile>(baseProfile);
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof VendorBusinessProfile, string>>>({});
  const [toast, setToast] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const safeSaved = readSavedVendorBusinessProfile(vendor);
    const safeRestored = readVendorBusinessProfileSession(vendor);
    setSavedProfile(safeSaved);
    setProfile(safeRestored);
    setInitialized(true);
  }, [vendor]);

  useEffect(() => {
    if (!initialized) return;
    saveVendorBusinessProfileSession(profile, { commitSaved: false, keepDraft: true });
  }, [initialized, profile]);

  const completion = calculateProfileCompletion(profile);

  const categoryOptions = useMemo(() => VENDOR_CATEGORY_OPTIONS.filter((item) => item.value !== 'all').map((item) => ({ value: item.value, label: item.shortLabel })), []);
  const areaOptions = useMemo(() => LOCATION_AREA_OPTIONS.filter((item) => item.value !== 'hyderabad').map((item) => ({ value: item.value, label: item.shortLabel })), []);
  const eventOptions = useMemo(() => EVENT_CATEGORY_OPTIONS.filter((item) => item.value !== 'all').map((item) => ({ value: item.value, label: item.label })), []);
  const update = <K extends keyof VendorBusinessProfile>(key: K, value: VendorBusinessProfile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setErrors((current) => { const next = { ...current }; delete next[key]; return next; });
  };
  const fieldClass = (key: keyof VendorBusinessProfile) => cn('h-11 w-full rounded-lg border bg-brand-white px-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand-green focus:ring-2 focus:ring-brand-green/10', errors[key] ? 'border-state-error' : 'border-border-default');
  const showError = (key: keyof VendorBusinessProfile) => errors[key] ? <p className="mt-1 text-xs text-state-error" role="alert">{errors[key]}</p> : null;

  function handleNavigate(label: string, target?: string) {
    setMobileNavOpen(false);
    if (label === 'Overview' || target === 'overview') window.location.href = '/vendor/dashboard';
    else if (label === 'Enquiries' || target === 'enquiries') window.location.href = '/vendor/dashboard/enquiries';
    else if (label === 'Business Profile') window.location.href = '/vendor/dashboard/business-profile';
    else if (label === 'Services & Pricing') window.location.href = '/vendor/dashboard/services-pricing';
    else if (label === 'Portfolio') window.location.href = '/vendor/dashboard/portfolio';
    else if (label === 'Account Settings') window.location.href = '/vendor/dashboard/account-settings';
    else setToast('This dashboard section is not connected yet.');
  }
  function handleLogout() { setToast('Mock sign out only. No real vendor authentication session is connected.'); }

  function validate(): Partial<Record<keyof VendorBusinessProfile, string>> {
    const next: Partial<Record<keyof VendorBusinessProfile, string>> = {};
    for (const field of PROFILE_COMPLETION_FIELDS) if (!String(profile[field.key] ?? '').trim()) next[field.key] = `${field.label} is required.`;
    if (profile.yearEstablished && (!/^\d{4}$/.test(profile.yearEstablished) || Number(profile.yearEstablished) < 1800 || Number(profile.yearEstablished) > new Date().getFullYear())) next.yearEstablished = 'Enter a valid four-digit year.';
    if (profile.businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.businessEmail)) next.businessEmail = 'Enter a valid email address.';
    if (profile.businessPhone && !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(profile.businessPhone.replace(/[\s-]/g, ''))) next.businessPhone = 'Enter a valid Indian mobile number.';
    if (profile.alternativePhone && !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(profile.alternativePhone.replace(/[\s-]/g, ''))) next.alternativePhone = 'Enter a valid Indian mobile number.';
    if (profile.websiteUrl && !/^https?:\/\//i.test(profile.websiteUrl)) next.websiteUrl = 'Include https:// or http:// in the website address.';
    if (profile.pinCode && !/^\d{6}$/.test(profile.pinCode)) next.pinCode = 'Enter a valid six-digit PIN code.';
    return next;
  }

  function saveChanges() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = document.querySelector('[aria-invalid="true"], [data-invalid="true"]');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setToast('Please fix the highlighted fields before saving.');
      return;
    }
    try {
      saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: false });
      setSavedProfile(profile);
      setToast('Profile saved to this browser session. No server or database is connected.');
    } catch {
      setToast('This browser could not save the profile session. Your edits remain visible on this page.');
    }
  }

  function cancelChanges() {
    setProfile(savedProfile);
    setErrors({});
    discardVendorBusinessProfileDraft(vendor.slug);
    setToast('Unsaved changes were discarded.');
  }

  function previewPublicProfile() {
    const preview = toPublicProfilePreview(profile);
    const encoded = encodeURIComponent(JSON.stringify(preview));
    if (encoded.length > 3800) {
      setToast('This profile has too much text to preview in the temporary browser session. Shorten the description or specialties and try again.');
      return;
    }
    saveVendorBusinessProfileSession(profile, { commitSaved: false, keepDraft: true });
    document.cookie = `${BUSINESS_PROFILE_PREVIEW_COOKIE}=${encoded}; Path=/; SameSite=Lax`;
    window.location.assign(`/vendors/${vendor.slug}?profilePreview=1`);
  }

  function toggleGuestCapacity(value: VendorBusinessProfile['guestCapacity'][number]) {
    update('guestCapacity', profile.guestCapacity.includes(value) ? profile.guestCapacity.filter((item) => item !== value) : [...profile.guestCapacity, value]);
  }

  const sidebarVendor = useMemo(() => ({ ...vendor, businessName: profile.businessName || vendor.businessName }), [profile.businessName, vendor]);

  return (
    <div className="min-h-screen bg-brand-ivory text-text-primary">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-green lg:flex"><SidebarContents vendor={sidebarVendor} activeItem="Business Profile" onNavigate={handleNavigate} onLogout={handleLogout} /></aside>
      {mobileNavOpen && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard navigation"><button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} /><aside className="absolute inset-y-0 left-0 flex w-[min(19rem,86vw)] flex-col bg-brand-green shadow-xl"><div className="flex justify-end px-3 pt-3"><button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"><span className="material-symbols-outlined">close</span></button></div><SidebarContents vendor={sidebarVendor} activeItem="Business Profile" onNavigate={handleNavigate} onLogout={handleLogout} /></aside></div>}
      <main className="min-w-0 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border-default bg-brand-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setMobileNavOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-default text-brand-green lg:hidden" aria-label="Open dashboard navigation"><span className="material-symbols-outlined">menu</span></button><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gold-dark sm:text-[11px]">Vendor workspace Mock account</p><h1 className="truncate text-base font-bold text-brand-green sm:text-lg">Business Profile</h1></div></div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative"><button type="button" onClick={() => { setNotificationOpen((open) => !open); setProfileMenuOpen(false); }} aria-label="Notifications" aria-expanded={notificationOpen} className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary hover:bg-brand-ivory hover:text-brand-green"><span className="material-symbols-outlined">notifications</span><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold" /></button>{notificationOpen && <div className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-border-default bg-brand-white p-4 shadow-lg"><p className="text-sm font-semibold text-brand-green">Notifications</p><p className="mt-2 text-xs leading-relaxed text-text-secondary">Notifications are a visual preview and are not connected yet.</p></div>}</div>
            <div className="relative"><button type="button" onClick={() => { setProfileMenuOpen((open) => !open); setNotificationOpen(false); }} aria-expanded={profileMenuOpen} className="flex h-10 items-center gap-2 rounded-full border border-border-default bg-brand-white pl-1 pr-2 hover:bg-brand-ivory sm:pr-3"><span className="relative h-8 w-8 overflow-hidden rounded-full bg-brand-green-light">{vendor.portfolioImages[0] ? <Image src={vendor.portfolioImages[0]} alt="" fill sizes="32px" className="object-cover" /> : <span className="flex h-full items-center justify-center text-xs font-bold text-brand-green">SV</span>}</span><span className="hidden max-w-36 truncate text-xs font-semibold text-brand-green sm:block">{sidebarVendor.businessName}</span><span className="material-symbols-outlined hidden text-[18px] text-text-secondary sm:block">expand_more</span></button>{profileMenuOpen && <div className="absolute right-0 top-12 z-30 w-60 rounded-xl border border-border-default bg-brand-white p-2 shadow-lg"><div className="border-b border-border-default px-3 py-2"><p className="truncate text-sm font-semibold text-brand-green">{sidebarVendor.businessName}</p><p className="text-xs text-text-secondary">Mock vendor account</p></div><button type="button" onClick={handleLogout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-state-error hover:bg-brand-ivory"><span className="material-symbols-outlined text-[18px]">logout</span>Mock sign out</button></div>}</div>
          </div>
        </header>

        <div className="mx-auto max-w-[1680px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-text-secondary">Keep your public business information accurate</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-green sm:text-3xl">{profile.businessName}</h2><p className="mt-2 text-sm text-text-secondary">Updates in this prototype are stored only in this browser session.</p></div><button type="button" onClick={previewPublicProfile} className="btn btn-sm btn-outline inline-flex w-fit items-center gap-2"><span className="material-symbols-outlined text-[17px]">open_in_new</span>Preview Public Profile</button></section>

          <div className="flex items-center gap-3 rounded-xl border border-brand-gold-border bg-brand-gold-light px-4 py-3 text-xs leading-relaxed text-brand-gold-dark sm:text-sm" role="note"><span className="material-symbols-outlined text-[19px]" aria-hidden="true">info</span><p>Mock vendor account. Profile edits and contact preferences are temporary browser-session data; nothing is sent to a server.</p></div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 divide-y divide-border-default">
              <section className="py-6 sm:py-7 rounded-xl border border-border-default bg-brand-white px-5 mb-5 sm:px-7" aria-labelledby="business-info-heading"><div className="mb-5"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-dark">01 Business</p><h3 id="business-info-heading" className="mt-1 text-lg font-bold text-brand-green">Business Information</h3><p className="mt-1 text-xs text-text-secondary">The details customers see when they discover your listing.</p></div><div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <div><label htmlFor="business-name" className="mb-1.5 block text-sm font-semibold text-text-primary">Business / Brand Name <span className="text-state-error">*</span></label><input id="business-name" value={profile.businessName} onChange={(event) => update('businessName', event.target.value)} aria-invalid={!!errors.businessName} className={fieldClass('businessName')} />{showError('businessName')}</div>
                <div><label className="mb-1.5 block text-sm font-semibold text-text-primary" htmlFor="vendor-category">Vendor Category <span className="text-state-error">*</span></label><ProfileSelect id="vendor-category" label="Vendor category" invalid={!!errors.category} value={profile.category} options={categoryOptions} placeholder="Choose category" onChange={(value) => update('category', value as VendorBusinessProfile['category'])} />{showError('category')}</div>
                <div className="md:col-span-2"><label htmlFor="business-description" className="mb-1.5 block text-sm font-semibold text-text-primary">Business Description <span className="text-state-error">*</span></label><textarea id="business-description" value={profile.description} onChange={(event) => update('description', event.target.value)} aria-invalid={!!errors.description} rows={4} maxLength={1200} className={cn('w-full resize-y rounded-lg border bg-brand-white px-3 py-2.5 text-sm leading-relaxed text-text-primary outline-none placeholder:text-text-muted focus:border-brand-green focus:ring-2 focus:ring-brand-green/10', errors.description ? 'border-state-error' : 'border-border-default')} />{showError('description')}<p className="mt-1 text-right text-[11px] text-text-secondary">{profile.description.length}/1200</p></div>
                <div><label htmlFor="year-established" className="mb-1.5 block text-sm font-semibold text-text-primary">Year Established <span className="text-state-error">*</span></label><input id="year-established" inputMode="numeric" maxLength={4} value={profile.yearEstablished} onChange={(event) => update('yearEstablished', event.target.value.replace(/\D/g, '').slice(0, 4))} aria-invalid={!!errors.yearEstablished} placeholder="YYYY" className={fieldClass('yearEstablished')} />{showError('yearEstablished')}</div>
                <div><label htmlFor="business-email" className="mb-1.5 block text-sm font-semibold text-text-primary">Business Email <span className="text-state-error">*</span></label><input id="business-email" type="email" value={profile.businessEmail} onChange={(event) => update('businessEmail', event.target.value)} aria-invalid={!!errors.businessEmail} placeholder="you@business.com" className={fieldClass('businessEmail')} />{showError('businessEmail')}</div>
                <div><label htmlFor="business-phone" className="mb-1.5 block text-sm font-semibold text-text-primary">Business Phone Number <span className="text-state-error">*</span></label><input id="business-phone" type="tel" value={profile.businessPhone} onChange={(event) => update('businessPhone', event.target.value)} aria-invalid={!!errors.businessPhone} placeholder="+91 98765 43210" className={fieldClass('businessPhone')} />{showError('businessPhone')}</div>
                <div><label htmlFor="alternative-phone" className="mb-1.5 block text-sm font-semibold text-text-primary">Alternative Contact Number <span className="text-xs font-normal text-text-secondary">(optional)</span></label><input id="alternative-phone" type="tel" value={profile.alternativePhone} onChange={(event) => update('alternativePhone', event.target.value)} aria-invalid={!!errors.alternativePhone} placeholder="+91 98765 43210" className={fieldClass('alternativePhone')} />{showError('alternativePhone')}</div>
                <div><label htmlFor="website-url" className="mb-1.5 block text-sm font-semibold text-text-primary">Website URL <span className="text-xs font-normal text-text-secondary">(optional)</span></label><input id="website-url" type="url" value={profile.websiteUrl} onChange={(event) => update('websiteUrl', event.target.value)} aria-invalid={!!errors.websiteUrl} placeholder="https://example.com" className={fieldClass('websiteUrl')} />{showError('websiteUrl')}</div>
              </div></section>

              <section className="py-6 sm:py-7 rounded-xl border border-border-default bg-brand-white px-5 mb-5 sm:px-7" aria-labelledby="business-location-heading"><div className="mb-5"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-dark">02 Location</p><h3 id="business-location-heading" className="mt-1 text-lg font-bold text-brand-green">Business Location</h3></div><div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                <div><label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-text-primary">State <span className="text-state-error">*</span></label><input id="state" value={profile.state} onChange={(event) => update('state', event.target.value)} aria-invalid={!!errors.state} placeholder="State" className={fieldClass('state')} />{showError('state')}</div>
                <div><label htmlFor="city" className="mb-1.5 block text-sm font-semibold text-text-primary">City <span className="text-state-error">*</span></label><input id="city" value={profile.city} onChange={(event) => update('city', event.target.value)} aria-invalid={!!errors.city} placeholder="City" className={fieldClass('city')} />{showError('city')}</div>
                <div><label htmlFor="area-locality" className="mb-1.5 block text-sm font-semibold text-text-primary">Area / Locality <span className="text-state-error">*</span></label><input id="area-locality" value={profile.areaLocality} onChange={(event) => update('areaLocality', event.target.value)} aria-invalid={!!errors.areaLocality} placeholder="Area or locality" className={fieldClass('areaLocality')} />{showError('areaLocality')}</div>
                <div><label htmlFor="pin-code" className="mb-1.5 block text-sm font-semibold text-text-primary">PIN Code <span className="text-state-error">*</span></label><input id="pin-code" inputMode="numeric" maxLength={6} value={profile.pinCode} onChange={(event) => update('pinCode', event.target.value.replace(/\D/g, '').slice(0, 6))} aria-invalid={!!errors.pinCode} placeholder="6-digit PIN code" className={fieldClass('pinCode')} />{showError('pinCode')}</div>
                <div className="md:col-span-2"><label htmlFor="business-address" className="mb-1.5 block text-sm font-semibold text-text-primary">Full Business Address <span className="text-state-error">*</span></label><textarea id="business-address" value={profile.businessAddress} onChange={(event) => update('businessAddress', event.target.value)} aria-invalid={!!errors.businessAddress} rows={2} className={cn('w-full resize-y rounded-lg border bg-brand-white px-3 py-2.5 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10', errors.businessAddress ? 'border-state-error' : 'border-border-default')} />{showError('businessAddress')}</div>
                <div className="md:col-span-2"><label className="mb-1.5 block text-sm font-semibold text-text-primary">Service Areas <span className="text-xs font-normal text-text-secondary">(choose all areas served around Hyderabad)</span></label><ProfileMultiSelect label="Hyderabad service areas" values={profile.serviceAreas} options={areaOptions} placeholder="Select service areas" onChange={(value) => update('serviceAreas', value as VendorBusinessProfile['serviceAreas'])} /><div className="mt-2 flex flex-wrap gap-1.5">{profile.serviceAreas.map((area) => <span key={area} className="rounded-full bg-brand-ivory px-2.5 py-1 text-[11px] text-text-secondary">{getServiceAreaLabel(area)}</span>)}</div></div>
              </div></section>

              <section className="py-6 sm:py-7 rounded-xl border border-border-default bg-brand-white px-5 mb-5 sm:px-7" aria-labelledby="highlights-heading"><div className="mb-5"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-dark">03 Highlights</p><h3 id="highlights-heading" className="mt-1 text-lg font-bold text-brand-green">Business Highlights</h3><p className="mt-1 text-xs text-text-secondary">Use the listingâ€™s current service and event data, then add or remove what applies.</p></div><div className="space-y-5">
                <ChipEditor label="Key Specialities" values={profile.keySpecialties} placeholder="Add a speciality" onChange={(value) => update('keySpecialties', value)} />
                <Link href="/vendor/dashboard/services-specialities" className="inline-flex text-sm font-semibold text-brand-green hover:text-brand-gold-dark">Open Services &amp; Specialities editor</Link>
                <ChipEditor label="Languages Spoken" values={profile.languagesSpoken} placeholder="Add a language" onChange={(value) => update('languagesSpoken', value)} />
                <div><label className="mb-1.5 block text-sm font-semibold text-text-primary">Types of Events Served</label><ProfileMultiSelect label="Event types served" values={profile.eventCategories} options={eventOptions} placeholder="Select event types" onChange={(value) => update('eventCategories', value as VendorBusinessProfile['eventCategories'])} /></div>
                <fieldset><legend className="mb-2 text-sm font-semibold text-text-primary">Guest Capacity</legend><div className="flex flex-wrap gap-2">{CAPACITY_OPTIONS.map((option) => <label key={option.value} className={cn('inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors', profile.guestCapacity.includes(option.value) ? 'border-brand-green bg-brand-green-light text-brand-green' : 'border-border-default bg-white text-text-secondary')}><input type="checkbox" checked={profile.guestCapacity.includes(option.value)} onChange={() => toggleGuestCapacity(option.value)} className="h-4 w-4 accent-[#173D32]" />{option.label}</label>)}</div></fieldset>
                <div><label htmlFor="business-experience" className="mb-1.5 block text-sm font-semibold text-text-primary">Business Experience</label><input id="business-experience" value={profile.businessExperience} onChange={(event) => update('businessExperience', event.target.value)} placeholder="For example, 8 years" className={fieldClass('businessExperience')} /></div>
              </div></section>

              <section className="py-6 sm:py-7 rounded-xl border border-border-default bg-brand-white px-5 sm:px-7" aria-labelledby="contact-preferences-heading"><div className="mb-3"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-dark">04 Preferences</p><h3 id="contact-preferences-heading" className="mt-1 text-lg font-bold text-brand-green">Contact Preferences</h3><p className="mt-1 text-xs text-text-secondary">These controls are frontend prototype settings and do not update a live profile.</p></div><div className="divide-y divide-border-default"><PreferenceToggle label="Show phone number on public profile" description="Allow customers to view the business phone number on your listing." checked={profile.showPhone} onChange={(value) => update('showPhone', value)} /><PreferenceToggle label="Show email on public profile" description="Allow customers to view the business email on your listing." checked={profile.showEmail} onChange={(value) => update('showEmail', value)} /><PreferenceToggle label="Accept enquiries through AyojanSetu" description="Allow customers to start a platform enquiry for this vendor." checked={profile.acceptEnquiries} onChange={(value) => update('acceptEnquiries', value)} /></div></section>

              <div className="flex flex-col-reverse gap-3 py-5 sm:flex-row sm:justify-end"><button type="button" onClick={cancelChanges} className="btn btn-sm btn-outline">Cancel</button><button type="button" onClick={saveChanges} className="btn btn-sm btn-primary">Save Changes</button></div>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-24">
              <section className="rounded-xl border border-border-default bg-brand-white p-5">
                <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gold-dark">Profile health</p><h3 className="mt-1 text-base font-bold text-brand-green">Profile Completion</h3></div><span className="text-2xl font-bold text-brand-green">{completion.percentage}%</span></div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-ivory"><div className="h-full rounded-full bg-brand-green transition-[width]" style={{ width: `${completion.percentage}%` }} /></div>
                <p className="mt-3 text-xs leading-relaxed text-text-secondary">{completion.missing.length ? 'Complete these required details to strengthen your business profile:' : 'All required profile details are complete.'}</p>
                {completion.missing.length > 0 && <ul className="mt-3 space-y-1.5">{completion.missing.map(({ key, label }) => <li key={key}><button type="button" aria-label={`Go to ${label}`} onClick={() => { const target = document.getElementById(PROFILE_FIELD_IDS[key] ?? key); target?.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (target instanceof HTMLElement) target.focus({ preventScroll: true }); }} className="flex w-full items-start gap-2 rounded-md py-1 text-left text-xs text-text-secondary hover:bg-brand-ivory hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green"><span className="material-symbols-outlined mt-[-1px] text-[15px] text-brand-gold-dark">radio_button_unchecked</span><span>{label}</span><span className="material-symbols-outlined ml-auto text-[15px]" aria-hidden="true">arrow_forward</span></button></li>)}</ul>}
                <p className="mt-4 border-t border-border-default pt-3 text-[11px] text-text-muted">Calculated from {completion.total} required fields in this profile.</p>
              </section>
              <section className="rounded-xl border border-border-default bg-brand-white p-5"><div className="flex items-center gap-3"><span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-brand-ivory">{vendor.portfolioImages[0] ? <Image src={vendor.portfolioImages[0]} alt="" fill sizes="48px" className="object-cover" /> : <span className="flex h-full items-center justify-center font-bold text-brand-green">AS</span>}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-brand-green">{profile.businessName || 'Business name'}</p><p className="mt-0.5 text-xs text-text-secondary">{categoryOptions.find((item) => item.value === profile.category)?.label}</p><p className="mt-0.5 truncate text-xs text-text-secondary">{[profile.areaLocality, profile.city].filter(Boolean).join(', ')}{profile.yearEstablished ? ` · Est. ${profile.yearEstablished}` : ''}</p></div></div>{(profile.businessPhone || profile.businessEmail) && <div className="mt-3 space-y-1 border-t border-border-default pt-3 text-xs text-text-secondary">{profile.businessPhone && <p className="truncate"><span className="font-semibold text-brand-green">Phone:</span> +91 {profile.businessPhone.replace(/^\+91[\s-]*/, '')}</p>}{profile.businessEmail && <p className="truncate"><span className="font-semibold text-brand-green">Email:</span> {profile.businessEmail}</p>}</div>}<button type="button" onClick={previewPublicProfile} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-border-default text-xs font-semibold text-brand-green hover:border-brand-gold hover:bg-brand-ivory"><span className="material-symbols-outlined text-[17px]">open_in_new</span>Preview Public Profile</button></section>
            </aside>
          </div>
        </div>
      </main>
      {toast && <div className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-lg items-start gap-3 rounded-xl bg-brand-green px-4 py-3 text-sm text-white shadow-lg sm:left-auto sm:right-6" role="status"><span className="material-symbols-outlined text-[19px] text-brand-gold">info</span><p className="flex-1 text-xs leading-relaxed">{toast}</p><button type="button" aria-label="Dismiss message" onClick={() => setToast('')} className="text-white/70 hover:text-white"><span className="material-symbols-outlined text-[18px]">close</span></button></div>}
    </div>
  );
}

