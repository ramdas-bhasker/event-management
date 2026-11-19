/**
 * AyojanSetu – Static Homepage Content & All-Events Marketplace Constants
 */

import type {
  DropdownOption,
  EventTypeFilter,
  FeaturedVendor,
  HowItWorksStep,
  MegaMenuCategoryItem,
  MegaMenuVendorItem,
  MicroMarketId,
  OccasionCategory,
  PopularServiceItem,
  ServiceId,
  TrendingSearchTag,
  WhyFeatureItem,
  WhyPledgeItem,
} from '@/types';

export const EVENT_TYPE_FILTER_PILLS: EventTypeFilter[] = [
  'All Events',
  'Weddings',
  'Birthdays',
  'Corporate Events',
  'Family Functions',
  'Traditional Functions',
  'Private Celebrations',
];

export const EXPLORE_VENDORS_MEGA_LINKS: MegaMenuVendorItem[] = [
  {
    id: 'decorators',
    label: 'Decorators',
    icon: 'yard',
    href: '#featured-vendors',
    serviceId: 'decorators',
  },
  {
    id: 'photographers-videographers',
    label: 'Photographers & Videographers',
    icon: 'photo_camera',
    href: '#featured-vendors',
    serviceId: 'photography',
  },
  {
    id: 'caterers',
    label: 'Caterers',
    icon: 'restaurant',
    href: '#featured-vendors',
    serviceId: 'catering',
  },
  {
    id: 'venues-banquets',
    label: 'Venues & Banquets',
    icon: 'apartment',
    href: '#featured-vendors',
    serviceId: 'venue',
  },
  {
    id: 'makeup-artists',
    label: 'Makeup Artists',
    icon: 'face_retouching_natural',
    href: '#featured-vendors',
    serviceId: 'makeup',
  },
  {
    id: 'event-planners',
    label: 'Event Planners',
    icon: 'event_note',
    href: '#featured-vendors',
    serviceId: 'planners',
  },
  {
    id: 'djs-entertainment',
    label: 'DJs & Entertainment',
    icon: 'graphic_eq',
    href: '#featured-vendors',
    serviceId: 'dj',
  },
  {
    id: 'florists-gifts',
    label: 'Florists & Gifts',
    icon: 'local_florist',
    href: '#featured-vendors',
    serviceId: 'florists',
  },
];

export const EVENT_CATEGORIES_MEGA_LINKS: MegaMenuCategoryItem[] = [
  {
    id: 'weddings-engagements',
    label: 'Weddings & Engagements',
    icon: 'favorite',
    href: '#event-categories',
    eventFilter: 'Weddings',
  },
  {
    id: 'birthdays-milestones',
    label: 'Birthdays & Milestones',
    icon: 'cake',
    href: '#event-categories',
    eventFilter: 'Birthdays',
  },
  {
    id: 'corporate-events',
    label: 'Corporate Events',
    icon: 'business_center',
    href: '#event-categories',
    eventFilter: 'Corporate Events',
  },
  {
    id: 'traditional-functions',
    label: 'Traditional Functions',
    icon: 'auto_awesome',
    href: '#event-categories',
    eventFilter: 'Traditional Functions',
  },
  {
    id: 'housewarming-poojas',
    label: 'Housewarming & Poojas',
    icon: 'self_improvement',
    href: '#event-categories',
    eventFilter: 'Traditional Functions',
  },
  {
    id: 'anniversaries-jubilees',
    label: 'Anniversaries & Jubilees',
    icon: 'wine_bar',
    href: '#event-categories',
    eventFilter: 'Family Functions',
  },
  {
    id: 'baby-showers-naming',
    label: 'Baby Showers & Naming Ceremonies',
    icon: 'child_care',
    href: '#event-categories',
    eventFilter: 'Family Functions',
  },
  {
    id: 'private-parties-social',
    label: 'Private Parties & Social Gatherings',
    icon: 'nightlife',
    href: '#event-categories',
    eventFilter: 'Private Celebrations',
  },
];

export const SERVICE_TYPE_OPTIONS: DropdownOption<ServiceId>[] = [
  { value: 'all', label: 'All Services', icon: 'apps' },
  { value: 'decorators', label: 'Decorators', icon: 'yard' },
  {
    value: 'photography',
    label: 'Photographers & Videographers',
    icon: 'photo_camera',
  },
  { value: 'catering', label: 'Caterers', icon: 'restaurant' },
  { value: 'venue', label: 'Venues & Banquets', icon: 'apartment' },
  { value: 'makeup', label: 'Makeup Artists', icon: 'face_retouching_natural' },
  { value: 'planners', label: 'Event Planners', icon: 'event_note' },
  { value: 'dj', label: 'DJs & Entertainment', icon: 'graphic_eq' },
  { value: 'florists', label: 'Florists & Gifts', icon: 'local_florist' },
];

export const MICRO_MARKET_OPTIONS: DropdownOption<MicroMarketId>[] = [
  { value: 'all', label: 'All Hyderabad', icon: 'public' },
  { value: 'banjara', label: 'Banjara Hills', icon: 'location_city' },
  { value: 'jubilee', label: 'Jubilee Hills', icon: 'diamond' },
  { value: 'gachibowli', label: 'Gachibowli', icon: 'domain' },
  { value: 'madhapur', label: 'Madhapur & Hitec', icon: 'corporate_fare' },
  { value: 'secunderabad', label: 'Secunderabad', icon: 'account_balance' },
  { value: 'kondapur', label: 'Kondapur', icon: 'pin_drop' },
];

export const TRENDING_SEARCH_TAGS: TrendingSearchTag[] = [
  {
    label: 'Stage & Event Decorators',
    serviceId: 'decorators',
    href: '#featured-vendors',
  },
  {
    label: 'Hyderabad Caterers',
    serviceId: 'catering',
    href: '#featured-vendors',
  },
  {
    label: 'Event Photography',
    serviceId: 'photography',
    href: '#featured-vendors',
  },
  {
    label: 'Banquet Halls & Lawns',
    serviceId: 'venue',
    href: '#featured-vendors',
  },
];

export const OCCASION_CATEGORIES: OccasionCategory[] = [
  {
    id: 'weddings-engagements',
    title: 'Weddings & Engagements',
    description:
      'Mandap setups, ring ceremony stages, floral backdrops, catering, and full wedding planning.',
    pillLabel: 'Weddings',
    ctaLabel: 'Browse Specialists',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIcg5uX5Fj1NvUrbI4BbwWLUsmc0E_vx5EGoSqKfAxxI8TSaAVhHGr1kw7Kr3yKUcB8ttIdP5vUJYcmsMuFGpBmkgIImuv7D0hcxIRfbAmmAjDNdw9r9dTaedUauh0QEsGlPkCsyWxcOcCB8DMjF9y7lRPwJ5yl9uoKw17GoKbeXrsl1ms6Cmhr2iaQPRI4TXLZEkRE5QATd0VfKkgF29uoaYylQt7uQ7IoLwehbQ',
    imageAlt: 'Traditional Indian wedding and engagement stage setup in Hyderabad',
    href: '#featured-vendors',
    eventFilter: 'Weddings',
  },
  {
    id: 'birthdays-milestones',
    title: 'Birthdays & Milestones',
    description:
      'Themed decor, first birthdays, milestone celebrations, custom cakes, and family entertainment.',
    pillLabel: 'Milestones',
    ctaLabel: 'Browse Specialists',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC7nmhQd-s-TSeFzH9E_yspmXeZ8r9DURuVX0xJ6xUPeRluxIZTE3IXQo7SWPLWu0JVHIZcZg_LZSGyX0MLLXYnRlQvOVBYwZIKPW0rXDpGC0y0Sh_XzSYNe0d2WYYAvTemYx9EO-N_nIRFRYHc0mzrDuEHOdOV649bfjOiS3Zk9EaSgWVqsPomIc1lga8JA2Ms7aF-Fqb0oPYLh0K_7uIRjAJ75H333jfMOHwglBU',
    imageAlt:
      'Birthday party celebration setup in Hyderabad with custom backdrop and lighting',
    href: '#featured-vendors',
    eventFilter: 'Birthdays',
  },
  {
    id: 'corporate-events',
    title: 'Corporate Events',
    description:
      'Conferences, product launches, annual day galas, AV production, and executive catering.',
    pillLabel: 'Corporate',
    ctaLabel: 'Browse Specialists',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfZDCfPVJmqBn7LwfGma0wmJBQqEGWvIVmwubvNRIZuw7Mq_2sQIj7zRFw8IWf5Lbe0LWz2EhbMPK9mNtTULj89a5u4-rtfzDjHvGNFsGo55lTStYAQZuErv0sEwpM2pVdo12QqiOQ2rUu58wpbu0seiyJCnaV7FBC7VuD_oo7RqfJA-q-qC2B2d7zh8t6s8XVk5oPidkLx8NzM9fK6p4VR0STjZBBAsvr8rWXbk8',
    imageAlt: 'Corporate conference and gala stage setup in Hyderabad',
    href: '#featured-vendors',
    eventFilter: 'Corporate Events',
  },
  {
    id: 'traditional-functions',
    title: 'Traditional Functions',
    description:
      'Half Saree (Langa Voni), Dhoti ceremonies, Upanayanam, and cultural family gatherings.',
    pillLabel: 'Heritage',
    ctaLabel: 'Browse Specialists',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAm1Qrq_FjWG7liWeMyl3KboGxmFiXVeE7xaEFUkb0wmQd0OZEU8c572XWH-YEGIJob6boVnCSwi_901t3-0fHQDB-p4mpRgqHGyo_r09n_UCIIhPaIvCz9fOf9g_DVeg4la7oIoN-snAGwurCXh4rhXKrTmXQwH9cu63NYxRQGakB8oY-AJnlFVfz7yTHhqp8VrcUAD5OvfROnmstAhFLq3axr3ypX4ZF--4Lwhrk',
    imageAlt:
      'Traditional South Indian Half Saree and family ceremony floral decor in Hyderabad',
    href: '#featured-vendors',
    eventFilter: 'Traditional Functions',
  },
  {
    id: 'housewarming-poojas',
    title: 'Housewarming & Poojas',
    description:
      'Griha Pravesh floral thresholds, Satyanarayana Swamy Vratham setups, and traditional feasts.',
    pillLabel: 'Auspicious',
    ctaLabel: 'Browse Specialists',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJFfioaw2moNdshPzjx5XaPWBj0Yt7JnJdf2S0TRYZnZ_H4wz8ku2SkTUskjg8hBY8aZhi4crmAZ-ZV1q2j2j7yOLRoNR8xujsH2HSBLWESxptvyYQ_JcPLMdMCZEfggSPVWkmFOc1WTW9C3Mt7WdM15kCktpy-a4BloGgsAwkjbKnRaTesYy6E6oNlWQNHNCnMZDN4d-tbqef1dmcsT34m5d1l5Plx-ADkH_xGQg',
    imageAlt:
      'Griha Pravesh housewarming marigold and mango leaf entrance decor in Hyderabad',
    href: '#featured-vendors',
    eventFilter: 'Traditional Functions',
  },
  {
    id: 'anniversaries-jubilees',
    title: 'Anniversaries & Jubilees',
    description:
      'Silver & golden jubilee tributes, intimate dining setups, live music, and family portraits.',
    pillLabel: 'Celebrations',
    ctaLabel: 'Browse Specialists',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAONWoNEl3jGyvskTXo1aPA5KCSb8xGDAwsSpOg9uUlMA6a-AwPGyWpsIQumMFLhm1YgmXqAsahZxdv-M_9agYQBLJwH1C6AV7gPYdJLgEdofis-yU8E3bs9bqLn04USCIrvqCVrPybMbPh4YN6l9WFyQnrddw5AN1ymNpjtgwxQrmC_Yi7-9RZQ66NFAYrSTjcCPt27jAlSTOxi-7iRsjtqNeDjEdZK-CPxuhjNoU',
    imageAlt: 'Silver jubilee anniversary evening dinner setup on a Hyderabad lawn',
    href: '#featured-vendors',
    eventFilter: 'Family Functions',
  },
  {
    id: 'baby-showers-naming-ceremonies',
    title: 'Baby Showers & Naming Ceremonies',
    description:
      'Seemantham floral backdrops, Barasala cradle styling, pastel stages, and photography.',
    pillLabel: 'Family',
    ctaLabel: 'Browse Specialists',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAnNyJPDNfFuJS4WMWWPbvZh1ll-bbwP3ZD8vUHqkEaiO4al_ZwBh9khsBbiAdpLAmF1ej3cJxStze6igW_H7tnG-81LrEqNy2tOaB_ISIQB0kB67zRXo2jgJret9XTDUKfZYFd8GTRt_Q9cRn_aSMCszxS29FyS-XAF52fudGy29uB9yq72NlYO_cdgzJVHo7Aw2C4FfrRYmJm-rP3zfkV7lVgQqlYUYusqEvsoxg',
    imageAlt: 'Traditional cradle ceremony and baby shower stage decor in Hyderabad',
    href: '#featured-vendors',
    eventFilter: 'Family Functions',
  },
  {
    id: 'private-parties-social-gatherings',
    title: 'Private Parties & Social Gatherings',
    description:
      'Sangeet nights, cocktail dinners, farmhouse get-togethers, DJs, and live food counters.',
    pillLabel: 'Social',
    ctaLabel: 'Browse Specialists',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAq_OhXurhXxQM7dgYHDgp0-fgQlGnZHK-sgJes1gWFrXSx25n4d_WGEAI7_aG382e6YWtc_snLk5X_605nPvn1xUxCEM7NPXRKTUD-j8hvWUfdheomhuZnza0fIBAHSUH3_M7BvOfkQjNuPjtII2zFhlPV0ZSKsfNY77bv7EddU9Pf7Q28KHw92nBwfZUw7BUt4mva-VrLQCn8lRtqUUJqMJ_O97FF0MKsnkGk2xY',
    imageAlt:
      'Evening social gathering and private party lighting with DJ console in Hyderabad',
    href: '#featured-vendors',
    eventFilter: 'Private Celebrations',
  },
];

export const POPULAR_SERVICES: PopularServiceItem[] = [
  {
    id: 'decorators',
    title: 'Decorators',
    subtitle: 'Stage, Floral & Theme Styling',
    icon: 'yard',
    href: '#featured-vendors',
    serviceId: 'decorators',
  },
  {
    id: 'photographers-videographers',
    title: 'Photographers & Videographers',
    subtitle: 'Candid, Traditional & Event Films',
    icon: 'photo_camera',
    href: '#featured-vendors',
    serviceId: 'photography',
  },
  {
    id: 'caterers',
    title: 'Caterers',
    subtitle: 'Multi-Cuisine & Regional Menus',
    icon: 'restaurant',
    href: '#featured-vendors',
    serviceId: 'catering',
  },
  {
    id: 'venues-banquets',
    title: 'Venues & Banquets',
    subtitle: 'Halls, Lawns & Convention Spaces',
    icon: 'apartment',
    href: '#featured-vendors',
    serviceId: 'venue',
  },
  {
    id: 'makeup-artists',
    title: 'Makeup Artists',
    subtitle: 'Bridal, Party & Family Styling',
    icon: 'face_retouching_natural',
    href: '#featured-vendors',
    serviceId: 'makeup',
  },
  {
    id: 'event-planners',
    title: 'Event Planners',
    subtitle: 'End-to-End Event Coordination',
    icon: 'event_note',
    href: '#featured-vendors',
    serviceId: 'planners',
  },
  {
    id: 'djs-entertainment',
    title: 'DJs & Entertainment',
    subtitle: 'Sound, Lighting, Live Bands & MCs',
    icon: 'graphic_eq',
    href: '#featured-vendors',
    serviceId: 'dj',
  },
  {
    id: 'florists-gifts',
    title: 'Florists & Gifts',
    subtitle: 'Garlands, Hampers & Return Gifts',
    icon: 'local_florist',
    href: '#featured-vendors',
    serviceId: 'florists',
  },
];

export const FEATURED_VENDORS: FeaturedVendor[] = [
  {
    id: 'sri-venkateswara-event-stage-decor',
    name: 'Sri Venkateswara Event & Stage Decor',
    categoryLabel: 'Decorators',
    categoryIcon: 'yard',
    serviceId: 'decorators',
    locationId: 'banjara',
    location: 'Banjara Hills, Hyderabad',
    priceCaption: 'Starting Price Range (Sample)',
    priceValue: '₹35,000 – ₹1,80,000 / event',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBDnf0pqvNFVNguHktd6Iy_b-898ujhGo97JqrfPErxFjQE2MEnA2w_veSS8eVnPcBWp1PBvGMtr74XkyqA0psdV9nJ2YeKGgOFqK4zEqz395DHQF9ug9LsW53Mdg2PaPluXRRvcUPC9nh77UYjaRht3FDkud3pmxht9SndN2-tb5GowPLZCszqoRZ9-Zfi4hrEuQFqJNigljy4U7f54hkQ6EnWbCQRViGREdtACyk',
    imageAlt: 'Sri Venkateswara Event & Stage Decor floral stage backdrop in Hyderabad',
    badgeLabel: 'Sample Listing',
    verificationStatus: 'Sample Profile · Verification Pending Live Onboarding',
    about:
      'Sample decorator listing specializing in customizable stage backdrops, floral installations, entrance arches, and ambient lighting for weddings, birthdays, and family ceremonies across Hyderabad.',
  },
  {
    id: 'deccan-royal-feast-catering',
    name: 'Deccan Royal Feast & Catering',
    categoryLabel: 'Caterers',
    categoryIcon: 'restaurant',
    serviceId: 'catering',
    locationId: 'madhapur',
    location: 'Madhapur, Hyderabad',
    priceCaption: 'Starting Price (Sample)',
    priceValue: '₹550 / Plate onwards',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeGyvRr7IvYlFCEJicZ9JZIDHK8ZvVUJqELjNF0WUIKawbQzZiqtTkwH7dH5YHaiOT_8mCsHHvOQpObaSxO_GMPaS3zTbzv17ATvdhJ9cm-jLPC2SUcO7Coj6NzLRNKzQZ1QOVjtZkB9gfOJWDIBJvoQeh8sswlVROk1-NgGkl6BbMQpR9X9hlsYvbKMYV6NcBKB6cU-CveIUJSvyfHWHpIeJd3Sy0VdpAx1CudO8',
    imageAlt: 'Deccan Royal Feast & Catering buffet counter setup in Hyderabad',
    badgeLabel: 'Sample Listing',
    verificationStatus: 'Sample Profile · Verification Pending Live Onboarding',
    about:
      'Sample catering service profile offering customizable vegetarian and non-vegetarian menus, live counters, corporate buffet setups, and traditional sit-down spreads.',
  },
  {
    id: 'moments-event-photography-films',
    name: 'Moments Event Photography & Films',
    categoryLabel: 'Photographers & Videographers',
    categoryIcon: 'photo_camera',
    serviceId: 'photography',
    locationId: 'jubilee',
    location: 'Jubilee Hills, Hyderabad',
    priceCaption: 'Starting Price Range (Sample)',
    priceValue: '₹25,000 – ₹1,20,000 / event',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDnxEsFymGjvYUDaBL4tX6-ooqBIROo_hTji4KMQ64-Dk5cj0G56qv-vIj-y-yMCIEC1aYxEoh4Q_hu8kgZixE3vOgqIeSCBtO7GG3Hil8vLj-p0YHZ-WOZl3ABD0L-E2Qz0faK1cWGfOj-qUH--Mid8rMTzeq-cJ94bzdt8uAgOrGAbEbcmZMQzFiH3jn6ApBz7wMxXFoVsVxX4b94ot18DomSGwRY6LFtOIuVaM',
    imageAlt:
      'Moments Event Photography & Films candid celebration photography in Hyderabad',
    badgeLabel: 'Sample Listing',
    verificationStatus: 'Sample Profile · Verification Pending Live Onboarding',
    about:
      'Sample photography and videography studio covering birthday milestones, corporate events, family ceremonies, and multi-day wedding celebrations across Hyderabad.',
  },
  {
    id: 'siri-floral-styling-celebration-gifts',
    name: 'Siri Floral Styling & Celebration Gifts',
    categoryLabel: 'Florists & Gifts',
    categoryIcon: 'local_florist',
    serviceId: 'florists',
    locationId: 'gachibowli',
    location: 'Gachibowli, Hyderabad',
    priceCaption: 'Starting Price (Sample)',
    priceValue: '₹15,000 / event onwards',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCr6W3HAV8WbwZXj5PcHhoAlmDdlYCJ2K0qWmYzqsAbnNJ3YDwC4PWGTgBA0KvH0TBQFqgs7ANW0z5YK7Xg3nLVNzdLqDq4LqX9lcuTL6zPWFYgtHch1T_JRYy_k_2E7q2W_9pZPsEwq2SIjkCShKYyB-jR1g1Hy--jnmLhRjxNVkTMeMJAbMlqHyn0D0BZZV3sHVxOf0IxnI5bY-esAdZFD3fU8T_TxdFqUDJSr7I',
    imageAlt:
      'Siri Floral Styling & Celebration Gifts traditional floral backdrop in Gachibowli',
    badgeLabel: 'Sample Listing',
    verificationStatus: 'Sample Profile · Verification Pending Live Onboarding',
    about:
      'Sample florist and event gifting studio offering fresh flower backdrops, housewarming floral thresholds, custom garlands, and curated guest return gift hampers.',
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    number: '01',
    icon: 'travel_explore',
    title: 'Discover Vendors',
    description:
      'Browse Hyderabad event professionals by occasion, service category, locality, and budget requirements.',
    trustBadge: 'Organized by service & locality',
  },
  {
    number: '02',
    icon: 'balance',
    title: 'Compare Services',
    description:
      'Review service inclusions, starting price ranges, portfolio photos, and availability before making a shortlist.',
    trustBadge: 'Clear starting prices & quotes',
  },
  {
    number: '03',
    icon: 'connect_without_contact',
    title: 'Contact & Finalize',
    description:
      'Send an enquiry or connect directly via WhatsApp and phone to discuss custom requirements and finalize your booking.',
    trustBadge: 'Direct WhatsApp & phone connection',
  },
];

export const WHY_PLEDGE_ITEMS: WhyPledgeItem[] = [
  {
    icon: 'location_city',
    title: 'Neighborhood-First Discovery',
    description:
      'Find vendors serving Banjara Hills, Jubilee Hills, Gachibowli, Madhapur, Secunderabad, and surrounding areas.',
  },
  {
    icon: 'event_available',
    title: 'Built for All Event Scales',
    description:
      'From 30-guest family gatherings to large convention hall receptions and corporate summits.',
  },
  {
    icon: 'handshake',
    title: 'Straightforward Communication',
    description:
      'Speak directly with event service providers to customize packages around your family or company needs.',
  },
];

export const WHY_FEATURE_ITEMS: WhyFeatureItem[] = [
  {
    icon: 'travel_explore',
    title: 'Local Hyderabad Vendor Discovery',
    description:
      'Discover decorators, caterers, photographers, venues, makeup artists, and planners operating across Hyderabad’s key neighborhoods.',
  },
  {
    icon: 'receipt_long',
    title: 'Transparent Starting Prices & Quotations',
    description:
      'View clear starting price ranges on vendor profiles and request custom quotations tailored to your guest count and event requirements.',
  },
  {
    icon: 'verified_user',
    title: 'Portfolio & Business Verification',
    description:
      'Vendor profiles highlight business details, service categories, and past work portfolios so you can evaluate quality with confidence.',
  },
  {
    icon: 'mark_chat_unread',
    title: 'Direct WhatsApp & Phone Connections',
    description:
      'Connect directly with event professionals via WhatsApp or phone to discuss dates, themes, menu tastes, and venue layouts.',
  },
  {
    icon: 'compare_arrows',
    title: 'Compare Multiple Vendors Before Deciding',
    description:
      'Shortlist your favorite service providers, compare inclusions side by side, and choose the right team for your occasion without pressure.',
    spanTwo: true,
  },
];

export const ENQUIRY_OCCASION_OPTIONS: DropdownOption<string>[] = [
  {
    value: 'Weddings & Engagements',
    label: 'Weddings & Engagements',
    icon: 'favorite',
  },
  {
    value: 'Birthdays & Milestones',
    label: 'Birthdays & Milestones',
    icon: 'cake',
  },
  {
    value: 'Corporate Events',
    label: 'Corporate Events',
    icon: 'business_center',
  },
  {
    value: 'Traditional Functions',
    label: 'Traditional Functions',
    icon: 'auto_awesome',
  },
  {
    value: 'Housewarming & Poojas',
    label: 'Housewarming & Poojas',
    icon: 'self_improvement',
  },
  {
    value: 'Anniversaries & Jubilees',
    label: 'Anniversaries & Jubilees',
    icon: 'wine_bar',
  },
  {
    value: 'Baby Showers & Naming Ceremonies',
    label: 'Baby Showers & Naming Ceremonies',
    icon: 'child_care',
  },
  {
    value: 'Private Parties & Social Gatherings',
    label: 'Private Parties & Social Gatherings',
    icon: 'nightlife',
  },
];

export const ENQUIRY_PREFERRED_DATE_OPTIONS: DropdownOption<string>[] = [
  { value: 'Flexible Dates', label: 'Flexible Dates', icon: 'calendar_month' },
  { value: 'This Weekend', label: 'This Weekend', icon: 'event' },
  { value: 'Within 2 Weeks', label: 'Within 2 Weeks', icon: 'date_range' },
  { value: 'Next Month', label: 'Next Month', icon: 'calendar_today' },
  { value: 'In 2–3 Months', label: 'In 2–3 Months', icon: 'schedule' },
];
