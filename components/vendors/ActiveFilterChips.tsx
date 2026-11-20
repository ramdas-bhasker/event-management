'use client';

import type { ActiveFilterChipItem } from '@/types/vendor';

interface ActiveFilterChipsProps {
  chips: ActiveFilterChipItem[];
  onClearAll: () => void;
}

export function ActiveFilterChips({
  chips,
  onClearAll,
}: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-border-default"
      aria-label="Active search filters"
    >
      <span className="text-small text-text-secondary font-medium">
        Active:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 bg-brand-ivory border border-border-default px-2.5 py-1 rounded-md text-xs font-medium text-brand-green"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove filter ${chip.label}`}
            className="inline-flex items-center justify-center text-text-secondary hover:text-state-error transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-brand-gold-dark hover:text-brand-green text-xs font-semibold underline ml-1 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
