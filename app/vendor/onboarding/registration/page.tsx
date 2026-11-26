import type { Metadata } from 'next';
import { VendorAccountRegistrationClient } from '@/components/vendor-onboarding/VendorAccountRegistrationClient';

export const metadata: Metadata = {
  title: '1. Vendor Account Registration | AyojanSetu Vendor Onboarding',
};

export default function VendorAccountRegistrationPage() {
  return <VendorAccountRegistrationClient />;
}
