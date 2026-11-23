'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { LOCATION_AREA_OPTIONS } from '@/data/mock-vendors';
import { submitMockEnquiry } from '@/lib/mock-enquiry-service';
import { cn, formatIsoDate, MONTH_NAMES, SHORT_MONTHS, WEEKDAYS } from '@/lib/utils';
import type { EnquiryDraft } from '@/types/enquiry';
import type { EnquiryVendor } from '@/types/enquiry-vendor';

const EVENT_TYPES = [
  'Wedding', 'Engagement', 'Birthday', 'Corporate Event', 'Reception',
  'Housewarming', 'Traditional Function', 'Baby Shower / Naming Ceremony',
  'Anniversary', 'Other',
];
const GUEST_COUNTS = ['Below 50', '50–100', '100–250', '250–500', '500–1000', 'Above 1000', 'Not Sure'];
const BUDGETS = ['Below ₹25,000', '₹25,000–₹50,000', '₹50,000–₹1 lakh', '₹1–₹2 lakh', '₹2–₹5 lakh', 'Above ₹5 lakh', 'Flexible / Need Guidance'];
const FORM_DRAFT_KEY = 'ayojansetu_enquiry_draft';
const DEMO_AUTH_KEY = 'ayojansetu_demo_customer_auth';
const LAST_ENQUIRY_VENDOR_KEY = 'ayojansetu_last_enquiry_vendor';
const OTHER_REQUIREMENTS = 'Other requirements';
const INITIAL_SERVICE_LIMIT = 8;

const EMPTY_DRAFT = (vendorId: string): EnquiryDraft => ({
  vendorId,
  eventType: '', otherEventType: '', eventDate: '', dateNotFinalised: false,
  eventLocation: '', otherLocation: '', guestCount: '', budget: '', services: [],
  message: '', fullName: '', mobileNumber: '', email: '',
});

interface EnquiryFormClientProps { vendor: EnquiryVendor }

interface CustomSelectProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  error?: string;
  onChange: (value: string) => void;
}

function CustomSelect({ id, label, value, placeholder, options, error, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useOutsideClickAndEscape(rootRef, () => setOpen(false), open);

  return (
    <div className={cn('ay-dropdown', open && 'is-open')} ref={rootRef}>
      <label id={`${id}-label`} className="mb-1.5 block text-sm font-semibold text-text-primary">{label}</label>
      <button type="button" id={id} aria-haspopup="listbox" aria-labelledby={`${id}-label`} aria-expanded={open} aria-describedby={error ? `${id}-error` : undefined} onClick={() => setOpen((current) => !current)} className={cn('ay-dropdown-trigger is-form-control', error && '!border-state-error')}>
        <span className="ay-dropdown-trigger-left"><span className="material-symbols-outlined ay-dropdown-form-icon" aria-hidden="true">expand_more</span><span className="ay-dropdown-value">{value || placeholder}</span></span>
        <span className="material-symbols-outlined ay-dropdown-chevron" aria-hidden="true">expand_more</span>
      </button>
      {open && <div role="listbox" aria-labelledby={`${id}-label`} className="ay-dropdown-menu"><div className="ay-dropdown-list">
        {options.map((option) => <button type="button" role="option" aria-selected={value === option} key={option} onClick={() => { onChange(option); setOpen(false); }} className={cn('ay-dropdown-item', value === option && 'is-selected')}><span className="ay-dropdown-item-title">{option}</span>{value === option && <span className="material-symbols-outlined ml-auto" aria-hidden="true">check</span>}</button>)}
      </div></div>}
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-state-error" role="alert">{error}</p>}
    </div>
  );
}

interface EventDatePickerProps {
  value: string;
  disabled: boolean;
  error?: string;
  onChange: (value: string) => void;
}

function EventDatePicker({ value, disabled, error, onChange }: EventDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [calendar, setCalendar] = useState(() => {
    const parsed = value.split('-').map(Number);
    return parsed.length === 3 && parsed.every(Number.isFinite)
      ? { year: parsed[0], month: parsed[1] - 1 }
      : { year: new Date().getFullYear(), month: new Date().getMonth() };
  });
  const rootRef = useRef<HTMLDivElement>(null);
  useOutsideClickAndEscape(rootRef, () => setOpen(false), open);

  useEffect(() => {
    if (!value) return;
    const [year, month] = value.split('-').map(Number);
    if (year && month) setCalendar({ year, month: month - 1 });
  }, [value]);

  const firstDay = new Date(calendar.year, calendar.month, 1).getDay();
  const daysInMonth = new Date(calendar.year, calendar.month + 1, 0).getDate();
  const displayValue = value ? `${value.slice(8, 10)} ${SHORT_MONTHS[Number(value.slice(5, 7)) - 1]} ${value.slice(0, 4)}` : '';

  function moveMonth(amount: number) {
    const next = new Date(calendar.year, calendar.month + amount, 1);
    setCalendar({ year: next.getFullYear(), month: next.getMonth() });
  }

  function chooseDate(date: Date, preset: string | null = null) {
    onChange(formatIsoDate(date.getFullYear(), date.getMonth(), date.getDate()));
    setActivePreset(preset);
    setCalendar({ year: date.getFullYear(), month: date.getMonth() });
    setOpen(false);
  }

  function choosePreset(preset: 'weekend' | 'next-month') {
    const now = new Date();
    if (preset === 'weekend') {
      const dayOffset = (6 - now.getDay() + 7) % 7 || 7;
      const saturday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
      chooseDate(saturday, preset);
    } else {
      chooseDate(new Date(now.getFullYear(), now.getMonth() + 1, 1), preset);
    }
  }

  return (
    <div>
      <label id="event-date-label" className="mb-1.5 block text-sm font-semibold text-text-primary">Event date *</label>
      <div className={cn('ay-dropdown', open && 'is-open')} ref={rootRef}>
        <button type="button" id="event-date" disabled={disabled} aria-haspopup="dialog" aria-labelledby="event-date-label" aria-expanded={open} aria-describedby={error ? 'event-date-error' : undefined} onClick={() => setOpen((current) => !current)} className={cn('ay-dropdown-trigger is-form-control', disabled && 'cursor-not-allowed opacity-60', error && '!border-state-error')}>
          <span className="ay-dropdown-trigger-left"><span className="material-symbols-outlined ay-dropdown-form-icon" aria-hidden="true">calendar_month</span><span className="ay-dropdown-value">{disabled ? 'Date not finalised' : displayValue || 'Choose event date'}</span></span>
          <span className="material-symbols-outlined ay-dropdown-chevron" aria-hidden="true">expand_more</span>
        </button>
        {open && !disabled && <div role="dialog" aria-label="Choose event date" className="ay-dropdown-menu ay-calendar-menu">
          <div className="ay-dropdown-header"><span className="ay-dropdown-header-title">Select Event Date</span></div>
          <div className="ay-calendar-presets">
            <button type="button" className={cn('ay-calendar-preset-btn', activePreset === 'weekend' && 'is-active')} onClick={() => choosePreset('weekend')}>This Weekend</button>
            <button type="button" className={cn('ay-calendar-preset-btn', activePreset === 'next-month' && 'is-active')} onClick={() => choosePreset('next-month')}>Next Month</button>
          </div>
          <div className="ay-calendar-nav">
            <button type="button" className="ay-calendar-nav-btn" aria-label="Previous Month" onClick={() => moveMonth(-1)}><span className="material-symbols-outlined" aria-hidden="true">chevron_left</span></button>
            <span className="ay-calendar-month-label">{MONTH_NAMES[calendar.month]} {calendar.year}</span>
            <button type="button" className="ay-calendar-nav-btn" aria-label="Next Month" onClick={() => moveMonth(1)}><span className="material-symbols-outlined" aria-hidden="true">chevron_right</span></button>
          </div>
          <div className="ay-calendar-grid">
            {WEEKDAYS.map((day) => <div key={day} className="ay-calendar-weekday">{day}</div>)}
            {Array.from({ length: firstDay }, (_, index) => <div key={`empty-${index}`} aria-hidden="true" />)}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;
              const iso = formatIsoDate(calendar.year, calendar.month, day);
              const isPast = iso < getToday();
              return <button key={iso} type="button" disabled={isPast} aria-label={`${MONTH_NAMES[calendar.month]} ${day}, ${calendar.year}`} aria-pressed={iso === value} className={cn('ay-calendar-day', iso === value && 'is-selected')} onClick={() => chooseDate(new Date(calendar.year, calendar.month, day))}>{day}</button>;
            })}
          </div>
          <div className="ay-calendar-footer"><span>Choose a date or mark it as not finalised</span><button type="button" className="font-semibold text-brand-green" onClick={() => setOpen(false)}>Close</button></div>
        </div>}
      </div>
      {error && <p id="event-date-error" className="mt-1 text-xs text-state-error" role="alert">{error}</p>}
    </div>
  );
}

function normalizeIndianMobile(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  return /^[6-9]\d{9}$/.test(digits) ? `+91 ${digits}` : null;
}

function validateDraft(draft: EnquiryDraft): Partial<Record<keyof EnquiryDraft, string>> {
  const errors: Partial<Record<keyof EnquiryDraft, string>> = {};
  if (!draft.eventType) errors.eventType = 'Choose an event type.';
  if (draft.eventType === 'Other' && !draft.otherEventType.trim()) errors.otherEventType = 'Enter the event type.';
  if (!draft.dateNotFinalised && !draft.eventDate) errors.eventDate = 'Choose a date or select Date Not Finalised.';
  if (draft.eventDate) {
    const parsedDate = new Date(`${draft.eventDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate < today) errors.eventDate = 'Choose a valid date that is today or later.';
  }
  if (!draft.eventLocation) errors.eventLocation = 'Choose an event location.';
  if (draft.eventLocation === 'Other location' && !draft.otherLocation.trim()) errors.otherLocation = 'Enter the event location.';
  if (!draft.guestCount) errors.guestCount = 'Choose an expected guest count.';
  if (!draft.budget) errors.budget = 'Choose an estimated budget.';
  if (draft.fullName.trim().length < 2) errors.fullName = 'Enter your full name.';
  if (!normalizeIndianMobile(draft.mobileNumber)) errors.mobileNumber = 'Enter a valid 10-digit Indian mobile number.';
  if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address or leave this blank.';
  return errors;
}

function getToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function EnquiryFormClient({ vendor }: EnquiryFormClientProps) {
  const router = useRouter();
  const draftKey = `${FORM_DRAFT_KEY}:${vendor.id}`;
  const [draft, setDraft] = useState<EnquiryDraft>(() => EMPTY_DRAFT(vendor.id));
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryDraft, string>>>({});
  const [isReady, setIsReady] = useState(false);
  const [isDemoAuthenticated, setIsDemoAuthenticated] = useState(false);
  const [showMockAuth, setShowMockAuth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submittingRef = useRef(false);
  const previousVendorId = useRef(vendor.id);

  useEffect(() => {
    let vendorChanged = previousVendorId.current !== vendor.id;
    previousVendorId.current = vendor.id;
    if (vendorChanged) setShowAllServices(false);

    try {
      const lastVendorId = sessionStorage.getItem(LAST_ENQUIRY_VENDOR_KEY);
      vendorChanged = vendorChanged || Boolean(lastVendorId && lastVendorId !== vendor.id);
      sessionStorage.setItem(LAST_ENQUIRY_VENDOR_KEY, vendor.id);
      if (vendorChanged) setShowAllServices(false);

      const stored = sessionStorage.getItem(draftKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          const data = parsed as Partial<EnquiryDraft>;
          const allowedServices = new Set([...vendor.services, OTHER_REQUIREMENTS]);
          setDraft({ ...EMPTY_DRAFT(vendor.id), ...data, vendorId: vendor.id, services: vendorChanged ? [] : Array.isArray(data.services) ? data.services.filter((service) => allowedServices.has(service)) : [] });
        }
      } else if (vendorChanged) {
        setDraft((current) => ({ ...current, vendorId: vendor.id, services: [] }));
      }
      setIsDemoAuthenticated(sessionStorage.getItem(DEMO_AUTH_KEY) === 'true');
    } catch {
      // Continue with an empty in-memory draft if session storage is unavailable.
    } finally {
      setIsReady(true);
    }
  }, [draftKey, vendor.id, vendor.services]);

  useEffect(() => {
    if (!isReady) return;
    try { sessionStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* Keep in-memory values. */ }
  }, [draft, draftKey, isReady]);

  function updateDraft<K extends keyof EnquiryDraft>(field: K, value: EnquiryDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError('');
  }

  function toggleService(service: string) {
    updateDraft('services', draft.services.includes(service) ? draft.services.filter((item) => item !== service) : [...draft.services, service]);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (!isDemoAuthenticated) {
      setShowMockAuth(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const mobileNumber = normalizeIndianMobile(draft.mobileNumber);
      if (!mobileNumber) throw new Error('Enter a valid Indian mobile number.');
      submitMockEnquiry({ ...draft, fullName: draft.fullName.trim(), mobileNumber, email: draft.email.trim() });
      sessionStorage.removeItem(draftKey);
      router.push('/enquiry/confirmation');
    } catch {
      setSubmitError('The demo enquiry could not be stored in this browser session. Please try again.');
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function continueInDemoMode() {
    try { sessionStorage.setItem(DEMO_AUTH_KEY, 'true'); } catch { /* No OTP or credentials are collected. */ }
    setIsDemoAuthenticated(true);
    setShowMockAuth(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const locations = [...LOCATION_AREA_OPTIONS.filter((option) => option.value !== 'hyderabad').map((option) => option.shortLabel), 'Other location'];
  const selectedEventLocation = draft.eventLocation === 'Other location' ? draft.otherLocation : draft.eventLocation;
  const relevantServices = Array.from(new Set(vendor.services));
  const visibleServices = showAllServices ? relevantServices : relevantServices.slice(0, INITIAL_SERVICE_LIMIT);
  const hasOtherRequirements = draft.services.includes(OTHER_REQUIREMENTS);

  return (
    <div className="grid items-start gap-5 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <aside className="order-first lg:order-last lg:sticky lg:top-6">
        <div className="flex overflow-hidden rounded-2xl bg-brand-white shadow-sm lg:block">
          <div className="relative aspect-square w-24 shrink-0 bg-brand-ivory sm:w-32 lg:aspect-[16/10] lg:w-full">
            {vendor.portfolioImages[0] ? <Image src={vendor.portfolioImages[0]} alt={`${vendor.businessName} portfolio`} fill sizes="(max-width: 1023px) 128px, 340px" className="object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-text-secondary">Photo unavailable</div>}
          </div>
          <div className="min-w-0 p-4 lg:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">Selected vendor</p>
            <h2 className="mt-1 text-base font-bold text-brand-green lg:text-lg">{vendor.businessName}</h2>
            <p className="mt-1 text-xs text-text-secondary lg:text-sm">{vendor.categoryLabel} · {vendor.location}</p>
            <p className="mt-2 text-sm font-semibold text-brand-green">{vendor.priceDisplay || 'Request a custom quote'}</p>
            <Link href={vendor.profileHref} className="mt-2 inline-block text-xs font-semibold text-brand-green underline underline-offset-4 lg:mt-4 lg:text-sm">View vendor profile</Link>
          </div>
        </div>
      </aside>
      <div className="order-last min-w-0 lg:order-first">
        {showMockAuth ? (
          <section className="rounded-2xl bg-brand-white p-6 shadow-sm sm:p-8" aria-labelledby="mock-auth-title">
            <Link href={vendor.profileHref} className="text-sm font-semibold text-brand-green underline underline-offset-4">Return to vendor profile</Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-brand-gold-dark">Prototype sign-in</p>
            <h1 id="mock-auth-title" className="mt-2 text-2xl font-bold text-brand-green sm:text-3xl">Sign in to submit your enquiry</h1>
            <p className="mt-3 leading-relaxed text-text-secondary">You can browse without signing in. Signing in is required to submit a platform enquiry. Your details are preserved while you continue; real customer authentication is not connected.</p>
            <div className="mt-5 rounded-xl border border-border-default bg-brand-ivory p-4 text-sm text-text-secondary"><strong className="text-brand-green">Mock sign-in:</strong> Continuing sets a temporary signed-in state in this browser tab. No account is created and no OTP is sent.</div>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="btn btn-md btn-primary" onClick={continueInDemoMode}>Continue with prototype sign-in</button>
              <button type="button" className="btn btn-md btn-outline" onClick={() => setShowMockAuth(false)}>Edit enquiry</button>
            </div>
          </section>
        ) : (
          <form onSubmit={handleFormSubmit} noValidate className="space-y-6">
            <section className="rounded-2xl bg-brand-white p-6 shadow-sm sm:p-8" aria-labelledby="event-information">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold-dark">Event enquiry</p>
                <h1 id="event-information" className="mt-1 text-2xl font-bold text-brand-green sm:text-3xl">Tell us about your event</h1>
                <p className="mt-2 text-sm text-text-secondary">Share a few details to prepare your request for {vendor.businessName}.</p>
              </div>
              {isDemoAuthenticated && <p className="mb-5 rounded-lg bg-brand-ivory px-4 py-3 text-xs text-text-secondary"><strong className="text-brand-green">Prototype sign-in is active.</strong> Your enquiry is held in this browser session and has not been sent to the vendor.</p>}
              <div className="grid gap-5 sm:grid-cols-2">
                <CustomSelect id="event-type" label="Event type *" value={draft.eventType} placeholder="Select event type" options={EVENT_TYPES} error={errors.eventType} onChange={(value) => updateDraft('eventType', value)} />
                {draft.eventType === 'Other' && <div>
                  <label htmlFor="other-event-type" className="mb-1.5 block text-sm font-semibold text-text-primary">Tell us the event type *</label>
                  <input id="other-event-type" value={draft.otherEventType} onChange={(event) => updateDraft('otherEventType', event.target.value)} className={`form-input ${errors.otherEventType ? 'is-error' : ''}`} placeholder="Event type" />
                  {errors.otherEventType && <p className="mt-1 text-xs text-state-error" role="alert">{errors.otherEventType}</p>}
                </div>}
                <div>
                  <EventDatePicker value={draft.eventDate} disabled={draft.dateNotFinalised} error={errors.eventDate} onChange={(value) => { updateDraft('eventDate', value); updateDraft('dateNotFinalised', false); }} />
                  <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm text-text-secondary"><input type="checkbox" checked={draft.dateNotFinalised} onChange={(event) => { updateDraft('dateNotFinalised', event.target.checked); if (event.target.checked) updateDraft('eventDate', ''); }} className="h-4 w-4 accent-brand-green" />Date Not Finalised</label>
                </div>
                <div>
                  <CustomSelect id="event-location" label="Event location *" value={selectedEventLocation} placeholder="Choose a Hyderabad locality" options={locations} error={errors.eventLocation} onChange={(value) => { updateDraft('eventLocation', value); if (value !== 'Other location') updateDraft('otherLocation', ''); }} />
                  {draft.eventLocation === 'Other location' && <div className="mt-3">
                    <label htmlFor="other-location" className="mb-1.5 block text-sm font-semibold text-text-primary">Enter event location *</label>
                    <input id="other-location" value={draft.otherLocation} onChange={(event) => updateDraft('otherLocation', event.target.value)} className={`form-input ${errors.otherLocation ? 'is-error' : ''}`} placeholder="City or locality" />
                    {errors.otherLocation && <p className="mt-1 text-xs text-state-error" role="alert">{errors.otherLocation}</p>}
                  </div>}
                </div>
                <CustomSelect id="guest-count" label="Expected guest count *" value={draft.guestCount} placeholder="Select guest count" options={GUEST_COUNTS} error={errors.guestCount} onChange={(value) => updateDraft('guestCount', value)} />
                <CustomSelect id="estimated-budget" label="Estimated budget *" value={draft.budget} placeholder="Select estimated budget" options={BUDGETS} error={errors.budget} onChange={(value) => updateDraft('budget', value)} />
              </div>
            </section>

            <section className="rounded-2xl bg-brand-white p-6 shadow-sm sm:p-8" aria-labelledby="service-requirements">
              <h2 id="service-requirements" className="text-xl font-bold text-brand-green">Service requirements</h2>
              <p className="mt-1 text-sm text-text-secondary">{vendor.servicesNote ?? 'Select any services you are interested in. These options are based on this vendor’s listing.'}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{visibleServices.map((service) => <label key={service} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border-default px-3 py-2 text-sm text-text-primary hover:bg-brand-ivory"><input type="checkbox" checked={draft.services.includes(service)} onChange={() => toggleService(service)} className="h-4 w-4 shrink-0 accent-brand-green" />{service}</label>)}
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border-default px-3 py-2 text-sm text-text-primary hover:bg-brand-ivory"><input type="checkbox" checked={hasOtherRequirements} onChange={() => toggleService(OTHER_REQUIREMENTS)} className="h-4 w-4 shrink-0 accent-brand-green" />{OTHER_REQUIREMENTS}</label>
              </div>
              {relevantServices.length > INITIAL_SERVICE_LIMIT && <button type="button" aria-expanded={showAllServices} onClick={() => setShowAllServices((current) => !current)} className="mt-3 text-sm font-semibold text-brand-green underline underline-offset-4">{showAllServices ? 'Show less' : `Show all services (${relevantServices.length})`}</button>}
              {hasOtherRequirements ? <div className="mt-5">
                <label htmlFor="requirements-message" className="mb-1.5 block text-sm font-semibold text-text-primary">Other requirements details <span className="font-normal text-text-secondary">(optional)</span></label>
                <input id="requirements-message" type="text" value={draft.message} onChange={(event) => updateDraft('message', event.target.value)} className="form-input" placeholder="Describe any other service you need." />
              </div> : <div>
                <label htmlFor="requirements-message" className="mb-1.5 mt-5 block text-sm font-semibold text-text-primary">Additional requirements <span className="font-normal text-text-secondary">(optional)</span></label>
                <textarea id="requirements-message" rows={4} value={draft.message} onChange={(event) => updateDraft('message', event.target.value)} className="form-input min-h-28 resize-y" placeholder="Share any details that will help the vendor understand your event." />
              </div>}
            </section>

            <section className="rounded-2xl bg-brand-white p-6 shadow-sm sm:p-8" aria-labelledby="contact-details">
              <h2 id="contact-details" className="text-xl font-bold text-brand-green">Your contact details</h2>
              <p className="mt-1 text-sm text-text-secondary">We need a name and mobile number to prepare your enquiry.</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="full-name" className="mb-1.5 block text-sm font-semibold text-text-primary">Full name *</label>
                  <input id="full-name" autoComplete="name" value={draft.fullName} onChange={(event) => updateDraft('fullName', event.target.value)} className={`form-input ${errors.fullName ? 'is-error' : ''}`} placeholder="Your name" />
                  {errors.fullName && <p className="mt-1 text-xs text-state-error" role="alert">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="mobile-number" className="mb-1.5 block text-sm font-semibold text-text-primary">Mobile number *</label>
                  <input id="mobile-number" type="tel" inputMode="tel" autoComplete="tel" value={draft.mobileNumber} onChange={(event) => updateDraft('mobileNumber', event.target.value)} className={`form-input ${errors.mobileNumber ? 'is-error' : ''}`} placeholder="98765 43210" />
                  {errors.mobileNumber && <p className="mt-1 text-xs text-state-error" role="alert">{errors.mobileNumber}</p>}
                  <p className="mt-1 text-xs text-text-secondary">Indian mobile number with or without +91.</p>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email-address" className="mb-1.5 block text-sm font-semibold text-text-primary">Email <span className="font-normal text-text-secondary">(optional)</span></label>
                  <input id="email-address" type="email" autoComplete="email" value={draft.email} onChange={(event) => updateDraft('email', event.target.value)} className={`form-input ${errors.email ? 'is-error' : ''}`} placeholder="you@example.com" />
                  {errors.email && <p className="mt-1 text-xs text-state-error" role="alert">{errors.email}</p>}
                </div>
              </div>
            </section>

            {submitError && <p className="rounded-lg border border-state-error bg-brand-white px-4 py-3 text-sm text-state-error" role="alert">{submitError}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href={vendor.profileHref} className="text-center text-sm font-semibold text-brand-green underline underline-offset-4">Back to vendor profile</Link>
              <button type="submit" disabled={isSubmitting} className="btn btn-md btn-primary disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Preparing enquiry…' : isDemoAuthenticated ? 'Submit Enquiry' : 'Continue to Sign In'}</button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
