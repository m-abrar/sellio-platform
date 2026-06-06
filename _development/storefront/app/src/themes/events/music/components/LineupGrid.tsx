
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
        { name: "Void Phase", genre: "Techno", image: "/themes/events/music/21.webp" },
        { name: "Neon Pulse", genre: "Synthwave", image: "/themes/events/music/22.webp" },
        { name: "Static Ghost", genre: "Ambient", image: "/themes/events/music/23.webp" },
        { name: "Iron Logic", genre: "Industrial", image: "/themes/events/music/24.webp" },
        { name: "Digital Riot", genre: "Glitch", image: "/themes/events/music/25.webp" },
        { name: "Hyper Drive", genre: "Drum & Bass", image: "/themes/events/music/26.webp" },
        { name: "Sonic Bloom", genre: "Experimental", image: "/themes/events/music/27.webp" },
        { name: "Nodal Flow", genre: "Deep House", image: "/themes/events/music/28.webp" },
    ];

    return (
        <section className="lineup-grid" id="sonic-lineup-section">
            {artists.map((a, i) => <ArtistCard key={i} {...a} />)}
        </section>
    );
};

