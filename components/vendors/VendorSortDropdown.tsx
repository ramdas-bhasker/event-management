'use client';

import { useCallback, useRef, useState } from 'react';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { cn } from '@/lib/utils';
import { VENDOR_SORT_OPTIONS } from '@/data/mock-vendors';
import type { VendorSortOption } from '@/types/vendor';

interface VendorSortDropdownProps {
  value: VendorSortOption;
  onChange: (sort: VendorSortOption) => void;
}

export function VendorSortDropdown({
  value,
  onChange,
}: VendorSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useOutsideClickAndEscape(dropdownRef, closeDropdown, isOpen);
  const selectedOption = VENDOR_SORT_OPTIONS.find((option) => option.value === value);

  return (
    <div className="flex items-center gap-2">
      <span className="text-small text-text-secondary font-medium whitespace-nowrap">
        Sort by:
      </span>
      <div
        ref={dropdownRef}
        className={cn('ay-dropdown min-w-[190px]', isOpen && 'is-open')}
      >
        <button
          type="button"
          className="ay-dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls="vendor-sort-options"
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen((open) => !open);
          }}
        >
          <span className="ay-dropdown-value">{selectedOption?.label ?? 'Recommended'}</span>
          <span className="material-symbols-outlined ay-dropdown-chevron">
            expand_more
          </span>
        </button>
        <div
          className="ay-dropdown-menu align-right"
          id="vendor-sort-options"
          role="listbox"
          aria-label="Sort vendors"
        >
          <div className="ay-dropdown-list">
            {VENDOR_SORT_OPTIONS.map((option) => {
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
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="material-symbols-outlined ay-dropdown-item-icon">
                    sort
                  </span>
                  <span className="ay-dropdown-item-title">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
