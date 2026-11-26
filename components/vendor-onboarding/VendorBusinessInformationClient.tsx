'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { VendorOnboardingCleanShell } from '@/components/vendor-onboarding/VendorOnboardingCleanShell';
import { VENDOR_CATEGORY_OPTIONS } from '@/data/mock-vendors';
import {
  calculateProfileCompletion,
  createBusinessProfile,
  getCategoryLabelFromSlug,
  getDefaultMockVendor,
  readVendorBusinessProfileSession,
  saveVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

const STEP2_PREVIEW_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCnJlJ54nXA9GVVt7RMXT8Fl8j72eclLf6HVFScho1ag0UY55IrokkC4V3FYnNVk_HVUyOhTUijmot3iw-CI6dptyEtEm7xfSEhcBPJpJ4oX9XWgv_WiIY3J1VYHqZDcAaBHXaRwk45iR8Q9u5mW0nvBPOp8DCAcwxMxV517PkUF_fVHk7meVWpSp8NswEzz5yuh4xObQSP2xC8XZLr7KAB5BP5C2Sq9mb5WRaN0YU';

const CATEGORY_OPTIONS = VENDOR_CATEGORY_OPTIONS.filter(
  (
    item
  ): item is {
    value: VendorBusinessProfile['category'];
    label: string;
    shortLabel: string;
    icon: string;
  } => item.value !== 'all'
);

export function VendorBusinessInformationClient() {
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

  const categoryLabel = getCategoryLabelFromSlug(profile.category);
  const completion = calculateProfileCompletion(profile);

  const leftExtraCard = (
    <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
      <div className="relative h-44 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={STEP2_PREVIEW_IMAGE}
          alt="An opulent South Indian wedding mandap decorated with cascading fresh white jasmine garlands, deep botanical green foliage, and warm champagne gold brass lamps in an open-air Hyderabad courtyard at golden hour"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#00271d]/80 via-[#00271d]/20 to-transparent p-4">
          <div>
            <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#ffdea6]">
              Live Card Preview
            </span>
            <p className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#ffffff]">
              {categoryLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="line-clamp-1 text-[16px] font-semibold leading-[22px] text-[#191c1a]">
          {profile.businessName.trim() || 'Your Business Name'}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-[12px] leading-[16px] text-[#414845]">
          <span className="material-symbols-outlined text-[15px]">location_on</span>
          {[profile.areaLocality, profile.city].filter(Boolean).join(', ') || 'Hyderabad'} • Est.{' '}
          {profile.yearEstablished || '2016'}
        </p>
        <p className="mt-2.5 line-clamp-2 text-[12px] leading-[16px] text-[#414845]">
          {profile.description.trim() || 'Your business description will appear here.'}
        </p>
      </div>
    </div>
  );

  return (
    <VendorOnboardingCleanShell
      currentStep={2}
      stepTitle="Business Information"
      contextTag={categoryLabel}
      progressPercent={completion.percentage}
      leftExtraCard={leftExtraCard}
    >
      <div className="mb-8">
        <h2 className="mb-1 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-[#191c1a]">
          Tell us about your business
        </h2>
        <p className="text-[14px] leading-[20px] text-[#414845]">
          Share your brand identity and core expertise so couples and event hosts in Hyderabad can
          discover you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Business / Brand Name */}
        <div className="md:col-span-2">
          <label
            htmlFor="business-name"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            Business / Brand Name <span className="text-[#ba1a1a]">*</span>
          </label>
          <input
            id="business-name"
            type="text"
            value={profile.businessName}
            onChange={(e) => updateField('businessName', e.target.value)}
            placeholder="e.g., Sri Venkateswara Mandap & Floral"
            className="h-11 w-full rounded-lg bg-[#f1f4ef] px-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
          />
          <p className="mt-1.5 text-[12px] leading-[16px] text-[#414845]">
            This will be displayed as your public storefront title on AyojanSetu.
          </p>
        </div>

        {/* Vendor Category */}
        <div className="md:col-span-2">
          <label
            htmlFor="vendor-category"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            Vendor Category <span className="text-[#ba1a1a]">*</span>
          </label>
          <div className="relative">
            <select
              id="vendor-category"
              value={profile.category}
              onChange={(e) =>
                updateField('category', e.target.value as VendorBusinessProfile['category'])
              }
              className="h-11 w-full cursor-pointer appearance-none rounded-lg bg-[#f1f4ef] pl-4 pr-10 text-[14px] text-[#191c1a] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
            >
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.shortLabel}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#414845]">
              expand_more
            </span>
          </div>
        </div>

        {/* Business Description */}
        <div className="md:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="business-description"
              className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
            >
              Business Description <span className="text-[#ba1a1a]">*</span>
            </label>
            <span className="text-[12px] leading-[16px] text-[#414845]">
              {profile.description.length} / 500
            </span>
          </div>
          <textarea
            id="business-description"
            rows={4}
            maxLength={500}
            value={profile.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe your signature style, specialties, and what makes your service memorable..."
            className="w-full resize-none rounded-xl bg-[#f1f4ef] p-4 text-[14px] leading-[20px] text-[#191c1a] placeholder:text-[#717975] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
          />
        </div>

        {/* Year Established */}
        <div>
          <label
            htmlFor="year-established"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            Year Established <span className="text-[#ba1a1a]">*</span>
          </label>
          <input
            id="year-established"
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={profile.yearEstablished}
            onChange={(e) =>
              updateField('yearEstablished', e.target.value.replace(/\D/g, '').slice(0, 4))
            }
            placeholder="e.g., 2016"
            className="h-11 w-full rounded-lg bg-[#f1f4ef] px-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
          />
        </div>

        {/* Business Email */}
        <div>
          <label
            htmlFor="business-email"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            Business Email <span className="text-[#ba1a1a]">*</span>
          </label>
          <input
            id="business-email"
            type="email"
            value={profile.businessEmail}
            onChange={(e) => updateField('businessEmail', e.target.value)}
            placeholder="bookings@yourbrand.in"
            className="h-11 w-full rounded-lg bg-[#f1f4ef] px-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
          />
        </div>

        {/* Business Phone Number */}
        <div>
          <label
            htmlFor="business-phone"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            Business Phone Number <span className="text-[#ba1a1a]">*</span>
          </label>
          <div className="flex h-11 items-center overflow-hidden rounded-lg bg-[#f1f4ef] transition-all focus-within:bg-[#ffffff] focus-within:shadow-md">
            <span className="flex h-full select-none items-center bg-[#ecefea] px-4 text-[13px] font-medium text-[#191c1a]">
              +91
            </span>
            <input
              id="business-phone"
              type="tel"
              maxLength={14}
              value={profile.businessPhone}
              onChange={(e) => updateField('businessPhone', e.target.value)}
              placeholder="98765 43210"
              className="h-full w-full bg-transparent px-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] focus:outline-none"
            />
          </div>
        </div>

        {/* Alternative Contact Number */}
        <div>
          <label
            htmlFor="alt-phone"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            Alternative Contact Number{' '}
            <span className="text-[12px] font-normal text-[#414845]">(Optional)</span>
          </label>
          <div className="flex h-11 items-center overflow-hidden rounded-lg bg-[#f1f4ef] transition-all focus-within:bg-[#ffffff] focus-within:shadow-md">
            <span className="flex h-full select-none items-center bg-[#ecefea] px-4 text-[13px] font-medium text-[#191c1a]">
              +91
            </span>
            <input
              id="alt-phone"
              type="tel"
              maxLength={14}
              value={profile.alternativePhone}
              onChange={(e) => updateField('alternativePhone', e.target.value)}
              placeholder="91234 56789"
              className="h-full w-full bg-transparent px-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] focus:outline-none"
            />
          </div>
        </div>

        {/* Website URL */}
        <div className="md:col-span-2">
          <label
            htmlFor="website-url"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            Website URL <span className="text-[12px] font-normal text-[#414845]">(Optional)</span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#414845]">
              language
            </span>
            <input
              id="website-url"
              type="url"
              value={profile.websiteUrl}
              onChange={(e) => updateField('websiteUrl', e.target.value)}
              placeholder="https://www.yourbrand.in"
              className="h-11 w-full rounded-lg bg-[#f1f4ef] pl-10 pr-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 flex items-center justify-between bg-[#ffffff] pt-6">
        <Link
          href="/vendor/onboarding/registration"
          onClick={() =>
            saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: true })
          }
          className="flex h-11 items-center gap-1 rounded-lg bg-[#ecefea] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#191c1a] transition-colors hover:bg-[#e6e9e4]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </Link>
        <Link
          href="/vendor/dashboard/services-specialities"
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
