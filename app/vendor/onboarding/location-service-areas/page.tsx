import type { Metadata } from 'next';
import { VendorLocationServiceAreasClient } from '@/components/vendor-onboarding/VendorLocationServiceAreasClient';

export const metadata: Metadata = {
  title: '4. Business Location & Service Areas | AyojanSetu Vendor Onboarding',
};

export default function VendorLocationServiceAreasPage() {
  return <VendorLocationServiceAreasClient />;
}
