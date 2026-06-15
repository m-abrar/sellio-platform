'use client';

import { AmenityGrid } from './AmenityGrid';
import { FeatureList } from './FeatureList';
import { GalleryGrid } from './GalleryGrid';
import { MediaLinks } from './MediaLinks';
import { NeighborhoodList } from './NeighborhoodList';
import { PriceBreakdownTable } from './PriceBreakdownTable';
import { PropertyMapEmbed } from './PropertyMapEmbed';
import { RulesAndPolicies } from './RulesAndPolicies';
import { ScoresPanel } from './ScoresPanel';
import type { ListingMode } from '../listing-mode';
import type { PropertyDetail } from '../property-detail-types';

interface ProductDetailMainProps {
  listingMode: ListingMode;
  detail: PropertyDetail;
  description: string | null;
  shortDescription?: string | null;
  amenities: PropertyDetail['amenities'];
  features: PropertyDetail['features'];
  scores: PropertyDetail['scores'];
  neighborhoods: PropertyDetail['neighborhoods'];
  galleryImages: string[];
  title: string;
}

function DescriptionBlock({
  description,
  shortDescription,
}: {
  description: string | null;
  shortDescription?: string | null;
}) {
  const body = description || shortDescription;
  if (!body) return null;

  return (
    <section className="pm-detail-block pm-detail-description-block">
      <span className="structure-grid-kicker">Overview</span>
      <h2 className="pm-detail-block__title">About this property</h2>
      <div className="pm-detail-description__body">{body}</div>
    </section>
  );
}

export function ProductDetailMain({
  listingMode,
  detail,
  description,
  shortDescription,
  amenities,
  features,
  scores,
  neighborhoods,
  galleryImages,
  title,
}: ProductDetailMainProps) {
  const amenityList = amenities || [];
  const featureList = features || [];
  const scoreList = scores || [];
  const neighborhoodList = neighborhoods || [];

  if (listingMode === 'rental') {
    return (
      <div className="pm-detail-main pm-detail-main--rental">
        <DescriptionBlock description={description} shortDescription={shortDescription} />
        <GalleryGrid images={galleryImages} title={title} />
        <RulesAndPolicies rules={detail.rules} policies={detail.policies} />
        <AmenityGrid amenities={amenityList} />
        <FeatureList features={featureList} />
        <ScoresPanel scores={scoreList} />
        <PropertyMapEmbed property={detail} />
        <NeighborhoodList neighborhoods={neighborhoodList} />
        <MediaLinks video={detail.video} virtualTour={detail.virtual_tour} />
        <PriceBreakdownTable property={detail} />
      </div>
    );
  }

  return (
    <div className="pm-detail-main pm-detail-main--sale">
      <DescriptionBlock description={description} shortDescription={shortDescription} />
      <GalleryGrid images={galleryImages} title={title} />
      <PriceBreakdownTable property={detail} />
      <FeatureList features={featureList} />
      <AmenityGrid amenities={amenityList} />
      <ScoresPanel scores={scoreList} />
      <PropertyMapEmbed property={detail} />
      <NeighborhoodList neighborhoods={neighborhoodList} />
      <RulesAndPolicies rules={detail.rules} policies={detail.policies} />
      <MediaLinks video={detail.video} virtualTour={detail.virtual_tour} />
    </div>
  );
}
