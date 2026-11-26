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

const STEP1_INSPIRATION_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBsCPozYpSqTcTcJHo3lFwNWngJtdN3okO8r3Ro7IDhcRk0St2TgbhhDWh6CifuEfdRnXp15VdZbcnecV816uUSpdnH9JE4DufEYdJIU62Ou80pWXsvxmX_EY0Gm2OFwMTJSmYGyzqdvu-4xXYS4SewsPfOjtfSSoYD1GXPi6lCyhTl_0jY_DnNMkBJaBVQlT4iGt11Q5mx4mM_7dqeY63EkRqu4tbTHS4TWxngtvs';

export function VendorAccountRegistrationClient() {
  const vendor = getDefaultMockVendor();
  const [profile, setProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(vendor)
  );
  const [initialized, setInitialized] = useState(false);
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

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

  const isOtpVerified = otp.trim() === '123456';
  const completion = calculateProfileCompletion(profile);
  const categoryLabel = getCategoryLabelFromSlug(profile.category);

  const leftExtraCard = (
    <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
      <div className="relative h-44 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={STEP1_INSPIRATION_IMAGE}
          alt="Editorial architectural photograph of a grand heritage mandap and event courtyard in Hyderabad"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#00271d]/80 via-[#00271d]/20 to-transparent p-4">
          <div>
            <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#ffdea6]">
              Built for Event Professionals
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
            Why Partner with AyojanSetu
          </span>
          <span className="rounded-full bg-[#ffdea6] px-2 py-1 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#745a29]">
            0% Listing Fee
          </span>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5 rounded-lg bg-[#f1f4ef] p-3">
            <span className="material-symbols-outlined mt-0.5 text-[18px] text-[#00271d]">
              bolt
            </span>
            <div>
              <p className="text-[13px] font-semibold leading-[18px] text-[#191c1a]">
                Direct Verified Enquiries
              </p>
              <p className="mt-0.5 text-[12px] leading-[16px] text-[#414845]">
                Receive qualified leads with event dates, guest count, and budget upfront.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-lg bg-[#f1f4ef] p-3">
            <span className="material-symbols-outlined mt-0.5 text-[18px] text-[#00271d]">
              location_on
            </span>
            <div>
              <p className="text-[13px] font-semibold leading-[18px] text-[#191c1a]">
                Hyderabad Micro-Market Reach
              </p>
              <p className="mt-0.5 text-[12px] leading-[16px] text-[#414845]">
                Featured across Banjara Hills, Jubilee Hills, Gachibowli, and Madhapur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <VendorOnboardingCleanShell
      currentStep={1}
      stepTitle="Vendor Account Registration"
      contextTag={categoryLabel}
      progressPercent={completion.percentage}
      leftExtraCard={leftExtraCard}
    >
      <div className="mb-8">
        <h2 className="mb-1 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-[#191c1a]">
          Join AyojanSetu as a Vendor
        </h2>
        <p className="text-[14px] leading-[20px] text-[#414845]">
          Grow your business and connect with customers looking for verified event services in
          Hyderabad.
        </p>
      </div>

      {/* Mobile Number + Send OTP */}
      <div className="mb-6">
        <label
          htmlFor="mobile-input"
          className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
        >
          Mobile Number <span className="text-[#ba1a1a]">*</span>
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex h-11 flex-1 items-center overflow-hidden rounded-lg bg-[#f1f4ef] transition-all focus-within:bg-[#ffffff] focus-within:shadow-md">
            <div className="flex h-full shrink-0 items-center gap-1.5 border-r border-[#e0e3df] bg-[#ecefea] px-4 text-[14px] font-medium text-[#191c1a]">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              id="mobile-input"
              type="tel"
              maxLength={11}
              value={profile.accountMobile}
              onChange={(e) => updateField('accountMobile', e.target.value)}
              placeholder="98765 43210"
              className="h-full w-full bg-transparent px-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setOtpSent(true)}
            className="flex h-11 shrink-0 items-center justify-center rounded-lg bg-[#fedb9d] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#795f2d] transition-colors hover:bg-[#ffdea6]"
          >
            {otpSent ? 'Resend OTP' : 'Send OTP'}
          </button>
        </div>
        <p className="mt-1.5 text-[12px] leading-[16px] text-[#414845]">
          We will send a 6-digit verification code to this number.
        </p>
      </div>

      {/* 6-Digit OTP Verification Box */}
      <div className="mb-6 rounded-xl bg-[#f1f4ef] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#ffdea6]/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#745a29]">info</span>
            <span className="text-[12px] font-medium leading-[16px] text-[#271900]">
              Demo OTP: <strong className="font-semibold">123456</strong> — for prototype
              demonstration only
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setOtp('123456');
              setOtpSent(true);
            }}
            className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[#00271d] hover:underline"
          >
            Auto-fill
          </button>
        </div>

        <div>
          <label
            htmlFor="otp-input"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            6-Digit OTP Verification <span className="text-[#ba1a1a]">*</span>
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="h-11 w-full rounded-lg bg-[#ffffff] px-4 text-[14px] tracking-widest text-[#191c1a] placeholder:tracking-normal placeholder:text-[#717975] transition-shadow focus:outline-none focus:shadow-md sm:w-56"
            />
            {isOtpVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#c2ebdb] px-3 py-1 text-[11px] font-semibold text-[#002018]">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Full Name & Email Address */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullname-input"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            Full Name <span className="text-[#ba1a1a]">*</span>
          </label>
          <input
            id="fullname-input"
            type="text"
            value={profile.ownerName}
            onChange={(e) => updateField('ownerName', e.target.value)}
            placeholder="e.g., Ramesh Rao"
            className="h-11 w-full rounded-lg bg-[#f1f4ef] px-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
          />
        </div>
        <div>
          <label
            htmlFor="email-input"
            className="mb-2 block text-[13px] font-medium leading-[18px] tracking-[0.005em] text-[#191c1a]"
          >
            Email Address <span className="text-[#ba1a1a]">*</span>
          </label>
          <input
            id="email-input"
            type="email"
            value={profile.accountEmail}
            onChange={(e) => updateField('accountEmail', e.target.value)}
            placeholder="e.g., ramesh@srivenkateswaramandap.in"
            className="h-11 w-full rounded-lg bg-[#f1f4ef] px-4 text-[14px] text-[#191c1a] placeholder:text-[#717975] transition-all focus:bg-[#ffffff] focus:outline-none focus:shadow-md"
          />
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="mb-8">
        <label className="flex cursor-pointer select-none items-start gap-2.5">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-[#00271d]"
          />
          <span className="text-[12px] leading-relaxed text-[#414845]">
            I agree to AyojanSetu&apos;s{' '}
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="font-medium text-[#00271d] hover:underline"
            >
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="font-medium text-[#00271d] hover:underline"
            >
              Privacy Policy
            </a>
            , and consent to receive onboarding updates via WhatsApp and SMS.
          </span>
        </label>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between bg-[#ffffff] pt-6">
        <Link
          href="/"
          className="flex h-11 items-center gap-1 rounded-lg bg-[#ecefea] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#191c1a] transition-colors hover:bg-[#e6e9e4]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </Link>
        <Link
          href="/vendor/onboarding/business-information"
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
