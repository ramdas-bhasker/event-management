'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VendorOnboardingCleanShell } from '@/components/vendor-onboarding/VendorOnboardingCleanShell';
import {
  calculateProfileCompletion,
  createBusinessProfile,
  DEFAULT_ONBOARDING_PORTFOLIO_ITEMS,
  getCategoryLabelFromSlug,
  getDefaultMockVendor,
  getServiceAreaLabel,
  readVendorBusinessProfileSession,
  saveVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

export function VendorReviewSubmitClient() {
  const router = useRouter();
  const vendor = getDefaultMockVendor();
  const [profile, setProfile] = useState<VendorBusinessProfile>(() =>
    createBusinessProfile(vendor)
  );
  const [declarationChecked, setDeclarationChecked] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    setProfile(readVendorBusinessProfileSession(vendor));
  }, [vendor]);

  const categoryLabel = getCategoryLabelFromSlug(profile.category);
  const completion = calculateProfileCompletion(profile);
  const serviceAreaLabels = [
    ...profile.serviceAreas.map((slug) => getServiceAreaLabel(slug)),
    ...profile.customServiceAreas,
  ];
  const portfolioItems =
    profile.portfolioItems.length > 0
      ? profile.portfolioItems
      : DEFAULT_ONBOARDING_PORTFOLIO_ITEMS;

  const isCustomPrice =
    profile.contactForPrice ||
    !profile.displayPricePublicly ||
    profile.pricingModel === 'Custom Quote' ||
    !profile.startingPrice.trim();

  function handleSaveDraft() {
    saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: true });
    setDraftSaved(true);
  }

  function handleSubmitForApproval() {
    saveVendorBusinessProfileSession(profile, { commitSaved: true, keepDraft: false });
    setSubmitted(true);
    router.push('/vendor/onboarding/submitted');
  }

  const leftExtraCard = (
    <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
      <div className="relative h-44 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portfolioItems[0].imageUrl}
          alt={`${profile.businessName} preview`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#00271d]/80 via-[#00271d]/20 to-transparent p-4">
          <div>
            <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#ffdea6]">
              Profile Completion · {completion.percentage}%
            </span>
            <p className="text-[18px] font-medium leading-[26px] tracking-[-0.005em] text-[#ffffff]">
              {completion.missing.length === 0
                ? 'Ready for Verification'
                : `${completion.completed} of ${completion.total} Required Fields`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#745a29]">
            verified_user
          </span>
          <h3 className="text-[15px] font-semibold text-[#191c1a]">Vendor Guidance</h3>
        </div>
        <p className="text-[12px] leading-[16px] text-[#414845]">
          Keep your registered GSTIN, owner PAN, and high-resolution portfolio images verified. Once
          submitted, our curation team reviews profiles within 24–48 business hours.
        </p>
      </div>
    </div>
  );

  return (
    <VendorOnboardingCleanShell
      currentStep={7}
      stepTitle="Review & Submit"
      contextTag="Final Verification"
      progressPercent={completion.percentage}
      leftExtraCard={leftExtraCard}
    >
      <div className="mb-8">
        <h2 className="mb-1 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-[#191c1a]">
          Review your business profile
        </h2>
        <p className="text-[14px] leading-[20px] text-[#414845]">
          Confirm all business, service, and pricing details below before submitting to the
          AyojanSetu curation team for approval.
        </p>
      </div>

      {submitted && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#c2ebdb] px-5 py-4 text-[#002018]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[22px]">task_alt</span>
            <div>
              <p className="text-[14px] font-semibold">Application Submitted for Curation Review</p>
              <p className="text-[12px]">
                Your vendor onboarding profile has been saved and synced with your Vendor Workspace.
              </p>
            </div>
          </div>
          <Link
            href="/vendor/dashboard/business-profile"
            className="rounded-lg bg-[#00271d] px-4 py-2 text-[12px] font-semibold text-white"
          >
            Open Workspace Profile
          </Link>
        </div>
      )}

      {draftSaved && !submitted && (
        <div className="mb-6 rounded-xl bg-[#ffdea6]/70 px-5 py-3 text-[13px] font-medium text-[#271900]">
          Draft saved and synced with your Vendor Workspace.
        </div>
      )}

      {/* Row 1: Account Information & Business Details */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col justify-between gap-4 rounded-xl bg-[#f1f4ef] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c2ebdb] text-[#002018]">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#191c1a]">Account Information</h3>
            </div>
            <Link
              href="/vendor/onboarding/registration"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#173d32] hover:underline"
            >
              <span className="material-symbols-outlined text-[15px]">edit</span>
              Edit
            </Link>
          </div>
          <div className="space-y-2">
            <div className="rounded-lg bg-[#ffffff] p-3">
              <p className="text-[12px] text-[#414845]">Owner / Primary Contact</p>
              <p className="mt-0.5 text-[14px] font-medium text-[#191c1a]">
                {profile.ownerName || 'Ramesh Rao'}
              </p>
            </div>
            <div className="rounded-lg bg-[#ffffff] p-3">
              <p className="text-[12px] text-[#414845]">Business / Account Phone</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <p className="text-[14px] font-medium text-[#191c1a]">
                  +91 {profile.businessPhone || profile.accountMobile || '98490 54321'}
                </p>
                <span
                  className="material-symbols-outlined text-[16px] text-[#173d32]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-xl bg-[#f1f4ef] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c2ebdb] text-[#002018]">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#191c1a]">Business Details</h3>
            </div>
            <Link
              href="/vendor/onboarding/business-information"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#173d32] hover:underline"
            >
              <span className="material-symbols-outlined text-[15px]">edit</span>
              Edit
            </Link>
          </div>
          <div className="flex flex-1 flex-col justify-between rounded-lg bg-[#ffffff] p-4">
            <div>
              <p className="text-[12px] text-[#414845]">Registered Business Name</p>
              <p className="mt-0.5 text-[14px] font-medium text-[#191c1a]">
                {profile.businessName}
              </p>
              <p className="mt-1 text-[12px] text-[#414845]">{profile.businessEmail}</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-[#414845]">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#745a29]">
                  workspace_premium
                </span>
                {categoryLabel}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#745a29]">
                  calendar_today
                </span>
                Est. {profile.yearEstablished || '2016'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Selected Services & Pricing Information */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col justify-between gap-4 rounded-xl bg-[#f1f4ef] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c2ebdb] text-[#002018]">
                <span className="material-symbols-outlined text-[18px]">category</span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#191c1a]">Selected Services</h3>
            </div>
            <Link
              href="/vendor/dashboard/services-specialities"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#173d32] hover:underline"
            >
              <span className="material-symbols-outlined text-[15px]">edit</span>
              Edit
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.keySpecialties.map((service) => (
              <span
                key={service}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#c2ebdb] px-3 py-1.5 text-[13px] font-medium text-[#002018]"
              >
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-xl bg-[#f1f4ef] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffdea6] text-[#271900]">
                <span className="material-symbols-outlined text-[18px]">sell</span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#191c1a]">Pricing Information</h3>
            </div>
            <Link
              href="/vendor/onboarding/pricing-information"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#173d32] hover:underline"
            >
              <span className="material-symbols-outlined text-[15px]">edit</span>
              Edit
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-[#ffffff] p-3">
              <p className="text-[12px] text-[#414845]">Billing</p>
              <p className="mt-0.5 text-[13px] font-medium text-[#191c1a]">
                {profile.pricingModel}
              </p>
            </div>
            <div className="rounded-lg bg-[#ffffff] p-3">
              <p className="text-[12px] text-[#414845]">Starting</p>
              <p className="mt-0.5 text-[13px] font-semibold text-[#173d32]">
                {isCustomPrice ? 'Custom Quote' : `₹${profile.startingPrice}`}
              </p>
            </div>
            <div className="rounded-lg bg-[#ffffff] p-3">
              <p className="text-[12px] text-[#414845]">Visibility</p>
              <p className="mt-0.5 text-[13px] font-medium text-[#191c1a]">
                {isCustomPrice ? 'On Request' : 'Public'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Business Location & Service Areas */}
      <div className="mb-6 rounded-xl bg-[#f1f4ef] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c2ebdb] text-[#002018]">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
            </div>
            <h3 className="text-[16px] font-semibold text-[#191c1a]">
              Business Location &amp; Service Areas
            </h3>
          </div>
          <Link
            href="/vendor/onboarding/location-service-areas"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#173d32] hover:underline"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            Edit
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[#ffffff] p-3.5">
            <p className="text-[12px] text-[#414845]">Primary Studio / Office Address</p>
            <p className="mt-0.5 text-[14px] font-medium text-[#191c1a]">
              {[profile.areaLocality, profile.city, profile.pinCode].filter(Boolean).join(', ')}
            </p>
            {profile.businessAddress && (
              <p className="mt-1 text-[12px] text-[#414845]">{profile.businessAddress}</p>
            )}
          </div>
          <div className="rounded-lg bg-[#ffffff] p-3.5">
            <p className="text-[12px] text-[#414845]">Serving Micro-Markets</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {serviceAreaLabels.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-[#ecefea] px-3 py-0.5 text-[12px] text-[#191c1a]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Portfolio Images */}
      <div className="mb-6 rounded-xl bg-[#f1f4ef] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c2ebdb] text-[#002018]">
              <span className="material-symbols-outlined text-[18px]">photo_library</span>
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-[#191c1a]">Portfolio Images</h3>
              <p className="text-[12px] text-[#414845]">
                {portfolioItems.length} uploaded thumbnails
              </p>
            </div>
          </div>
          <Link
            href="/vendor/onboarding/portfolio-setup"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#173d32] hover:underline"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            Edit
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {portfolioItems.map((thumb) => (
            <div
              key={thumb.id}
              className="group relative aspect-[16/10] overflow-hidden rounded-lg bg-[#ffffff]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb.imageUrl}
                alt={thumb.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 rounded bg-[#ffffff]/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#191c1a] backdrop-blur-sm">
                {thumb.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Declaration Checkbox */}
      <label
        htmlFor="declaration-checkbox"
        className="mb-8 flex cursor-pointer select-none items-start gap-3 rounded-xl border border-[#e7e3da] bg-[#f1f4ef] p-5"
      >
        <input
          id="declaration-checkbox"
          type="checkbox"
          checked={declarationChecked}
          onChange={(e) => setDeclarationChecked(e.target.checked)}
          className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded accent-[#00271d]"
        />
        <div>
          <span className="block text-[13px] font-semibold text-[#191c1a]">
            Declaration of Accuracy
          </span>
          <span className="mt-1 block text-[12px] leading-relaxed text-[#414845]">
            I confirm that all business details, service categories, pricing, and portfolio images
            provided above are accurate and belong to {profile.businessName}. I agree to
            AyojanSetu&apos;s Vendor Terms of Service.
          </span>
        </div>
      </label>

      {/* Bottom Action Bar */}
      <div className="flex flex-col items-center justify-between gap-3 bg-[#ffffff] pt-6 sm:flex-row">
        <Link
          href="/vendor/onboarding/portfolio-setup"
          className="flex h-11 w-full items-center justify-center gap-1 rounded-lg bg-[#ecefea] px-6 text-[14px] font-semibold leading-[20px] tracking-[0.01em] text-[#191c1a] transition-colors hover:bg-[#e6e9e4] sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </Link>
        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[#fedb9d] px-6 text-[14px] font-semibold text-[#795f2d] transition-colors hover:bg-[#ffdea6] sm:w-auto"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Save as Draft</span>
          </button>
          <button
            type="button"
            onClick={handleSubmitForApproval}
            className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[#00271d] px-8 text-[14px] font-semibold text-[#ffffff] shadow-sm transition-colors hover:bg-[#173d32] sm:w-auto"
          >
            <span>Submit for Approval</span>
            <span className="material-symbols-outlined text-[18px]">task_alt</span>
          </button>
        </div>
      </div>
    </VendorOnboardingCleanShell>
  );
}
