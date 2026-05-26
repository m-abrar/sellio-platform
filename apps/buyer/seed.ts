import Database from "better-sqlite3";
import { 
  PROPERTIES, 
  EVENTS, 
  AUTOS, 
  SERVICES, 
  JOBS, 
  CLASSIFIEDS, 
  PRODUCTS 
} from "./src/data";

const db = new Database("database.sqlite");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    avatar TEXT
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Clear existing data
db.exec("DELETE FROM items");
db.exec("DELETE FROM users");
db.exec("DELETE FROM favorites");
db.exec("DELETE FROM bookings");

// Insert a default user
db.prepare("INSERT INTO users (id, name, email, avatar) VALUES (?, ?, ?, ?)")
  .run(1, "John Doe", "john.doe@example.com", "https://picsum.photos/seed/user/100/100");

const insertItem = db.prepare(`
  INSERT INTO items (id, module, title, description, price, image, category, metadata)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const allData = [
  { module: 'properties', items: PROPERTIES },
  { module: 'events', items: EVENTS },
  { module: 'autos', items: AUTOS },
  { module: 'services', items: SERVICES },
  { module: 'jobs', items: JOBS },
  { module: 'classifieds', items: CLASSIFIEDS },
  { module: 'products', items: PRODUCTS },
];

for (const group of allData) {
  for (const item of group.items) {
    const { id, title, description, price, image, category, ...metadata } = item;
    insertItem.run(id, group.module, title, description, price, image, category, JSON.stringify(metadata));
  }
}

// Add some initial favorites for the user
const favoriteItems = ['p1', 'e1', 'a1', 'j1'];
const insertFavorite = db.prepare("INSERT INTO favorites (user_id, item_id) VALUES (?, ?)");
for (const itemId of favoriteItems) {
  insertFavorite.run(1, itemId);
}

// Add some initial bookings
const insertBooking = db.prepare("INSERT INTO bookings (user_id, item_id, status, booking_date) VALUES (?, ?, ?, ?)");
insertBooking.run(1, 'e1', 'confirmed', '2024-09-15');
insertBooking.run(1, 's1', 'pending', '2024-08-10');

console.log("Database seeded successfully!");
