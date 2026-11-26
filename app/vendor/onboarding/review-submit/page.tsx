import type { Metadata } from 'next';
import { VendorReviewSubmitClient } from '@/components/vendor-onboarding/VendorReviewSubmitClient';

export const metadata: Metadata = {
  title: '7. Review & Submit | AyojanSetu Vendor Onboarding',
};

export default function VendorReviewSubmitPage() {
  return <VendorReviewSubmitClient />;
}
