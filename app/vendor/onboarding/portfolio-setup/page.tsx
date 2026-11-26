import type { Metadata } from 'next';
import { VendorPortfolioSetupClient } from '@/components/vendor-onboarding/VendorPortfolioSetupClient';

export const metadata: Metadata = {
  title: '6. Portfolio Setup | AyojanSetu Vendor Onboarding',
};

export default function VendorPortfolioSetupPage() {
  return <VendorPortfolioSetupClient />;
}
