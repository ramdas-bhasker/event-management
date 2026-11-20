'use client';

import { useCallback, useRef, useState } from 'react';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import { cn } from '@/lib/utils';

interface VendorPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalCount: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function VendorPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalCount,
  perPage,
  onPageChange,
  onPerPageChange,
}: VendorPaginationProps) {
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const perPageDropdownRef = useRef<HTMLDivElement>(null);
  const closePerPageDropdown = useCallback(() => setIsPerPageOpen(false), []);
  useOutsideClickAndEscape(perPageDropdownRef, closePerPageDropdown, isPerPageOpen);

  if (totalCount === 0) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className="bg-brand-white rounded-2xl border border-border-default p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
      aria-label="Vendor results pagination"
    >
      <div className="text-small text-text-secondary">
        Showing{' '}
        <span className="font-semibold text-brand-green">
          {startIndex}–{endIndex}
        </span>{' '}
        of <span className="font-semibold text-brand-green">{totalCount}</span>{' '}
        vendors
      </div>

      {/* Page Controls */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:bg-brand-ivory hover:text-brand-green text-xs font-medium border border-border-default transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[16px] mr-1">
            chevron_left
          </span>
          <span>Previous</span>
        </button>

        {pages.map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors',
                isActive
                  ? 'bg-brand-green text-brand-white shadow-xs'
                  : 'text-text-secondary bg-brand-ivory/50 border border-border-default hover:bg-brand-ivory hover:text-brand-green'
              )}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:bg-brand-ivory hover:text-brand-green text-xs font-medium border border-border-default transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[16px] ml-1">
            chevron_right
          </span>
        </button>
      </div>

      {/* Results Per Page Selector */}
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <span>Results per page:</span>
        <div
          ref={perPageDropdownRef}
          className={cn('ay-dropdown w-20', isPerPageOpen && 'is-open')}
        >
          <button
            type="button"
            className="ay-dropdown-trigger is-form-control"
            aria-haspopup="listbox"
            aria-expanded={isPerPageOpen}
            aria-controls="results-per-page-options"
            aria-label={`Results per page: ${perPage}`}
            onClick={(event) => {
              event.stopPropagation();
              setIsPerPageOpen((open) => !open);
            }}
          >
            <span className="ay-dropdown-value">{perPage}</span>
            <span className="material-symbols-outlined ay-dropdown-chevron">
              expand_more
            </span>
          </button>
          <div
            className="ay-dropdown-menu align-right"
            id="results-per-page-options"
            role="listbox"
            aria-label="Results per page"
            style={{ minWidth: '100px' }}
          >
            <div className="ay-dropdown-list">
              {[12, 24].map((option) => {
                const isSelected = option === perPage;
                return (
                  <button
                    key={option}
                    type="button"
                    className={cn('ay-dropdown-item', isSelected && 'is-selected')}
                    role="option"
                    aria-selected={isSelected}
                    onClick={(event) => {
                      event.stopPropagation();
                      onPerPageChange(option);
                      setIsPerPageOpen(false);
                    }}
                  >
                    <span className="ay-dropdown-item-title">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
