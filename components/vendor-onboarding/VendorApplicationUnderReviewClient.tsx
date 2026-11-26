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

export function VendorApplicationUnderReviewClient() {
  const vendor = getDefaultMockVendor();
  const [profile, setProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(vendor)
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setProfile(readVendorBusinessProfileSession(vendor));
  }, [vendor]);

  function handleCopy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(APPLICATION_ID).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
              {/* Header Card: Business Name, Application ID & Under Review Badge */}
              <section className="relative overflow-hidden rounded-xl bg-[#ffffff] p-6 shadow-sm md:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#fedb9d]/30 blur-2xl" />
                <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-wider text-[#414845]">
                      Vendor Onboarding • Application Status
                    </span>
                    <h1 className="text-[32px] font-semibold leading-[40px] tracking-tight text-[#191c1a]">
                      {profile.businessName}
                    </h1>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
                        Application ID:
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy Application ID"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded bg-[#ecefea] px-2.5 py-1 text-[12px] leading-[16px] text-[#191c1a] transition-colors hover:bg-[#e6e9e4]"
                      >
                        <span className="font-medium tracking-wide">{APPLICATION_ID}</span>
                        <span className="material-symbols-outlined text-[15px] text-[#414845]">
                          content_copy
                        </span>
                      </button>
                      {copied && (
                        <span className="text-[12px] font-medium leading-[16px] text-[#00271d]">
                          Copied!
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center self-start md:self-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#fedb9d] px-3.5 py-1.5 text-[#795f2d] shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#745a29] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#745a29]" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-wider">
                        Under Review
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5-Step Progress Timeline Card */}
              <section className="rounded-xl bg-[#ffffff] p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-[20px] font-semibold leading-[28px] tracking-[-0.01em] text-[#191c1a]">
                      Verification Progress
                    </h2>
                    <p className="mt-0.5 text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
                      Live tracking of your vendor onboarding milestones
                    </p>
                  </div>
                  <span className="hidden items-center gap-1.5 text-[12px] font-medium leading-[16px] text-[#745a29] sm:inline-flex">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    Step 2 of 4
                  </span>
                </div>

                {/* Desktop Horizontal / Mobile Vertical Timeline */}
                <div className="relative grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-2">
                  {/* Step 1: Application Submitted (Completed) */}
                  <Link
                    href="/vendor/onboarding/submitted"
                    className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-2 md:text-center"
                  >
                    <div className=" absolute left-1/2 top-5 z-0 hidden h-0.5 w-full bg-[#00271d] md:block" />
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00271d] text-[#ffffff] shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#00271d]">
                        Completed
                      </span>
                      <span className="mt-0.5 text-[14px] font-semibold leading-[20px] text-[#191c1a]">
                        Application Submitted
                      </span>
                      <span className="text-[12px] leading-[16px] text-[#414845]">14 May 2026</span>
                    </div>
                  </Link>

                  {/* Step 2: Under Review (Active / Current) */}
                  <div className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-2 md:text-center">
                    <div className="absolute left-1/2 top-5 z-0 hidden h-0.5 w-full bg-[#e6e9e4] md:block" />
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#745a29] text-[#ffffff] shadow-md">
                      <span className="material-symbols-outlined text-[20px]">manage_search</span>
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#745a29]">
                        Current Stage
                      </span>
                      <span className="mt-0.5 text-[14px] font-semibold leading-[20px] text-[#191c1a]">
                        Under Review
                      </span>
                      <span className="text-[12px] leading-[16px] text-[#414845]">In progress</span>
                    </div>
                  </div>

                  {/* Step 3: Changes Requested (Upcoming) */}
                  <Link
                    href="/vendor/onboarding/status/changes-requested"
                    className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-2 md:text-center"
                  >
                    <div className="absolute left-1/2 top-5 z-0 hidden h-0.5 w-full bg-[#e6e9e4] md:block" />
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ecefea] text-[#414845]">
                      <span className="material-symbols-outlined text-[20px]">edit_document</span>
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#717975]">
                        Upcoming
                      </span>
                      <span className="mt-0.5 text-[14px] font-medium leading-[20px] text-[#414845]">
                        Changes Requested
                      </span>
                      <span className="text-[12px] leading-[16px] text-[#717975]">If required</span>
                    </div>
                  </Link>

                  {/* Step 4: Approved (Upcoming) */}
                  <Link
                    href="/vendor/onboarding/status/approved"
                    className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-2 md:text-center"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ecefea] text-[#414845]">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#717975]">
                        Upcoming
                      </span>
                      <span className="mt-0.5 text-[14px] font-medium leading-[20px] text-[#414845]">
                        Approved
                      </span>
                      <span className="text-[12px] leading-[16px] text-[#717975]">
                        Profile goes live
                      </span>
                    </div>
                  </Link>

                  {/* Step 5: Rejected (Branch / Inactive) */}
                  <div className="relative flex items-start gap-4 opacity-60 md:flex-col md:items-center md:gap-2 md:text-center">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f4ef] text-[#717975]">
                      <span className="material-symbols-outlined text-[20px]">block</span>
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#717975]">
                        Branch
                      </span>
                      <span className="mt-0.5 text-[14px] font-medium leading-[20px] text-[#414845]">
                        Rejected
                      </span>
                      <span className="text-[12px] leading-[16px] text-[#717975]">
                        Inactive outcome
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Asymmetric Info Grid: What Happens Next + Estimated Timeframe & Support */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                {/* Left: What Happens Next Info Card */}
                <section className="flex flex-col justify-between gap-6 rounded-xl bg-[#ffffff] p-6 shadow-sm md:col-span-7 md:p-8">
                  <div>
                    <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-wider text-[#745a29]">
                      Review Process
                    </span>
                    <h2 className="mt-1 text-[20px] font-semibold leading-[28px] tracking-[-0.01em] text-[#191c1a]">
                      What happens next?
                    </h2>
                    <p className="mt-2 text-[14px] leading-[20px] text-[#414845]">
                      Our Hyderabad onboarding team is currently reviewing your business credentials
                      and portfolio. Here is what we verify before activating your storefront:
                    </p>
                    <div className="mt-6 flex flex-col gap-4">
                      <div className="flex items-start gap-4 rounded-lg bg-[#f1f4ef] p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c2ebdb] text-[#002018]">
                          <span className="material-symbols-outlined text-[18px]">fact_check</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[14px] font-semibold leading-[20px] text-[#191c1a]">
                            1. Business &amp; GST Verification
                          </h3>
                          <p className="mt-0.5 text-[12px] leading-[16px] text-[#414845]">
                            Validating your registration details, PAN/GST records, and{' '}
                            {profile.areaLocality || 'Banjara Hills'} service address.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-lg bg-[#f1f4ef] p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fedb9d] text-[#795f2d]">
                          <span className="material-symbols-outlined text-[18px]">
                            photo_library
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[14px] font-semibold leading-[20px] text-[#191c1a]">
                            2. Portfolio &amp; Pricing Quality Check
                          </h3>
                          <p className="mt-0.5 text-[12px] leading-[16px] text-[#414845]">
                            Ensuring your mandap &amp; floral gallery images and starting package
                            rates meet marketplace standards.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-lg bg-[#f1f4ef] p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ecefea] text-[#414845]">
                          <span className="material-symbols-outlined text-[18px]">
                            notifications_active
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[14px] font-semibold leading-[20px] text-[#191c1a]">
                            3. Approval Notification
                          </h3>
                          <p className="mt-0.5 text-[12px] leading-[16px] text-[#414845]">
                            You will receive an email and WhatsApp alert once approved, or if any
                            minor updates are needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Right: Estimated Timeframe & Help / Support Card */}
                <aside className="flex flex-col gap-6 md:col-span-5">
                  {/* Timeframe Card with Inline SVG Progress Ring */}
                  <div className="flex items-center gap-4 rounded-xl bg-[#ffffff] p-6 shadow-sm">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                      <svg
                        className="h-16 w-16 -rotate-90 text-[#745a29]"
                        fill="none"
                        viewBox="0 0 64 64"
                      >
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeOpacity="0.18"
                          strokeWidth="6"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="currentColor"
                          strokeDasharray="163.36"
                          strokeDashoffset="98"
                          strokeLinecap="round"
                          strokeWidth="6"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-semibold leading-[14px] text-[#191c1a]">
                        40%
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-wider text-[#414845]">
                        Estimated Timeframe
                      </span>
                      <p className="mt-0.5 text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#191c1a]">
                        2–3 Business Days
                      </p>
                      <p className="mt-0.5 text-[12px] leading-[16px] text-[#414845]">
                        Expected decision by 18 May 2026
                      </p>
                    </div>
                  </div>

                  {/* Help / Support Card */}
                  <div className="flex flex-1 flex-col justify-between gap-4 rounded-xl bg-[#00271d] p-6 text-[#ffffff] shadow-sm">
                    <div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#173d32] text-[#ffffff]">
                        <span className="material-symbols-outlined text-[22px]">
                          support_agent
                        </span>
                      </div>
                      <h3 className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#ffffff]">
                        Need assistance with your application?
                      </h3>
                      <p className="mt-1 text-[12px] leading-[16px] text-[#81a899]">
                        Have a question about your documents or need to update your submitted
                        details? Our vendor support team is here to help.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <a
                        href="#support"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ffffff] px-4 py-2.5 text-[14px] font-semibold leading-[20px] text-[#00271d] transition-colors hover:bg-[#f1f4ef]"
                      >
                        <span className="material-symbols-outlined text-[18px]">help</span>
                        <span>Contact Help / Support</span>
                      </a>
                      <span className="text-center text-[12px] leading-[16px] text-[#81a899]">
                        Mon–Sat, 9:30 AM – 6:30 PM IST
                      </span>
                    </div>
                  </div>
                </aside>
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
              href="/vendor/onboarding/status/under-review"
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
