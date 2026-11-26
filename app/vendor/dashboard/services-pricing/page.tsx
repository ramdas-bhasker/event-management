import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_VENDORS } from '@/data/mock-vendors';
import { VendorServicesPricingClient } from '@/components/vendor-dashboard/VendorServicesPricingClient';
import { VendorWorkspaceShell } from '@/components/vendor-dashboard/VendorWorkspaceShell';

export const metadata: Metadata = { title: 'Services & Pricing | AyojanSetu Vendor Dashboard' };

export default function ServicesPricingPage() {
  const vendor = MOCK_VENDORS.find((record) => record.slug === 'sri-venkateswara-mandap-floral');
  if (!vendor) notFound();
  return <VendorWorkspaceShell vendor={vendor} activeItem="Services & Pricing"><VendorServicesPricingClient vendor={vendor} /></VendorWorkspaceShell>;
}
