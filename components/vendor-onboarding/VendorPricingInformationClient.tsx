'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { VendorOnboardingCleanShell } from '@/components/vendor-onboarding/VendorOnboardingCleanShell';
import {
  calculateProfileCompletion,
  createBusinessProfile,
  getCategoryLabelFromSlug,
  getDefaultMockVendor,
  readVendorBusinessProfileSession,
  saveVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

const STEP5_PREVIEW_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCgM7Vij7-fuRSfRfEfj7rhWoGGVoACyrIB0WkgcTT_dUyhEqqhplvotFLqFHnSZ01t8tVhQe1ur1bAZXkxmDB8To26JKz2ks_5W8R4zsm9GRedspQM7m30iJw4-zoLivD0qRX9WfAsNqoLB8m3t5oPA6yZvxQSaZfOpEBa8Nw1fzLsU-Mm7jeVMqag5f6K2olCID69tgR6EAbrfe7_EiQccjXALIKxl-j-TdFE9B4';

interface PricingModelOption {
  model: VendorBusinessProfile['pricingModel'];
  unit: string;
  icon: string;
  description: string;
  fullSpan?: boolean;
}

const PRICING_MODELS: PricingModelOption[] = [
  {
    model: 'Fixed Price',
    unit: 'fixed package',
    icon: 'sell',
    description: 'Flat rate for a standard deliverable or package.',
  },
  {
    model: 'Per Event',
    unit: 'per event',
    icon: 'celebration',
    description: 'Ideal for decor, photography, and full-day bookings.',
  },
  {
    model: 'Per Plate',
    unit: 'per plate',
    icon: 'restaurant',
    description: 'Standard for catering, banquets, and live counters.',
  },
  {
    model: 'Per Guest',
    unit: 'per guest',
    icon: 'groups',
    description: 'Scales with total attendee headcount.',
  },
  {
    model: 'Custom Quote',
    unit: 'custom quote',
    icon: 'request_quote',
    description: 'Tailored proposals based on venue, dates, and bespoke requirements.',
    fullSpan: true,
  },
];

const QUICK_PRICES = ['25,000', '65,000', '1,50,000', '3,00,000'];

export function VendorPricingInformationClient() {
  const vendor = getDefaultMockVendor();
  const [profile, setProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(vendor)
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setProfile(readVendorBusinessProfileSession(vendor));
    setInitialized(true);
  }, [vendor]);

  useEffect(() => {
    if (!initialized) return;
    saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: true });
  }, [initialized, profile]);

  const updateField = <K extends keyof VendorBusinessProfile>(
    key: K,
    value: VendorBusinessProfile[K]
  ) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const selectedModel = profile.pricingModel;
  const startingPrice = profile.startingPrice;
  const displayPublicly = profile.displayPricePublicly;
  const contactForPrice = profile.contactForPrice;
  const pricingNotes = profile.pricingNotes;

  const currentUnit =
    PRICING_MODELS.find((m) => m.model === selectedModel)?.unit ?? 'per event';

  const showContactForPrice =
    contactForPrice || !displayPublicly || selectedModel === 'Custom Quote' || !startingPrice.trim();

  const categoryLabel = getCategoryLabelFromSlug(profile.category);
  const completion = calculateProfileCompletion(profile);

  const leftExtraCard = (
    <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
      <div className="relative h-44 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={STEP5_PREVIEW_IMAGE}
          alt="Upscale outdoor evening wedding reception in Jubilee Hills Hyderabad"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#00271d]/80 via-[#00271d]/20 to-transparent p-4">
          <div>
            <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#ffdea6]">
              Live Pricing Preview
            </span>
            <p className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#ffffff]">
              {profile.businessName}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between rounded-lg bg-[#f1f4ef] p-3.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[#414845]">
              {selectedModel}
            </p>
            <p className="mt-0.5 text-[18px] font-semibold text-[#00271d]">
              {showContactForPrice ? (
                'Contact for Price'
              ) : (
                <>
                  ₹{startingPrice.trim()}{' '}
                  <span className="text-[12px] font-normal text-[#414845]">onwards</span>
                </>
              )}
            </p>
          </div>
          <span className="rounded-lg bg-[#00271d] px-3.5 py-1.5 text-[12px] font-semibold text-[#ffffff]">
            Enquire
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <VendorOnboardingCleanShell
      currentStep={5}
      stepTitle="Pricing Information"
      contextTag={categoryLabel}
      progressPercent={completion.percentage}
      leftExtraCard={leftExtraCard}
    >
      <div className="mb-8">
        <h2 className="mb-1 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-[#191c1a]">
          Tell customers how you price your services
        </h2>
        <p className="text-[14px] leading-[20px] text-[#414845]">
          Choose the structure that best reflects how you quote for events. You can update packages
          anytime from your vendor dashboard.
        </p>
      </div>

      {/* 1. Select Pricing Model */}
      <div className="mb-8">
        <label className="mb-4 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
          1. Select Pricing Model
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PRICING_MODELS.map((option) => {
            const isSelected = selectedModel === option.model;
            return (
              <button
                key={option.model}
                type="button"
                onClick={() => updateField('pricingModel', option.model)}
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
                    <span className="material-symbols-outlined text-[20px]">{option.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold leading-[20px]">
                      {option.model}
                    </p>
                    <p
                      className={[
                        'truncate text-[12px] leading-[16px]',
                        isSelected ? 'text-[#c2ebdb]' : 'text-[#414845]',
                      ].join(' ')}
                    >
                      {option.description}
                    </p>
                  </div>
                </div>
                <span
                  className={[
                    'material-symbols-outlined ml-3 shrink-0 text-[20px]',
                    isSelected ? 'text-[#ffdea6]' : 'text-[#c1c8c4]',
                  ].join(' ')}
                  style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Starting Price & Visibility */}
      <div className="mb-8 rounded-xl bg-[#f1f4ef] p-6">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="starting-price-input"
            className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            2. Starting Price in ₹ <span className="font-normal text-[#414845]">(Optional)</span>
          </label>
          <span className="text-[12px] text-[#414845]">e.g., ₹65,000</span>
        </div>

        <div className="flex h-11 items-center overflow-hidden rounded-lg bg-[#ffffff] transition-shadow focus-within:shadow-md">
          <div className="flex h-full select-none items-center justify-center bg-[#ecefea] px-4 text-[16px] font-semibold text-[#191c1a]">
            ₹
          </div>
          <input
            id="starting-price-input"
            type="text"
            inputMode="numeric"
            value={startingPrice}
            disabled={contactForPrice || selectedModel === 'Custom Quote'}
            onChange={(e) => updateField('startingPrice', e.target.value)}
            placeholder="65,000"
            className="h-full w-full bg-transparent px-4 text-[15px] font-medium text-[#191c1a] placeholder:text-[#717975] focus:outline-none disabled:opacity-50"
          />
          <span className="shrink-0 px-4 text-[12px] text-[#414845]">{currentUnit}</span>
        </div>

        {/* Quick Fill Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-[#414845]">Quick fill:</span>
          {QUICK_PRICES.map((price) => (
            <button
              key={price}
              type="button"
              onClick={() => {
                setProfile((prev) => ({
                  ...prev,
                  startingPrice: price,
                  contactForPrice: false,
                  displayPricePublicly: true,
                }));
              }}
              className={[
                'rounded-lg px-3 py-1 text-[12px] transition-colors',
                startingPrice === price
                  ? 'bg-[#fedb9d] font-semibold text-[#271900]'
                  : 'bg-[#ffffff] text-[#191c1a] hover:bg-[#ffdea6]',
              ].join(' ')}
            >
              ₹{price}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-[#ffffff] p-4">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#191c1a]">
                Display Starting Price Publicly
              </p>
              <p className="mt-0.5 text-[12px] text-[#414845]">
                Show this amount on your marketplace card.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={displayPublicly}
              onClick={() => {
                const next = !displayPublicly;
                setProfile((prev) => ({
                  ...prev,
                  displayPricePublicly: next,
                  contactForPrice: next ? false : prev.contactForPrice,
                }));
              }}
              className={[
                'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                displayPublicly ? 'bg-[#00271d]' : 'bg-[#e0e3df]',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[#ffffff] shadow-sm transition-transform',
                  displayPublicly ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl bg-[#ffffff] p-4">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#191c1a]">Contact for Price</p>
              <p className="mt-0.5 text-[12px] text-[#414845]">
                Hide exact numbers and prompt direct enquiries.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={contactForPrice}
              onClick={() => {
                const next = !contactForPrice;
                setProfile((prev) => ({
                  ...prev,
                  contactForPrice: next,
                  displayPricePublicly: next ? false : prev.displayPricePublicly,
                }));
              }}
              className={[
                'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                contactForPrice ? 'bg-[#00271d]' : 'bg-[#e0e3df]',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[#ffffff] shadow-sm transition-transform',
                  contactForPrice ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Pricing Notes */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="pricing-notes"
            className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            3. Pricing Notes
          </label>
          <span className="text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
            {pricingNotes.length} / 400
          </span>
        </div>
        <textarea
          id="pricing-notes"
          rows={4}
          maxLength={400}
          value={pricingNotes}
          onChange={(e) => updateField('pricingNotes', e.target.value)}
          placeholder="Example: Starting package includes 6 hours of coverage, 2 senior artists, and complimentary travel within Hyderabad & Secunderabad. GST extra as applicable."
          className="w-full resize-none rounded-xl bg-[#f1f4ef] p-4 text-[14px] leading-[20px] text-[#191c1a] placeholder:text-[#717975] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between bg-[#ffffff] pt-6">
        <Link
          href="/vendor/onboarding/location-service-areas"
          onClick={() =>
            saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: true })
          }
          className="flex h-11 items-center gap-1 rounded-lg bg-[#ecefea] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#191c1a] transition-colors hover:bg-[#e6e9e4]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </Link>
        <Link
          href="/vendor/onboarding/portfolio-setup"
          onClick={() =>
            saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: true })
          }
          className="flex h-11 items-center gap-1 rounded-lg bg-[#00271d] px-8 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#ffffff] shadow-sm transition-colors hover:bg-[#173d32]"
        >
          <span>Continue</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </VendorOnboardingCleanShell>
  );
}
