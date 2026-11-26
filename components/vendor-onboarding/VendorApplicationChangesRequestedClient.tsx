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

export function VendorApplicationChangesRequestedClient() {
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
            <div className="mx-auto flex w-full max-w-3xl flex-col">
              {/* Status Header Card */}
              <section className="relative overflow-hidden rounded-xl bg-[#ffffff] p-6 shadow-sm md:p-8">
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#fedb9d]/30 blur-2xl" />
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[12px] leading-[16px] text-[#414845]">
                    <span className="font-semibold uppercase tracking-wider text-[#745a29]">
                      Application Status
                    </span>
                    <span>•</span>
                    <span className="font-medium text-[#191c1a]">ID: {APPLICATION_ID}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      title="Copy Application ID"
                      className="inline-flex items-center gap-1 rounded bg-[#f1f4ef] px-2 py-0.5 text-[12px] text-[#414845] transition-colors hover:bg-[#ecefea] hover:text-[#191c1a]"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copied ? 'check' : 'content_copy'}
                      </span>
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#fedb9d] px-3 py-1 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#795f2d]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#745a29]" />
                    Changes Requested
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.02em] text-[#191c1a]">
                    {profile.businessName}
                  </h1>
                  <p className="flex items-center gap-2 text-[14px] leading-[20px] text-[#414845]">
                    <span className="material-symbols-outlined text-[18px] text-[#745a29]">
                      storefront
                    </span>
                    <span>
                      Mandap &amp; Floral Decor · {profile.city || 'Hyderabad'},{' '}
                      {profile.state || 'Telangana'}
                    </span>
                  </p>
                </div>
              </section>

              {/* Visual Progress Timeline */}
              <section className="mt-6 rounded-xl bg-[#f1f4ef] p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#191c1a]">
                    Verification Progress
                  </h2>
                  <span className="text-[12px] leading-[16px] text-[#414845]">Step 3 of 4</span>
                </div>
                <div className="relative">
                  {/* Desktop Horizontal Connector */}
                  <div className="absolute left-8 right-8 top-5 hidden h-1 overflow-hidden rounded-full bg-[#e6e9e4] sm:block">
                    <div className="h-full w-2/3 rounded-full bg-[#00271d] transition-all duration-500" />
                  </div>
                  <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-4 sm:gap-4">
                    {/* Step 1: Submitted */}
                    <Link
                      href="/vendor/onboarding/submitted"
                      className="flex items-center gap-4 sm:flex-col sm:gap-2 sm:text-center"
                    >
                      <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00271d] text-[#ffffff] shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium leading-[18px] text-[#191c1a]">
                          Submitted
                        </span>
                        <span className="text-[12px] leading-[16px] text-[#414845]">
                          12 May 2026
                        </span>
                      </div>
                    </Link>

                    {/* Step 2: Under Review */}
                    <Link
                      href="/vendor/onboarding/status/under-review"
                      className="flex items-center gap-4 sm:flex-col sm:gap-2 sm:text-center"
                    >
                      <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00271d] text-[#ffffff] shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium leading-[18px] text-[#191c1a]">
                          Under Review
                        </span>
                        <span className="text-[12px] leading-[16px] text-[#414845]">
                          13 May 2026
                        </span>
                      </div>
                    </Link>

                    {/* Step 3: Changes Requested (Active) */}
                    <div className="flex items-center gap-4 sm:flex-col sm:gap-2 sm:text-center">
                      <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fedb9d] text-[#795f2d] shadow-md">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          edit_note
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold leading-[18px] text-[#745a29]">
                          Changes Requested
                        </span>
                        <span className="text-[12px] leading-[16px] text-[#795f2d]">
                          Action needed
                        </span>
                      </div>
                    </div>

                    {/* Step 4: Approved */}
                    <Link
                      href="/vendor/onboarding/status/approved"
                      className="flex items-center gap-4 opacity-60 sm:flex-col sm:gap-2 sm:text-center"
                    >
                      <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6e9e4] text-[#414845]">
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium leading-[18px] text-[#414845]">
                          Approved
                        </span>
                        <span className="text-[12px] leading-[16px] text-[#414845]">Pending</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </section>

              {/* Admin Feedback & Required Corrections Card */}
              <section className="mt-8 rounded-xl bg-[#ffffff] p-6 shadow-sm md:p-8">
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fedb9d] text-[#795f2d]">
                      <span className="material-symbols-outlined text-[22px]">rate_review</span>
                    </div>
                    <div>
                      <h2 className="text-[20px] font-semibold leading-[28px] tracking-[-0.01em] text-[#191c1a]">
                        Admin Feedback
                      </h2>
                      <p className="text-[12px] leading-[16px] text-[#414845]">
                        Reviewed by AyojanSetu Onboarding Team · 14 May 2026
                      </p>
                    </div>
                  </div>
                  <span className="self-start rounded bg-[#f1f4ef] px-2.5 py-1 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#414845] sm:self-center">
                    2 Items Flagged
                  </span>
                </div>

                {/* Reviewer Comment Box */}
                <div className="mb-6 rounded-lg bg-[#f1f4ef] p-4 md:p-5">
                  <p className="text-[14px] leading-relaxed text-[#191c1a]">
                    “Thank you for registering{' '}
                    <span className="font-semibold">{profile.businessName}</span> on AyojanSetu.
                    Your business registration and GST details look great. Before we can publish
                    your storefront, please update the two sections highlighted below.”
                  </p>
                </div>

                {/* Sections Requiring Correction */}
                <div className="flex flex-col gap-3">
                  <h3 className="mb-1 text-[13px] font-medium uppercase leading-[18px] tracking-wider text-[#414845]">
                    Sections Requiring Correction
                  </h3>

                  {/* Item 1 */}
                  <Link
                    href="/vendor/onboarding/location-service-areas"
                    className="flex flex-col justify-between gap-4 rounded-xl bg-[#f1f4ef] p-4 transition-colors hover:bg-[#ecefea] sm:flex-row sm:items-start md:p-5"
                  >
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fedb9d]/70 text-[#795f2d]">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#191c1a]">
                            Business Location &amp; Service Areas
                          </h4>
                          <span className="rounded bg-[#fedb9d] px-2 py-0.5 text-[11px] font-semibold uppercase leading-[14px] text-[#795f2d]">
                            Incomplete
                          </span>
                        </div>
                        <p className="text-[14px] leading-[20px] text-[#414845]">
                          Complete street address needed — please include plot/building number,
                          nearby landmark, and PIN code for your Hyderabad service radius.
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Item 2 */}
                  <Link
                    href="/vendor/onboarding/portfolio-setup"
                    className="flex flex-col justify-between gap-4 rounded-xl bg-[#f1f4ef] p-4 transition-colors hover:bg-[#ecefea] sm:flex-row sm:items-start md:p-5"
                  >
                    <div className="flex min-w-0 items-start gap-3.5">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fedb9d]/70 text-[#795f2d]">
                        <span className="material-symbols-outlined text-[18px]">photo_library</span>
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#191c1a]">
                            Portfolio Setup
                          </h4>
                          <span className="rounded bg-[#fedb9d] px-2 py-0.5 text-[11px] font-semibold uppercase leading-[14px] text-[#795f2d]">
                            Missing Media
                          </span>
                        </div>
                        <p className="text-[14px] leading-[20px] text-[#414845]">
                          Add at least 2 landscape event photos (16:10 or 16:9 ratio) showcasing
                          recent mandap &amp; floral installations.
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>

              {/* Action Footer */}
              <section className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-[#ffffff] p-6 shadow-sm sm:flex-row">
                <div className="flex items-center gap-2.5 text-[#414845]">
                  <span className="material-symbols-outlined text-[20px] text-[#00271d]">info</span>
                  <span className="text-[12px] leading-[16px]">
                    Your previous details are saved. Resubmitted applications receive priority
                    review within 24 hours.
                  </span>
                </div>
                <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
                  <a
                    href="#help"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#f1f4ef] px-4 py-2.5 text-[14px] font-semibold leading-[20px] text-[#191c1a] transition-colors hover:bg-[#ecefea] sm:flex-initial"
                  >
                    Need Help?
                  </a>
                  <Link
                    href="/vendor/onboarding/location-service-areas"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00271d] px-5 py-2.5 text-[14px] font-semibold leading-[20px] text-[#ffffff] shadow-sm transition-colors hover:bg-[#173d32] sm:flex-initial"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    <span>Edit &amp; Resubmit</span>
                  </Link>
                </div>
              </section>
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
              href="/vendor/onboarding/status/changes-requested"
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
