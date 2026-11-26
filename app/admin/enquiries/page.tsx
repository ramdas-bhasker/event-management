import type { Metadata } from 'next';
import { AdminEnquiryManagementClient } from '@/components/admin/AdminEnquiryManagementClient';

export const metadata: Metadata = {
  title: 'Enquiry Management — AyojanSetu Admin',
  description:
    'Monitor customer enquiries and track their progress across Hyderabad event vendors in real-time.',
};

export default function AdminEnquiriesPage() {
  return <AdminEnquiryManagementClient />;
}
