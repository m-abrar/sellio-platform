import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.sqlite");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    avatar TEXT,
    phone TEXT,
    location TEXT,
    member_since TEXT,
    settings TEXT DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    module TEXT,
    title TEXT,
    description TEXT,
    price REAL,
    image TEXT,
    category TEXT,
    metadata TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    item_id TEXT,
    type TEXT DEFAULT 'booking',
    status TEXT DEFAULT 'pending',
    booking_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(item_id) REFERENCES items(id)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER,
    item_id TEXT,
    PRIMARY KEY(user_id, item_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(item_id) REFERENCES items(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    item_id TEXT,
    booking_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(item_id) REFERENCES items(id),
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );
`);

// Migration: Add 'type' column to 'bookings' if it doesn't exist
try {
  db.prepare("ALTER TABLE bookings ADD COLUMN type TEXT DEFAULT 'booking'").run();
} catch (e) {
  // Column might already exist
}

// Seed Initial Data
const seedDatabase = () => {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  const itemCount = db.prepare("SELECT COUNT(*) as count FROM items").get().count;
  const bookingCount = db.prepare("SELECT COUNT(*) as count FROM bookings").get().count;
  const reviewCount = db.prepare("SELECT COUNT(*) as count FROM reviews").get().count;
  const messageCount = db.prepare("SELECT COUNT(*) as count FROM messages").get().count;
  const favoriteCount = db.prepare("SELECT COUNT(*) as count FROM favorites").get().count;

  if (userCount === 0) {
    console.log("Seeding users...");
    const users = [
      { name: "John Doe", email: "john.doe@example.com", avatar: "https://picsum.photos/seed/user1/200/200", phone: "+1 (555) 123-4567", location: "New York, NY", member_since: "Jan 2024" },
      { name: "Jane Smith", email: "jane.smith@example.com", avatar: "https://picsum.photos/seed/user2/200/200", phone: "+1 (555) 987-6543", location: "London, UK", member_since: "Mar 2024" },
      { name: "Bob Wilson", email: "bob.wilson@example.com", avatar: "https://picsum.photos/seed/user3/200/200", phone: "+1 (555) 456-7890", location: "San Francisco, CA", member_since: "Feb 2024" },
      { name: "Alice Brown", email: "alice.brown@example.com", avatar: "https://picsum.photos/seed/user4/200/200", phone: "+1 (555) 321-0987", location: "Sydney, AU", member_since: "Apr 2024" },
    ];
    const insertUser = db.prepare("INSERT INTO users (name, email, avatar, phone, location, member_since) VALUES (?, ?, ?, ?, ?, ?)");
    users.forEach(u => insertUser.run(u.name, u.email, u.avatar, u.phone, u.location, u.member_since));
  }

  if (itemCount === 0) {
    console.log("Seeding items...");
    const items = [
      // Properties
      { id: 'p1', module: 'properties', title: 'Modern Downtown Loft', description: 'Spacious loft with city views.', price: 2500, category: 'Apartment', image: 'https://picsum.photos/seed/prop1/800/600', metadata: JSON.stringify({ location: 'New York, NY', beds: 2, baths: 2, rating: 4.8 }) },
      { id: 'p2', module: 'properties', title: 'Beachfront Villa', description: 'Luxury villa right on the sand.', price: 5000, category: 'Villa', image: 'https://picsum.photos/seed/prop2/800/600', metadata: JSON.stringify({ location: 'Malibu, CA', beds: 4, baths: 3, rating: 4.9 }) },
      { id: 'p3', module: 'properties', title: 'Cozy Mountain Cabin', description: 'Perfect for a winter getaway.', price: 1800, category: 'Cabin', image: 'https://picsum.photos/seed/prop3/800/600', metadata: JSON.stringify({ location: 'Aspen, CO', beds: 3, baths: 1, rating: 4.7 }) },
      
      // Autos
      { id: 'a1', module: 'autos', title: 'Tesla Model 3', description: '2023 Long Range AWD.', price: 45000, category: 'Electric', image: 'https://picsum.photos/seed/car1/800/600', metadata: JSON.stringify({ year: 2023, mileage: '5,000 mi', transmission: 'Auto', rating: 4.7 }) },
      { id: 'a2', module: 'autos', title: 'Porsche 911', description: 'Classic performance and style.', price: 120000, category: 'Sport', image: 'https://picsum.photos/seed/car2/800/600', metadata: JSON.stringify({ year: 2022, mileage: '2,000 mi', transmission: 'PDK', rating: 4.9 }) },
      { id: 'a3', module: 'autos', title: 'Ford F-150 Lightning', description: 'Powerful electric pickup truck.', price: 65000, category: 'Truck', image: 'https://picsum.photos/seed/car3/800/600', metadata: JSON.stringify({ year: 2023, mileage: '1,200 mi', transmission: 'Auto', rating: 4.6 }) },
      
      // Events
      { id: 'e1', module: 'events', title: 'Tech Conference 2024', description: 'The biggest tech event of the year.', price: 299, category: 'Conference', image: 'https://picsum.photos/seed/event1/800/600', metadata: JSON.stringify({ date: '2024-10-15', location: 'San Francisco, CA', rating: 4.5 }) },
      { id: 'e2', module: 'events', title: 'Jazz in the Park', description: 'Evening of smooth jazz and wine.', price: 45, category: 'Music', image: 'https://picsum.photos/seed/event2/800/600', metadata: JSON.stringify({ date: '2024-08-20', location: 'Chicago, IL', rating: 4.8 }) },
      
      // Services
      { id: 's1', module: 'services', title: 'House Cleaning', description: 'Professional deep cleaning service.', price: 150, category: 'Home', image: 'https://picsum.photos/seed/service1/800/600', metadata: JSON.stringify({ provider: 'CleanCo', rating: 4.6 }) },
      { id: 's2', module: 'services', title: 'Personal Training', description: 'One-on-one fitness coaching.', price: 80, category: 'Fitness', image: 'https://picsum.photos/seed/service2/800/600', metadata: JSON.stringify({ provider: 'FitLife', rating: 4.9 }) },
      
      // Jobs
      { id: 'j1', module: 'jobs', title: 'Senior React Developer', description: 'Join our fast-growing team.', price: 150000, category: 'Engineering', image: 'https://picsum.photos/seed/job1/800/600', metadata: JSON.stringify({ type: 'Full-time', location: 'Remote', rating: 4.8 }) },
      { id: 'j2', module: 'jobs', title: 'Product Designer', description: 'Shape the future of our platform.', price: 130000, category: 'Design', image: 'https://picsum.photos/seed/job2/800/600', metadata: JSON.stringify({ type: 'Full-time', location: 'New York, NY', rating: 4.7 }) },
      
      // Classifieds
      { id: 'c1', module: 'classifieds', title: 'Vintage Camera', description: 'Rare 1970s film camera in great condition.', price: 350, category: 'Electronics', image: 'https://picsum.photos/seed/class1/800/600', metadata: JSON.stringify({ condition: 'Used', rating: 4.4 }) },
      { id: 'c2', module: 'classifieds', title: 'Mountain Bike', description: 'High-performance trail bike.', price: 800, category: 'Sports', image: 'https://picsum.photos/seed/class2/800/600', metadata: JSON.stringify({ condition: 'Like New', rating: 4.5 }) },
      
      // Products
      { id: 'pr1', module: 'products', title: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones.', price: 299, category: 'Audio', image: 'https://picsum.photos/seed/prod1/800/600', metadata: JSON.stringify({ brand: 'AudioTech', rating: 4.8 }) },
      { id: 'pr2', module: 'products', title: 'Smart Watch', description: 'Track your health and fitness.', price: 399, category: 'Wearables', image: 'https://picsum.photos/seed/prod2/800/600', metadata: JSON.stringify({ brand: 'WristIt', rating: 4.7 }) },
    ];
    const insertItem = db.prepare("INSERT INTO items (id, module, title, description, price, image, category, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    items.forEach(item => insertItem.run(item.id, item.module, item.title, item.description, item.price, item.image, item.category, item.metadata));
  }

  if (messageCount === 0) {
    console.log("Seeding messages...");
    const messages = [
      { sender: 2, receiver: 1, content: "Is the loft still available for next week?" },
      { sender: 1, receiver: 2, content: "Yes, it is! Would you like to schedule a viewing?" },
      { sender: 2, receiver: 1, content: "That would be great. How about Tuesday at 2 PM?" },
      { sender: 3, receiver: 1, content: "Thanks for the quick response on the Tesla." },
      { sender: 4, receiver: 1, content: "I'm interested in the Senior React Developer position." },
      { sender: 1, receiver: 4, content: "Great! Please send over your resume and portfolio." },
    ];
    const insertMsg = db.prepare("INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)");
    messages.forEach(m => insertMsg.run(m.sender, m.receiver, m.content));
  }

  if (bookingCount === 0) {
    console.log("Seeding bookings...");
    const bookings = [
      { user: 1, item: 'p1', type: 'booking', status: 'confirmed', date: '2024-10-20' },
      { user: 1, item: 'e1', type: 'booking', status: 'pending', date: '2024-10-15' },
      { user: 1, item: 's1', type: 'booking', status: 'completed', date: '2024-03-01' },
      { user: 2, item: 'p2', type: 'booking', status: 'confirmed', date: '2024-11-12' },
      { user: 1, item: 's2', type: 'quote', status: 'pending', date: '2024-10-25' },
      { user: 1, item: 's1', type: 'quote', status: 'confirmed', date: '2024-10-28' },
    ];
    const insertBooking = db.prepare("INSERT INTO bookings (user_id, item_id, type, status, booking_date) VALUES (?, ?, ?, ?, ?)");
    bookings.forEach(b => insertBooking.run(b.user, b.item, b.type, b.status, b.date));
  }

  if (favoriteCount === 0) {
    console.log("Seeding favorites...");
    const favorites = [
      { user: 1, item: 'a1' },
      { user: 1, item: 'p2' },
      { user: 1, item: 'j1' },
      { user: 1, item: 'pr1' },
    ];
    const insertFav = db.prepare("INSERT INTO favorites (user_id, item_id) VALUES (?, ?)");
    favorites.forEach(f => insertFav.run(f.user, f.item));
  }

  if (reviewCount === 0) {
    console.log("Seeding reviews...");
    const reviews = [
      { user: 1, item: 'a1', booking: 3, rating: 5, comment: "Amazing car, very smooth ride!" },
      { user: 1, item: 'p1', booking: 1, rating: 4, comment: "Great location, but a bit noisy at night." },
      { user: 2, item: 'p2', booking: 4, rating: 5, comment: "The villa was absolutely stunning. Perfect vacation!" },
    ];
    const insertReview = db.prepare("INSERT INTO reviews (user_id, item_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)");
    reviews.forEach(r => insertReview.run(r.user, r.item, r.booking, r.rating, r.comment));
  }
};

seedDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get Next Booking
  app.get("/api/user/next-booking", (req, res) => {
    const userId = 1;
    const nextBooking = db.prepare(`
      SELECT b.*, i.title as itemTitle, i.module 
      FROM bookings b
      JOIN items i ON b.item_id = i.id
      WHERE b.user_id = ? AND b.type = 'booking' AND b.status = 'confirmed'
      ORDER BY b.booking_date ASC
      LIMIT 1
    `).get(userId);
    res.json(nextBooking || null);
  });

  // Get User Stats
  app.get("/api/user/stats", (req, res) => {
    const userId = 1;
    const stats = {
      favoritesCount: db.prepare("SELECT COUNT(*) as count FROM favorites WHERE user_id = ?").get(userId).count,
      bookingsCount: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND type = 'booking'").get(userId).count,
      messagesCount: db.prepare("SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0").get(userId).count,
      appsCount: db.prepare("SELECT COUNT(*) as count FROM bookings b JOIN items i ON b.item_id = i.id WHERE b.user_id = ? AND i.module = 'jobs' AND b.type = 'booking'").get(userId).count,
      appointmentsCount: db.prepare("SELECT COUNT(*) as count FROM bookings b JOIN items i ON b.item_id = i.id WHERE b.user_id = ? AND i.module = 'services' AND b.type = 'booking'").get(userId).count,
      quotesCount: db.prepare("SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND type = 'quote'").get(userId).count,
      inquiriesCount: db.prepare("SELECT COUNT(*) as count FROM bookings b JOIN items i ON b.item_id = i.id WHERE b.user_id = ? AND i.module = 'autos' AND b.type = 'booking'").get(userId).count,
      classifiedsActivityCount: db.prepare("SELECT COUNT(*) as count FROM bookings b JOIN items i ON b.item_id = i.id WHERE b.user_id = ? AND i.module = 'classifieds' AND b.type = 'booking'").get(userId).count,
      reviewsCount: db.prepare("SELECT COUNT(*) as count FROM reviews WHERE user_id = ?").get(userId).count,
      // Module counts
      propertiesCount: db.prepare("SELECT COUNT(*) as count FROM items WHERE module = 'properties'").get().count,
      autosCount: db.prepare("SELECT COUNT(*) as count FROM items WHERE module = 'autos'").get().count,
      eventsCount: db.prepare("SELECT COUNT(*) as count FROM items WHERE module = 'events'").get().count,
      servicesCount: db.prepare("SELECT COUNT(*) as count FROM items WHERE module = 'services'").get().count,
      jobsCount: db.prepare("SELECT COUNT(*) as count FROM items WHERE module = 'jobs'").get().count,
      classifiedsCount: db.prepare("SELECT COUNT(*) as count FROM items WHERE module = 'classifieds'").get().count,
      productsCount: db.prepare("SELECT COUNT(*) as count FROM items WHERE module = 'products'").get().count,
      totalItemsCount: db.prepare("SELECT COUNT(*) as count FROM items").get().count,
    };
    res.json(stats);
  });

  // Get User Profile
  app.get("/api/user/profile", (req, res) => {
    const userId = 1;
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    if (user) {
      user.settings = JSON.parse(user.settings || '{}');
    }
    res.json(user);
  });

  // Update User Profile
  app.put("/api/user/profile", (req, res) => {
    const userId = 1;
    const { name, email, phone, location, settings } = req.body;
    
    if (settings) {
      db.prepare("UPDATE users SET name = ?, email = ?, phone = ?, location = ?, settings = ? WHERE id = ?")
        .run(name, email, phone, location, JSON.stringify(settings), userId);
    } else {
      db.prepare("UPDATE users SET name = ?, email = ?, phone = ?, location = ? WHERE id = ?")
        .run(name, email, phone, location, userId);
    }
    
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    if (user) {
      user.settings = JSON.parse(user.settings || '{}');
    }
    res.json(user);
  });

  // Get Favorites
  app.get("/api/favorites", (req, res) => {
    const userId = 1;
    const favorites = db.prepare(`
      SELECT items.* FROM items 
      JOIN favorites ON items.id = favorites.item_id 
      WHERE favorites.user_id = ?
    `).all(userId);
    res.json(favorites.map(f => ({ ...f, metadata: JSON.parse(f.metadata) })));
  });

  // Toggle Favorite
  app.post("/api/favorites/toggle", (req, res) => {
    const { itemId } = req.body;
    const userId = 1;
    const exists = db.prepare("SELECT 1 FROM favorites WHERE user_id = ? AND item_id = ?").get(userId, itemId);
    
    if (exists) {
      db.prepare("DELETE FROM favorites WHERE user_id = ? AND item_id = ?").run(userId, itemId);
      res.json({ status: 'removed' });
    } else {
      db.prepare("INSERT INTO favorites (user_id, item_id) VALUES (?, ?)").run(userId, itemId);
      res.json({ status: 'added' });
    }
  });

  // Get Bookings
  app.get("/api/bookings", (req, res) => {
    const userId = 1;
    const { type } = req.query;
    const bookings = db.prepare(`
      SELECT 
        bookings.*, 
        items.title as itemTitle, 
        items.module,
        (SELECT id FROM reviews WHERE booking_id = bookings.id LIMIT 1) as review_id
      FROM bookings 
      JOIN items ON bookings.item_id = items.id 
      WHERE bookings.user_id = ? AND bookings.type = ?
    `).all(userId, type || 'booking');
    res.json(bookings);
  });

  // Get Items by Module
  app.get("/api/items", (req, res) => {
    const { module } = req.query;
    let items;
    if (module) {
      items = db.prepare("SELECT * FROM items WHERE module = ?").all(module);
    } else {
      items = db.prepare("SELECT * FROM items").all();
    }
    res.json(items.map((f: any) => ({ ...f, metadata: JSON.parse(f.metadata) })));
  });

  // Get Conversations
  app.get("/api/conversations", (req, res) => {
    const userId = 1;
    // This is a simplified query to get unique users the current user has messaged with
    const conversations = db.prepare(`
      SELECT DISTINCT 
        u.id, 
        u.name, 
        u.avatar,
        (SELECT content FROM messages WHERE (sender_id = ? AND receiver_id = u.id) OR (sender_id = u.id AND receiver_id = ?) ORDER BY created_at DESC LIMIT 1) as lastMessage,
        (SELECT created_at FROM messages WHERE (sender_id = ? AND receiver_id = u.id) OR (sender_id = u.id AND receiver_id = ?) ORDER BY created_at DESC LIMIT 1) as time,
        (SELECT COUNT(*) FROM messages WHERE sender_id = u.id AND receiver_id = ? AND is_read = 0) as unread
      FROM users u
      JOIN messages m ON (m.sender_id = ? AND m.receiver_id = u.id) OR (m.sender_id = u.id AND m.receiver_id = ?)
      WHERE u.id != ?
    `).all(userId, userId, userId, userId, userId, userId, userId, userId);
    res.json(conversations);
  });

  // Get Messages
  app.get("/api/messages", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages ORDER BY created_at ASC").all();
    res.json(messages);
  });

  // Send Message
  app.post("/api/messages", (req, res) => {
    const { content, sender_id, receiver_id } = req.body;
    const result = db.prepare("INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)")
      .run(sender_id, receiver_id, content);
    res.json({ id: result.lastInsertRowid, content, sender_id, receiver_id });
  });

  // Get Reviews
  app.get("/api/reviews", (req, res) => {
    const userId = 1;
    const reviews = db.prepare(`
      SELECT 
        reviews.*, 
        items.title as itemTitle, 
        items.image as itemImage,
        items.module as itemModule,
        users.name as userName, 
        users.avatar as userAvatar
      FROM reviews 
      JOIN items ON reviews.item_id = items.id 
      JOIN users ON reviews.user_id = users.id
      WHERE reviews.user_id = ?
      ORDER BY reviews.created_at DESC
    `).all(userId);
    res.json(reviews);
  });

  // Post Review
  app.post("/api/reviews", (req, res) => {
    const userId = 1;
    const { item_id, booking_id, rating, comment } = req.body;
    const result = db.prepare("INSERT INTO reviews (user_id, item_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)")
      .run(userId, item_id, booking_id, rating, comment);
    
    const newReview = db.prepare(`
      SELECT reviews.*, items.title as itemTitle, items.image as itemImage
      FROM reviews 
      JOIN items ON reviews.item_id = items.id 
      WHERE reviews.id = ?
    `).get(result.lastInsertRowid);
    
    res.json(newReview);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
