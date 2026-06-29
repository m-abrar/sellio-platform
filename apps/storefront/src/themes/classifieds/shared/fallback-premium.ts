import type { ClassifiedListing } from '@/types';

export const PREMIUM_FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Global SaaS Platform & API",
    slug: "global-saas-platform-api",
    description: "Recurring revenue subscription model with high-margin customer base and fully automated delivery workflow.",
    pricing: {
      base_price: 2500000,
      sale_price: 2500000,
      is_on_sale: false,
      discount: null,
      formatted: "$2,500,000",
      formatted_short: "$2.5M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Fully Remote",
      state: "Global"
    },
    taxonomy: {
      category: "tech"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400"
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: true,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 2,
    title: "Upscale Urban Health Club",
    slug: "upscale-urban-health-club",
    description: "Established high-tier brand in a fast-growing metropolitan area with stable recurring memberships.",
    pricing: {
      base_price: 950000,
      sale_price: 950000,
      is_on_sale: false,
      discount: null,
      formatted: "$950,000",
      formatted_short: "$950K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "New York City",
      state: "NY"
    },
    taxonomy: {
      category: "hospitality"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400"
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: true,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 3,
    title: "B2B Logistics & Warehousing",
    slug: "b2b-logistics-warehousing",
    description: "Asset-heavy operation with stable long-term contracts and prime midwest hub access.",
    pricing: {
      base_price: 1200000,
      sale_price: 1200000,
      is_on_sale: false,
      discount: null,
      formatted: "$1,200,000",
      formatted_short: "$1.2M",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Chicago",
      state: "IL"
    },
    taxonomy: {
      category: "manufacturing"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400"
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: true,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 4,
    title: "Niche E-Commerce Coffee Brand",
    slug: "niche-e-commerce-coffee-brand",
    description: "Fully custom Shopify setup specializing in organic micro-lot coffee blends with solid organic search presence.",
    pricing: {
      base_price: 350000,
      sale_price: 350000,
      is_on_sale: false,
      discount: null,
      formatted: "$350,000",
      formatted_short: "$350K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Remote",
      state: "US"
    },
    taxonomy: {
      category: "retail"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 5,
    title: "Local Cafe & Organic Bakery",
    slug: "local-cafe-organic-bakery",
    description: "Highly rated local spot in historic district featuring state-of-the-art kitchen equipment and high foot traffic.",
    pricing: {
      base_price: 120000,
      sale_price: 120000,
      is_on_sale: false,
      discount: null,
      formatted: "$120,000",
      formatted_short: "$120K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Seattle",
      state: "WA"
    },
    taxonomy: {
      category: "hospitality"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 6,
    title: "Regional Trucking Fleet Operation",
    slug: "regional-trucking-fleet-operation",
    description: "Operable fleet of 12 well-maintained semi-trucks, active CDL driver rosters, and contracted shipping lanes.",
    pricing: {
      base_price: 800000,
      sale_price: 800000,
      is_on_sale: false,
      discount: null,
      formatted: "$800,000",
      formatted_short: "$800K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Dallas",
      state: "TX"
    },
    taxonomy: {
      category: "manufacturing"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 7,
    title: "Software Reseller Agency Hub",
    slug: "software-reseller-agency-hub",
    description: "White-label distributor rights for CRM solutions in regional tech startup zones.",
    pricing: {
      base_price: 50000,
      sale_price: 50000,
      is_on_sale: false,
      discount: null,
      formatted: "$50,000",
      formatted_short: "$50K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Global Remote",
      state: "US"
    },
    taxonomy: {
      category: "tech"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400"
    },
    item_specs: {
      condition_rating: 3,
      condition_label: "Standard",
      badge_class: "cp-badge-standard",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 8,
    title: "B2B Enterprise Consulting Firm",
    slug: "b2b-enterprise-consulting-firm",
    description: "Consultancy focused on restructuring and supply chain optimization with high-value contracts.",
    pricing: {
      base_price: 450000,
      sale_price: 450000,
      is_on_sale: false,
      discount: null,
      formatted: "$450,000",
      formatted_short: "$450K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Remote",
      state: "US"
    },
    taxonomy: {
      category: "tech"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 9,
    title: "Vending Machine Route (22 spots)",
    slug: "vending-machine-route-22-spots",
    description: "Lucrative route of smart vending machines in corporate campuses and school gyms with cash flows verified.",
    pricing: {
      base_price: 75000,
      sale_price: 75000,
      is_on_sale: false,
      discount: null,
      formatted: "$75,000",
      formatted_short: "$75K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Phoenix",
      state: "AZ"
    },
    taxonomy: {
      category: "retail"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1575224300306-1b8da56134ec?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 10,
    title: "Digital Marketing Agency (SaaS Focused)",
    slug: "digital-marketing-agency-saas-focused",
    description: "Marketing specialists with active monthly retainer arrangements and proven SEO traffic channels.",
    pricing: {
      base_price: 220000,
      sale_price: 220000,
      is_on_sale: false,
      discount: null,
      formatted: "$220,000",
      formatted_short: "$220K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "London",
      state: "UK"
    },
    taxonomy: {
      category: "tech"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400"
    },
    item_specs: {
      condition_rating: 4,
      condition_label: "Verified",
      badge_class: "cp-badge-verified",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 11,
    title: "Local Automated Laundromat",
    slug: "local-automated-laundromat",
    description: "Fully coinless automated laundromat featuring brand-new commercial washers with high-margin returns.",
    pricing: {
      base_price: 90000,
      sale_price: 90000,
      is_on_sale: false,
      discount: null,
      formatted: "$90,000",
      formatted_short: "$90K",
      transaction_type: { for_sale: true, for_rent: false }
    },
    location: {
      city: "Miami",
      state: "FL"
    },
    taxonomy: {
      category: "retail"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1545173168-9f1947eebd01?q=80&w=400"
    },
    item_specs: {
      condition_rating: 3,
      condition_label: "Standard",
      badge_class: "cp-badge-standard",
      quantity: 1
    },
    status: {
      is_featured: false,
      is_published: true,
      is_new_listing: false,
      is_shipping: false
    }
  }
];
