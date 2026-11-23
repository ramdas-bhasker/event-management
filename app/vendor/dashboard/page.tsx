import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VendorDashboardClient } from '@/components/vendor-dashboard/VendorDashboardClient';
import { MOCK_VENDORS } from '@/data/mock-vendors';

export const metadata: Metadata = {
  title: 'Vendor Dashboard | AyojanSetu',
  description: 'Mock vendor workspace overview for AyojanSetu.',
};

export default function VendorDashboardPage() {
  const vendor = MOCK_VENDORS.find((record) => record.slug === 'sri-venkateswara-mandap-floral');
  if (!vendor) notFound();
  return <VendorDashboardClient vendor={vendor} />;
}
