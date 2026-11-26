'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  createBusinessProfile,
  getDefaultMockVendor,
  readVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

const APPLICATION_ID = 'AS-VND-2026-0418';
const APPROVED_HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCV44gmSfUEIKKzyHXsPN2YqMAW75nDi8AuK2ztvpOv8j_w4crcnJ3t4fwqHS6Q3h-KpXHpW6pDAuZ-QzK61sbsLCBKGp14gABcWJNdoDUkiVRXtHsetghxtEIOjfqU69sxdvwX5AhQv7QFF7LPuy1V9zG3ZfcpBYTMQEvOxIq7zBZX7vzotIEjxlWMLgFl2rNmy6c52aTQvZGTLA04sUZt9mOcTBLVe7cqN4Dzsh8';

export function VendorApplicationApprovedClient() {
  const vendor = getDefaultMockVendor();
  const [profile, setProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(vendor)
  );

  useEffect(() => {
    setProfile(readVendorBusinessProfileSession(vendor));
  }, [vendor]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7faf5] font-sans text-[14px] leading-[20px] text-[#191c1a]">
      {/* Fixed Header */}
      <header className="fixed top-0 z-50 w-full bg-[#f7faf5]/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link
            href="/"
            className="text-[20px] font-semibold leading-[28px] tracking-[-0.01em] text-[#00271d]"
          >
            AyojanSetu
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              <a
                href="#help"
                onClick={(e) => e.preventDefault()}
                className="text-[14px] leading-[20px] text-[#414845] transition-colors hover:text-[#191c1a]"
              >
                Help / Support
              </a>
              <Link
                href="/vendor/dashboard"
                className="text-[14px] leading-[20px] text-[#414845] transition-colors hover:text-[#191c1a]"
              >
                Already have an account? Login
              </Link>
            </nav>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00271d]">
              <span className="material-symbols-outlined text-[18px] text-[#ffffff]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 bg-[#f7faf5] pt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex w-full flex-col">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-4">
              {/* Top Business & Approved Badge Card */}
              <div className="relative w-full overflow-hidden rounded-xl bg-[#ffffff] p-8 shadow-md">
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#00271d]/5" />
                <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-wider text-[#745a29]">
                        Vendor Application
                      </span>
                      <span className="text-[#c1c8c4]">•</span>
                      <span className="font-mono text-[12px] leading-[16px] text-[#414845]">
                        {APPLICATION_ID}
                      </span>
                    </div>
                    <h1 className="truncate text-[32px] font-semibold leading-[40px] tracking-[-0.02em] text-[#191c1a]">
                      {profile.businessName}
                    </h1>
                    <p className="text-[14px] leading-[20px] text-[#414845]">
                      {[profile.areaLocality, profile.city].filter(Boolean).join(', ') ||
                        'Banjara Hills, Hyderabad'}{' '}
                      • Mandap &amp; Event Decor
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <div className="inline-flex items-center gap-1 rounded-lg bg-[#00271d] px-4 py-2 text-[#ffffff] shadow-sm">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                      <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-wider">
                        Approved
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Step Completed Verification Progress Card */}
              <div className="w-full rounded-xl bg-[#ffffff] p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#191c1a]">
                    Verification Progress
                  </span>
                  <span className="text-[12px] font-semibold leading-[16px] text-[#00271d]">
                    4 of 4 Steps Completed
                  </span>
                </div>

                <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div className="absolute left-8 right-8 top-5 z-0 hidden h-0.5 bg-[#00271d]/20 md:block">
                    <div className="h-full w-full bg-[#00271d] transition-all duration-700" />
                  </div>

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-1 items-center gap-4 md:flex-col md:gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00271d] text-[#ffffff] shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                    <div className="flex flex-col md:items-center">
                      <span className="text-[14px] font-semibold leading-[20px] text-[#191c1a]">
                        Submitted
                      </span>
                      <span className="text-[12px] leading-[16px] text-[#414845]">12 Jan 2026</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-1 items-center gap-4 md:flex-col md:gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00271d] text-[#ffffff] shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                    <div className="flex flex-col md:items-center">
                      <span className="text-[14px] font-semibold leading-[20px] text-[#191c1a]">
                        KYC Verified
                      </span>
                      <span className="text-[12px] leading-[16px] text-[#414845]">14 Jan 2026</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-1 items-center gap-4 md:flex-col md:gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00271d] text-[#ffffff] shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                    <div className="flex flex-col md:items-center">
                      <span className="text-[14px] font-semibold leading-[20px] text-[#191c1a]">
                        Portfolio Review
                      </span>
                      <span className="text-[12px] leading-[16px] text-[#414845]">15 Jan 2026</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative z-10 flex flex-1 items-center gap-4 md:flex-col md:gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00271d] text-[#ffffff] shadow-md">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                    <div className="flex flex-col md:items-center">
                      <span className="text-[14px] font-semibold leading-[20px] text-[#00271d]">
                        Approved
                      </span>
                      <span className="text-[12px] font-medium leading-[16px] text-[#745a29]">
                        Live Today
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Congratulations Hero Banner Card */}
              <div className="relative w-full overflow-hidden rounded-xl bg-[#ffffff] shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="flex flex-col justify-center gap-6 p-8 lg:col-span-7">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#c2ebdb] text-[#002018]">
                      <span
                        className="material-symbols-outlined text-[32px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        celebration
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-[#191c1a]">
                        Congratulations! Your vendor profile is now live on AyojanSetu.
                      </h2>
                      <p className="text-[16px] leading-[24px] text-[#414845]">
                        Customers across Hyderabad can now discover your mandap and floral decor
                        services, view your curated portfolio, and send direct booking enquiries.
                      </p>
                    </div>
                    <div className="flex flex-col items-stretch gap-4 pt-2 sm:flex-row sm:items-center">
                      <Link
                        href="/vendor/dashboard"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00271d] px-6 py-3 text-[14px] font-semibold leading-[20px] text-[#ffffff] shadow-sm transition-colors hover:bg-[#173d32]"
                      >
                        <span>Go to Vendor Dashboard</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </Link>
                      <Link
                        href={`/vendors/${profile.vendorSlug}?profilePreview=1`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f1f4ef] px-6 py-3 text-[14px] font-semibold leading-[20px] text-[#00271d] transition-colors hover:bg-[#ecefea]"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        <span>View Public Profile</span>
                      </Link>
                    </div>
                  </div>

                  <div className="relative min-h-[260px] bg-[#ecefea] lg:col-span-5 lg:min-h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={APPROVED_HERO_IMAGE}
                      alt="An opulent South Indian mandap decorated with fresh marigolds, jasmine garlands, and lush botanical greens under warm golden ambient lighting in a heritage Hyderabad courtyard."
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#00271d]/60 via-transparent to-transparent p-6">
                      <div className="flex w-full items-center justify-between rounded-lg bg-[#f7faf5]/90 p-4 shadow-sm backdrop-blur-md">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#745a29]">
                            Marketplace Status
                          </span>
                          <span className="text-[14px] font-semibold leading-[20px] text-[#191c1a]">
                            Accepting Enquiries
                          </span>
                        </div>
                        <span className="h-3 w-3 animate-pulse rounded-full bg-[#00271d]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Feature Cards Below Hero */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex items-start gap-4 rounded-xl bg-[#ffffff] p-6 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ffdea6] text-[#271900]">
                    <span className="material-symbols-outlined text-[20px]">photo_library</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#191c1a]">
                      Portfolio Live
                    </span>
                    <span className="text-[12px] leading-[16px] text-[#414845]">
                      12 curated event galleries published to your storefront.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl bg-[#ffffff] p-6 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c2ebdb] text-[#002018]">
                    <span className="material-symbols-outlined text-[20px]">
                      notifications_active
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#191c1a]">
                      Instant Alerts
                    </span>
                    <span className="text-[12px] leading-[16px] text-[#414845]">
                      WhatsApp &amp; SMS notifications enabled for new leads.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl bg-[#ffffff] p-6 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#b8eed7] text-[#002117]">
                    <span className="material-symbols-outlined text-[20px]">support_agent</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#191c1a]">
                      Partner Support
                    </span>
                    <span className="text-[12px] leading-[16px] text-[#414845]">
                      Dedicated Hyderabad onboarding manager assigned.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f1f4ef] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-[12px] leading-[16px] tracking-[0.01em] text-[#414845] sm:flex-row lg:px-8">
          <span>© 2025 AyojanSetu. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a
              href="#support"
              onClick={(e) => e.preventDefault()}
              className="transition-colors hover:text-[#191c1a]"
            >
              Vendor Support
            </a>
            <Link
              href="/vendor/onboarding/status/approved"
              className="transition-colors hover:text-[#191c1a]"
            >
              Application Status
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
