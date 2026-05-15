
import React from 'react';

interface VehicleCardProps {
    name: string;
    price: string;
    hp: string;
    acceleration: string;
    image: string;
}

const VehicleCard = ({ name, price, hp, acceleration, image }: VehicleCardProps) => (
    <div className="vehicle-card-premium">
        <div className="vehicle-img-wrapper">
            <img src={image} alt={name} className="vehicle-img" />
        </div>
        <div className="vehicle-info">
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--drive-blue)', letterSpacing: '3px', marginBottom: '1rem' }}>EXOTIC_CLASS</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>{name}</h3>
            <div className="vehicle-price">{price}</div>
            <div style={{ display: 'flex', gap: '3rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--drive-border)' }}>
                <div>
                    <div style={{ fontSize: '0.65rem', color: '#444', fontWeight: 800 }}>HORSEPOWER</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{hp}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.65rem', color: '#444', fontWeight: 800 }}>0-100_KMH</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{acceleration}</div>
                </div>
            </div>
        </div>
    </div>
);

export const VehicleShowcase = () => {
    const vehicles = [
        { name: "Aventador SVJ", price: "$517,000", hp: "770 HP", acceleration: "2.8s", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2070" },
        { name: "911 GT3 RS", price: "$223,000", hp: "518 HP", acceleration: "3.2s", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
    ];

    return (
        <section className="vehicle-showcase">
            <div style={{ marginBottom: '8rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--drive-blue)', letterSpacing: '5px' }}>THE_DIAMOND_COLLECTION</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 800, color: 'white', marginTop: '1.5rem', letterSpacing: '-3px' }}>Ultimate Velocity.</h2>
            </div>
            <div className="vehicle-grid">
                {vehicles.map((v, i) => <VehicleCard key={i} {...v} />)}
            </div>
        </section>
    );
};
