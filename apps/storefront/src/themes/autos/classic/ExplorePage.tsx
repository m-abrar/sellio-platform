'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Vehicle } from '@sellio/types';
import { ClassicCarCard } from './components';
import AutosExplorePage from '@/themes/autos/shared/AutosExplorePage';
import { useAutosThemeLink } from '@/themes/autos/shared/useAutosThemeLink';
import {
  formatVehiclePrice,
  getVehicleImage,
  getVehicleSpecLabel,
} from '@/themes/autos/shared/vehicle-utils';

function ClassicExploreCards() {
  const router = useRouter();
  const themeLink = useAutosThemeLink();

  return (
    <AutosExplorePage
      variant="classic"
      classPrefix="ac"
      pageTitle="Classic Vehicle Catalog"
      pageSubtitle="Search collector inventory synchronized from your Sellio vehicle registry."
      filterSectionClass="ac-filter-section"
      searchInputClass="ac-select"
      selectClass="ac-select"
      gridClass="ac-grid"
      primaryBtnClass="ac-btn ac-btn-cta"
      outlineBtnClass="ac-btn ac-btn-gold"
      renderVehicleCard={(car: Vehicle) => (
        <ClassicCarCard
          key={car.id}
          title={car.title}
          desc={getVehicleSpecLabel(car)}
          price={formatVehiclePrice(car)}
          image={getVehicleImage(car)}
          onClick={() => router.push(themeLink(`/product/${car.slug}`))}
        />
      )}
    />
  );
}

export default function ExplorePage() {
  return <ClassicExploreCards />;
}
