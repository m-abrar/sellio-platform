import React from 'react';
import { MapExperienceCard, GlowMarker } from './components';

export default function EventsMapPage() {
  const experiences = [
    { title: "Jazz in the Square", location: "Tompkins Sq, NYC", price: "$25", date: "Tonight, 8PM", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2070" },
    { title: "Neon Art Showcase", location: "Art Haus, BK", price: "$15", date: "Tonight, 9PM", image: "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=2070" },
    { title: "Indie Rock Night", location: "The Bowery, NYC", price: "$35", date: "Tonight, 10PM", image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070" },
    { title: "Rooftop Mixer", location: "Cloud 9, NYC", price: "$55", date: "Tonight, 7PM", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070" },
    { title: "Street Food Festival", location: "Lower East Side", price: "Free", date: "Tonight, 6PM", image: "https://images.unsplash.com/photo-1531050171605-723ee305e33c?q=80&w=2070" },
  ];

  return (
    <>
      <div className="vibe-map-canvas">
        <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(#c4b5fd 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          {/* Simulated Vibe Map */}
          <GlowMarker top="25%" left="35%" active={true} />
          <GlowMarker top="50%" left="20%" />
          <GlowMarker top="45%" left="65%" active={true} />
          <GlowMarker top="75%" left="50%" />
          <GlowMarker top="20%" left="75%" />
          
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(88, 28, 135, 0.1)', borderLeft: '4px solid #db2777' }}>
            <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#581c87' }}>Neighborhood Pulse</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>High Activity: East Village</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#db2777', marginTop: '0.5rem' }}>12 EVENTS TONIGHT</div>
          </div>
        </div>
      </div>

      <div className="experience-side-feed">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 900, color: '#581c87' }}>{experiences.length} VIBES_FOUND</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#db2777' }}>REFINE_</span>
        </div>
        {experiences.map((exp, i) => (
          <MapExperienceCard key={i} {...exp} />
        ))}
        <div style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.4, fontSize: '0.75rem' }}>
          Updated 2 minutes ago
        </div>
      </div>
    </>
  );
}
