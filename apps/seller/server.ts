import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import db from "./src/db/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const portArgIndex = process.argv.findIndex((arg) => arg === "--port" || arg === "-p");
  const portArg = portArgIndex >= 0 ? process.argv[portArgIndex + 1] : undefined;
  const PORT = Number(portArg || process.env.PORT || 3000);

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare(`
      SELECT p.*, c.title as category_title 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `).all();
    
    const formattedProducts = products.map((p: any) => ({
      ...p,
      pricing: { base_price: p.base_price, sale_price: p.sale_price, formatted: `$${p.base_price}` },
      inventory: { stock_quantity: p.stock_quantity, in_stock: p.stock_quantity > 0, manage_stock: p.manage_stock },
      category: { id: p.category_id, title: p.category_title },
      brand: { title: p.brand_title },
      specs: { weight: p.weight, dimensions: p.dimensions }
    }));

    res.json({ data: { data: formattedProducts } });
  });

  app.get("/api/products/:slug", (req, res) => {
    const product: any = db.prepare(`
      SELECT p.*, c.title as category_title 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `).get(req.params.slug);

    if (product) {
      const formatted = {
        ...product,
        pricing: { base_price: product.base_price, sale_price: product.sale_price, formatted: `$${product.base_price}` },
        inventory: { stock_quantity: product.stock_quantity, in_stock: product.stock_quantity > 0, manage_stock: product.manage_stock },
        category: { id: product.category_id, title: product.category_title },
        brand: { title: product.brand_title },
        specs: { weight: product.weight, dimensions: product.dimensions }
      };
      res.json({ data: { data: formatted } });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  });

  app.post("/api/products", (req, res) => {
    const { title, sku, category_id, base_price, stock_quantity, description } = req.body;
    const slug = title?.toLowerCase().replace(/ /g, '-');
    
    try {
      const info = db.prepare(`
        INSERT INTO products (title, slug, sku, category_id, base_price, stock_quantity, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(title, slug, sku, category_id, base_price, stock_quantity, description);

      res.status(201).json({ 
        data: { 
          id: info.lastInsertRowid,
          message: "Product created successfully" 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.post("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, sku, category_id, base_price, stock_quantity, description } = req.body;
    
    try {
      db.prepare(`
        UPDATE products 
        SET title = ?, sku = ?, category_id = ?, base_price = ?, stock_quantity = ?, description = ?
        WHERE id = ?
      `).run(title, sku, category_id, base_price, stock_quantity, description, id);

      res.json({ message: "Product updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    try {
      db.prepare('DELETE FROM products WHERE id = ?').run(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  app.get("/api/users", (req, res) => {
    const users = db.prepare('SELECT id, name, email, role FROM users').all();
    res.json(users);
  });

  // Properties API
  app.get("/api/properties", (req, res) => {
    const properties = db.prepare('SELECT * FROM properties').all();
    const formatted = properties.map((p: any) => ({
      ...p,
      is_active: !!p.is_active,
      media: [{ original_url: p.image_url }]
    }));
    res.json({ data: { data: formatted } });
  });

  // Autos API
  app.get("/api/autos", (req, res) => {
    const autos = db.prepare('SELECT * FROM autos').all();
    const formatted = autos.map((a: any) => ({
      ...a,
      is_active: !!a.is_active,
      media: [{ original_url: a.image_url }]
    }));
    res.json({ data: { data: formatted } });
  });

  // Events API
  app.get("/api/events", (req, res) => {
    const events = db.prepare('SELECT * FROM events').all();
    const formatted = events.map((e: any) => ({
      ...e,
      is_active: !!e.is_active,
      media: [{ original_url: e.image_url }]
    }));
    res.json({ data: { data: formatted } });
  });

  // Jobs API
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare('SELECT * FROM jobs').all();
    const formatted = jobs.map((j: any) => ({
      ...j,
      is_active: !!j.is_active,
      media: [{ original_url: j.image_url }]
    }));
    res.json({ data: { data: formatted } });
  });

  // Services API
  app.get("/api/services", (req, res) => {
    const services = db.prepare('SELECT * FROM services').all();
    const formatted = services.map((s: any) => ({
      ...s,
      is_active: !!s.is_active,
      media: [{ original_url: s.image_url }]
    }));
    res.json({ data: { data: formatted } });
  });

  // Classifieds API
  app.get("/api/classifieds", (req, res) => {
    const classifieds = db.prepare('SELECT * FROM classifieds').all();
    const formatted = classifieds.map((c: any) => ({
      ...c,
      is_active: !!c.is_active,
      media: [{ original_url: c.image_url }]
    }));
    res.json({ data: { data: formatted } });
  });

  // Customers API
  app.get("/api/customers", (req, res) => {
    const customers = db.prepare('SELECT * FROM customers').all();
    res.json({ data: { data: customers } });
  });

  // Reviews API
  app.get("/api/reviews", (req, res) => {
    const reviews = db.prepare('SELECT * FROM reviews').all();
    res.json({ data: { data: reviews } });
  });

  // Messages API
  app.get("/api/messages", (req, res) => {
    const messages = db.prepare('SELECT * FROM messages').all();
    const formatted = messages.map((m: any) => ({
      ...m,
      unread: !!m.unread
    }));
    res.json({ data: { data: formatted } });
  });

  // Transactions API
  app.get("/api/transactions", (req, res) => {
    const transactions = db.prepare('SELECT * FROM transactions WHERE user_id = 2 ORDER BY id DESC').all();
    res.json({ data: { data: transactions } });
  });

  // Wallet API
  app.get("/api/wallet", (req, res) => {
    const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = 2').get();
    if (wallet) {
      res.json({ data: wallet });
    } else {
      res.status(404).json({ error: "Wallet not found" });
    }
  });

  app.post("/api/wallet/withdraw", (req, res) => {
    const { amount, method } = req.body;
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const wallet = db.prepare('SELECT * FROM wallets WHERE user_id = 2').get();
    if (!wallet || wallet.balance < amountNum) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    try {
      const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      
      // Update wallet
      db.prepare('UPDATE wallets SET balance = balance - ?, last_updated = ? WHERE user_id = 2')
        .run(amountNum, new Date().toISOString());

      // Create transaction
      db.prepare(`
        INSERT INTO transactions (user_id, type, title, amount, amount_value, date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(2, 'payout', `Withdrawal to ${method || 'Bank Account'}`, `-$${amountNum.toFixed(2)}`, -amountNum, date, 'Pending');

      res.json({ message: "Withdrawal initiated successfully" });
    } catch (error) {
      console.error('Withdrawal error:', error);
      res.status(500).json({ error: "Failed to process withdrawal" });
    }
  });

  // Notifications API
  app.get("/api/notifications", (req, res) => {
    const notifications = db.prepare('SELECT * FROM notifications').all();
    const formatted = notifications.map((n: any) => ({
      ...n,
      read: !!n.read
    }));
    res.json({ data: { data: formatted } });
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    
    if (user) {
      res.json({
        token: 'real-jwt-token-from-sqlite',
        user: { name: user.name, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Activities API
  app.get("/api/activities", (req, res) => {
    const { module, type } = req.query;
    let activities;
    
    if (module && type) {
      activities = db.prepare('SELECT * FROM activities WHERE module = ? AND type = ?').all(module, type);
    } else if (type) {
      activities = db.prepare('SELECT * FROM activities WHERE type = ?').all(type);
    } else {
      activities = db.prepare('SELECT * FROM activities').all();
    }
    
    res.json({ data: { data: activities } });
  });

  app.get("/api/activities/:id", (req, res) => {
    const { id } = req.params;
    const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
    
    if (activity) {
      res.json({ data: activity });
    } else {
      res.status(404).json({ error: "Activity not found" });
    }
  });

  app.get("/api/sidebar-counts", (req, res) => {
    try {
      const getCount = (table: string, where: string = '') => {
        try {
          const query = `SELECT COUNT(*) as count FROM ${table} ${where}`;
          return (db.prepare(query).get() as any).count;
        } catch (e) {
          console.error(`Error counting ${table}:`, e);
          return 0;
        }
      };

      const counts = {
        properties: getCount('properties'),
        events: getCount('events'),
        autos: getCount('autos'),
        jobs: getCount('jobs'),
        services: getCount('services'),
        products: getCount('products'),
        classifieds: getCount('classifieds'),
        activity_properties: getCount('activities', "WHERE module = 'properties'"),
        activity_events: getCount('activities', "WHERE module = 'events'"),
        activity_autos: getCount('activities', "WHERE module = 'autos'"),
        activity_joblistings: getCount('activities', "WHERE module = 'joblistings'"),
        activity_services: getCount('activities', "WHERE module = 'services'"),
        activity_products: getCount('activities', "WHERE module = 'products'"),
        activity_classifieds: getCount('activities', "WHERE module = 'classifieds'"),
        customers: getCount('customers'),
        reviews: getCount('reviews'),
        messages: getCount('messages', 'WHERE unread = 1'),
        notifications: getCount('notifications', 'WHERE read = 0'),
        wallet: getCount('transactions'),
        payouts: getCount('transactions', "WHERE type = 'payout'"),
        memberships: 12, // Mocked as no table yet
        analytics: 84, // Mocked as no table yet
      };
      res.json({ data: counts });
    } catch (error) {
      console.error('Sidebar counts error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch sidebar counts', 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Dashboard Stats
  app.get('/api/dashboard', (req, res) => {
    try {
      const getCount = (table: string, where: string = '') => {
        try {
          const query = `SELECT COUNT(*) as count FROM ${table} ${where}`;
          return (db.prepare(query).get() as any).count;
        } catch (e) {
          return 0;
        }
      };

      const moduleCounts = {
        properties: getCount('properties'),
        events: getCount('events'),
        autos: getCount('autos'),
        jobs: getCount('jobs'),
        services: getCount('services'),
        products: getCount('products'),
        classifieds: getCount('classifieds'),
      };

      const messagesCount = getCount('messages', 'WHERE unread = 1');
      const notificationsCount = getCount('notifications', 'WHERE read = 0');
      
      const recentProducts = db.prepare('SELECT id, title, slug, is_published FROM products ORDER BY id DESC LIMIT 5').all() as any[];
      
      const recentListings = recentProducts.map(p => ({
        ...p,
        is_active: p.is_published,
        module_type: 'Product'
      }));

      res.json({
        data: {
          stats: {
            activeInventory: Object.values(moduleCounts).reduce((a, b) => a + b, 0),
            urgentAlerts: messagesCount + notificationsCount,
            marketViews: 3120,
            totalRevenue: 12400,
            moduleCounts,
            alerts: {
              messages: messagesCount,
              notifications: notificationsCount
            },
            revenue: {
              earnings: 15600,
              payouts: 3200
            }
          },
          recentListings
        }
      });
    } catch (error) {
      console.error('Dashboard data error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
