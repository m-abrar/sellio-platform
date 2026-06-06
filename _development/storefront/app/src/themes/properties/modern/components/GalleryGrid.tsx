'use client';

interface GalleryGridProps {
  images: string[];
  title: string;
}

export function GalleryGrid({ images, title }: GalleryGridProps) {
  const extra = images.slice(1);
  if (!extra.length) return null;

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Photos</span>
      <h2 className="pm-detail-block__title">Gallery</h2>
      <div className="pm-gallery-grid">
        {extra.map((url, index) => (
          <figure key={`${url}-${index}`} className="pm-gallery-grid__item">
            <img src={url} alt={`${title} — photo ${index + 2}`} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
}
