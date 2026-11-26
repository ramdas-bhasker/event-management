import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MOCK_VENDORS } from '@/data/mock-vendors';
import { VendorPortfolioClient } from '@/components/vendor-dashboard/VendorPortfolioClient';
import { VendorWorkspaceShell } from '@/components/vendor-dashboard/VendorWorkspaceShell';

export const metadata: Metadata = { title: 'Portfolio | AyojanSetu Vendor Dashboard' };

export default function PortfolioPage() {
  const vendor = MOCK_VENDORS.find((record) => record.slug === 'sri-venkateswara-mandap-floral');
  if (!vendor) notFound();
  return <VendorWorkspaceShell vendor={vendor} activeItem="Portfolio"><VendorPortfolioClient vendor={vendor} /></VendorWorkspaceShell>;
}
