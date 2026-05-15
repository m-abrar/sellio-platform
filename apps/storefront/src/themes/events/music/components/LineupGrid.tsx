
import React from 'react';

interface ArtistCardProps {
    name: string;
    image: string;
    genre: string;
}

const ArtistCard = ({ name, image, genre }: ArtistCardProps) => (
    <div className="artist-card-premium">
        <img src={image} alt={name} className="artist-img" />
        <div className="artist-info">
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--sonic-pink)', letterSpacing: '4px', marginBottom: '0.5rem' }}>{genre.toUpperCase()}</div>
            <h3 className="artist-name">{name}</h3>
        </div>
    </div>
);

export const LineupGrid = () => {
    const artists = [
        { name: "Void Phase", genre: "Techno", image: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?q=80&w=2070" },
        { name: "Neon Pulse", genre: "Synthwave", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070" },
        { name: "Static Ghost", genre: "Ambient", image: "https://images.unsplash.com/photo-1514525253361-b83f859b73c0?q=80&w=2070" },
        { name: "Iron Logic", genre: "Industrial", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070" },
        { name: "Digital Riot", genre: "Glitch", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070" },
        { name: "Hyper Drive", genre: "Drum & Bass", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2070" },
        { name: "Sonic Bloom", genre: "Experimental", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070" },
        { name: "Nodal Flow", genre: "Deep House", image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070" },
    ];

    return (
        <section className="lineup-grid">
            {artists.map((a, i) => <ArtistCard key={i} {...a} />)}
        </section>
    );
};
