'use client';

interface RulesAndPoliciesProps {
  rules?: string | null;
  policies?: string | null;
}

export function RulesAndPolicies({ rules, policies }: RulesAndPoliciesProps) {
  if (!rules && !policies) return null;

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Stay details</span>
      <h2 className="pm-detail-block__title">Rules and policies</h2>
      {rules && (
        <div className="pm-prose-panel">
          <h3>House rules</h3>
          <p>{rules}</p>
        </div>
      )}
      {policies && (
        <div className="pm-prose-panel">
          <h3>Policies</h3>
          <p>{policies}</p>
        </div>
      )}
    </section>
  );
}
