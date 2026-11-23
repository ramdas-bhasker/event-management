import type { Metadata } from 'next';
import { EnquiryConfirmationClient } from '@/components/enquiry/EnquiryConfirmationClient';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeritageStrip } from '@/components/layout/HeritageStrip';

export const metadata: Metadata = {
  title: 'Enquiry Confirmation | AyojanSetu',
  description: 'Review your AyojanSetu demo enquiry reference and details.',
};

export default function EnquiryConfirmationPage() {
  return (
    <>
      <HeritageStrip />
      <Header />
      <main className="min-h-screen bg-brand-ivory py-10 sm:py-14">
        <div className="ay-container">
          <EnquiryConfirmationClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
