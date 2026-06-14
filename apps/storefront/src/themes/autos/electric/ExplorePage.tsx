'use client';

import React from 'react';

import type { Vehicle } from '@sellio/types';
import { ElectricHeader, EVCard, ElectricFooter } from './components';
import AutosExplorePage from '@/themes/autos/shared/AutosExplorePage';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import { formatVehiclePrice, getVehicleImage } from '@/themes/autos/shared/vehicle-utils';

function getEvSpecs(car: Vehicle) {
  const title = car.title.toLowerCase();
  if (title.includes('tesla')) return { range: '330 Miles', battery: '75 kWh', charge: '250 kW' };
  if (title.includes('rivian')) return { range: '314 Miles', battery: '135 kWh', charge: '200 kW' };
  if (title.includes('lucid')) return { range: '410 Miles', battery: '112 kWh', charge: '300 kW' };
  return {
    range: `${300 + (car.id * 15) % 120} Miles`,
    battery: `${65 + (car.id * 8) % 70} kWh`,
    charge: `${150 + (car.id * 50) % 210} kW`,
  };
}

function ElectricExploreCards() {
  const themeLink = useAutosThemeLink();

  return (
    <AutosExplorePage
      variant="electric"
      classPrefix="ev"
      pageTitle="Electric Vehicle Catalog"
      pageSubtitle="Browse live EV inventory with fast-charging specs and lease-ready pricing."
      filterSectionClass="ev-filter-section"
      searchInputClass="ev-select"
      selectClass="ev-select"
      gridClass="ev-grid"
      primaryBtnClass="ev-btn ev-btn-green"
      outlineBtnClass="ev-btn ev-btn-blue"
      shell={(content) => (
        <div className="autos-electric-wrapper">
          <ElectricHeader />
          {content}
          <ElectricFooter />
        </div>
      )}
      renderVehicleCard={(car: Vehicle) => {
        const specs = getEvSpecs(car);
        return (
          <a key={car.id} href={themeLink(`/product/${car.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <EVCard
              title={car.title}
              price={formatVehiclePrice(car)}
              range={specs.range}
              battery={specs.battery}
              charge={specs.charge}
              image={getVehicleImage(car, car.media?.main_photo || '/themes/autos/electric/tesla_y.png')}
            />
          </a>
        );
      }}
    />
  );
}

export default function ExplorePage() {
  return <ElectricExploreCards />;
}
