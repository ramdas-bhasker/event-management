import type { Metadata } from 'next';
import { AdminVendorApplicationReviewClient } from '@/components/admin/AdminVendorApplicationReviewClient';

export const metadata: Metadata = {
  title: 'Vendor Application Review | AyojanSetu Admin Console',
};

export default function AdminVendorApplicationReviewPage() {
  return <AdminVendorApplicationReviewClient />;
}
