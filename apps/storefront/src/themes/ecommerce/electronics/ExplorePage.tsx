'use client';

import React from 'react';
import { ElectronicsHeader, ElectronicsFooter } from './components';
import EcommerceExplorePage from '@/themes/ecommerce/shared/EcommerceExplorePage';

interface ExplorePageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
}

export default function ExplorePage(props: ExplorePageProps) {
  return (
    <EcommerceExplorePage
      classPrefix="el"
      {...props}
      shell={(content) => (
        <>
          <ElectronicsHeader />
          {content}
          <ElectronicsFooter />
        </>
      )}
    />
  );
}
