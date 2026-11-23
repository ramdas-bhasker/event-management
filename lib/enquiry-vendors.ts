import { FEATURED_VENDORS } from '@/lib/constants';
import { isActualServiceSpecialty, MOCK_VENDORS } from '@/data/mock-vendors';
import type { EnquiryVendor } from '@/types/enquiry-vendor';
import type { FeaturedVendor, ServiceId } from '@/types';
import type { VendorCategorySlug } from '@/types/vendor';

const FEATURED_CATEGORY: Record<ServiceId, Exclude<VendorCategorySlug, 'all'>> = {
  all: 'wedding-decorators',
  decorators: 'wedding-decorators',
  photography: 'wedding-photographers',
  catering: 'caterers',
  venue: 'event-venues',
  makeup: 'makeup-artists',
  planners: 'event-planners',
  dj: 'djs-and-entertainment',
  florists: 'wedding-decorators',
};

function getActualServices(services: string[]) {
  return Array.from(new Set(services.map((service) => service.trim()).filter(isActualServiceSpecialty)));
}

function getCategoryServices(category: Exclude<VendorCategorySlug, 'all'>, serviceId?: ServiceId) {
  let matchingVendors = MOCK_VENDORS.filter((vendor) => vendor.category === category);

  if (serviceId === 'florists') {
    matchingVendors = matchingVendors.filter((vendor) =>
      /floral|flower|florist|garland|gift/i.test(
        [vendor.businessName, vendor.description, ...vendor.services].join(' ')
      )
    );
  }

  return getActualServices(matchingVendors.flatMap((vendor) => vendor.services));
}

function normalizeFeaturedVendor(featured: FeaturedVendor): EnquiryVendor {
  const matchingRecord = MOCK_VENDORS.find((vendor) => vendor.businessName === featured.name);

  if (matchingRecord) {
    return {
      id: matchingRecord.slug,
      businessName: matchingRecord.businessName,
      category: matchingRecord.category,
      categoryLabel: matchingRecord.categoryLabel,
      location: matchingRecord.location,
      priceDisplay: matchingRecord.priceDisplay,
      portfolioImages: matchingRecord.portfolioImages,
      services: getActualServices(matchingRecord.services),
      profileHref: `/vendors/${matchingRecord.slug}`,
    };
  }

  const category = FEATURED_CATEGORY[featured.serviceId];
  const categoryServices = getCategoryServices(category, featured.serviceId);

  return {
    id: featured.id,
    businessName: featured.name,
    category,
    categoryLabel: featured.categoryLabel,
    location: featured.location,
    priceDisplay: featured.priceValue,
    portfolioImages: [featured.imageUrl],
    services: categoryServices,
    servicesNote: categoryServices.length
      ? 'Choose from services listed by vendors in this category, or describe a specific need under Other requirements.'
      : 'No services are listed for this vendor category yet. You can describe what you need under Other requirements.',
    profileHref: `/vendors/${featured.id}`,
  };
}

export function findEnquiryVendor(id: string): EnquiryVendor | undefined {
  const record = MOCK_VENDORS.find((vendor) => vendor.id === id || vendor.slug === id);
  if (record) {
    return {
      id: record.slug,
      businessName: record.businessName,
      category: record.category,
      categoryLabel: record.categoryLabel,
      location: record.location,
      priceDisplay: record.priceDisplay,
      portfolioImages: record.portfolioImages,
      services: getActualServices(record.services),
      profileHref: `/vendors/${record.slug}`,
    };
  }
  const featured = FEATURED_VENDORS.find((vendor) => vendor.id === id);
  return featured ? normalizeFeaturedVendor(featured) : undefined;
}
