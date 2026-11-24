import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VendorEnquiriesClient } from '@/components/vendor-dashboard/VendorEnquiriesClient';
import { MOCK_VENDORS } from '@/data/mock-vendors';

export const metadata: Metadata = {
  title: 'Vendor Enquiries | AyojanSetu',
  description: 'Review and manage mock vendor enquiries in the AyojanSetu dashboard.',
};

export default function VendorEnquiriesPage() {
  const vendor = MOCK_VENDORS.find((record) => record.slug === 'sri-venkateswara-mandap-floral');
  if (!vendor) notFound();
  return <VendorEnquiriesClient vendor={vendor} />;
}
