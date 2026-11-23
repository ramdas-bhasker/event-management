'use client';

import { useEffect, useState } from 'react';
import {
  BUDGET_RANGE_OPTIONS,
  GUEST_CAPACITY_OPTIONS,
  LOCATION_AREA_OPTIONS,
  MOCK_VENDORS,
  getAllServiceSpecialtyGroups,
  getServiceSpecialtyOptions,
  getPriceTypeOptions,
  VENDOR_CATEGORY_OPTIONS,
} from '@/data/mock-vendors';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import type {
  BudgetRangeSlug,
  GuestCapacitySlug,
  PriceTypeSlug,
  VendorCategorySlug,
  VendorFilterState,
  VendorLocationSlug,
} from '@/types/vendor';

interface VendorFilterSidebarProps {
  filters: VendorFilterState;
  onSelectCategory: (category: VendorCategorySlug) => void;
  onToggleArea: (area: Exclude<VendorLocationSlug, 'hyderabad'>) => void;
  onSelectBudget: (budget: BudgetRangeSlug) => void;
  onTogglePriceType: (priceType: PriceTypeSlug) => void;
  onToggleService: (service: string) => void;
  onToggleVerifiedOnly: () => void;
  onToggleFastResponse: () => void;
  onSelectCapacity: (capacity: GuestCapacitySlug) => void;
  onResetAll: () => void;
  showConciergeCard?: boolean;
}

export function VendorFilterSidebar({
  filters,
  onSelectCategory,
  onToggleArea,
  onSelectBudget,
  onTogglePriceType,
  onToggleService,
  onToggleVerifiedOnly,
  onToggleFastResponse,
  onSelectCapacity,
  onResetAll,
  showConciergeCard = true,
}: VendorFilterSidebarProps) {
  const openEnquiryModal = useUiStore((s) => s.openEnquiryModal);
  const allServiceGroups = getAllServiceSpecialtyGroups();
  const firstServiceGroup = allServiceGroups[0]?.name;
  const [expandedServiceGroups, setExpandedServiceGroups] = useState<Set<string>>(
    () => new Set(firstServiceGroup ? [firstServiceGroup] : [])
  );
  const [showAllCategoryServices, setShowAllCategoryServices] = useState(false);

  const activeBudgetMeta =
    BUDGET_RANGE_OPTIONS.find((b) => b.value === filters.budget) ||
    BUDGET_RANGE_OPTIONS[0];

  const areaOptions = LOCATION_AREA_OPTIONS.filter(
    (loc): loc is { value: Exclude<VendorLocationSlug, 'hyderabad'>; label: string; shortLabel: string } =>
      loc.value !== 'hyderabad'
  );
  const serviceOptions = getServiceSpecialtyOptions(filters.category);
  const priceTypeOptions = getPriceTypeOptions(filters.category);

  useEffect(() => {
    setShowAllCategoryServices(false);
    setExpandedServiceGroups(new Set(firstServiceGroup ? [firstServiceGroup] : []));
  }, [filters.category, firstServiceGroup]);

  function toggleServiceGroup(groupName: string) {
    setExpandedServiceGroups((current) => {
      const next = new Set(current);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  }

  // Calculate counts from dataset
  function getCategoryCount(cat: VendorCategorySlug): number {
    if (cat === 'all') return MOCK_VENDORS.length;
    return MOCK_VENDORS.filter((v) => v.category === cat).length;
  }

  function getAreaCount(area: Exclude<VendorLocationSlug, 'hyderabad'>): number {
    return MOCK_VENDORS.filter(
      (v) => v.locationSlug === area || v.serviceAreas.includes(area)
    ).length;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-brand-white rounded-2xl border border-border-default p-5 shadow-xs flex flex-col gap-5">
        {/* Filters Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-default">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-green text-[20px]">
              tune
            </span>
            <h2 className="text-h4 text-brand-green font-bold">Filter Results</h2>
          </div>
          <button
            type="button"
            onClick={onResetAll}
            className="text-small text-brand-gold-dark hover:text-brand-green font-semibold transition-colors"
          >
            Reset All
          </button>
        </div>

        {/* 1. Ayojan Trust Guarantee */}
        <div className="flex flex-col gap-2 pb-4 border-b border-border-default">
          <span className="text-label text-brand-green font-semibold uppercase tracking-wider">
            Ayojan Trust Guarantee
          </span>
          <label className="flex items-center justify-between cursor-pointer px-3 py-2 rounded-lg bg-brand-ivory hover:bg-brand-ivory-hover/70 border border-border-default transition-colors">
            <span className="text-small text-text-primary font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-state-success">
                verified
              </span>
              <span>Audited On-Site Only</span>
            </span>
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={onToggleVerifiedOnly}
              className="w-4 h-4 rounded accent-brand-green cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer px-3 py-2 rounded-lg bg-brand-ivory hover:bg-brand-ivory-hover/70 border border-border-default transition-colors">
            <span className="text-small text-text-primary font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-brand-gold-dark">
                bolt
              </span>
              <span>Responds under 2 hrs</span>
            </span>
            <input
              type="checkbox"
              checked={filters.fastResponseOnly}
              onChange={onToggleFastResponse}
              className="w-4 h-4 rounded accent-brand-green cursor-pointer"
            />
          </label>
        </div>

        {/* 2. Vendor Category */}
        <div className="flex flex-col gap-1.5 pb-4 border-b border-border-default">
          <span className="text-label text-brand-green font-semibold uppercase tracking-wider mb-1">
            Vendor Category
          </span>
          {VENDOR_CATEGORY_OPTIONS.map((cat) => {
            const isSelected = filters.category === cat.value;
            const count = getCategoryCount(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onSelectCategory(cat.value)}
                className={cn(
                  'w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors',
                  isSelected
                    ? 'bg-brand-green text-brand-white font-semibold'
                    : 'text-text-secondary hover:bg-brand-ivory hover:text-brand-green'
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-[16px]">
                    {cat.icon}
                  </span>
                  <span className="truncate">{cat.shortLabel}</span>
                </span>
                <span
                  className={cn(
                    'text-[11px] px-1.5 py-0.5 rounded font-semibold',
                    isSelected
                      ? 'bg-brand-white/20 text-brand-white'
                      : 'text-text-secondary'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Hyderabad Micro-Markets (Areas Served) */}
        <div className="flex flex-col gap-1.5 pb-4 border-b border-border-default">
          <span className="text-label text-brand-green font-semibold uppercase tracking-wider mb-1">
            Hyderabad Micro-Markets
          </span>
          {areaOptions.map((area) => {
            const isChecked =
              filters.areas.includes(area.value) ||
              filters.location === area.value;
            const count = getAreaCount(area.value);

            return (
              <label
                key={area.value}
                className="flex items-center justify-between text-xs text-text-secondary hover:text-brand-green cursor-pointer py-1"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleArea(area.value)}
                    className="w-4 h-4 rounded accent-brand-green cursor-pointer"
                  />
                  <span
                    className={cn(
                      isChecked && 'text-brand-green font-semibold'
                    )}
                  >
                    {area.label}
                  </span>
                </span>
                <span className="text-[11px] font-semibold text-text-secondary/80">
                  {count}
                </span>
              </label>
            );
          })}
        </div>

        {/* 4. Budget Allocation & Fast Pills */}
        <div className="flex flex-col gap-2.5 pb-4 border-b border-border-default">
          <span className="text-label text-brand-green font-semibold uppercase tracking-wider">
            Budget Allocation
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col bg-brand-ivory p-2.5 rounded-lg border border-border-default">
              <span className="text-badge text-text-secondary uppercase">
                Min Price
              </span>
              <span className="text-label text-text-primary font-semibold mt-0.5">
                {activeBudgetMeta.minLabel}
              </span>
            </div>
            <div className="flex flex-col bg-brand-ivory p-2.5 rounded-lg border border-border-default">
              <span className="text-badge text-text-secondary uppercase">
                Max Price
              </span>
              <span className="text-label text-text-primary font-semibold mt-0.5">
                {activeBudgetMeta.maxLabel}
              </span>
            </div>
          </div>

          {/* Visual Range Slider Track */}
          <div className="w-full bg-border-default h-1.5 rounded-full relative my-1 overflow-hidden">
            <div
              className={cn(
                'absolute h-1.5 bg-brand-green rounded-full transition-all',
                filters.budget === 'all' && 'left-0 right-0',
                filters.budget === 'under-50k' && 'left-0 right-3/4',
                filters.budget === '50k-150k' && 'left-1/4 right-2/4',
                filters.budget === '150k-300k' && 'left-2/4 right-1/4',
                filters.budget === '300k-plus' && 'left-3/4 right-0'
              )}
            />
          </div>

          {/* Quick Budget Pills */}
          <div className="flex flex-wrap gap-1.5">
            {BUDGET_RANGE_OPTIONS.map((budgetOpt) => {
              const isSelected = filters.budget === budgetOpt.value;
              return (
                <button
                  key={budgetOpt.value}
                  type="button"
                  onClick={() => onSelectBudget(budgetOpt.value)}
                  className={cn(
                    'text-[11px] px-2.5 py-1 rounded-md border transition-colors font-semibold',
                    isSelected
                      ? 'bg-brand-green text-brand-white border-brand-green'
                      : 'bg-brand-ivory text-text-secondary border-border-default hover:border-brand-green hover:text-brand-green'
                  )}
                >
                  {budgetOpt.pillLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Price Type */}
        <div className="flex flex-col gap-1.5 pb-4 border-b border-border-default">
          <span className="text-label text-brand-green font-semibold uppercase tracking-wider mb-1">
            Price Structure
          </span>
          {priceTypeOptions.map((pt) => {
            const isChecked = filters.priceTypes.includes(pt.value);
            return (
              <label
                key={pt.value}
                className="flex items-center gap-2 text-xs text-text-secondary hover:text-brand-green cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onTogglePriceType(pt.value)}
                  className="w-4 h-4 rounded accent-brand-green cursor-pointer"
                />
                <span
                  className={cn(isChecked && 'text-brand-green font-semibold')}
                >
                  {pt.label}
                </span>
              </label>
            );
          })}
        </div>

        {/* 6. Services & Specialities Offered */}
        <div className="flex flex-col gap-1.5 pb-4 border-b border-border-default">
          <span className="text-label text-brand-green font-semibold uppercase tracking-wider mb-1">
            Services &amp; Specialities
          </span>
          {filters.category === 'all' ? (
            <div className="flex flex-col gap-2">
              {allServiceGroups.map((group) => {
                const isExpanded = expandedServiceGroups.has(group.name);
                const groupId = `service-group-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                return (
                  <section key={group.name} className="border-b border-border-default/70 pb-2 last:border-b-0">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={groupId}
                      onClick={() => toggleServiceGroup(group.name)}
                      className="flex w-full items-center justify-between gap-2 py-1.5 text-left text-xs font-semibold text-text-primary hover:text-brand-green"
                    >
                      <span className="min-w-0">{group.name} <span className="font-normal text-text-secondary">({group.services.length})</span></span>
                      <span className={cn('material-symbols-outlined shrink-0 text-[18px] transition-transform', isExpanded && 'rotate-180')} aria-hidden="true">expand_more</span>
                    </button>
                    {isExpanded && <div id={groupId} role="group" aria-label={group.name} className="flex flex-col gap-0.5 pt-1">
                      {group.services.map((service) => {
                        const isChecked = filters.services.includes(service);
                        return (
                          <label key={service} className="flex min-h-8 items-center gap-2 py-1 text-xs text-text-secondary hover:text-brand-green cursor-pointer">
                            <input type="checkbox" checked={isChecked} onChange={() => onToggleService(service)} className="w-4 h-4 shrink-0 rounded accent-brand-green cursor-pointer" />
                            <span className={cn(isChecked && 'text-brand-green font-semibold')}>{service}</span>
                          </label>
                        );
                      })}
                    </div>}
                  </section>
                );
              })}
            </div>
          ) : serviceOptions.length > 0 ? (
            <>
              {(showAllCategoryServices ? serviceOptions : serviceOptions.slice(0, 8)).map((service) => {
                const isChecked = filters.services.includes(service);
                return (
                  <label key={service} className="flex min-h-8 items-center gap-2 text-xs text-text-secondary hover:text-brand-green cursor-pointer py-1">
                    <input type="checkbox" checked={isChecked} onChange={() => onToggleService(service)} className="w-4 h-4 shrink-0 rounded accent-brand-green cursor-pointer" />
                    <span className={cn(isChecked && 'text-brand-green font-semibold')}>{service}</span>
                  </label>
                );
              })}
              {serviceOptions.length > 8 && <button type="button" aria-expanded={showAllCategoryServices} onClick={() => setShowAllCategoryServices((current) => !current)} className="mt-1 self-start text-xs font-semibold text-brand-green underline underline-offset-4">{showAllCategoryServices ? 'Show less' : `Show all services (${serviceOptions.length})`}</button>}
            </>
          ) : (
            <p className="py-1 text-xs text-text-secondary">No service options are listed for this category yet.</p>
          )}
        </div>

        {/* 7. Guest Capacity Experience */}
        <div className="flex flex-col gap-1.5">
          <span className="text-label text-brand-green font-semibold uppercase tracking-wider mb-1">
            Guest Scale Experience
          </span>
          {GUEST_CAPACITY_OPTIONS.map((cap) => {
            const isSelected = filters.capacity === cap.value;
            return (
              <label
                key={cap.value}
                className="flex items-center gap-2 text-xs text-text-secondary hover:text-brand-green cursor-pointer py-1"
              >
                <input
                  type="radio"
                  name="vendor-guest-capacity"
                  checked={isSelected}
                  onChange={() => onSelectCapacity(cap.value)}
                  className="w-4 h-4 accent-brand-green cursor-pointer"
                />
                <span
                  className={cn(isSelected && 'text-brand-green font-semibold')}
                >
                  {cap.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Need Help Concierge Card (Matches Stitch Left Sidebar Callout) */}
      {showConciergeCard && (
        <div className="bg-brand-white p-5 rounded-2xl border border-border-default flex flex-col gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-brand-green font-semibold">
            <span className="material-symbols-outlined text-[20px] text-brand-gold-dark">
              support_agent
            </span>
            <span className="text-h4 font-bold">Hyderabad Concierge</span>
          </div>
          <p className="text-small text-text-secondary leading-relaxed">
            Confused by vendor rates or availability for auspicious Muhurtham and
            celebration dates?
          </p>
          <button
            type="button"
            onClick={() => openEnquiryModal('AyojanSetu Hyderabad Concierge')}
            className="btn btn-sm btn-secondary w-full mt-1 font-semibold"
          >
            <span className="material-symbols-outlined text-[16px] text-brand-gold-dark">
              chat
            </span>
            <span>Free Vendor Matching</span>
          </button>
        </div>
      )}
    </div>
  );
}
