'use client';

import React from 'react';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

interface ArtistCardProps {
    name: string;
    image: string;
    genre: string;
}

const ArtistCard = ({ name, image, genre }: ArtistCardProps) => (
    <div className="artist-card-premium">
        <img src={image} alt={name} className="artist-img" />
        <div className="artist-info">
            <div className="artist-genre-label">{genre.toUpperCase()}</div>
            <h3 className="artist-name">{name}</h3>
        </div>
    </div>
);

export const LineupGrid = () => {
    const artist1Name = useThemeContent('lineup.artist_1_name', 'Void Phase');
    const artist1Genre = useThemeContent('lineup.artist_1_genre', 'Techno');
    const artist1Image = useThemeMedia('lineup.artist_1_image', '/themes/events/music/21.webp');

    const artist2Name = useThemeContent('lineup.artist_2_name', 'Neon Pulse');
    const artist2Genre = useThemeContent('lineup.artist_2_genre', 'Synthwave');
    const artist2Image = useThemeMedia('lineup.artist_2_image', '/themes/events/music/22.webp');

    const artist3Name = useThemeContent('lineup.artist_3_name', 'Static Ghost');
    const artist3Genre = useThemeContent('lineup.artist_3_genre', 'Ambient');
    const artist3Image = useThemeMedia('lineup.artist_3_image', '/themes/events/music/23.webp');

    const artist4Name = useThemeContent('lineup.artist_4_name', 'Iron Logic');
    const artist4Genre = useThemeContent('lineup.artist_4_genre', 'Industrial');
    const artist4Image = useThemeMedia('lineup.artist_4_image', '/themes/events/music/24.webp');

    const artist5Name = useThemeContent('lineup.artist_5_name', 'Digital Riot');
    const artist5Genre = useThemeContent('lineup.artist_5_genre', 'Glitch');
    const artist5Image = useThemeMedia('lineup.artist_5_image', '/themes/events/music/25.webp');

    const artist6Name = useThemeContent('lineup.artist_6_name', 'Hyper Drive');
    const artist6Genre = useThemeContent('lineup.artist_6_genre', 'Drum & Bass');
    const artist6Image = useThemeMedia('lineup.artist_6_image', '/themes/events/music/26.webp');

    const artist7Name = useThemeContent('lineup.artist_7_name', 'Sonic Bloom');
    const artist7Genre = useThemeContent('lineup.artist_7_genre', 'Experimental');
    const artist7Image = useThemeMedia('lineup.artist_7_image', '/themes/events/music/27.webp');

    const artist8Name = useThemeContent('lineup.artist_8_name', 'Nodal Flow');
    const artist8Genre = useThemeContent('lineup.artist_8_genre', 'Deep House');
    const artist8Image = useThemeMedia('lineup.artist_8_image', '/themes/events/music/28.webp');

    const artists = [
        { name: artist1Name, genre: artist1Genre, image: artist1Image },
        { name: artist2Name, genre: artist2Genre, image: artist2Image },
        { name: artist3Name, genre: artist3Genre, image: artist3Image },
        { name: artist4Name, genre: artist4Genre, image: artist4Image },
        { name: artist5Name, genre: artist5Genre, image: artist5Image },
        { name: artist6Name, genre: artist6Genre, image: artist6Image },
        { name: artist7Name, genre: artist7Genre, image: artist7Image },
        { name: artist8Name, genre: artist8Genre, image: artist8Image },
    ];

    return (
        <section className="lineup-grid" id="sonic-lineup-section">
            {artists.map((a) => <ArtistCard key={a.name} {...a} />)}
        </section>
    );
};
