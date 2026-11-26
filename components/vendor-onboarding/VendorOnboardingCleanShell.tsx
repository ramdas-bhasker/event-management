'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

export interface OnboardingRoadmapStep {
  number: string;
  stepIndex: number;
  title: string;
  href: string;
}

export const ONBOARDING_ROADMAP_STEPS: OnboardingRoadmapStep[] = [
  {
    number: '01',
    stepIndex: 1,
    title: '1. Vendor Account Registration',
    href: '/vendor/onboarding/registration',
  },
  {
    number: '02',
    stepIndex: 2,
    title: '2. Business Information',
    href: '/vendor/onboarding/business-information',
  },
  {
    number: '03',
    stepIndex: 3,
    title: '3. Services & Specialities',
    href: '/vendor/dashboard/services-specialities',
  },
  {
    number: '04',
    stepIndex: 4,
    title: '4. Business Location & Service Areas',
    href: '/vendor/onboarding/location-service-areas',
  },
  {
    number: '05',
    stepIndex: 5,
    title: '5. Pricing Information',
    href: '/vendor/onboarding/pricing-information',
  },
  {
    number: '06',
    stepIndex: 6,
    title: '6. Portfolio Setup',
    href: '/vendor/onboarding/portfolio-setup',
  },
  {
    number: '07',
    stepIndex: 7,
    title: '7. Review & Submit',
    href: '/vendor/onboarding/review-submit',
  },
];

interface VendorOnboardingCleanShellProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  stepTitle: string;
  contextTag?: string;
  progressPercent: number;
  leftExtraCard?: ReactNode;
  children: ReactNode;
}

export function VendorOnboardingCleanShell({
  currentStep,
  stepTitle,
  contextTag = 'Wedding Decorators',
  progressPercent,
  leftExtraCard,
  children,
}: VendorOnboardingCleanShellProps) {
  const paddedStep = String(currentStep).padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#f7f4ed] font-sans text-[14px] leading-[20px] text-[#191c1a]">
      {/* Sticky Top Header (Identical to Step 3 Clean Layout) */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-[#e7e3da] bg-[#ffffff] px-6 py-3.5 lg:px-12">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#173d32]">
            AyojanSetu
          </Link>
          <span className="h-4 w-[1px] bg-[#e7e3da]" />
          <span className="rounded-full bg-[#fedb9d]/60 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#745a29]">
            Vendor Onboarding
          </span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#help"
              onClick={(e) => e.preventDefault()}
              className="text-sm font-medium text-[#414845] transition-colors hover:text-[#191c1a]"
            >
              Help / Support
            </a>
            <Link
              href="/vendor/dashboard"
              className="text-sm font-medium text-[#414845] transition-colors hover:text-[#191c1a]"
            >
              Already have an account?{' '}
              <span className="font-semibold text-[#173d32] underline">Login</span>
            </Link>
          </nav>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173d32] text-white shadow-sm">
            <span className="material-symbols-outlined text-[19px]">person</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative bg-[#f7f4ed] py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col">
            {/* Top Context & Progress Strip (Identical to Step 3 Clean Layout) */}
            <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#e7e3da] bg-[#ffffff] p-6 shadow-sm md:flex-row md:items-end">
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="rounded-full bg-[#fedb9d] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#795f2d]">
                    Step {paddedStep} of 07
                  </span>
                  <span className="text-xs text-[#717975]">•</span>
                  <span className="text-xs font-semibold text-[#173d32]">{contextTag}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#191c1a] lg:text-3xl">
                  {stepTitle}
                </h1>
              </div>

              <div className="w-full rounded-xl border border-[#e7e3da] bg-[#f7f4ed] p-3.5 md:w-72">
                <div className="mb-1.5 flex justify-between text-xs font-medium text-[#414845]">
                  <span>Onboarding Progress</span>
                  <span className="font-bold text-[#173d32]">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#e0e3df]">
                  <div
                    className="h-full rounded-full bg-[#173d32] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Main Asymmetric 12-Column Grid (Identical to Step 3 Clean Layout) */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              {/* Left Column: Stepper Status & Visual Context (4 cols) */}
              <div className="flex flex-col gap-6 lg:col-span-4">
                {/* Stepper Card */}
                <div className="rounded-2xl border border-[#e7e3da] bg-[#ffffff] p-6 shadow-sm">
                  <p className="mb-4 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.03em] text-[#414845]">
                    Onboarding Roadmap
                  </p>
                  <div className="flex flex-col gap-2">
                    {ONBOARDING_ROADMAP_STEPS.map((step) => {
                      const isCompleted = step.stepIndex < currentStep;
                      const isActive = step.stepIndex === currentStep;

                      if (isCompleted) {
                        return (
                          <Link
                            key={step.number}
                            href={step.href}
                            className="flex items-center gap-4 rounded-lg bg-[#ffffff]/60 p-2 transition-colors hover:bg-[#f1f4ef]"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c2ebdb] text-[#002018]">
                              <span className="material-symbols-outlined text-[16px]">check</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[14px] font-medium leading-[20px] text-[#191c1a]">
                                {step.title}
                              </p>
                              <p className="truncate text-[12px] leading-[16px] tracking-[0.01em] text-[#414845]">
                                Completed
                              </p>
                            </div>
                          </Link>
                        );
                      }

                      if (isActive) {
                        return (
                          <Link
                            key={step.number}
                            href={step.href}
                            aria-current="step"
                            className="flex items-center gap-4 rounded-lg bg-[#00271d] p-2 text-[#ffffff] shadow-sm"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffdea6] text-[11px] font-semibold leading-[14px] tracking-[0.03em] text-[#271900]">
                              {step.number}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[14px] font-semibold leading-[20px]">
                                {step.title}
                              </p>
                              <p className="truncate text-[12px] leading-[16px] tracking-[0.01em] text-[#c2ebdb]">
                                In Progress
                              </p>
                            </div>
                          </Link>
                        );
                      }

                      return (
                        <Link
                          key={step.number}
                          href={step.href}
                          className="flex items-center gap-4 rounded-lg p-2 opacity-60 transition-opacity hover:opacity-100"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e6e9e4] text-[11px] font-semibold leading-[14px] tracking-[0.03em] text-[#414845]">
                            {step.number}
                          </div>
                          <p className="truncate text-[14px] leading-[20px] text-[#414845]">
                            {step.title}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary Left Card (Visual Inspiration / Live Summary) */}
                {leftExtraCard}
              </div>

              {/* Right Column: Main Form Card (8 cols) */}
              <div className="rounded-2xl border border-[#e7e3da] bg-[#ffffff] p-6 shadow-sm sm:p-8 lg:col-span-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
