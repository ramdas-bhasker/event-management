import type { Metadata } from 'next';
import { VendorPricingInformationClient } from '@/components/vendor-onboarding/VendorPricingInformationClient';

export const metadata: Metadata = {
  title: '5. Pricing Information | AyojanSetu Vendor Onboarding',
};

export default function VendorPricingInformationPage() {
  return <VendorPricingInformationClient />;
}
