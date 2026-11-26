import type { Metadata } from 'next';
import { AdminVendorManagementClient } from '@/components/admin/AdminVendorManagementClient';

export const metadata: Metadata = {
  title: 'Vendor Management Overview | AyojanSetu Admin Console',
};

export default function AdminRootPage() {
  return <AdminVendorManagementClient />;
}
