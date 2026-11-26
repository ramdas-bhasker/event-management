import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_VENDORS } from '@/data/mock-vendors';
import { VendorAccountSettingsClient } from '@/components/vendor-dashboard/VendorAccountSettingsClient';
import { VendorWorkspaceShell } from '@/components/vendor-dashboard/VendorWorkspaceShell';

export const metadata: Metadata = { title: 'Account Settings | AyojanSetu Vendor Dashboard' };

export default function AccountSettingsPage() {
  const vendor = MOCK_VENDORS.find((record) => record.slug === 'sri-venkateswara-mandap-floral');
  if (!vendor) notFound();
  return <VendorWorkspaceShell vendor={vendor} activeItem="Account Settings"><VendorAccountSettingsClient vendor={vendor} /></VendorWorkspaceShell>;
}
