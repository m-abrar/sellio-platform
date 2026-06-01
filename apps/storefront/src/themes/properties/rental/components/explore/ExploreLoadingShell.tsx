export function ExploreLoadingShell() {
  return (
    <div className="pr-explore-page" aria-busy="true">
      <section className="pr-explore-hero pr-explore-hero--loading" aria-hidden="true">
        <div className="pr-explore-hero__inner">
          <header className="pr-page-nav pr-page-nav--loading" aria-hidden="true">
            <div className="pr-page-nav__back-skeleton" />
            <div className="pr-crumbs-skeleton" />
          </header>
          <div className="pr-explore-hero__title-skeleton" />
          <div className="pr-explore-hero__search-skeleton" />
        </div>
      </section>
      <section className="pr-explore-layout">
        <div className="pr-explore-sidebar-skeleton" />
        <div className="pr-explore-results-skeleton">
          <div className="pr-explore-results-toolbar-skeleton" />
          <div className="pr-explore-grid-skeleton">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="pr-explore-card-skeleton" key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
