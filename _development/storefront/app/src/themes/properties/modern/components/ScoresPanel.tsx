'use client';

import type { PropertyScoreItem } from '../property-detail-types';

interface ScoresPanelProps {
  scores: PropertyScoreItem[];
}

export function ScoresPanel({ scores }: ScoresPanelProps) {
  if (!scores.length) return null;

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Location</span>
      <h2 className="pm-detail-block__title">Area scores</h2>
      <div className="pm-scores-grid">
        {scores.map((item) => (
          <article key={item.id} className="pm-score-card">
            <div className="pm-score-card__value">
              {item.score}
              {item.units ? <small>{item.units}</small> : null}
            </div>
            <h3>{item.title}</h3>
            {item.description && <p>{item.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
