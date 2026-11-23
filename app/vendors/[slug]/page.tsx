import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeritageStrip } from '@/components/layout/HeritageStrip';
import { VendorDetailActions } from '@/components/vendors/VendorDetailActions';
import { VendorListingCard } from '@/components/vendors/VendorListingCard';
import { VendorPortfolioGallery } from '@/components/vendors/VendorPortfolioGallery';
import { LOCATION_AREA_OPTIONS, MOCK_VENDORS } from '@/data/mock-vendors';
import { FEATURED_VENDORS } from '@/lib/constants';

interface VendorDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getResultsHref(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && value) query.set(key, value);
    else if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
  }
  const suffix = query.toString();
  return suffix ? `/vendors?${suffix}` : '/vendors';
}

function findVendor(slug: string) {
  const slugAliases: Record<string, string> = {
    'moments-event-photography': 'moments-event-photography-films',
  };
  const canonicalSlug = slugAliases[slug] ?? slug;
  return MOCK_VENDORS.find((item) => item.slug === canonicalSlug);
}

function findFeaturedVendor(slug: string) {
  return FEATURED_VENDORS.find((item) => item.id === slug);
}

export async function generateMetadata({ params }: VendorDetailPageProps) {
  const { slug } = await params;
  const vendor = findVendor(slug);
  const featuredVendor = findFeaturedVendor(slug);
  return {
    title: vendor ? `${vendor.businessName} | AyojanSetu` : featuredVendor ? `${featuredVendor.name} | AyojanSetu` : 'Vendor not found | AyojanSetu',
    description: vendor?.description ?? featuredVendor?.about ?? 'Explore event vendors on AyojanSetu.',
  };
}

export default async function VendorDetailPage({ params, searchParams }: VendorDetailPageProps) {
  const [{ slug }, queryParams] = await Promise.all([params, searchParams]);
  const vendor = findVendor(slug);
  const featuredVendor = vendor ? undefined : findFeaturedVendor(slug);
  if (!vendor && !featuredVendor) notFound();

  if (featuredVendor) {
    const resultsHref = getResultsHref(queryParams);
    return (
      <>
        <HeritageStrip />
        <Header />
        <main className="min-h-screen w-full bg-brand-ivory py-8 pb-24 lg:pb-8">
          <div className="ay-container">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
              <Link href="/" className="font-medium hover:text-brand-green">Home</Link><span aria-hidden="true">›</span>
              <Link href={resultsHref} className="font-medium hover:text-brand-green">Find Vendors</Link><span aria-hidden="true">›</span>
              <span className="font-semibold text-brand-green" aria-current="page">{featuredVendor.name}</span>
            </nav>
            <VendorPortfolioGallery images={[featuredVendor.imageUrl]} name={featuredVendor.name} />
            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="rounded-2xl bg-brand-white p-6 shadow-sm sm:p-8">
                <span className="badge badge-gold">{featuredVendor.badgeLabel}</span>
                <h1 className="mt-4 text-h1 font-bold text-brand-green">{featuredVendor.name}</h1>
                <p className="mt-2 text-sm text-text-secondary">{featuredVendor.categoryLabel} · {featuredVendor.location}</p>
                <p className="mt-5 leading-relaxed text-text-primary">{featuredVendor.about}</p>
                <div className="mt-6 rounded-xl border border-border-default bg-brand-ivory p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">Profile status</p>
                  <p className="mt-1 text-sm text-text-secondary">{featuredVendor.verificationStatus}</p>
                  <p className="mt-3 text-sm text-text-secondary">Detailed services and package information are not available in this sample listing yet.</p>
                </div>
              </div>
              <aside className="lg:sticky lg:top-6">
                <div className="rounded-2xl border border-border-default bg-brand-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-text-secondary">{featuredVendor.priceCaption}</p>
                  <p className="mb-5 mt-1 text-2xl font-bold text-brand-green">{featuredVendor.priceValue}</p>
                  <Link href={`/enquiry?vendorId=${encodeURIComponent(featuredVendor.id)}`} className="btn btn-md btn-primary">Request Quotation</Link>
                  <Link href={resultsHref} className="mt-5 inline-flex text-sm font-semibold text-brand-green underline underline-offset-4">Back to Search</Link>
                </div>
              </aside>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  if (!vendor) notFound();

  const areaLabels = vendor.serviceAreas.map((areaSlug) => LOCATION_AREA_OPTIONS.find((area) => area.value === areaSlug)?.shortLabel || areaSlug).join(' · ');
  const resultsHref = getResultsHref(queryParams);
  const similarVendors = MOCK_VENDORS.filter((candidate) =>
    candidate.id !== vendor.id && candidate.category === vendor.category &&
    (candidate.locationSlug === vendor.locationSlug || candidate.serviceAreas.some((area) => vendor.serviceAreas.includes(area)))
  ).slice(0, 4);
  const eventLabels = vendor.eventCategories.map((event) => event.replaceAll('-', ' '));

  return (
    <>
      <HeritageStrip />
      <Header />
      <main className="min-h-screen w-full bg-brand-ivory py-8 pb-24 lg:pb-8">
        <div className="ay-container">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
            <Link href="/" className="font-medium hover:text-brand-green">Home</Link><span aria-hidden="true">›</span>
            <Link href={resultsHref} className="font-medium hover:text-brand-green">Find Vendors</Link><span aria-hidden="true">›</span>
            <Link href={resultsHref} className="font-medium hover:text-brand-green">All Event Vendors</Link><span aria-hidden="true">›</span>
            <span className="font-semibold text-brand-green" aria-current="page">{vendor.businessName}</span>
          </nav>

          <VendorPortfolioGallery images={vendor.portfolioImages} name={vendor.businessName} />

          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              <section className="mb-8 rounded-2xl bg-brand-white p-6 shadow-sm sm:p-8">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  {vendor.verified && <span className="badge badge-green">Ayojan Verified</span>}
                  {typeof vendor.rating === 'number' && (vendor.reviewCount ?? 0) > 0 && <span className="text-sm font-semibold text-brand-green">★ {vendor.rating.toFixed(1)} <span className="font-normal text-text-secondary">({vendor.reviewCount} reviews)</span></span>}
                </div>
                <h1 className="text-h1 font-bold text-brand-green">{vendor.businessName}</h1>
                <p className="mt-2 text-sm text-text-secondary">{vendor.categoryLabel} · {vendor.location}</p>
                <p className="mt-5 leading-relaxed text-text-primary">{vendor.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">{vendor.services.map((service) => <span key={service} className="rounded-full border border-border-default bg-brand-ivory px-3 py-1 text-xs text-text-secondary">{service}</span>)}</div>
                <p className="mt-5 text-sm"><span className="font-semibold text-brand-green">Service areas: </span><span className="text-text-secondary">{areaLabels}</span></p>
              </section>

              <section className="mb-8 rounded-2xl bg-brand-white p-6 sm:p-8" aria-labelledby="about-vendor">
                <h2 id="about-vendor" className="text-h3 mb-3 text-brand-green">About the vendor</h2>
                <p className="leading-relaxed text-text-secondary">{vendor.description}</p>
                <h3 className="mt-6 text-sm font-semibold text-brand-green">Event specialities</h3>
                <p className="mt-2 capitalize text-sm text-text-secondary">{eventLabels.join(' · ')}</p>
                <h3 className="mt-5 text-sm font-semibold text-brand-green">Business location</h3>
                <p className="mt-2 text-sm text-text-secondary">{vendor.location}</p>
              </section>

              <section className="mb-8 rounded-2xl bg-brand-white p-6 sm:p-8" aria-labelledby="vendor-services">
                <h2 id="vendor-services" className="text-h3 mb-4 text-brand-green">Services &amp; packages</h2>
                <ul className="grid gap-x-6 sm:grid-cols-2">{vendor.services.map((service) => <li key={service} className="border-b border-border-default py-3 text-sm text-text-primary">{service}</li>)}</ul>
                <p className="mt-4 text-sm text-text-secondary">Package details are not listed. Contact the vendor for available packages.</p>
              </section>

              <section className="mb-8 rounded-2xl bg-brand-white p-6 sm:p-8" aria-labelledby="vendor-pricing">
                <h2 id="vendor-pricing" className="text-h3 mb-3 text-brand-green">Pricing information</h2>
                <p className="text-sm text-text-secondary">{vendor.priceCaption} · {vendor.priceTypeLabel}</p>
                <p className="mt-1 text-2xl font-bold text-brand-green">{vendor.priceDisplay || 'Request a custom quotation'}</p>
                <p className="mt-3 text-sm text-text-secondary">Final pricing depends on event requirements and vendor confirmation.</p>
              </section>

              <section className="mb-8 rounded-2xl bg-brand-white p-6 sm:p-8" aria-labelledby="vendor-reviews">
                <h2 id="vendor-reviews" className="text-h3 mb-3 text-brand-green">Customer reviews</h2>
                {typeof vendor.rating === 'number' && (vendor.reviewCount ?? 0) > 0 ? <p className="text-sm text-text-secondary">Rated <strong className="text-brand-green">{vendor.rating.toFixed(1)} / 5</strong> from {vendor.reviewCount} reviews. Individual review details are not available yet.</p> : <p className="text-sm text-text-secondary">Customer reviews are not available yet.</p>}
              </section>

              <section className="mb-8 rounded-2xl bg-brand-white p-6 sm:p-8" aria-labelledby="vendor-faqs">
                <h2 id="vendor-faqs" className="text-h3 mb-4 text-brand-green">Frequently asked questions</h2>
                <details className="border-b border-border-default py-3"><summary className="cursor-pointer font-semibold text-brand-green">Which events do you specialise in?</summary><p className="mt-2 capitalize text-sm text-text-secondary">{eventLabels.join(', ')}.</p></details>
                <details className="border-b border-border-default py-3"><summary className="cursor-pointer font-semibold text-brand-green">Which areas do you serve?</summary><p className="mt-2 text-sm text-text-secondary">{areaLabels || vendor.location}.</p></details>
                <details className="border-b border-border-default py-3"><summary className="cursor-pointer font-semibold text-brand-green">How can I request a quotation?</summary><p className="mt-2 text-sm text-text-secondary">Use the enquiry preview on this page. It will not be sent until an enquiry service is connected.</p></details>
                <details className="py-3"><summary className="cursor-pointer font-semibold text-brand-green">Are package details available?</summary><p className="mt-2 text-sm text-text-secondary">Contact the vendor through the enquiry preview for package details.</p></details>
              </section>
            </div>

            <aside className="hidden lg:sticky lg:top-6 lg:block">
              <div className="rounded-2xl border border-border-default bg-brand-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-text-secondary">{vendor.priceCaption} · {vendor.priceTypeLabel}</p>
                <p className="mb-5 mt-1 text-2xl font-bold text-brand-green">{vendor.priceDisplay}</p>
                <VendorDetailActions vendorId={vendor.id} vendorSlug={vendor.slug} businessName={vendor.businessName} />
                <p className="mt-4 text-xs leading-relaxed text-text-secondary">Complete the event form to prepare a temporary demo enquiry.</p>
                <Link href={resultsHref} className="mt-5 inline-flex text-sm font-semibold text-brand-green underline underline-offset-4">Back to Search</Link>
              </div>
            </aside>
          </div>

          <section className="mt-12" aria-labelledby="similar-vendors">
            <h2 id="similar-vendors" className="text-h2 mb-5 text-brand-green">Similar vendors</h2>
            {similarVendors.length > 0 ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">{similarVendors.map((item) => <VendorListingCard key={item.id} vendor={item} />)}</div> : <p className="text-sm text-text-secondary">No similar vendors are available yet.</p>}
          </section>
        </div>
      </main>
      <Footer />
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-border-default bg-brand-white p-3 lg:hidden">
        <span className="min-w-0 truncate text-sm font-bold text-brand-green">{vendor.priceDisplay}</span>
        <VendorDetailActions vendorId={vendor.id} vendorSlug={vendor.slug} businessName={vendor.businessName} />
      </div>
    </>
  );
}
