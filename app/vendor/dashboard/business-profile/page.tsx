import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VendorBusinessProfileClient } from '@/components/vendor-dashboard/VendorBusinessProfileClient';
import { MOCK_VENDORS } from '@/data/mock-vendors';

export const metadata: Metadata = {
  title: 'Business Profile | AyojanSetu Vendor Dashboard',
  description: 'Review and edit your mock AyojanSetu business profile.',
};

export default function VendorBusinessProfilePage() {
  const vendor = MOCK_VENDORS.find((record) => record.slug === 'sri-venkateswara-mandap-floral');
  if (!vendor) notFound();
  return <VendorBusinessProfileClient vendor={vendor} />;
}
