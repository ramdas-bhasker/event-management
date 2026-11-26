import type { Metadata } from 'next';
import { VendorBusinessInformationClient } from '@/components/vendor-onboarding/VendorBusinessInformationClient';

export const metadata: Metadata = {
  title: '2. Business Information | AyojanSetu Vendor Onboarding',
};

export default function VendorBusinessInformationPage() {
  return <VendorBusinessInformationClient />;
}
