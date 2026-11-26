import type { Metadata } from 'next';
import { VendorApplicationApprovedClient } from '@/components/vendor-onboarding/VendorApplicationApprovedClient';

export const metadata: Metadata = {
  title: '11. Application Status — Approved | AyojanSetu Vendor Onboarding',
};

export default function VendorApplicationApprovedPage() {
  return <VendorApplicationApprovedClient />;
}
