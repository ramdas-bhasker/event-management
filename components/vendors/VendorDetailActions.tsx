'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

interface VendorDetailActionsProps {
  vendorId: string;
  businessName: string;
}

export function VendorDetailActions({
  vendorId,
  businessName,
}: VendorDetailActionsProps) {
  const openEnquiryModal = useUiStore((s) => s.openEnquiryModal);
  const bookmarkedVendorIds = useUiStore((s) => s.bookmarkedVendorIds);
  const toggleVendorBookmark = useUiStore((s) => s.toggleVendorBookmark);
  const hydrateBookmarks = useUiStore((s) => s.hydrateBookmarks);

  useEffect(() => {
    hydrateBookmarks();
  }, [hydrateBookmarks]);

  const isSaved = bookmarkedVendorIds.includes(vendorId);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => openEnquiryModal(businessName)}
        className="btn btn-md btn-primary"
      >
        <span className="material-symbols-outlined text-[18px]">chat</span>
        <span>Request Quotation</span>
      </button>

      <button
        type="button"
        onClick={() => toggleVendorBookmark(vendorId)}
        aria-pressed={isSaved}
        className={cn(
          'btn btn-md',
          isSaved ? 'btn-secondary border-brand-green' : 'btn-outline'
        )}
      >
        <span
          className={cn(
            'material-symbols-outlined text-[18px]',
            isSaved ? 'text-state-error' : 'text-text-primary'
          )}
          style={{
            fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          favorite
        </span>
        <span>{isSaved ? 'Saved in Shortlist' : 'Save Vendor'}</span>
      </button>
    </div>
  );
}
