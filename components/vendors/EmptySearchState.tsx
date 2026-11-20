'use client';

interface EmptySearchStateProps {
  onClearAllFilters: () => void;
  onBroadenBudget: () => void;
  onResetLocation: () => void;
}

export function EmptySearchState({
  onClearAllFilters,
  onBroadenBudget,
  onResetLocation,
}: EmptySearchStateProps) {
  return (
    <div
      className="bg-brand-white rounded-2xl border border-border-default p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-xs"
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 rounded-full bg-brand-ivory border border-border-default flex items-center justify-center text-brand-gold-dark mb-4">
        <span className="material-symbols-outlined text-[32px]">
          search_off
        </span>
      </div>

      <h3 className="text-h3 text-brand-green font-bold">
        No Vendors Match Your Active Filters
      </h3>
      <p className="text-body text-text-secondary max-w-md mt-2">
        We couldn&apos;t find any Hyderabad event vendors matching this exact
        combination of category, locality, budget range, and specialities.
      </p>

      {/* Friendly Suggestions */}
      <div className="bg-brand-ivory border border-border-default rounded-xl p-4 mt-5 max-w-lg w-full text-left">
        <span className="text-badge text-brand-gold-dark uppercase tracking-wider block mb-2">
          Suggestions to find more vendors:
        </span>
        <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
          <li>
            Switch budget allocation to <strong>All Budgets</strong> to include
            custom-quote and adjacent tier packages.
          </li>
          <li>
            Expand your micro-market selection to include nearby areas like{' '}
            <strong>Banjara Hills, Jubilee Hills, or Madhapur</strong>.
          </li>
          <li>
            Remove one or more specific service speciality checkboxes.
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={onClearAllFilters}
          className="btn btn-md btn-primary"
        >
          <span className="material-symbols-outlined text-[18px]">
            restart_alt
          </span>
          <span>Clear All Filters</span>
        </button>
        <button
          type="button"
          onClick={onBroadenBudget}
          className="btn btn-md btn-secondary"
        >
          Broaden Budget Range
        </button>
        <button
          type="button"
          onClick={onResetLocation}
          className="btn btn-md btn-outline"
        >
          Show All Hyderabad Areas
        </button>
      </div>
    </div>
  );
}

export function VendorListingSkeletonGrid() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      aria-busy="true"
      aria-label="Loading vendor search results"
    >
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-brand-white rounded-2xl border border-border-default overflow-hidden shadow-xs flex flex-col animate-pulse"
        >
          <div className="aspect-[4/3] w-full bg-border-default/60" />
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-border-default rounded" />
              <div className="h-4 w-12 bg-border-default rounded" />
            </div>
            <div className="h-5 w-3/4 bg-border-default rounded" />
            <div className="h-3.5 w-1/2 bg-border-default/70 rounded" />
            <div className="flex gap-1.5 mt-1">
              <div className="h-5 w-16 bg-border-default/60 rounded" />
              <div className="h-5 w-20 bg-border-default/60 rounded" />
            </div>
            <div className="pt-3 mt-2 border-t border-border-default flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="h-3.5 w-24 bg-border-default/70 rounded" />
                <div className="h-5 w-16 bg-border-default rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 bg-border-default/70 rounded-lg" />
                <div className="h-9 bg-border-default rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function VendorSearchErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="bg-brand-white rounded-2xl border border-state-error/40 p-8 text-center flex flex-col items-center justify-center shadow-xs"
      role="alert"
    >
      <div className="w-14 h-14 rounded-full bg-state-error-bg text-state-error flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-[28px]">error</span>
      </div>
      <h3 className="text-h3 text-text-primary font-bold">
        Unable to Load Vendor Directory
      </h3>
      <p className="text-body text-text-secondary max-w-md mt-1.5">
        {message ||
          'An unexpected error occurred while preparing vendor search results. Please try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="btn btn-md btn-primary mt-5"
      >
        Retry Search
      </button>
    </div>
  );
}
