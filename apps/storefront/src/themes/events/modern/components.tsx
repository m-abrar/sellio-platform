import React from 'react';

export const EventHeader = () => (
  <header className="event-header">
    <div className="event-logo">EVENT_FLOW</div>
    <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
      <span>Today</span>
      <span>This Weekend</span>
      <span>By Category</span>
    </div>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>EXPLORE_</span>
      <button style={{ 
        background: 'var(--color-violet)', 
        color: 'white', 
        padding: '0.6rem 1.5rem', 
        borderRadius: '100px', 
        border: 'none', 
        fontWeight: 700,
        fontSize: '0.85rem'
      }}>
        + Create Event
      </button>
    </div>
  </header>
);

export const DiscoveryBubble = ({ title, category, image }: { title: string, category: string, image: string }) => (
  <div className="discovery-bubble">
    <img src={image} alt={title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{category}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{title}</div>
    </div>
  </div>
);

export const DateCard = ({ title, location, price, month, day, image }: { title: string, location: string, price: string, month: string, day: string, image: string }) => (
  <div className="date-card-modern">
    <div style={{ height: '200px', position: 'relative' }}>
      <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div className="card-date-badge">
        <span className="date-month">{month}</span>
        <span className="date-day">{day}</span>
      </div>
    </div>
    <div style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.2rem' }}>{title}</h3>
      <div style={{ opacity: 0.5, fontSize: '0.85rem', marginBottom: '1.5rem' }}>{location}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="ticket-price-modern">from {price}</div>
        <button className="buy-ticket-btn">BUY_TICKETS</button>
      </div>
    </div>
  </div>
);

export const EventFooter = () => (
  <footer className="modern-event-footer">
    <div>
      <div className="event-logo" style={{ marginBottom: '1rem' }}>EVENT_FLOW</div>
      <p style={{ opacity: 0.4, fontSize: '0.85rem', maxWidth: '300px' }}>Discover the most impactful events in your city and beyond.</p>
    </div>
    <div style={{ display: 'flex', gap: '4rem' }}>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '1rem' }}>DISCOVER</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
          <span>Concerts</span>
          <span>Workshops</span>
          <span>Conferences</span>
        </div>
      </div>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '0.8rem', marginBottom: '1rem' }}>PLATFORM</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
          <span>Pricing</span>
          <span>Ticketing</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  </footer>
);
