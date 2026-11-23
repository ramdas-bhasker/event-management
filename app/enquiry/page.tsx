import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EnquiryFormClient } from '@/components/enquiry/EnquiryFormClient';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeritageStrip } from '@/components/layout/HeritageStrip';
import { findEnquiryVendor } from '@/lib/enquiry-vendors';

export const metadata: Metadata = {
  title: 'Send a Vendor Enquiry | AyojanSetu',
  description: 'Share your event requirements with your selected AyojanSetu vendor.',
};

interface EnquiryPageProps {
  searchParams: Promise<{ vendorId?: string | string[] }>;
}

export default async function EnquiryPage({ searchParams }: EnquiryPageProps) {
  const params = await searchParams;
  const vendorId = Array.isArray(params.vendorId) ? params.vendorId[0] : params.vendorId;
  const vendor = vendorId ? findEnquiryVendor(vendorId) : undefined;

  if (!vendor) notFound();

  return (
    <>
      <HeritageStrip />
      <Header />
      <main className="min-h-screen bg-brand-ivory py-8 sm:py-10">
        <div className="ay-container">
          <EnquiryFormClient vendor={vendor} />
        </div>
      </main>
      <Footer />
    </>
  );
}
