'use client';

interface TagListProps {
  tags: string[];
  variant?: 'block' | 'inline';
}

export function TagList({ tags, variant = 'block' }: TagListProps) {
  if (!tags.length) return null;

  if (variant === 'inline') {
    return (
      <div className="pm-tag-list pm-tag-list--inline" role="list">
        {tags.map((tag) => (
          <span key={tag} className="pm-tag-pill" role="listitem">
            {tag}
          </span>
        ))}
      </div>
    );
  }

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Tags</span>
      <h2 className="pm-detail-block__title">Property tags</h2>
      <div className="pm-tag-list">
        {tags.map((tag) => (
          <span key={tag} className="pm-tag-pill">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
