import { EnquiryModal } from '@/components/common/EnquiryModal';
import { CategorySection } from '@/components/home/CategorySection';
import { CTASection } from '@/components/home/CTASection';
import { FeaturedVendors } from '@/components/home/FeaturedVendors';
import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { PopularServices } from '@/components/home/PopularServices';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeritageStrip } from '@/components/layout/HeritageStrip';

export default function HomePage() {
  return (
    <>
      <HeritageStrip />
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <PopularServices />
        <FeaturedVendors />
        <HowItWorks />
        <WhyChooseUs />
        <CTASection />
      </main>
      <Footer />
      <EnquiryModal />
    </>
  );
}
