import type { ClassifiedListing } from '@sellio/types';

export const DEALS_FALLBACK_CLASSIFIEDS: ClassifiedListing[] = [
  {
    id: 1,
    title: "Apple Watch Series 8 (GPS, 41mm)",
    slug: "apple-watch-series-8-gps-41mm",
    description: "Keep track of your health and fitness with the Apple Watch Series 8. Features advanced sensors for insights into your physical well-being, an Always-On Retina display, robust water resistance, and fast-charging capabilities. Perfect condition, original packaging included.",
    short_description: "Apple Watch Series 8 in pristine space gray condition.",
    pricing: {
      base_price: 399,
      sale_price: 249,
      is_on_sale: true,
      discount: "37",
      formatted: "$249.00",
      formatted_short: "$249",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Like New",
      badge_class: "cd-badge-like-new",
      age_years: 1,
      quantity: 3,
      dimensions: "41mm x 35mm x 10.7mm",
      warranty: "6 Months Seller Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "electronics",
      type: "For Sale",
      brand: "Apple",
      tags: ["smartwatch", "fitness", "apple", "wearables"]
    },
    location: {
      city: "San Francisco",
      state: "CA",
      country: "USA",
      address: "Downtown SF"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: true,
      inquiry_count: 5
    },
    seller: {
      id: 101,
      name: "GadgetPro",
      avatar: null
    }
  },
  {
    id: 2,
    title: "Canon EOS R6 Mirrorless Camera (Body Only)",
    slug: "canon-eos-r6-mirrorless-camera-body-only",
    description: "The Canon EOS R6 is a versatile tool for photographers and videographers alike. Boasting a 20MP Full-Frame sensor, 4K60 video capabilities, 5-axis in-body image stabilization, and up to 20 fps mechanical shooting. Exceptionally clean body, negligible shutter count.",
    short_description: "Pro-tier mirrorless camera body, pristine condition.",
    pricing: {
      base_price: 2299,
      sale_price: 1399,
      is_on_sale: true,
      discount: "39",
      formatted: "$1,399.00",
      formatted_short: "$1,399",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Excellent",
      badge_class: "cd-badge-excellent",
      age_years: 1.5,
      quantity: 1,
      dimensions: "138.4mm x 97.5mm x 88.4mm",
      warranty: "1 Year Remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "electronics",
      type: "For Sale",
      brand: "Canon",
      tags: ["camera", "mirrorless", "canon", "photography"]
    },
    location: {
      city: "New York",
      state: "NY",
      country: "USA",
      address: "Manhattan Studio"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: true,
      is_shipping: true,
      inquiry_count: 12
    },
    seller: {
      id: 102,
      name: "LensMaster",
      avatar: null
    }
  },
  {
    id: 3,
    title: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh-1000xm5-headphones",
    description: "Industry-leading noise canceling wireless headphones with crystal-clear hands-free calling, smart features, and unmatched audio fidelity. Features a lightweight design with soft fit leather headband.",
    short_description: "Sony WH-1000XM5 wireless ANC headphones in black.",
    pricing: {
      base_price: 399,
      sale_price: 219,
      is_on_sale: true,
      discount: "45",
      formatted: "$219.00",
      formatted_short: "$219",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 5,
      condition_label: "Brand New",
      badge_class: "cd-badge-new",
      age_years: 0.1,
      quantity: 5,
      dimensions: "Standard Over-Ear",
      warranty: "2 Year Global Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "electronics",
      type: "For Sale",
      brand: "Sony",
      tags: ["headphones", "anc", "audio", "sony", "music"]
    },
    location: {
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      address: "Beverly Hills"
    },
    status: {
      is_published: true,
      is_featured: true,
      is_new_listing: false,
      is_shipping: true,
      inquiry_count: 9
    },
    seller: {
      id: 103,
      name: "AudioDepot",
      avatar: null
    }
  },
  {
    id: 4,
    title: "Nike Air Max 270 Running Shoes",
    slug: "nike-air-max-270-running-shoes",
    description: "Nike's first lifestyle Air Max brings you style, comfort, and big attitude. Features an extra-large air pocket for supreme cushioning. Vibrant crimson red accents that match your active daily energy.",
    short_description: "Nike Air Max 270 in original box, never worn outdoors.",
    pricing: {
      base_price: 160,
      sale_price: 85,
      is_on_sale: true,
      discount: "47",
      formatted: "$85.00",
      formatted_short: "$85",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.9,
      condition_label: "Like New",
      badge_class: "cd-badge-like-new",
      age_years: 0.2,
      quantity: 2,
      dimensions: "US Men Size 10.5",
      warranty: "No Warranty"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "fashion",
      type: "For Sale",
      brand: "Nike",
      tags: ["shoes", "sneakers", "nike", "fashion", "running"]
    },
    location: {
      city: "Chicago",
      state: "IL",
      country: "USA",
      address: "Lincoln Park"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: true,
      inquiry_count: 2
    },
    seller: {
      id: 104,
      name: "KickZilla",
      avatar: null
    }
  },
  {
    id: 5,
    title: "Herman Miller Aeron Ergonomic Chair - Size B",
    slug: "herman-miller-aeron-ergonomic-chair-size-b",
    description: "The gold standard of ergonomic office seating. Fully loaded Size B model with posturefit lumbar support, tilt limiter, seat angle adjustment, and fully adjustable vinyl armrests. Pellet mesh is in superb shape without any tears.",
    short_description: "Classic Herman Miller Aeron office chair, Size B.",
    pricing: {
      base_price: 1200,
      sale_price: 450,
      is_on_sale: true,
      discount: "62",
      formatted: "$450.00",
      formatted_short: "$450",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.5,
      condition_label: "Very Good",
      badge_class: "cd-badge-very-good",
      age_years: 3,
      quantity: 1,
      dimensions: "Size B (Medium)",
      warranty: "5 Years Warranty Remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "home",
      type: "For Sale",
      brand: "Herman Miller",
      tags: ["chair", "ergonomic", "office", "furniture"]
    },
    location: {
      city: "Boston",
      state: "MA",
      country: "USA",
      address: "Financial District"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: false,
      is_shipping: false,
      inquiry_count: 14
    },
    seller: {
      id: 105,
      name: "OfficeClearance",
      avatar: null
    }
  },
  {
    id: 6,
    title: "DeWalt 20V Max Cordless Drill Kit",
    slug: "dewalt-20v-max-cordless-drill-kit",
    description: "High performance DeWalt 20V cordless compact drill and driver kit. Includes two 20V lithium-ion batteries, a charger, and a heavy-duty contractor carrying bag. Ideal for home projects or contractor duties.",
    short_description: "DeWalt Cordless Drill Kit, complete set with 2 batteries.",
    pricing: {
      base_price: 179,
      sale_price: 99,
      is_on_sale: true,
      discount: "45",
      formatted: "$99.00",
      formatted_short: "$99",
      transaction_type: { for_sale: true, for_rent: false }
    },
    item_specs: {
      condition_rating: 4.8,
      condition_label: "Like New",
      badge_class: "cd-badge-like-new",
      age_years: 0.5,
      quantity: 2,
      dimensions: "Compact 20V",
      warranty: "1 Year Remaining"
    },
    media: {
      main_photo: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=600",
      thumbnail: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400",
      gallery: [],
      all_photos_count: 1
    },
    taxonomy: {
      category: "tools",
      type: "For Sale",
      brand: "DeWalt",
      tags: ["drill", "tools", "dewalt", "cordless"]
    },
    location: {
      city: "Seattle",
      state: "WA",
      country: "USA",
      address: "Greenwood"
    },
    status: {
      is_published: true,
      is_featured: false,
      is_new_listing: true,
      is_shipping: true,
      inquiry_count: 4
    },
    seller: {
      id: 106,
      name: "HardwareDirect",
      avatar: null
    }
  }
];
