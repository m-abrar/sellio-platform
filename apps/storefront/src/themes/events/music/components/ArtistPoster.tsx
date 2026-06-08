
import React from 'react';

interface ArtistPosterProps {
    name: string;
    date: string;
    image: string;
}

export const ArtistPoster = ({ name, date, image }: ArtistPosterProps) => (
    <div className="artist-poster">
        <img src={image} alt={name} className="artist-img" />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }}></div>
        <div className="artist-info">
            <h3 className="artist-name">{name}</h3>
            <p className="artist-date">{date}</p>
        </div>
    </div>
);
