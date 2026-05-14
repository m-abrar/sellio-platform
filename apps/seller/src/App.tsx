import React from 'react'

function App() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">SELLIO SELLER</div>
        <nav>
          <a href="#" className="nav-item active">
            <span style={{ marginRight: '12px' }}>📊</span> Dashboard
          </a>
          <a href="#" className="nav-item">
            <span style={{ marginRight: '12px' }}>📦</span> Products
          </a>
          <a href="#" className="nav-item">
            <span style={{ marginRight: '12px' }}>🛒</span> Orders
          </a>
          <a href="#" className="nav-item">
            <span style={{ marginRight: '12px' }}>👥</span> Customers
          </a>
          <a href="#" className="nav-item">
            <span style={{ marginRight: '12px' }}>⚙️</span> Settings
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Overview</h1>
            <p style={{ color: '#64748b' }}>Welcome back, StyleTime HQ</p>
          </div>
          <button className="btn-primary">+ Add Product</button>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">$124,592.00</div>
            <div className="stat-trend up">↑ 12.5% from last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">1,205</div>
            <div className="stat-trend up">↑ 4.2% from last month</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Products</div>
            <div className="stat-value">48</div>
            <div className="stat-trend" style={{ color: '#64748b' }}>Stable</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Conversion Rate</div>
            <div className="stat-value">3.4%</div>
            <div className="stat-trend up">↑ 0.8% from last month</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Orders</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-7421</td>
                <td>Sarah Johnson</td>
                <td>Premium Silk Scarf</td>
                <td>$85.00</td>
                <td><span className="badge badge-success">Shipped</span></td>
              </tr>
              <tr>
                <td>#ORD-7422</td>
                <td>Michael Chen</td>
                <td>Leather Watch Band</td>
                <td>$45.00</td>
                <td><span className="badge badge-pending">Processing</span></td>
              </tr>
              <tr>
                <td>#ORD-7423</td>
                <td>Elena Rodriguez</td>
                <td>Minimalist Wallet</td>
                <td>$120.00</td>
                <td><span className="badge badge-success">Shipped</span></td>
              </tr>
              <tr>
                <td>#ORD-7424</td>
                <td>David Wilson</td>
                <td>Wool Beanie</td>
                <td>$35.00</td>
                <td><span className="badge badge-success">Shipped</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default App
