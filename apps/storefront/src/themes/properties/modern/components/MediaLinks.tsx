'use client';

interface MediaLinksProps {
  video?: string | null;
  virtualTour?: string | null;
}

export function MediaLinks({ video, virtualTour }: MediaLinksProps) {
  if (!video && !virtualTour) return null;

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Media</span>
      <h2 className="pm-detail-block__title">Tours and video</h2>
      <div className="pm-media-links">
        {virtualTour && (
          <a href={virtualTour} className="pm-media-link" target="_blank" rel="noopener noreferrer">
            Virtual tour
          </a>
        )}
        {video && (
          <a href={video} className="pm-media-link" target="_blank" rel="noopener noreferrer">
            Property video
          </a>
        )}
      </div>
    </section>
  );
}
