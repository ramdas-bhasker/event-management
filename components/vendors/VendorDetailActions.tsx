'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

interface VendorDetailActionsProps {
  vendorId: string;
  vendorSlug: string;
  businessName: string;
}

export function VendorDetailActions({
  vendorId,
  vendorSlug,
  businessName,
}: VendorDetailActionsProps) {
  const router = useRouter();
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
        aria-label={`Request a quotation from ${businessName}`}
        onClick={() => router.push(`/enquiry?vendorId=${encodeURIComponent(vendorSlug)}`)}
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
