import type { Metadata } from 'next';
import { AdminEnquiryDetailsClient } from '@/components/admin/AdminEnquiryDetailsClient';

export const metadata: Metadata = {
  title: 'Enquiry Details & Vendor Tracking — AyojanSetu Admin',
  description:
    'Inspect customer enquiry specifications, deliverables, moodboards, and vendor quotation response tracking.',
};

export default function AdminEnquiryDetailsPage() {
  return <AdminEnquiryDetailsClient />;
}
