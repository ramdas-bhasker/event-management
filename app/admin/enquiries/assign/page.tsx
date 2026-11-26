import type { Metadata } from 'next';
import { AdminAssignVendorsClient } from '@/components/admin/AdminAssignVendorsClient';

export const metadata: Metadata = {
  title: 'Assign Vendors to Enquiry — AyojanSetu Admin',
  description:
    'Match and dispatch approved Hyderabad event vendors to customer enquiries with real-time slot tracking.',
};

export default function AdminAssignVendorsPage() {
  return <AdminAssignVendorsClient />;
}
