import type { Metadata } from 'next';
import { VendorApplicationUnderReviewClient } from '@/components/vendor-onboarding/VendorApplicationUnderReviewClient';

export const metadata: Metadata = {
  title: '9. Application Status — Under Review | AyojanSetu Vendor Onboarding',
};

export default function VendorApplicationUnderReviewPage() {
  return <VendorApplicationUnderReviewClient />;
}
