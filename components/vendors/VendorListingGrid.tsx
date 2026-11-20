'use client';

import { VendorListingCard } from '@/components/vendors/VendorListingCard';
import type { VendorRecord } from '@/types/vendor';

interface VendorListingGridProps {
  vendors: VendorRecord[];
}

export function VendorListingGrid({ vendors }: VendorListingGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {vendors.map((vendor) => (
        <VendorListingCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}
