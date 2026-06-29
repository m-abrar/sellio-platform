import type { ClassifiedListing } from '@/types';

export const MODERN_FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Apple iPad Pro 12.9 (M2 Chip - 256GB)",
    slug: "apple-ipad-pro-12-9-m2-chip-256gb",
    description: "Mint condition Apple iPad Pro 12.9-inch with the powerhouse M2 chip. 256GB storage, space gray color. Includes original box, charger, and an extra screen protector.",
    pricing: {
      base_price: 850,
      sale_price: 850,
      is_on_sale: false,
      discount: null,
      formatted: "$850.00",
      formatted_short: "$850",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Like New",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "San Jose",
      state: "CA"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true
    }
  },
  {
    id: 2,
    title: "Chesterfield Vintage Leather Sofa",
    slug: "chesterfield-vintage-leather-sofa",
    description: "Stunning Chesterfield 3-seater sofa in aged oxblood vintage leather. Hand-tufted details, solid mahogany legs, and classic scroll arms. Incredibly comfortable.",
    pricing: {
      base_price: 1200,
      sale_price: 1200,
      is_on_sale: false,
      discount: null,
      formatted: "$1,200.00",
      formatted_short: "$1,200",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Excellent",
      badge_class: "cm-card-badge",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400",
    },
    taxonomy: {
      category: "furniture"
    },
    location: {
      city: "Austin",
      state: "TX"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: false
    }
  },
  {
    id: 3,
    title: "DJI Mavic Air 2 Fly More Combo",
    slug: "dji-mavic-air-2-fly-more-combo",
    description: "Perfect working order DJI Mavic Air 2 drone. Fly More Combo includes 3 smart batteries, multi-charger hub, ND filter set, carrying bag, and replacement propellers.",
    pricing: {
      base_price: 850,
      sale_price: 650,
      is_on_sale: true,
      discount: "24",
      formatted: "$650.00",
      formatted_short: "$650",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.9,
      condition_label: "Like New",
      badge_class: "cm-card-badge",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "Miami",
      state: "FL"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: true
    }
  },
  {
    id: 4,
    title: "Adidas Yeezy Boost 350 V2",
    slug: "adidas-yeezy-boost-350-v2",
    description: "Adidas Yeezy Boost 350 V2 'Carbon'. Size US 10.5. Deadstock condition, never worn, tags still attached. Purchased directly from Adidas Confirmed app.",
    pricing: {
      base_price: 220,
      sale_price: 220,
      is_on_sale: false,
      discount: null,
      formatted: "$220.00",
      formatted_short: "$220",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Brand New",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400",
    },
    taxonomy: {
      category: "fashion"
    },
    location: {
      city: "Brooklyn",
      state: "NY"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true
    }
  },
  {
    id: 5,
    title: "Sony PlayStation 5 Disc Edition",
    slug: "sony-playstation-5-disc-edition",
    description: "Gently used Sony PlayStation 5 Disc Console. Firmware updated. Package includes 1 white DualSense wireless controller, HDMI cable, power cord, and Astro's Playroom.",
    pricing: {
      base_price: 400,
      sale_price: 400,
      is_on_sale: false,
      discount: null,
      formatted: "$400.00",
      formatted_short: "$400",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.6,
      condition_label: "Excellent",
      badge_class: "cm-card-badge",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "Chicago",
      state: "IL"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: true
    }
  },
  {
    id: 6,
    title: "Canon EOS R5 Mirrorless Camera Body",
    slug: "canon-eos-r5-mirrorless-camera-body",
    description: "Professional mirrorless setup: Canon EOS R5 body. 45MP full-frame sensor, 8K video, 5-axis in-body stabilization. Shutter count under 12k. Flawless cosmetics.",
    pricing: {
      base_price: 3200,
      sale_price: 2800,
      is_on_sale: true,
      discount: "12",
      formatted: "$2,800.00",
      formatted_short: "$2,800",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Excellent",
      badge_class: "cm-card-badge",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "Seattle",
      state: "WA"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: true
    }
  },
  {
    id: 7,
    title: "Secretlab TITAN Evo Gaming Chair",
    slug: "secretlab-titan-evo-gaming-chair",
    description: "Secretlab TITAN Evo 2022 Series gaming chair. Size Regular, upholstered in softweave plush fabric (charcoal blue). 4D armrests, magnetic head pillow.",
    pricing: {
      base_price: 350,
      sale_price: 350,
      is_on_sale: false,
      discount: null,
      formatted: "$350.00",
      formatted_short: "$350",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.7,
      condition_label: "Very Good",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=400",
    },
    taxonomy: {
      category: "furniture"
    },
    location: {
      city: "Denver",
      state: "CO"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: false
    }
  },
  {
    id: 8,
    title: "Oculus Quest 2 128GB VR Headset",
    slug: "oculus-quest-2-128gb-vr-headset",
    description: "Meta Oculus Quest 2 standalone VR headset. 128GB memory model. Includes two touch controllers, glasses spacer, silicon face cover, and charge adapter.",
    pricing: {
      base_price: 200,
      sale_price: 200,
      is_on_sale: false,
      discount: null,
      formatted: "$200.00",
      formatted_short: "$200",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.9,
      condition_label: "Like New",
      badge_class: "cm-card-badge cyan",
      quantity: 1,
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=400",
      thumbnail: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=400",
    },
    taxonomy: {
      category: "electronics"
    },
    location: {
      city: "Atlanta",
      state: "GA"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true
    }
  }
];
