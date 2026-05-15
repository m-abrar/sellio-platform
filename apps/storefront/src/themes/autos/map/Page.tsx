import React from 'react';
import { DealerVehicleCard, DealerMarker } from './components';

export default function AutosMapPage() {
  const inventory = [
    { name: "Audi RS e-tron GT", price: "$147,000", year: 2024, km: "1,200 km", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2070" },
    { name: "BMW i7 M70 xDrive", price: "$168,500", year: 2024, km: "500 km", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070" },
    { name: "Porsche Taycan Turbo S", price: "$194,900", year: 2024, km: "2,400 km", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
    { name: "Mercedes-AMG EQS 53", price: "$152,000", year: 2024, km: "150 km", image: "https://images.unsplash.com/photo-1617788131775-ceb2027fd12c?q=80&w=2070" },
    { name: "Tesla Model S Plaid", price: "$82,000", year: 2023, km: "12,000 km", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071" },
  ];

  return (
    <>
      <div className="dealer-inventory-feed">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800 }}>{inventory.length} VEHICLES IN STOCK</span>
          <select style={{ border: 'none', background: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
            <option>Sort: Distance</option>
          </select>
        </div>
        {inventory.map((car, i) => (
          <DealerVehicleCard key={i} {...car} />
        ))}
        <div style={{ padding: '2rem 0', textAlign: 'center', opacity: 0.4, fontSize: '0.75rem' }}>
          End of Search Results
        </div>
      </div>

      <div className="dealer-map-canvas">
        <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
          {/* Simulated Dealership Map */}
          <DealerMarker top="20%" left="30%" />
          <DealerMarker top="45%" left="60%" />
          <DealerMarker top="70%" left="40%" />
          <DealerMarker top="30%" left="80%" />
          <DealerMarker top="65%" left="15%" />
          
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Select Dealership</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>West LA Performance Motors</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0ea5e9', marginTop: '0.5rem' }}>12 VEHICLES AVAILABLE</div>
          </div>
        </div>
      </div>
    </>
  );
}
