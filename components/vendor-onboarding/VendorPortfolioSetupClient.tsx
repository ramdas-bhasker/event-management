'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { VendorOnboardingCleanShell } from '@/components/vendor-onboarding/VendorOnboardingCleanShell';
import {
  calculateProfileCompletion,
  createBusinessProfile,
  DEFAULT_ONBOARDING_PORTFOLIO_ITEMS,
  getCategoryLabelFromSlug,
  getDefaultMockVendor,
  readVendorBusinessProfileSession,
  saveVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import type {
  VendorBusinessProfile,
  VendorPortfolioPreviewItem,
} from '@/types/vendor-business-profile';

const PORTFOLIO_CATEGORIES = ['Mandap', 'Floral', 'Stage', 'Lighting & Ambience'];

export function VendorPortfolioSetupClient() {
  const vendor = getDefaultMockVendor();
  const [profile, setProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(vendor)
  );
  const [initialized, setInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(readVendorBusinessProfileSession(vendor));
    setInitialized(true);
  }, [vendor]);

  useEffect(() => {
    if (!initialized) return;
    saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: true });
  }, [initialized, profile]);

  const items = profile.portfolioItems;
  const categoryLabel = getCategoryLabelFromSlug(profile.category);
  const completion = calculateProfileCompletion(profile);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const added: VendorPortfolioPreviewItem[] = Array.from(files).map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: 'Mandap',
      imageUrl: URL.createObjectURL(file),
      status: 'READY',
    }));

    setProfile((prev) => ({
      ...prev,
      portfolioItems: [...prev.portfolioItems, ...added],
    }));
    event.target.value = '';
  }

  function updateItem(id: string, patch: Partial<VendorPortfolioPreviewItem>) {
    setProfile((prev) => ({
      ...prev,
      portfolioItems: prev.portfolioItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  }

  function removeItem(id: string) {
    setProfile((prev) => ({
      ...prev,
      portfolioItems: prev.portfolioItems.filter((item) => item.id !== id),
    }));
  }

  const leftExtraCard = (
    <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
      <div className="relative h-44 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={items[0]?.imageUrl ?? DEFAULT_ONBOARDING_PORTFOLIO_ITEMS[0].imageUrl}
          alt="Grand outdoor wedding mandap in Hyderabad at twilight"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#00271d]/80 via-[#00271d]/20 to-transparent p-4">
          <div>
            <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#ffdea6]">
              Portfolio Quality Tips
            </span>
            <p className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#ffffff]">
              {profile.businessName}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
            Uploaded Media
          </span>
          <span className="rounded-full bg-[#c2ebdb] px-2.5 py-0.5 text-[11px] font-semibold text-[#002018]">
            {items.length} Items
          </span>
        </div>
        <ul className="space-y-2 text-[12px] leading-[16px] text-[#414845]">
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined mt-0.5 text-[15px] text-[#00271d]">
              check
            </span>
            <span>
              Recommended aspect ratios: <strong>16:10</strong> or <strong>4:3</strong> landscape.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined mt-0.5 text-[15px] text-[#00271d]">
              check
            </span>
            <span>Upload authentic images of your actual setups (Mandap, Floral, Stage).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="material-symbols-outlined mt-0.5 text-[15px] text-[#00271d]">
              check
            </span>
            <span>Minimum resolution: 1200x800px (JPG, PNG, or WEBP).</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <VendorOnboardingCleanShell
      currentStep={6}
      stepTitle="Portfolio Setup"
      contextTag={categoryLabel}
      progressPercent={completion.percentage}
      leftExtraCard={leftExtraCard}
    >
      <div className="mb-8">
        <h2 className="mb-1 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-[#191c1a]">
          Showcase your best work
        </h2>
        <p className="text-[14px] leading-[20px] text-[#414845]">
          Curate high-resolution photographs of your recent events in Hyderabad and beyond to build
          immediate trust with prospective clients.
        </p>
      </div>

      {/* Drag & Drop Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group mb-8 cursor-pointer rounded-xl border-2 border-dashed border-[#c1c8c4] bg-[#f1f4ef] p-8 text-center transition-all hover:bg-[#ecefea]"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fedb9d] transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[28px] text-[#795f2d]">
              cloud_upload
            </span>
          </div>
          <div className="mb-1 flex flex-wrap items-center justify-center gap-2">
            <h3 className="text-[18px] font-semibold text-[#191c1a]">
              Drag and drop your event photos here
            </h3>
            <span className="rounded-full bg-[#e0e3df] px-2.5 py-0.5 text-[11px] font-semibold uppercase text-[#414845]">
              Prototype Upload
            </span>
          </div>
          <p className="mb-4 max-w-lg text-[13px] text-[#414845]">
            Select multiple JPG, PNG, or WEBP files to preview them in your portfolio grid.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="rounded-lg bg-[#00271d] px-6 py-2.5 text-[14px] font-semibold text-[#ffffff] shadow-sm transition-colors hover:bg-[#173d32]"
          >
            Browse Local Files
          </button>
        </div>
      </div>

      {/* Uploaded Portfolio Grid */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-semibold text-[#191c1a]">Uploaded Portfolio</h3>
            <span className="rounded-full bg-[#e6e9e4] px-2.5 py-0.5 text-[11px] font-semibold text-[#414845]">
              {items.length} ITEMS
            </span>
          </div>
          <span className="text-[12px] text-[#414845]">Recommended: Landscape 16:10 or 4:3</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-[#e7e3da] bg-[#ffffff] shadow-sm"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ecefea]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-2.5 top-2.5 rounded-full bg-[#ffffff]/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#191c1a] backdrop-blur-sm">
                  {item.status}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  title="Remove photo"
                  className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#ffffff]/90 text-[#ba1a1a] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#ffdad6]"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#414845]">
                    Photo Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                    placeholder="Add photo title"
                    className="h-10 w-full rounded-lg bg-[#f1f4ef] px-3 text-[13px] text-[#191c1a] focus:bg-[#ecefea] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#414845]">
                    Portfolio Category
                  </label>
                  <div className="relative">
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(item.id, { category: e.target.value })}
                      className="h-10 w-full cursor-pointer appearance-none rounded-lg bg-[#f1f4ef] px-3 pr-8 text-[13px] text-[#191c1a] focus:bg-[#ecefea] focus:outline-none"
                    >
                      {PORTFOLIO_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-[18px] text-[#414845]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between bg-[#ffffff] pt-6">
        <Link
          href="/vendor/onboarding/pricing-information"
          onClick={() =>
            saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: true })
          }
          className="flex h-11 items-center gap-1 rounded-lg bg-[#ecefea] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#191c1a] transition-colors hover:bg-[#e6e9e4]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </Link>
        <Link
          href="/vendor/onboarding/review-submit"
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
