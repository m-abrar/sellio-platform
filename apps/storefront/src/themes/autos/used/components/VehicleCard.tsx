
import React from 'react';

interface VehicleCardProps {
    year: string;
    make: string;
    model: string;
    price: string;
    mileage: string;
    transmission: string;
    image: string;
}

export const VehicleCard = ({ year, make, model, price, mileage, transmission, image }: VehicleCardProps) => (
    <div className="vehicle-card">
        <img src={image} alt={`${year} ${make} ${model}`} className="vehicle-img" />
        <div className="vehicle-info">
            <div className="vehicle-year-make">{year} {make.toUpperCase()}</div>
            <h3 className="vehicle-model">{model}</h3>
            <div className="vehicle-price">{price}</div>
            <div className="vehicle-meta">
                <span>📍 {mileage}</span>
                <span>⚙️ {transmission}</span>
            </div>
            <button style={{ 
                width: '100%', 
                marginTop: '1.5rem', 
                background: 'none', 
                border: '1px solid #ddd', 
                padding: '0.75rem', 
                fontSize: '0.75rem', 
                fontWeight: 700,
                borderRadius: '4px'
            }}>
                VIEW_HISTORY_REPORT
            </button>
        </div>
    </div>
);
