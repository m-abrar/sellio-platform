import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('marketplace.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT,
    featured_image TEXT,
    featured_image_id INTEGER,
    base_price REAL,
    sale_price REAL,
    stock_quantity INTEGER DEFAULT 0,
    manage_stock BOOLEAN DEFAULT 1,
    category_id INTEGER,
    brand_title TEXT,
    description TEXT,
    short_description TEXT,
    weight TEXT,
    dimensions TEXT,
    is_featured BOOLEAN DEFAULT 0,
    is_published BOOLEAN DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );

  CREATE TABLE IF NOT EXISTS autos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT 1,
    sku TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT 1,
    sku TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT 1,
    sku TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT 1,
    sku TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS classifieds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT 1,
    sku TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent TEXT,
    status TEXT,
    joined TEXT
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT,
    rating INTEGER,
    comment TEXT,
    asset TEXT,
    date TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    subject TEXT,
    preview TEXT,
    date TEXT,
    unread BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    title TEXT,
    amount TEXT,
    amount_value REAL,
    date TEXT,
    status TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    balance REAL DEFAULT 0,
    pending_balance REAL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    last_updated TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    title TEXT,
    message TEXT,
    date TEXT,
    read BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT 1,
    sku TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );

  DROP TABLE IF EXISTS activities;
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module TEXT NOT NULL,
    type TEXT NOT NULL,
    asset TEXT NOT NULL,
    customer TEXT NOT NULL,
    status TEXT NOT NULL,
    amount TEXT,
    resume TEXT,
    date TEXT NOT NULL
  );
`);

// Seed initial data if empty
const categoriesToSeed = [
  'Furniture', 'Electronics', 'Apparel', 'Home Decor', 
  'Automotive', 'Real Estate', 'Tech Gadgets', 'Luxury Goods'
];
const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (title) VALUES (?)');
categoriesToSeed.forEach(title => insertCategory.run(title));

const usersToSeed = [
  { name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
  { name: 'Partner User', email: 'partner@example.com', password: 'password', role: 'partner' }
];
const insertUser = db.prepare('INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
usersToSeed.forEach(u => insertUser.run(u.name, u.email, u.password, u.role));

const productsToSeed = [
  { title: 'Modern Executive Desk', slug: 'modern-executive-desk', sku: 'DSK-001', featured_image: 'https://picsum.photos/seed/desk/400/300', featured_image_id: 101, base_price: 599.99, sale_price: 499.99, stock_quantity: 12, category_id: 1, brand_title: 'OfficePro', description: 'A high-quality executive desk for modern offices.', short_description: 'Modern desk.', weight: '25', dimensions: '120x60x75 cm', is_featured: 1 },
  { title: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair', sku: 'CHR-002', featured_image: 'https://picsum.photos/seed/chair/400/300', featured_image_id: 102, base_price: 249.50, sale_price: null, stock_quantity: 3, category_id: 1, brand_title: 'OfficePro', description: 'Comfortable ergonomic chair.', short_description: 'Ergo chair.', weight: '15', dimensions: '60x60x110 cm', is_featured: 0 },
  { title: '4K Ultra HD Monitor', slug: '4k-ultra-hd-monitor', sku: 'MON-003', featured_image: 'https://picsum.photos/seed/monitor/400/300', featured_image_id: 103, base_price: 399.99, sale_price: 349.99, stock_quantity: 25, category_id: 2, brand_title: 'TechVision', description: 'Crystal clear 4K display.', short_description: '4K Monitor.', weight: '8', dimensions: '65x40x15 cm', is_featured: 1 },
  { title: 'Mechanical Gaming Keyboard', slug: 'mechanical-gaming-keyboard', sku: 'KBD-004', featured_image: 'https://picsum.photos/seed/keyboard/400/300', featured_image_id: 104, base_price: 129.99, sale_price: null, stock_quantity: 50, category_id: 2, brand_title: 'GameMaster', description: 'RGB backlit mechanical keyboard.', short_description: 'Gaming Keyboard.', weight: '1.5', dimensions: '45x15x4 cm', is_featured: 0 },
  { title: 'Wireless Noise Cancelling Headphones', slug: 'wireless-noise-cancelling-headphones', sku: 'AUD-005', featured_image: 'https://picsum.photos/seed/headphones/400/300', featured_image_id: 105, base_price: 299.99, sale_price: 249.99, stock_quantity: 15, category_id: 2, brand_title: 'SonicBoom', description: 'Premium sound quality with active noise cancellation.', short_description: 'Noise cancelling headphones.', weight: '0.5', dimensions: '20x18x8 cm', is_featured: 1 },
  { title: 'Designer Leather Handbag', slug: 'designer-leather-handbag', sku: 'BAG-006', featured_image: 'https://picsum.photos/seed/handbag/400/300', featured_image_id: 106, base_price: 850.00, sale_price: null, stock_quantity: 5, category_id: 3, brand_title: 'LuxeCouture', description: 'Handcrafted Italian leather handbag.', short_description: 'Leather handbag.', weight: '1.2', dimensions: '35x25x15 cm', is_featured: 1 }
];
const insertProduct = db.prepare(`
  INSERT OR IGNORE INTO products (
    title, slug, sku, featured_image, featured_image_id, 
    base_price, sale_price, stock_quantity, category_id, 
    brand_title, description, short_description, weight, dimensions, is_featured
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
productsToSeed.forEach(p => insertProduct.run(
  p.title, p.slug, p.sku, p.featured_image, p.featured_image_id, 
  p.base_price, p.sale_price, p.stock_quantity, p.category_id, 
  p.brand_title, p.description, p.short_description, p.weight, p.dimensions, p.is_featured
));

// Seed Autos
const autosToSeed = [
  { title: '2024 Mercedes-Benz G-Class', slug: '2024-mercedes-benz-g-class', price: '$180,000', location: 'Beverly Hills, CA', is_active: 1, sku: 'AUTO-G63-001', image_url: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?w=400' },
  { title: 'Porsche 911 Carrera S', slug: 'porsche-911-carrera-s', price: '$125,000', location: 'Miami, FL', is_active: 1, sku: 'AUTO-P911-002', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400' },
  { title: 'Tesla Model S Plaid', slug: 'tesla-model-s-plaid', price: '$89,990', location: 'Austin, TX', is_active: 0, sku: 'AUTO-TSLA-003', image_url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400' },
  { title: 'Range Rover Autobiography', slug: 'range-rover-autobiography', price: '$160,000', location: 'London, UK', is_active: 1, sku: 'AUTO-RR-004', image_url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400' },
  { title: 'Ferrari F8 Tributo', slug: 'ferrari-f8-tributo', price: '$280,000', location: 'Maranello, IT', is_active: 1, sku: 'AUTO-FER-005', image_url: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=400' }
];

const insertAuto = db.prepare('INSERT OR IGNORE INTO autos (title, slug, price, location, is_active, sku, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
autosToSeed.forEach(a => insertAuto.run(a.title, a.slug, a.price, a.location, a.is_active, a.sku, a.image_url));

// Seed Events
const eventsToSeed = [
  { title: 'Summer Tech Summit 2026', slug: 'summer-tech-summit-2026', price: '$299.00', location: 'San Francisco, CA', is_active: 1, sku: 'EVT-TECH-001', image_url: 'https://images.unsplash.com/photo-1540575861501-7ad0582373f2?w=400' },
  { title: 'Underground Jazz Night', slug: 'underground-jazz-night', price: '$45.00', location: 'New York, NY', is_active: 1, sku: 'EVT-JAZZ-002', image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400' }
];

const insertEvent = db.prepare('INSERT OR IGNORE INTO events (title, slug, price, location, is_active, sku, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
eventsToSeed.forEach(e => insertEvent.run(e.title, e.slug, e.price, e.location, e.is_active, e.sku, e.image_url));

// Seed Jobs
const jobsToSeed = [
  { title: 'Senior Product Designer', slug: 'senior-product-designer', price: '$140k - $180k', location: 'Remote', is_active: 1, sku: 'JOB-DES-001', image_url: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=400' },
  { title: 'Full Stack Engineer', slug: 'full-stack-engineer', price: '$120k - $160k', location: 'London, UK', is_active: 1, sku: 'JOB-ENG-002', image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400' }
];
const insertJob = db.prepare('INSERT OR IGNORE INTO jobs (title, slug, price, location, is_active, sku, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
jobsToSeed.forEach(j => insertJob.run(j.title, j.slug, j.price, j.location, j.is_active, j.sku, j.image_url));

// Seed Services
const servicesToSeed = [
  { title: 'Professional Interior Design', slug: 'professional-interior-design', price: '$150/hr', location: 'Los Angeles, CA', is_active: 1, sku: 'SRV-INT-001', image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400' },
  { title: 'Legal Consultation', slug: 'legal-consultation', price: '$300/hr', location: 'Chicago, IL', is_active: 1, sku: 'SRV-LEG-002', image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400' }
];
const insertService = db.prepare('INSERT OR IGNORE INTO services (title, slug, price, location, is_active, sku, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
servicesToSeed.forEach(s => insertService.run(s.title, s.slug, s.price, s.location, s.is_active, s.sku, s.image_url));

// Seed Classifieds
const classifiedsToSeed = [
  { title: 'Vintage Record Player', slug: 'vintage-record-player', price: '$120.00', location: 'Portland, OR', is_active: 1, sku: 'CLS-VIN-001', image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400' },
  { title: 'Mountain Bike - Trek Fuel EX', slug: 'mountain-bike-trek-fuel-ex', price: '$2,400.00', location: 'Denver, CO', is_active: 1, sku: 'CLS-BIK-002', image_url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400' },
  { title: 'Herman Miller Aeron Chair', slug: 'herman-miller-aeron-chair', price: '$650.00', location: 'Seattle, WA', is_active: 0, sku: 'CLS-FUR-003', image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' }
];
const insertClassified = db.prepare('INSERT OR IGNORE INTO classifieds (title, slug, price, location, is_active, sku, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
classifiedsToSeed.forEach(c => insertClassified.run(c.title, c.slug, c.price, c.location, c.is_active, c.sku, c.image_url));

// Seed Customers
const customersToSeed = [
  { name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', total_orders: 12, total_spent: '$4,250', status: 'Active', joined: 'Jan 2024' },
  { name: 'Sarah Smith', email: 'sarah@example.com', phone: '+1 987 654 321', total_orders: 5, total_spent: '$1,120', status: 'Active', joined: 'Feb 2024' },
  { name: 'Mike Ross', email: 'mike@law.com', phone: '+1 555 012 345', total_orders: 8, total_spent: '$2,800', status: 'Inactive', joined: 'Dec 2023' },
  { name: 'Emily Blunt', email: 'emily@hollywood.com', phone: '+1 555 999 888', total_orders: 2, total_spent: '$15,000', status: 'Active', joined: 'Mar 2024' },
  { name: 'David Gandy', email: 'david@fashion.com', phone: '+1 555 777 666', total_orders: 15, total_spent: '$8,450', status: 'Active', joined: 'Jan 2024' },
  { name: 'Leonardo DiCaprio', email: 'leo@eco.org', phone: '+1 555 111 222', total_orders: 3, total_spent: '$45,000', status: 'Active', joined: 'Apr 2024' }
];
const insertCustomer = db.prepare('INSERT OR IGNORE INTO customers (name, email, phone, total_orders, total_spent, status, joined) VALUES (?, ?, ?, ?, ?, ?, ?)');
customersToSeed.forEach(c => insertCustomer.run(c.name, c.email, c.phone, c.total_orders, c.total_spent, c.status, c.joined));

// Seed Reviews
const reviewsToSeed = [
  { customer: 'John Doe', rating: 5, comment: 'Exceptional service and quality. Highly recommended!', asset: 'Modern Villa', date: '2 hours ago' },
  { customer: 'Sarah Smith', rating: 4, comment: 'Great experience overall, slightly delayed delivery.', asset: 'G-Wagon', date: '1 day ago' },
  { customer: 'Emily Blunt', rating: 5, comment: 'The best marketplace for luxury assets.', asset: 'Penthouse', date: '3 days ago' },
  { customer: 'David Gandy', rating: 5, comment: 'Flawless transaction and beautiful product.', asset: 'Executive Watch', date: '4 days ago' }
];
const insertReview = db.prepare('INSERT OR IGNORE INTO reviews (customer, rating, comment, asset, date) VALUES (?, ?, ?, ?, ?)');
reviewsToSeed.forEach(r => insertReview.run(r.customer, r.rating, r.comment, r.asset, r.date));

// Seed Messages
const messagesToSeed = [
  { sender: 'John Doe', subject: 'Inquiry about Modern Villa', preview: 'Is the property available for a tour this weekend?', date: '10:30 AM', unread: 1 },
  { sender: 'Sarah Smith', subject: 'G-Wagon Shipping', preview: 'When can I expect the delivery to Miami?', date: 'Yesterday', unread: 0 },
  { sender: 'Support', subject: 'Account Verification', preview: 'Your account has been successfully verified.', date: '2 days ago', unread: 0 },
  { sender: 'David Gandy', subject: 'Watch Maintenance', preview: 'Do you offer servicing for the Titanium watch?', date: '3 days ago', unread: 1 }
];
const insertMessage = db.prepare('INSERT OR IGNORE INTO messages (sender, subject, preview, date, unread) VALUES (?, ?, ?, ?, ?)');
messagesToSeed.forEach(m => insertMessage.run(m.sender, m.subject, m.preview, m.date, m.unread));

// Seed Transactions
const transactionsToSeed = [
  { user_id: 2, type: 'payout', title: 'Payout to Chase Bank', amount: '-$1,250.00', amount_value: -1250.00, date: 'Feb 20, 2026', status: 'Completed' },
  { user_id: 2, type: 'earning', title: 'Sale: Titanium Executive Watch', amount: '+$1,200.00', amount_value: 1200.00, date: 'Feb 22, 2026', status: 'Completed' },
  { user_id: 2, type: 'earning', title: 'Booking: Modern Villa (Deposit)', amount: '+$2,500.00', amount_value: 2500.00, date: 'Feb 24, 2026', status: 'Completed' },
  { user_id: 2, type: 'payout', title: 'Payout to PayPal', amount: '-$890.50', amount_value: -890.50, date: 'Feb 24, 2026', status: 'Pending' },
  { user_id: 2, type: 'earning', title: 'Service: Interior Design', amount: '+$450.00', amount_value: 450.00, date: 'Feb 25, 2026', status: 'Completed' },
  { user_id: 2, type: 'refund', title: 'Refund: Leather Travel Set', amount: '-$450.00', amount_value: -450.00, date: 'Feb 26, 2026', status: 'Completed' },
  { user_id: 2, type: 'earning', title: 'Sale: 4K Monitor', amount: '+$350.00', amount_value: 350.00, date: 'Mar 01, 2026', status: 'Completed' }
];
const insertTransaction = db.prepare('INSERT OR IGNORE INTO transactions (user_id, type, title, amount, amount_value, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
transactionsToSeed.forEach(t => insertTransaction.run(t.user_id, t.type, t.title, t.amount, t.amount_value, t.date, t.status));

// Seed Wallets
const walletsToSeed = [
  { user_id: 2, balance: 14250.80, pending_balance: 890.50, last_updated: new Date().toISOString() }
];
const insertWallet = db.prepare('INSERT OR IGNORE INTO wallets (user_id, balance, pending_balance, last_updated) VALUES (?, ?, ?, ?)');
walletsToSeed.forEach(w => insertWallet.run(w.user_id, w.balance, w.pending_balance, w.last_updated));

// Seed Notifications
const notificationsToSeed = [
  { type: 'order', title: 'New Order Received', message: 'You have a new order for "Titanium Executive Watch" from David Gandy.', date: '2 minutes ago', read: 0 },
  { type: 'booking', title: 'Booking Confirmed', message: 'John Doe has confirmed their booking for "Modern Mediterranean Villa".', date: '1 hour ago', read: 0 },
  { type: 'inquiry', title: 'New Inquiry', message: 'Mike Ross sent an inquiry about "Mercedes Benz G-Wagon".', date: '3 hours ago', read: 1 },
  { type: 'payout', title: 'Payout Processed', message: 'Your payout of $1,250.00 has been successfully processed.', date: '1 day ago', read: 1 },
  { type: 'system', title: 'Account Verified', message: 'Congratulations! Your partner account has been fully verified.', date: '2 days ago', read: 1 },
  { type: 'review', title: 'New 5-Star Review', message: 'Emily Blunt left a 5-star review for "Penthouse".', date: '3 days ago', read: 1 },
  { type: 'system', title: 'Security Update', message: 'Please review your account security settings.', date: '4 days ago', read: 0 }
];
const insertNotification = db.prepare('INSERT OR IGNORE INTO notifications (type, title, message, date, read) VALUES (?, ?, ?, ?, ?)');
notificationsToSeed.forEach(n => insertNotification.run(n.type, n.title, n.message, n.date, n.read));

// Seed Activities
const activitiesToSeed = [
  { module: 'properties', type: 'bookings', asset: 'Luxury Penthouse', customer: 'John Doe', status: 'Confirmed', amount: '$2,500.00', date: '2 hours ago' },
  { module: 'products', type: 'orders', asset: 'Titanium Executive Watch', customer: 'David Gandy', status: 'Shipped', amount: '$1,200.00', date: '1 day ago' },
  { module: 'autos', type: 'inquiries', asset: 'Mercedes Benz G-Wagon', customer: 'Mike Ross', status: 'Pending', amount: null, date: '3 hours ago' },
  { module: 'joblistings', type: 'applications', asset: 'Senior Product Designer', customer: 'Sarah Smith', status: 'Reviewing', amount: null, date: 'Yesterday' }
];
const insertActivity = db.prepare('INSERT OR IGNORE INTO activities (module, type, asset, customer, status, amount, date) VALUES (?, ?, ?, ?, ?, ?, ?)');
activitiesToSeed.forEach(a => insertActivity.run(a.module, a.type, a.asset, a.customer, a.status, a.amount, a.date));

// Seed Properties
const propertiesToSeed = [
  { title: 'Luxury Penthouse', slug: 'luxury-penthouse', price: '$2,500,000', location: 'Downtown Metropolis', is_active: 1, sku: 'PROP-PENT-001', image_url: 'https://picsum.photos/seed/penthouse/400/300' },
  { title: 'Modern Suburban Villa', slug: 'modern-suburban-villa', price: '$850,000', location: 'Green Valley', is_active: 0, sku: 'PROP-VILLA-002', image_url: 'https://picsum.photos/seed/villa/400/300' },
  { title: 'Beachfront Condo', slug: 'beachfront-condo', price: '$1,200,000', location: 'Malibu, CA', is_active: 1, sku: 'PROP-BEACH-003', image_url: 'https://picsum.photos/seed/beach/400/300' }
];
const insertProperty = db.prepare('INSERT OR IGNORE INTO properties (title, slug, price, location, is_active, sku, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
propertiesToSeed.forEach(p => insertProperty.run(p.title, p.slug, p.price, p.location, p.is_active, p.sku, p.image_url));

export default db;
