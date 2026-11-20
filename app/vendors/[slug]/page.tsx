import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EnquiryModal } from '@/components/common/EnquiryModal';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeritageStrip } from '@/components/layout/HeritageStrip';
import { VendorDetailActions } from '@/components/vendors/VendorDetailActions';
import { LOCATION_AREA_OPTIONS, MOCK_VENDORS } from '@/data/mock-vendors';

interface VendorDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function VendorDetailPage({
  params,
}: VendorDetailPageProps) {
  const { slug } = await params;
  const vendor = MOCK_VENDORS.find((v) => v.slug === slug);

  if (!vendor) {
    notFound();
  }

  const areaLabels = vendor.serviceAreas
    .map(
      (areaSlug) =>
        LOCATION_AREA_OPTIONS.find((l) => l.value === areaSlug)?.shortLabel ||
        areaSlug
    )
    .join(' · ');

  return (
    <>
      <HeritageStrip />
      <Header />
      <main className="w-full bg-brand-ivory min-h-screen py-8">
        <div className="ay-container">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-text-secondary text-xs mb-6"
          >
            <Link
              href="/"
              className="hover:text-brand-green transition-colors font-medium"
            >
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px] text-text-muted">
              chevron_right
            </span>
            <Link
              href="/vendors"
              className="hover:text-brand-green transition-colors font-medium"
            >
              Find Vendors
            </Link>
            <span className="material-symbols-outlined text-[14px] text-text-muted">
              chevron_right
            </span>
            <Link
              href={`/vendors?category=${vendor.category}&location=hyderabad`}
              className="hover:text-brand-green transition-colors font-medium"
            >
              {vendor.categoryLabel}
            </Link>
            <span className="material-symbols-outlined text-[14px] text-text-muted">
              chevron_right
            </span>
            <span className="text-brand-green font-semibold">
              {vendor.businessName}
            </span>
          </nav>

          {/* Main Vendor Details Card */}
          <div className="bg-brand-white rounded-2xl border border-border-default shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Image Column */}
            <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto min-h-[320px] bg-brand-ivory">
              <Image
                src={
                  vendor.portfolioImages[0] || '/images/luxury_wedding_decor.png'
                }
                alt={`${vendor.businessName} portfolio showcase`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand-green/90 text-brand-white backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold">
                <span className="material-symbols-outlined text-[15px] text-brand-gold">
                  {vendor.specialtyIcon}
                </span>
                <span>{vendor.specialtyBadge}</span>
              </div>
            </div>

            {/* Right Details Column */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  {vendor.verified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FFDEA6] bg-brand-green px-2.5 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[14px] text-brand-gold">
                        verified
                      </span>
                      <span>Ayojan Verified Partner</span>
                    </span>
                  ) : (
                    <span className="badge badge-gold">
                      {vendor.categoryLabel}
                    </span>
                  )}

                  {typeof vendor.rating === 'number' &&
                  typeof vendor.reviewCount === 'number' &&
                  vendor.reviewCount > 0 ? (
                    <div className="flex items-center gap-1 text-sm font-semibold text-brand-green">
                      <span
                        className="material-symbols-outlined text-[17px] text-brand-gold"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span>{vendor.rating.toFixed(1)}</span>
                      <span className="text-text-secondary font-normal text-xs">
                        ({vendor.reviewCount} reviews)
                      </span>
                    </div>
                  ) : null}
                </div>

                <h1 className="text-h1 text-brand-green font-bold">
                  {vendor.businessName}
                </h1>

                <p className="text-body text-text-secondary flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-brand-gold-dark">
                    location_on
                  </span>
                  <span>
                    {vendor.location} · {vendor.categoryLabel}
                  </span>
                </p>

                <p className="text-body text-text-primary mt-4 leading-relaxed">
                  {vendor.description}
                </p>

                {/* Services & Specialities */}
                <div className="mt-5">
                  <span className="text-badge text-text-secondary uppercase tracking-wider block mb-2">
                    Services &amp; Specialities Included
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.services.map((srv) => (
                      <span
                        key={srv}
                        className="bg-brand-ivory border border-border-default text-text-primary text-xs px-2.5 py-1 rounded-md font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Areas Served */}
                <div className="mt-4">
                  <span className="text-badge text-text-secondary uppercase tracking-wider block mb-1">
                    Hyderabad Service Areas
                  </span>
                  <p className="text-small text-text-secondary">{areaLabels}</p>
                </div>
              </div>

              {/* Pricing Box & Actions */}
              <div className="pt-5 border-t border-border-default flex flex-col gap-4">
                <div className="bg-brand-ivory border border-border-default rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-badge text-text-secondary uppercase block">
                      {vendor.priceCaption} ({vendor.priceTypeLabel})
                    </span>
                    <span className="text-h3 text-brand-green font-bold">
                      {vendor.priceDisplay}
                    </span>
                  </div>
                  <span className="badge badge-green">Zero Commission</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <VendorDetailActions
                    vendorId={vendor.id}
                    businessName={vendor.businessName}
                  />
                  <Link href="/vendors" className="btn btn-md btn-outline">
                    Back to Results
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <EnquiryModal />
    </>
  );
}
