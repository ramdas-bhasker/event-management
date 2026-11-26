import type { Metadata } from 'next';
import { VendorApplicationSubmittedClient } from '@/components/vendor-onboarding/VendorApplicationSubmittedClient';

export const metadata: Metadata = {
  title: '8. Application Submitted Confirmation | AyojanSetu Vendor Onboarding',
};

export default function VendorApplicationSubmittedPage() {
  return <VendorApplicationSubmittedClient />;
}
