import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VendorServicesSpecialitiesClient } from '@/components/vendor-dashboard/VendorServicesSpecialitiesClient';
import { MOCK_VENDORS } from '@/data/mock-vendors';

export const metadata: Metadata = {
  title: '3. Services & Specialities | AyojanSetu Vendor Onboarding',
};

export default function ServicesSpecialitiesPage() {
  const vendor = MOCK_VENDORS.find((record) => record.slug === 'sri-venkateswara-mandap-floral');
  if (!vendor) notFound();

  return <VendorServicesSpecialitiesClient vendor={vendor} />;
}
