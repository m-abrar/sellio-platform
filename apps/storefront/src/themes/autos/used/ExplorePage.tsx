'use client';

import React from 'react';

import type { Vehicle } from '@/types';
import { UsedCarCard } from './components';
import AutosExplorePage from '@/themes/autos/shared/AutosExplorePage';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import { formatVehiclePrice, getVehicleImage } from '@/themes/autos/shared/vehicle-utils';

function UsedExploreCards() {
  const themeLink = useAutosThemeLink();

  return (
    <AutosExplorePage
      variant="used"
      classPrefix="us"
      pageTitle="Used Vehicle Catalog"
      pageSubtitle="Filter verified pre-owned listings from your live Sellio inventory."
      filterSectionClass="us-filter-card"
      searchInputClass="us-select"
      selectClass="us-select"
      gridClass="us-grid"
      primaryBtnClass="us-btn us-btn-orange"
      outlineBtnClass="us-btn us-btn-outline"
      renderVehicleCard={(car: Vehicle) => {
        const raw = car as Vehicle & {
          dealer?: { name?: string };
          dealer_name?: string;
          company?: { title?: string };
          city?: string;
        };
        const mileage = car.specs?.mileage ? String(car.specs.mileage) : '35,000 miles';
        const location = raw.city || car.location?.city || car.location?.state || 'Available nationwide';
        const dealer = raw.dealer?.name || raw.dealer_name || raw.company?.title || 'Verified Dealer';
        return (
          <a key={car.id} href={themeLink(`/product/${car.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <UsedCarCard
              title={car.title}
              price={formatVehiclePrice(car)}
              mileage={mileage.includes('mile') ? mileage : `${mileage} miles`}
              location={location}
              dealer={dealer}
              image={getVehicleImage(car)}
            />
          </a>
        );
      }}
    />
  );
}

export default function ExplorePage() {
  return <UsedExploreCards />;
}
