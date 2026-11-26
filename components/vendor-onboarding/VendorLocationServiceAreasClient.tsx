'use client';

import Link from 'next/link';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { VendorOnboardingCleanShell } from '@/components/vendor-onboarding/VendorOnboardingCleanShell';
import { LOCATION_AREA_OPTIONS } from '@/data/mock-vendors';
import {
  calculateProfileCompletion,
  createBusinessProfile,
  getCategoryLabelFromSlug,
  getDefaultMockVendor,
  getServiceAreaLabel,
  readVendorBusinessProfileSession,
  saveVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

const STEP4_MAP_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC0aAiWQQ72gtsT-Dy6zRUs-C2XB_vy75ah8gS9efk0rBt-zoj-4uH_ieqOjgO9nyjc59TVpXfoc8Xlwjwi2TxCODrGdHKvMfFRZFJhMzSGrisCZ1Hf3dy5DtyStfP8VrEpZHVc9FK0g9NBh8P0hWupuxnhUk_Czc1Bw01M1UbuvPPGUlTb78hyYgy1WScQ49s2PpKMglWOZQm37D_8dmAP3Lw6ZA-bYAys39v7zYs';

const CANONICAL_AREA_OPTIONS = LOCATION_AREA_OPTIONS.filter(
  (
    item
  ): item is {
    value: VendorBusinessProfile['serviceAreas'][number];
    label: string;
    shortLabel: string;
  } => item.value !== 'hyderabad'
);

export function VendorLocationServiceAreasClient() {
  const vendor = getDefaultMockVendor();
  const [profile, setProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(vendor)
  );
  const [initialized, setInitialized] = useState(false);
  const [customArea, setCustomArea] = useState('');

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

  function toggleCanonicalArea(slug: VendorBusinessProfile['serviceAreas'][number]) {
    setProfile((prev) => {
      const exists = prev.serviceAreas.includes(slug);
      const next = exists
        ? prev.serviceAreas.filter((item) => item !== slug)
        : [...prev.serviceAreas, slug];
      return { ...prev, serviceAreas: next };
    });
  }

  function toggleCustomArea(label: string) {
    setProfile((prev) => ({
      ...prev,
      customServiceAreas: prev.customServiceAreas.filter((item) => item !== label),
    }));
  }

  function selectAllAreas() {
    const allCanonical = CANONICAL_AREA_OPTIONS.map((item) => item.value);
    if (profile.serviceAreas.length === allCanonical.length) {
      updateField('serviceAreas', []);
    } else {
      updateField('serviceAreas', allCanonical);
    }
  }

  function addCustomArea() {
    const val = customArea.trim();
    if (!val) return;
    const matchCanonical = CANONICAL_AREA_OPTIONS.find(
      (item) =>
        item.shortLabel.toLowerCase() === val.toLowerCase() ||
        item.label.toLowerCase() === val.toLowerCase()
    );
    if (matchCanonical) {
      if (!profile.serviceAreas.includes(matchCanonical.value)) {
        updateField('serviceAreas', [...profile.serviceAreas, matchCanonical.value]);
      }
    } else if (
      !profile.customServiceAreas.some((item) => item.toLowerCase() === val.toLowerCase())
    ) {
      updateField('customServiceAreas', [...profile.customServiceAreas, val]);
    }
    setCustomArea('');
  }

  function handleCustomKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomArea();
    }
  }

  const allSelectedLabels = [
    ...profile.serviceAreas.map((slug) => getServiceAreaLabel(slug)),
    ...profile.customServiceAreas,
  ];
  const categoryLabel = getCategoryLabelFromSlug(profile.category);
  const completion = calculateProfileCompletion(profile);

  const leftExtraCard = (
    <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
      <div className="relative h-44 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={STEP4_MAP_IMAGE}
          alt="Hyderabad service area map preview"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#00271d]/85 via-[#00271d]/25 to-transparent p-4">
          <div>
            <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#ffdea6]">
              Active Reach
            </span>
            <p className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#ffffff]">
              {allSelectedLabels.length} Micro-Markets
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
            Selected Service Areas
          </span>
          <span
            className={
              allSelectedLabels.length > 0
                ? 'rounded-full bg-[#c2ebdb] px-2 py-1 text-[11px] font-semibold leading-[14px] tracking-[0.03em] text-[#002018]'
                : 'rounded-full bg-[#ecefea] px-2 py-1 text-[11px] font-semibold leading-[14px] tracking-[0.03em] text-[#414845]'
            }
          >
            {allSelectedLabels.length} Selected
          </span>
        </div>

        {allSelectedLabels.length === 0 ? (
          <p className="text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
            Choose one or more Hyderabad micro-markets on the right to define your service reach.
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1">
            {allSelectedLabels.map((area) => (
              <span
                key={area}
                className="rounded-md bg-[#ecefea] px-2 py-1 text-[12px] leading-[16px] tracking-[0.01em] text-[#191c1a]"
              >
                {area}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <VendorOnboardingCleanShell
      currentStep={4}
      stepTitle="Business Location & Service Areas"
      contextTag={categoryLabel}
      progressPercent={completion.percentage}
      leftExtraCard={leftExtraCard}
    >
      <div className="mb-8">
        <h2 className="mb-1 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-[#191c1a]">
          Where does your business operate?
        </h2>
        <p className="text-[14px] leading-[20px] text-[#414845]">
          Define your primary studio or office address in Hyderabad and select your delivery
          micro-markets.
        </p>
      </div>

      {/* Primary Business Address Fields */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
            Primary Business Address
          </span>
          <span className="rounded bg-[#f1f4ef] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#414845]">
            HQ / Studio
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="state-select"
              className="mb-1.5 block text-[13px] font-medium text-[#191c1a]"
            >
              State <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="relative">
              <select
                id="state-select"
                value={profile.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="h-11 w-full cursor-pointer appearance-none rounded-lg bg-[#f1f4ef] px-4 text-[14px] text-[#191c1a] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
              >
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#414845]">
                expand_more
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="city-select"
              className="mb-1.5 block text-[13px] font-medium text-[#191c1a]"
            >
              City <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="relative">
              <select
                id="city-select"
                value={profile.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="h-11 w-full cursor-pointer appearance-none rounded-lg bg-[#f1f4ef] px-4 text-[14px] text-[#191c1a] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Secunderabad">Secunderabad</option>
                <option value="Warangal">Warangal</option>
                <option value="Ranga Reddy">Ranga Reddy</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#414845]">
                expand_more
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="locality-input"
              className="mb-1.5 block text-[13px] font-medium text-[#191c1a]"
            >
              Area / Locality <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="locality-input"
              type="text"
              value={profile.areaLocality}
              onChange={(e) => updateField('areaLocality', e.target.value)}
              placeholder="e.g., Banjara Hills"
              className="h-11 w-full rounded-lg bg-[#f1f4ef] px-4 text-[14px] text-[#191c1a] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
            />
          </div>

          <div>
            <label
              htmlFor="pincode-input"
              className="mb-1.5 block text-[13px] font-medium text-[#191c1a]"
            >
              PIN Code <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              id="pincode-input"
              type="text"
              maxLength={6}
              value={profile.pinCode}
              onChange={(e) =>
                updateField('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="e.g., 500034"
              className="h-11 w-full rounded-lg bg-[#f1f4ef] px-4 text-[14px] text-[#191c1a] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="full-address"
              className="mb-1.5 block text-[13px] font-medium text-[#191c1a]"
            >
              Full Business Address <span className="text-[#ba1a1a]">*</span>
            </label>
            <textarea
              id="full-address"
              rows={3}
              value={profile.businessAddress}
              onChange={(e) => updateField('businessAddress', e.target.value)}
              placeholder="Building name, street, landmark..."
              className="w-full resize-none rounded-xl bg-[#f1f4ef] p-4 text-[14px] text-[#191c1a] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Service Areas & Hyderabad Micro-Markets */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <label className="block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
              Service Areas &amp; Hyderabad Micro-Markets
            </label>
            <p className="mt-0.5 text-[12px] text-[#414845]">
              Select all localities where your team can travel and execute events.
            </p>
          </div>
          <button
            type="button"
            onClick={selectAllAreas}
            className="rounded-lg bg-[#f1f4ef] px-3.5 py-1.5 text-[12px] font-semibold text-[#00271d] transition-colors hover:bg-[#c2ebdb]"
          >
            {profile.serviceAreas.length === CANONICAL_AREA_OPTIONS.length
              ? 'Clear All'
              : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CANONICAL_AREA_OPTIONS.map((area) => {
            const isSelected = profile.serviceAreas.includes(area.value);
            return (
              <button
                key={area.value}
                type="button"
                onClick={() => toggleCanonicalArea(area.value)}
                className={[
                  'flex items-center justify-between rounded-xl p-3.5 text-left transition-all',
                  isSelected
                    ? 'bg-[#00271d] text-[#ffffff] shadow-sm'
                    : 'bg-[#f1f4ef] text-[#191c1a] hover:bg-[#ecefea]',
                ].join(' ')}
              >
                <span className="truncate text-[14px] font-medium">{area.shortLabel}</span>
                <span
                  className={[
                    'material-symbols-outlined text-[19px]',
                    isSelected ? 'text-[#ffdea6]' : 'text-[#c1c8c4]',
                  ].join(' ')}
                  style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </button>
            );
          })}
          {profile.customServiceAreas.map((custom) => (
            <button
              key={custom}
              type="button"
              onClick={() => toggleCustomArea(custom)}
              className="flex items-center justify-between rounded-xl bg-[#00271d] p-3.5 text-left text-[#ffffff] shadow-sm transition-all"
            >
              <span className="truncate text-[14px] font-medium">{custom}</span>
              <span
                className="material-symbols-outlined text-[19px] text-[#ffdea6]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Service Area */}
      <div className="mb-8 rounded-xl bg-[#f1f4ef] p-6">
        <label
          htmlFor="custom-area-input"
          className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
        >
          Add Custom Service Area
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="custom-area-input"
            type="text"
            value={customArea}
            onChange={(e) => setCustomArea(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder="e.g., Shamshabad, Kompally, Financial District"
            className="h-11 flex-1 rounded-lg bg-[#ffffff] px-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] transition-shadow focus:outline-none focus:shadow-md"
          />
          <button
            type="button"
            onClick={addCustomArea}
            className="flex h-11 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#fedb9d] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#795f2d] transition-colors hover:bg-[#ffdea6]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Area</span>
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between bg-[#ffffff] pt-6">
        <Link
          href="/vendor/dashboard/services-specialities"
          onClick={() =>
            saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: true })
          }
          className="flex h-11 items-center gap-1 rounded-lg bg-[#ecefea] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#191c1a] transition-colors hover:bg-[#e6e9e4]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </Link>
        <Link
          href="/vendor/onboarding/pricing-information"
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
