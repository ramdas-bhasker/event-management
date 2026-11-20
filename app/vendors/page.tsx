import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EnquiryModal } from '@/components/common/EnquiryModal';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeritageStrip } from '@/components/layout/HeritageStrip';
import { VendorListingSkeletonGrid } from '@/components/vendors/EmptySearchState';
import { VendorSearchResultsClient } from '@/components/vendors/VendorSearchResultsClient';

export const metadata: Metadata = {
  title: 'Find Event Vendors in Hyderabad | AyojanSetu Vendor Directory',
  description:
    'Search, filter, and compare Hyderabad event professionals across wedding decorators, photographers, caterers, makeup artists, venues, planners, and entertainment.',
};

export default function VendorsSearchResultsPage() {
  return (
    <>
      <HeritageStrip />
      <Header />
      <main>
        <Suspense
          fallback={
            <div className="ay-container py-12">
              <VendorListingSkeletonGrid />
            </div>
          }
        >
          <VendorSearchResultsClient />
        </Suspense>
      </main>
      <Footer />
      <EnquiryModal />
    </>
  );
}
