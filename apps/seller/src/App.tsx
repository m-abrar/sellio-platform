
import React from 'react'
import './App.css'

function App() {
  const recentOrders = [
    { id: "#ORD-7421", customer: "Sarah Johnson", product: "Premium Silk Scarf", amount: "$85.00", status: "Shipped", statusType: "success" },
    { id: "#ORD-7422", customer: "Michael Chen", product: "Leather Watch Band", amount: "$45.00", status: "Processing", statusType: "pending" },
    { id: "#ORD-7423", customer: "Elena Rodriguez", product: "Minimalist Wallet", amount: "$120.00", status: "Shipped", statusType: "success" },
    { id: "#ORD-7424", customer: "David Wilson", product: "Wool Beanie", amount: "$35.00", status: "Shipped", statusType: "success" },
    { id: "#ORD-7425", customer: "James Blake", product: "Classic Fedora", amount: "$95.00", status: "Processing", statusType: "pending" },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar Elite */}
      <aside className="sidebar">
        <div className="sidebar-logo">SELLIO_SELLER</div>
        <nav style={{ flex: 1 }}>
          <a href="#" className="nav-item active">
            <span style={{ marginRight: '12px' }}>📊</span> DASHBOARD
          </a>
          <a href="#" className="nav-item">
            <span style={{ marginRight: '12px' }}>📦</span> INVENTORY
          </a>
          <a href="#" className="nav-item">
            <span style={{ marginRight: '12px' }}>🛒</span> ORDERS
          </a>
          <a href="#" className="nav-item">
            <span style={{ marginRight: '12px' }}>👥</span> NODES
          </a>
          <a href="#" className="nav-item">
            <span style={{ marginRight: '12px' }}>📈</span> ANALYTICS
          </a>
        </nav>
        
        <div className="card" style={{ padding: '1.5rem', marginTop: 'auto', marginBottom: 0, borderRadius: '16px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>STORAGE_QUOTA</div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.5rem' }}>
            <div style={{ width: '65%', height: '100%', background: 'var(--color-emerald)' }}></div>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>6.5GB / 10GB</div>
        </div>
      </aside>

      {/* Main Content Elite */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Mission Control</h1>
            <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Welcome back, node_administrator/StyleTime_HQ</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ padding: '0.875rem 1.5rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--color-emerald)', borderRadius: '50%', boxShadow: '0 0 10px var(--color-emerald)' }}></div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>LIVE_STATUS: STABLE</span>
            </div>
            <button className="btn-primary">INITIALIZE_DISTRIBUTION</button>
          </div>
        </header>

        {/* Real-time stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">TOTAL_VOLUME</div>
            <div className="stat-value">$124,592</div>
            <div className="stat-trend up">↑ 12.5% VS_PREV_NODE</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">NODE_THROUGHPUT</div>
            <div className="stat-value">1,205</div>
            <div className="stat-trend up">↑ 4.2% ACTIVE_SYNC</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">ACTIVE_DISTRIBUTION</div>
            <div className="stat-value">48</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>STABLE_NODE</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">SYNC_EFFICIENCY</div>
            <div className="stat-value">3.4%</div>
            <div className="stat-trend up">↑ 0.8% OPTIMIZED</div>
          </div>
        </div>

        {/* Charts & Tables */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h3>RECENT_TRANSACTIONS</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-emerald)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>VIEW_ALL_NODES</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>NODE_ID</th>
                  <th>SOURCE</th>
                  <th>DISTRIBUTION</th>
                  <th>VOLUME</th>
                  <th>PROTOCOL</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i}>
                    <td><code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{order.id}</code></td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td>{order.amount}</td>
                    <td><span className={`badge badge-${order.statusType}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>ACTIVE_ALERTS</h3>
            <div style={{ marginTop: '2rem' }}>
              {[
                { title: "Node sync required", desc: "Inventory node #42 needs reconciliation.", color: "#fbbf24" },
                { title: "High volume detected", desc: "Node throughput increased by 40% in Manhattan.", color: "var(--color-emerald)" },
                { title: "Security protocol active", desc: "Encryption layers rotating in 12m.", color: "#3b82f6" },
              ].map((alert, i) => (
                <div key={i} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', borderLeft: `4px solid ${alert.color}`, marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.25rem' }}>{alert.title.toUpperCase()}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{alert.desc}</div>
                </div>
              ))}
            </div>
            
            <button style={{ width: '100%', marginTop: '2rem', padding: '1.25rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
              CLEAR_ALL_ALERTS
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
