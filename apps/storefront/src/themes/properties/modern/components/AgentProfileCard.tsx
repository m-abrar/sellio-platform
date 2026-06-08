'use client';

import type { PropertyDetail } from '../property-detail-types';

interface AgentProfileCardProps {
  owner?: PropertyDetail['owner'];
  brand?: PropertyDetail['brand'];
  isRental: boolean;
  variant?: 'main' | 'sidebar';
}

export function AgentProfileCard({
  owner,
  brand,
  isRental,
  variant = 'main',
}: AgentProfileCardProps) {
  if (!owner && !brand) return null;

  const kicker = isRental ? 'Hosted by' : 'Listed by';
  const title = isRental ? 'Your host' : 'Listing agent';
  const sectionClass =
    variant === 'sidebar' ? 'pm-sidebar-card pm-sidebar-agent' : 'pm-detail-block';

  return (
    <section className={sectionClass}>
      <span className="structure-grid-kicker">{kicker}</span>
      <h2 className={variant === 'sidebar' ? 'pm-sidebar-card__title' : 'pm-detail-block__title'}>
        {title}
      </h2>

      {owner && (
        <div className="pm-agent">
          <div className="pm-agent__avatar">
            {owner.avatar_url ? (
              <img src={owner.avatar_url} alt="" />
            ) : (
              <span aria-hidden="true">{owner.name?.charAt(0) || 'A'}</span>
            )}
          </div>
          <div>
            <h3>{owner.name}</h3>
            {owner.username && <p className="pm-agent__username">@{owner.username}</p>}
            {brand?.title && (
              <p className="pm-agent__brand">
                {brand.title}
              </p>
            )}
          </div>
        </div>
      )}

      {!owner && brand && (
        <p className={variant === 'sidebar' ? 'pm-sidebar-card__hint' : 'pm-detail-block__copy'}>
          Listed under {brand.title}
        </p>
      )}
    </section>
  );
}
