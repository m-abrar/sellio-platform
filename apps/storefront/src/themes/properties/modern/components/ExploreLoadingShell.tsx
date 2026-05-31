export function ExploreLoadingShell() {
  return (
    <div className="pm-explore-page" aria-busy="true">
      <section className="pm-explore-hero pm-explore-hero--loading" aria-hidden="true">
        <div className="pm-explore-hero__inner">
          <header className="pm-detail-header pm-explore-page__header" aria-hidden="true">
            <div className="pm-detail-toolbar pm-detail-toolbar--loading">
              <div className="pm-detail-back-btn-skeleton" />
              <div className="pm-breadcrumbs-skeleton" />
            </div>
          </header>
          <div className="pm-explore-hero__title-skeleton" />
          <div className="pm-explore-hero__search-skeleton" />
        </div>
      </section>
      <section className="pm-explore-layout">
        <div className="pm-explore-sidebar-skeleton" />
        <div className="pm-explore-results-skeleton">
          <div className="pm-explore-results-toolbar-skeleton" />
          <div className="pm-explore-grid-skeleton">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="pm-explore-card-skeleton" key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
