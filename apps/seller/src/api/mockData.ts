export const mockAutos = [
  {
    id: 1,
    title: '2024 Mercedes-Benz G-Class',
    slug: '2024-mercedes-benz-g-class',
    price: '$180,000',
    location: 'Beverly Hills, CA',
    is_active: true,
    sku: 'AUTO-G63-001',
    media: [{ original_url: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?w=400' }]
  },
  {
    id: 2,
    title: 'Porsche 911 Carrera S',
    slug: 'porsche-911-carrera-s',
    price: '$125,000',
    location: 'Miami, FL',
    is_active: true,
    sku: 'AUTO-P911-002',
    media: [{ original_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400' }]
  },
  {
    id: 3,
    title: 'Tesla Model S Plaid',
    slug: 'tesla-model-s-plaid',
    price: '$89,990',
    location: 'Austin, TX',
    is_active: false,
    sku: 'AUTO-TSLA-003',
    media: [{ original_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400' }]
  }
];

export const mockEvents = [
  {
    id: 1,
    title: 'Summer Tech Summit 2026',
    slug: 'summer-tech-summit-2026',
    price: '$299.00',
    location: 'San Francisco, CA',
    is_active: true,
    sku: 'EVT-TECH-001',
    media: [{ original_url: 'https://images.unsplash.com/photo-1540575861501-7ad0582373f2?w=400' }]
  },
  {
    id: 2,
    title: 'Underground Jazz Night',
    slug: 'underground-jazz-night',
    price: '$45.00',
    location: 'New York, NY',
    is_active: true,
    sku: 'EVT-JAZZ-002',
    media: [{ original_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400' }]
  }
];

export const mockJobs = [
  {
    id: 1,
    title: 'Senior Product Designer',
    slug: 'senior-product-designer',
    price: '$140k - $180k',
    location: 'Remote',
    is_active: true,
    sku: 'JOB-DES-001',
    media: [{ original_url: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=400' }]
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    slug: 'full-stack-engineer',
    price: '$120k - $160k',
    location: 'London, UK',
    is_active: true,
    sku: 'JOB-ENG-002',
    media: [{ original_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400' }]
  }
];

export const mockServices = [
  {
    id: 1,
    title: 'Professional Interior Design',
    slug: 'professional-interior-design',
    price: '$150/hr',
    location: 'Los Angeles, CA',
    is_active: true,
    sku: 'SRV-INT-001',
    media: [{ original_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400' }]
  },
  {
    id: 2,
    title: 'Legal Consultation',
    slug: 'legal-consultation',
    price: '$300/hr',
    location: 'Chicago, IL',
    is_active: true,
    sku: 'SRV-LEG-002',
    media: [{ original_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400' }]
  }
];

export const mockCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', total_orders: 12, total_spent: '$4,250', status: 'Active', joined: 'Jan 2024' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', phone: '+1 987 654 321', total_orders: 5, total_spent: '$1,120', status: 'Active', joined: 'Feb 2024' },
  { id: 3, name: 'Mike Ross', email: 'mike@law.com', phone: '+1 555 012 345', total_orders: 8, total_spent: '$2,800', status: 'Inactive', joined: 'Dec 2023' },
];

export const mockReviews = [
  { id: 1, customer: 'John Doe', rating: 5, comment: 'Exceptional service and quality. Highly recommended!', asset: 'Modern Villa', date: '2 hours ago' },
  { id: 2, customer: 'Sarah Smith', rating: 4, comment: 'Great experience overall, slightly delayed delivery.', asset: 'G-Wagon', date: '1 day ago' },
  { id: 3, customer: 'Emily Blunt', rating: 5, comment: 'The best marketplace for luxury assets.', asset: 'Penthouse', date: '3 days ago' },
];

export const mockMessages = [
  { id: 1, sender: 'John Doe', subject: 'Inquiry about Modern Villa', preview: 'Is the property available for a tour this weekend?', date: '10:30 AM', unread: true },
  { id: 2, sender: 'Sarah Smith', subject: 'G-Wagon Shipping', preview: 'When can I expect the delivery to Miami?', date: 'Yesterday', unread: false },
  { id: 3, sender: 'Support', subject: 'Account Verification', preview: 'Your account has been successfully verified.', date: '2 days ago', unread: false },
];

export const mockPayouts = [
  { id: 1, amount: '$1,250.00', status: 'Completed', date: 'Feb 20, 2026', method: 'Bank Transfer' },
  { id: 2, amount: '$890.50', status: 'Pending', date: 'Feb 24, 2026', method: 'PayPal' },
  { id: 3, amount: '$2,400.00', status: 'Completed', date: 'Jan 15, 2026', method: 'Bank Transfer' },
];

export const mockMemberships = [
  { id: 1, name: 'Elite Partner', price: '$99/mo', features: ['0% Fees', 'Priority Support', 'Featured Listings'], status: 'Current' },
  { id: 2, name: 'Pro Studio', price: '$49/mo', features: ['1% Fees', 'Standard Support', 'Unlimited Listings'], status: 'Available' },
];

export const mockActivities = {
  bookings: [
    { id: 1, asset: 'Modern Mediterranean Villa', customer: 'John Doe', date: 'Feb 28 - Mar 5', status: 'Confirmed', amount: '$4,500' },
    { id: 2, asset: 'Summer Tech Summit', customer: 'Sarah Smith', date: 'Mar 15, 2026', status: 'Pending', amount: '$250' },
  ],
  inquiries: [
    { id: 1, asset: 'Mercedes Benz G-Wagon', customer: 'Mike Ross', date: '2 hours ago', message: 'Is the price negotiable?', status: 'New' },
    { id: 2, asset: 'Interior Design Service', customer: 'Emily Blunt', date: 'Yesterday', message: 'Do you offer remote consultations?', status: 'Replied' },
  ],
  applications: [
    { id: 1, asset: 'Senior Product Designer', customer: 'Alex Rivera', date: '1 day ago', status: 'Under Review', resume: 'alex_cv.pdf' },
    { id: 2, asset: 'Full Stack Engineer', customer: 'Jordan Lee', date: '3 days ago', status: 'Interviewing', resume: 'jordan_dev.pdf' },
  ],
  orders: [
    { id: 1, asset: 'Titanium Executive Watch', customer: 'David Gandy', date: 'Feb 22, 2026', status: 'Shipped', amount: '$1,200' },
    { id: 2, asset: 'Leather Travel Set', customer: 'Victoria B.', date: 'Feb 24, 2026', status: 'Processing', amount: '$450' },
  ]
};

export const mockClassifieds = [
  {
    id: 1,
    title: 'Vintage Record Player',
    slug: 'vintage-record-player',
    price: '$120.00',
    location: 'Portland, OR',
    is_active: true,
    sku: 'CLS-VIN-001',
    media: [{ original_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400' }]
  },
  {
    id: 2,
    title: 'Mountain Bike - Trek Fuel EX',
    slug: 'mountain-bike-trek-fuel-ex',
    price: '$2,400.00',
    location: 'Denver, CO',
    is_active: true,
    sku: 'CLS-BIK-002',
    media: [{ original_url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400' }]
  },
  {
    id: 3,
    title: 'Herman Miller Aeron Chair',
    slug: 'herman-miller-aeron-chair',
    price: '$650.00',
    location: 'Seattle, WA',
    is_active: false,
    sku: 'CLS-FUR-003',
    media: [{ original_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' }]
  }
];

export const mockNotifications = [
  { id: 1, type: 'order', title: 'New Order Received', message: 'You have a new order for "Titanium Executive Watch" from David Gandy.', date: '2 minutes ago', read: false },
  { id: 2, type: 'booking', title: 'Booking Confirmed', message: 'John Doe has confirmed their booking for "Modern Mediterranean Villa".', date: '1 hour ago', read: false },
  { id: 3, type: 'inquiry', title: 'New Inquiry', message: 'Mike Ross sent an inquiry about "Mercedes Benz G-Wagon".', date: '3 hours ago', read: true },
  { id: 4, type: 'payout', title: 'Payout Processed', message: 'Your payout of $1,250.00 has been successfully processed.', date: '1 day ago', read: true },
  { id: 5, type: 'system', title: 'Account Verified', message: 'Congratulations! Your partner account has been fully verified.', date: '2 days ago', read: true },
  { id: 6, type: 'review', title: 'New 5-Star Review', message: 'Emily Blunt left a 5-star review for "Penthouse".', date: '3 days ago', read: true },
];

export const mockTransactions = [
  { id: 1, type: 'payout', title: 'Payout to Chase Bank', amount: '-$1,250.00', date: 'Feb 20, 2026', status: 'Completed' },
  { id: 2, type: 'earning', title: 'Sale: Titanium Executive Watch', amount: '+$1,200.00', date: 'Feb 22, 2026', status: 'Completed' },
  { id: 3, type: 'earning', title: 'Booking: Modern Villa (Deposit)', amount: '+$2,500.00', date: 'Feb 24, 2026', status: 'Completed' },
  { id: 4, type: 'payout', title: 'Payout to PayPal', amount: '-$890.50', date: 'Feb 24, 2026', status: 'Pending' },
  { id: 5, type: 'earning', title: 'Service: Interior Design', amount: '+$450.00', date: 'Feb 25, 2026', status: 'Completed' },
  { id: 6, type: 'refund', title: 'Refund: Leather Travel Set', amount: '-$450.00', date: 'Feb 26, 2026', status: 'Completed' },
];
