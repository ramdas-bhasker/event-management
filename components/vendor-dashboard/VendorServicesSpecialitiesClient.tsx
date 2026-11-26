'use client';

import Link from 'next/link';
import { useEffect, useState, type KeyboardEvent } from 'react';
import {
  calculateProfileCompletion,
  createBusinessProfile,
  getCategoryLabelFromSlug,
  readVendorBusinessProfileSession,
  saveVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import type { VendorRecord } from '@/types/vendor';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

interface ServiceOption {
  name: string;
  icon: string;
  fullSpan?: boolean;
}

const CORE_SERVICE_OPTIONS: ServiceOption[] = [
  { name: 'Mandap Decoration', icon: 'temple_hindu' },
  { name: 'Floral Decoration', icon: 'local_florist' },
  { name: 'Stage Decoration', icon: 'theater_comedy' },
  { name: 'Lighting', icon: 'lightbulb' },
  { name: 'Entrance Decoration', icon: 'door_front' },
  { name: 'Traditional Mandaps', icon: 'festival' },
];

const ONBOARDING_STEPS = [
  {
    number: '01',
    title: '1. Vendor Account Registration',
    status: 'Completed',
    state: 'completed' as const,
    href: '/vendor/onboarding/registration',
  },
  {
    number: '02',
    title: '2. Business Information',
    status: 'Completed',
    state: 'completed' as const,
    href: '/vendor/onboarding/business-information',
  },
  {
    number: '03',
    title: '3. Services & Specialities',
    status: 'In Progress',
    state: 'active' as const,
    href: '/vendor/dashboard/services-specialities',
  },
  {
    number: '04',
    title: '4. Business Location & Service Areas',
    state: 'upcoming' as const,
    href: '/vendor/onboarding/location-service-areas',
  },
  {
    number: '05',
    title: '5. Pricing Information',
    state: 'upcoming' as const,
    href: '/vendor/onboarding/pricing-information',
  },
  {
    number: '06',
    title: '6. Portfolio Setup',
    state: 'upcoming' as const,
    href: '/vendor/onboarding/portfolio-setup',
  },
  {
    number: '07',
    title: '7. Review & Submit',
    state: 'upcoming' as const,
    href: '/vendor/onboarding/review-submit',
  },
];

const INSPIRATION_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAUnzHSRSnptoyLuUN64NjHQND2uREXAOtUfesQJtqYITG_rACSEfu0RwbYNXqUP91n3A4z-2oaR0ZfJAhq6hejFNCX1iM00kREfv8BgA4RPPikiQNniaae1V2LmVGWjipoEn_941qtKeb1CRzgsZEnqjEtO0mMj9fFZSnQTPNT3syfiFjKf5-AC3SNfbdqiT172-0yt8205nivBiHmXUIL4S1oSuHvGI4K2RN2sg8';

export function VendorServicesSpecialitiesClient({ vendor }: { vendor: VendorRecord }) {
  const [profile, setProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(vendor)
  );
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>(CORE_SERVICE_OPTIONS);
  const [customInput, setCustomInput] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loaded = readVendorBusinessProfileSession(vendor);
    setProfile(loaded);

    const extraOptions: ServiceOption[] = loaded.keySpecialties
      .filter(
        (name) =>
          !CORE_SERVICE_OPTIONS.some((core) => core.name.toLowerCase() === name.toLowerCase())
      )
      .map((name) => ({ name, icon: 'auto_awesome' }));

    if (extraOptions.length > 0) {
      setServiceOptions([...CORE_SERVICE_OPTIONS, ...extraOptions]);
    }
    setInitialized(true);
  }, [vendor]);

  useEffect(() => {
    if (!initialized) return;
    saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: true });
  }, [initialized, profile]);

  const selectedServices = profile.keySpecialties;
  const specialitiesText = profile.specialtiesDescription;
  const categoryLabel = getCategoryLabelFromSlug(profile.category);
  const completion = calculateProfileCompletion(profile);

  function toggleService(serviceName: string) {
    setProfile((prev) => {
      const exists = prev.keySpecialties.includes(serviceName);
      const next = exists
        ? prev.keySpecialties.filter((item) => item !== serviceName)
        : [...prev.keySpecialties, serviceName];
      return { ...prev, keySpecialties: next };
    });
  }

  function addCustomService() {
    const value = customInput.trim();
    if (!value) return;

    const existingOption = serviceOptions.find(
      (item) => item.name.toLowerCase() === value.toLowerCase()
    );
    const canonicalName = existingOption ? existingOption.name : value;

    if (!existingOption) {
      setServiceOptions((prev) => [...prev, { name: canonicalName, icon: 'auto_awesome' }]);
    }

    setProfile((prev) => {
      const next = prev.keySpecialties.includes(canonicalName)
        ? prev.keySpecialties
        : [...prev.keySpecialties, canonicalName];
      return { ...prev, keySpecialties: next };
    });
    setCustomInput('');
  }

  function handleCustomKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addCustomService();
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ed] font-sans text-[14px] leading-[20px] text-[#191c1a]">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-[#e7e3da] bg-[#ffffff] px-6 py-3.5 lg:px-12">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#173d32]">
            AyojanSetu
          </Link>
          <span className="h-4 w-[1px] bg-[#e7e3da]" />
          <span className="rounded-full bg-[#fedb9d]/60 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#745a29]">
            Vendor Onboarding
          </span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#help"
              onClick={(e) => e.preventDefault()}
              className="text-sm font-medium text-[#414845] transition-colors hover:text-[#191c1a]"
            >
              Help / Support
            </a>
            <Link
              href="/vendor/dashboard"
              className="text-sm font-medium text-[#414845] transition-colors hover:text-[#191c1a]"
            >
              Already have an account?{' '}
              <span className="font-semibold text-[#173d32] underline">Login</span>
            </Link>
          </nav>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173d32] text-white shadow-sm">
            <span className="material-symbols-outlined text-[19px]">person</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative bg-[#f7f4ed] py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col">
            {/* Top Context & Progress Strip */}
            <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#e7e3da] bg-[#ffffff] p-6 shadow-sm md:flex-row md:items-end">
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="rounded-full bg-[#fedb9d] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#795f2d]">
                    Step 03 of 07
                  </span>
                  <span className="text-xs text-[#717975]">•</span>
                  <span className="text-xs font-semibold text-[#173d32]">{categoryLabel}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#191c1a] lg:text-3xl">
                  Services &amp; Specialities
                </h1>
              </div>

              <div className="w-full rounded-xl border border-[#e7e3da] bg-[#f7f4ed] p-3.5 md:w-72">
                <div className="mb-1.5 flex justify-between text-xs font-medium text-[#414845]">
                  <span>Onboarding Progress</span>
                  <span className="font-bold text-[#173d32]">{completion.percentage}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#e0e3df]">
                  <div
                    className="h-full rounded-full bg-[#173d32] transition-all duration-500"
                    style={{ width: `${completion.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Main Asymmetric 12-Column Grid */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              {/* Left Column: Stepper Status & Visual Context (4 cols) */}
              <div className="flex flex-col gap-6 lg:col-span-4">
                {/* Stepper Card */}
                <div className="rounded-2xl border border-[#e7e3da] bg-[#ffffff] p-6 shadow-sm">
                  <p className="mb-4 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#414845]">
                    Onboarding Roadmap
                  </p>
                  <div className="flex flex-col gap-2">
                    {ONBOARDING_STEPS.map((step) => {
                      if (step.state === 'completed') {
                        return (
                          <Link
                            key={step.number}
                            href={step.href}
                            className="flex items-center gap-4 rounded-lg bg-[#ffffff]/60 p-2 transition-colors hover:bg-[#f1f4ef]"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c2ebdb] text-[#002018]">
                              <span className="material-symbols-outlined text-[16px]">check</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[14px] font-medium leading-[20px] text-[#191c1a]">
                                {step.title}
                              </p>
                              <p className="truncate text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
                                {step.status}
                              </p>
                            </div>
                          </Link>
                        );
                      }

                      if (step.state === 'active') {
                        return (
                          <Link
                            key={step.number}
                            href={step.href}
                            aria-current="step"
                            className="flex items-center gap-4 rounded-lg bg-[#00271d] p-2 text-[#ffffff] shadow-sm"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffdea6] text-[11px] font-semibold leading-[14px] tracking-[0.03em] text-[#271900]">
                              {step.number}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[14px] font-semibold leading-[20px]">
                                {step.title}
                              </p>
                              <p className="truncate text-[12px] leading-[16px] tracking-[0.01em] text-[#c2ebdb]">
                                {step.status}
                              </p>
                            </div>
                          </Link>
                        );
                      }

                      return (
                        <Link
                          key={step.number}
                          href={step.href}
                          className="flex items-center gap-4 rounded-lg p-2 opacity-60 transition-opacity hover:opacity-100"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e6e9e4] text-[11px] font-semibold leading-[14px] tracking-[0.03em] text-[#414845]">
                            {step.number}
                          </div>
                          <p className="truncate text-[14px] leading-[20px] text-[#414845]">
                            {step.title}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Visual Inspiration & Live Selection Summary */}
                <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
                  <div className="relative h-44 w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={INSPIRATION_IMAGE_URL}
                      alt="An architectural luxury Indian wedding mandap setup in Hyderabad featuring deep botanical green foliage, cascading jasmine and marigold floral garlands, warm ambient champagne gold uplighting, and refined ivory drapery at dusk, editorial photography style."
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#00271d]/80 via-[#00271d]/20 to-transparent p-4">
                      <div>
                        <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#ffdea6]">
                          Category Selected
                        </span>
                        <p className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#ffffff]">
                          {categoryLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
                        Selected Services
                      </span>
                      <span
                        className={
                          selectedServices.length > 0
                            ? 'rounded-full bg-[#c2ebdb] px-2 py-1 text-[11px] font-semibold leading-[14px] tracking-[0.03em] text-[#002018]'
                            : 'rounded-full bg-[#ecefea] px-2 py-1 text-[11px] font-semibold leading-[14px] tracking-[0.03em] text-[#414845]'
                        }
                      >
                        {selectedServices.length} Selected
                      </span>
                    </div>

                    {selectedServices.length === 0 ? (
                      <p className="text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
                        Choose one or more services from the list on the right to build your vendor
                        profile.
                      </p>
                    ) : (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedServices.map((service) => (
                          <span
                            key={service}
                            className="rounded-md bg-[#ecefea] px-2 py-1 text-[12px] leading-[16px] tracking-[0.01em] text-[#191c1a]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Main Form (8 cols) */}
              <div className="rounded-2xl border border-[#e7e3da] bg-[#ffffff] p-6 shadow-sm sm:p-8 lg:col-span-8">
                <div className="mb-8">
                  <h2 className="mb-1 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-[#191c1a]">
                    What services do you provide?
                  </h2>
                  <p className="text-[14px] leading-[20px] text-[#414845]">
                    Select all services you offer under{' '}
                    <span className="font-medium text-[#191c1a]">{categoryLabel}</span>. This helps
                    customers discover you for the right event requirements.
                  </p>
                </div>

                {/* Multi-Select Chips / Checkboxes */}
                <div className="mb-8">
                  <label className="mb-4 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
                    Core Services
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {serviceOptions.map((option) => {
                      const isSelected = selectedServices.includes(option.name);
                      return (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => toggleService(option.name)}
                          className={[
                            'group flex items-center justify-between rounded-xl p-4 text-left transition-all',
                            option.fullSpan ? 'sm:col-span-2' : '',
                            isSelected
                              ? 'bg-[#00271d] text-[#ffffff] shadow-sm'
                              : 'bg-[#f1f4ef] text-[#191c1a] hover:bg-[#ecefea]',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ffffff] text-[#00271d] transition-transform group-hover:scale-105">
                              <span className="material-symbols-outlined text-[20px]">
                                {option.icon}
                              </span>
                            </div>
                            <span className="truncate text-[14px] font-medium leading-[20px]">
                              {option.name}
                            </span>
                          </div>
                          <span
                            className={[
                              'material-symbols-outlined text-[20px]',
                              isSelected ? 'text-[#ffdea6]' : 'text-[#c1c8c4]',
                            ].join(' ')}
                            style={{
                              fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
                            }}
                          >
                            {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Custom Service */}
                <div className="mb-8 rounded-xl bg-[#f1f4ef] p-6">
                  <label
                    htmlFor="custom-service-input"
                    className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
                  >
                    Don&apos;t see your service listed?
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="custom-service-input"
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={handleCustomKeyDown}
                      placeholder="e.g., Mehendi Lounge Setup, Haldi Backdrop"
                      className="h-11 flex-1 rounded-lg bg-[#ffffff] px-4 text-[14px] leading-[20px] text-[#191c1a] placeholder:text-[#717975] transition-shadow focus:outline-none focus:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={addCustomService}
                      className="flex h-11 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#fedb9d] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#795f2d] transition-colors hover:bg-[#ffdea6]"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>Add Custom Service</span>
                    </button>
                  </div>
                </div>

                {/* Describe Your Specialities */}
                <div className="mb-8">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="specialities-textarea"
                      className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
                    >
                      Describe your specialities
                    </label>
                    <span className="text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
                      {specialitiesText.length} / 500
                    </span>
                  </div>
                  <textarea
                    id="specialities-textarea"
                    rows={4}
                    maxLength={500}
                    value={specialitiesText}
                    onChange={(e) => {
                      const next = e.target.value;
                      setProfile((prev) => ({ ...prev, specialtiesDescription: next }));
                    }}
                    placeholder="Highlight your unique craft, signature themes (e.g., royal Nizami florals, minimalist botanical mandaps, eco-friendly setups), or customisation capabilities..."
                    className="w-full resize-none rounded-xl bg-[#f1f4ef] p-4 text-[14px] leading-[20px] text-[#191c1a] placeholder:text-[#717975] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
                  />
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between bg-[#ffffff] pt-6">
                  <Link
                    href="/vendor/onboarding/business-information"
                    onClick={() =>
                      saveVendorBusinessProfileSession(profile, {
                        commitSaved: true,
                        keepDraft: true,
                      })
                    }
                    className="flex h-11 items-center gap-1 rounded-lg bg-[#ecefea] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#191c1a] transition-colors hover:bg-[#e6e9e4]"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Back</span>
                  </Link>
                  <Link
                    href="/vendor/onboarding/location-service-areas"
                    onClick={() =>
                      saveVendorBusinessProfileSession(profile, {
                        commitSaved: true,
                        keepDraft: true,
                      })
                    }
                    className="flex h-11 items-center gap-1 rounded-lg bg-[#00271d] px-8 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#ffffff] shadow-sm transition-colors hover:bg-[#173d32]"
                  >
                    <span>Continue</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
