import React from 'react';
import { DiscoveryBubble, DateCard } from './components';

export default function ModernEventsPage() {
  const trending = [
    { title: "Summer Sonic 2026", category: "MUSIC_FESTIVAL", image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070" },
    { title: "AI Design Workshop", category: "EDUCATION", image: "https://images.unsplash.com/photo-1591115765373-520b7a217294?q=80&w=2070" },
    { title: "Global Coffee Expo", category: "LIFESTYLE", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070" },
    { title: "Urban Night Run", category: "SPORTS", image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070" },
    { title: "Indie Film Showcase", category: "ARTS", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2070" },
  ];

  const events = [
    { title: "Midnight Jazz Session", location: "Blue Note, New York", price: "$45", month: "JUN", day: "12", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070" },
    { title: "Tech Founder Mixer", location: "Hub 42, San Francisco", price: "$20", month: "JUN", day: "14", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070" },
    { title: "Rooftop Yoga Flow", location: "Sky Terrace, Austin", price: "$15", month: "JUN", day: "15", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070" },
    { title: "Artisan Craft Fair", location: "Town Square, Portland", price: "Free", month: "JUN", day: "18", image: "https://images.unsplash.com/photo-1531050171605-723ee305e33c?q=80&w=2070" },
  ];

  return (
    <div>
      <section style={{ padding: '4rem 4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-outfit)', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Happening in Your City.</h1>
        <p style={{ opacity: 0.5, fontSize: '1.1rem' }}>The most impactful experiences, curated by date and relevance.</p>
      </section>

      <div className="discovery-rail">
        {trending.map((item, i) => (
          <DiscoveryBubble key={i} {...item} />
        ))}
      </div>

      <section style={{ padding: '4rem 4rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '2rem', fontWeight: 800 }}>Upcoming Experiences</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ padding: '0.6rem 1.2rem', background: 'white', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.85rem', fontWeight: 700 }}>This Weekend</div>
          <div style={{ padding: '0.6rem 1.2rem', background: 'white', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.85rem', fontWeight: 700 }}>All Filters</div>
        </div>
      </section>

      <div className="event-grid-modern">
        {events.map((event, i) => (
          <DateCard key={i} {...event} />
        ))}
      </div>

      <section style={{ padding: '8rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: 'var(--color-violet)', padding: '6rem', borderRadius: '48px', color: 'white', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Host your own event.</h2>
            <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
              Our platform provides the world's most powerful ticketing and discovery tools for event creators. Scale your audience from 10 to 10,000+ seamlessly.
            </p>
            <button style={{ 
              backgroundColor: 'white', 
              color: 'var(--color-violet)', 
              padding: '1.2rem 4rem', 
              borderRadius: '100px', 
              border: 'none', 
              fontFamily: 'var(--font-outfit)', 
              fontWeight: 800,
              cursor: 'pointer'
            }}>
              Get Started Now
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', height: '150px', borderRadius: '24px' }}></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
