'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { cn } from '@/lib/utils';
import {
  BUDGET_RANGE_OPTIONS,
  EVENT_CATEGORY_OPTIONS,
  LOCATION_AREA_OPTIONS,
  VENDOR_CATEGORY_OPTIONS,
} from '@/data/mock-vendors';
import type {
  BudgetRangeSlug,
  EventCategorySlug,
  VendorCategorySlug,
  VendorLocationSlug,
} from '@/types/vendor';

type SearchDropdownKey = 'event' | 'category' | 'location' | 'budget' | null;

interface SearchFilterOption<T extends string> {
  value: T;
  label: string;
  icon?: string;
}

interface SearchFilterDropdownProps<T extends string> {
  id: string;
  fieldLabel: string;
  icon: string;
  value: T;
  options: SearchFilterOption<T>[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: T) => void;
}

function SearchFilterDropdown<T extends string>({
  id,
  fieldLabel,
  icon,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: SearchFilterDropdownProps<T>) {
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div
      className={cn('ay-dropdown', isOpen && 'is-open')}
      id={`${id}Dropdown`}
      data-dropdown={id}
    >
      <button
        type="button"
        className="ay-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}Options`}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
      >
        <div className="ay-dropdown-trigger-left">
          <div className="ay-dropdown-icon-box">
            <span className="material-symbols-outlined" style={{ fontSize: '19px' }}>
              {icon}
            </span>
          </div>
          <div className="ay-dropdown-text">
            <span className="ay-dropdown-label">{fieldLabel}</span>
            <span className="ay-dropdown-value">{selectedOption?.label ?? ''}</span>
          </div>
        </div>
        <span className="material-symbols-outlined ay-dropdown-chevron">
          expand_more
        </span>
      </button>

      <div
        className="ay-dropdown-menu"
        id={`${id}Options`}
        role="listbox"
        aria-label={fieldLabel}
      >
        <div className="ay-dropdown-list">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={cn('ay-dropdown-item', isSelected && 'is-selected')}
                role="option"
                aria-selected={isSelected}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(option.value);
                }}
              >
                <span className="material-symbols-outlined ay-dropdown-item-icon">
                  {option.icon ?? icon}
                </span>
                <span className="ay-dropdown-item-title">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const LOCATION_FILTER_OPTIONS: SearchFilterOption<VendorLocationSlug>[] =
  LOCATION_AREA_OPTIONS.map((option) => ({
    value: option.value,
    label: option.shortLabel,
    icon: 'location_on',
  }));

const BUDGET_FILTER_OPTIONS: SearchFilterOption<BudgetRangeSlug>[] =
  BUDGET_RANGE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
    icon: 'payments',
  }));

interface VendorSearchBarProps {
  selectedEvent: EventCategorySlug;
  selectedCategory: VendorCategorySlug;
  selectedLocation: VendorLocationSlug;
  selectedBudget: BudgetRangeSlug;
  activeCategoryTitle: string;
  onApplySearch: (criteria: {
    event: EventCategorySlug;
    category: VendorCategorySlug;
    location: VendorLocationSlug;
    budget: BudgetRangeSlug;
  }) => void;
}

export function VendorSearchBar({
  selectedEvent,
  selectedCategory,
  selectedLocation,
  selectedBudget,
  activeCategoryTitle,
  onApplySearch,
}: VendorSearchBarProps) {
  const [draftEvent, setDraftEvent] = useState<EventCategorySlug>(selectedEvent);
  const [draftCategory, setDraftCategory] =
    useState<VendorCategorySlug>(selectedCategory);
  const [draftLocation, setDraftLocation] =
    useState<VendorLocationSlug>(selectedLocation);
  const [draftBudget, setDraftBudget] = useState<BudgetRangeSlug>(selectedBudget);
  const [openDropdown, setOpenDropdown] = useState<SearchDropdownKey>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);
  useOutsideClickAndEscape(searchFormRef, closeDropdown, openDropdown !== null);

  function toggleDropdown(target: Exclude<SearchDropdownKey, null>) {
    setOpenDropdown((current) => (current === target ? null : target));
  }

  // Sync local draft controls when URL / sidebar filters change
  useEffect(() => {
    setDraftEvent(selectedEvent);
    setDraftCategory(selectedCategory);
    setDraftLocation(selectedLocation);
    setDraftBudget(selectedBudget);
  }, [selectedEvent, selectedCategory, selectedLocation, selectedBudget]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpenDropdown(null);
    onApplySearch({
      event: draftEvent,
      category: draftCategory,
      location: draftLocation,
      budget: draftBudget,
    });
  }

  return (
    <>
      {/* BREADCRUMBS & INTRO HERO STRIP */}
      <section className="w-full bg-brand-ivory border-b border-border-default pt-6 pb-8">
        <div className="ay-container">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-text-secondary text-xs mb-3"
          >
            <Link
              href="/"
              className="hover:text-brand-green transition-colors font-medium"
            >
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px] text-text-muted">
              chevron_right
            </span>
            <Link
              href="/vendors"
              className="hover:text-brand-green transition-colors font-medium"
            >
              Find Vendors
            </Link>
            <span className="material-symbols-outlined text-[14px] text-text-muted">
              chevron_right
            </span>
            <span className="text-brand-green font-semibold">
              {activeCategoryTitle}
            </span>
          </nav>

          {/* Headline & Zero-Commission Trust Pill */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="badge badge-gold uppercase tracking-wider">
                  Hyderabad Artisan Directory
                </span>
                <span className="badge badge-green">
                  Transparent Starting Packages
                </span>
              </div>
              <h1 className="text-h1 text-brand-green tracking-tight font-bold">
                Find the Right Vendors for Your Event
              </h1>
              <p className="text-body text-text-secondary mt-1.5">
                Explore, compare itemized service portfolios, and connect directly with
                local event professionals across Hyderabad for weddings, corporate galas,
                birthdays, and traditional celebrations.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-brand-white px-4 py-3 rounded-xl border border-border-default shadow-xs shrink-0">
              <span className="material-symbols-outlined text-brand-gold-dark text-[24px]">
                verified_user
              </span>
              <div className="flex flex-col">
                <span className="text-label text-brand-green font-semibold">
                  Zero Commission Fee
                </span>
                <span className="text-small text-text-secondary">
                  Direct phone &amp; WhatsApp rates
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSISTENT SEARCH CRITERIA BAR */}
      <section
        aria-label="Vendor Search Criteria"
        className="w-full relative z-20 -mt-5"
      >
        <div className="ay-container">
          <div className="bg-brand-white rounded-2xl border border-border-default shadow-md p-3">
            <form
              ref={searchFormRef}
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center"
            >
              {/* 1. Event Category */}
              <SearchFilterDropdown
                id="search-event-category"
                fieldLabel="Event Category"
                icon="celebration"
                value={draftEvent}
                options={EVENT_CATEGORY_OPTIONS}
                isOpen={openDropdown === 'event'}
                onToggle={() => toggleDropdown('event')}
                onSelect={(value) => {
                  setDraftEvent(value);
                  setOpenDropdown(null);
                }}
              />

              {/* 2. Service Speciality */}
              <SearchFilterDropdown
                id="search-service-type"
                fieldLabel="Service Speciality"
                icon="design_services"
                value={draftCategory}
                options={VENDOR_CATEGORY_OPTIONS}
                isOpen={openDropdown === 'category'}
                onToggle={() => toggleDropdown('category')}
                onSelect={(value) => {
                  setDraftCategory(value);
                  setOpenDropdown(null);
                }}
              />

              {/* 3. Locality / Micro-Market */}
              <SearchFilterDropdown
                id="search-location"
                fieldLabel="Locality / Micro-Market"
                icon="location_on"
                value={draftLocation}
                options={LOCATION_FILTER_OPTIONS}
                isOpen={openDropdown === 'location'}
                onToggle={() => toggleDropdown('location')}
                onSelect={(value) => {
                  setDraftLocation(value);
                  setOpenDropdown(null);
                }}
              />

              {/* 4. Budget Range */}
              <SearchFilterDropdown
                id="search-budget"
                fieldLabel="Budget Range"
                icon="payments"
                value={draftBudget}
                options={BUDGET_FILTER_OPTIONS}
                isOpen={openDropdown === 'budget'}
                onToggle={() => toggleDropdown('budget')}
                onSelect={(value) => {
                  setDraftBudget(value);
                  setOpenDropdown(null);
                }}
              />

              {/* 5. Update Search CTA */}
              <button
                type="submit"
                className="btn btn-md btn-primary w-full min-h-[52px] rounded-xl font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Update Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
