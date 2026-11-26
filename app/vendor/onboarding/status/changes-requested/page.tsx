import type { Metadata } from 'next';
import { VendorApplicationChangesRequestedClient } from '@/components/vendor-onboarding/VendorApplicationChangesRequestedClient';

export const metadata: Metadata = {
  title: '10. Application Status — Changes Requested | AyojanSetu Vendor Onboarding',
};

export default function VendorApplicationChangesRequestedPage() {
  return <VendorApplicationChangesRequestedClient />;
}
