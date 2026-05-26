import React, { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { storefrontExploreUrl } from '../config/api';

const LABELS: Record<string, string> = {
  properties: 'properties',
  events: 'events',
  autos: 'autos',
  services: 'services',
  jobs: 'jobs',
  classifieds: 'classifieds',
  products: 'products',
};

interface StorefrontRedirectViewProps {
  module: string;
}

export default function StorefrontRedirectView({ module }: StorefrontRedirectViewProps) {
  const targetUrl = storefrontExploreUrl();
  const label = LABELS[module] || 'marketplace';

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.location.assign(targetUrl);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [targetUrl]);

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Storefront"
        title={`Opening ${label}`}
        description="Full marketplace browsing is handled by the storefront. Your buyer panel stays focused on saved items, bookings, messages, reviews, and account activity."
      />

      <div className="px-3">
        <EmptyState
          icon={ExternalLink}
          title="Continue in the storefront"
          description="You will be redirected to the marketplace browse experience."
          actionLabel="Open storefront"
          onAction={() => window.location.assign(targetUrl)}
        />
      </div>
    </div>
  );
}
