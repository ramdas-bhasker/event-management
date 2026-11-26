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

export function VendorApplicationSubmittedClient() {
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
    setTimeout(() => setCopied(false), 1800);
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
            <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center py-8">
              <div className="pointer-events-none absolute -left-12 -top-6 h-48 w-48 rounded-full bg-[#00271d]/5 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-8 -right-12 h-56 w-56 rounded-full bg-[#fedb9d]/30 blur-3xl" />

              <div className="relative flex w-full flex-col items-center rounded-xl bg-[#ffffff] p-8 text-center shadow-lg md:p-12">
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fedb9d]/40">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00271d] shadow-md">
                      <span
                        className="material-symbols-outlined text-[32px] text-[#ffdea6]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#745a29] shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-[#ffffff]">
                      verified
                    </span>
                  </span>
                </div>

                <span className="mb-4 rounded-full bg-[#fedb9d]/50 px-4 py-1 text-[11px] font-semibold uppercase leading-[14px] tracking-widest text-[#745a29]">
                  Onboarding Complete
                </span>

                <h1 className="mb-2 max-w-lg text-[32px] font-semibold leading-[40px] tracking-[-0.02em] text-[#191c1a]">
                  Your vendor application has been submitted!
                </h1>

                <p className="mb-8 max-w-md text-[16px] leading-[24px] text-[#414845]">
                  Thank you for joining AyojanSetu. Our team will review your business profile.
                </p>

                {/* Application ID & Business Name Box */}
                <div className="mb-8 flex w-full flex-col items-center justify-between gap-4 rounded-xl bg-[#f1f4ef] p-6 text-left sm:flex-row">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#414845]">
                      Application ID
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[18px] font-semibold leading-[26px] tracking-tight text-[#00271d]">
                        {APPLICATION_ID}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy Application ID"
                        className="rounded-lg p-1 text-[#414845] transition-colors hover:bg-[#ecefea] hover:text-[#00271d]"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {copied ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="hidden h-10 w-px bg-[#e6e9e4] sm:block" />
                  <div className="flex min-w-0 flex-col gap-1 sm:text-right">
                    <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#414845]">
                      Business Name
                    </span>
                    <span className="truncate text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#191c1a]">
                      {profile.businessName}
                    </span>
                  </div>
                </div>

                {/* 3-Column Feature Strip */}
                <div className="mb-8 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
                  <div className="flex items-start gap-2 rounded-lg bg-[#f1f4ef]/60 p-4">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-[#00271d]">
                      fact_check
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
                        Profile Review
                      </span>
                      <span className="text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
                        24–48 business hours
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg bg-[#f1f4ef]/60 p-4">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-[#745a29]">
                      verified_user
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
                        KYC &amp; Portfolio
                      </span>
                      <span className="text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
                        Document verification
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg bg-[#f1f4ef]/60 p-4">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px] text-[#00271d]">
                      storefront
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]">
                        Go Live
                      </span>
                      <span className="text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
                        Start receiving leads
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/vendor/onboarding/status/under-review"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#00271d] px-8 py-3 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#ffffff] shadow-sm transition-all hover:bg-[#173d32] sm:w-auto"
                  >
                    <span>View Application Status</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#00271d] transition-colors hover:bg-[#f1f4ef] hover:text-[#173d32] sm:w-auto"
                  >
                    <span>Return to AyojanSetu Home</span>
                  </Link>
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
