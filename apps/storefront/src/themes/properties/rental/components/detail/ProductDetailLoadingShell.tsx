export function ProductDetailLoadingShell() {
  return (
    <main className="pr-detail-page" aria-busy="true">
      <header className="pr-page-nav pr-page-nav--loading" aria-hidden="true">
        <div className="pr-page-nav__back-skeleton" />
        <div className="pr-crumbs-skeleton" />
      </header>
      <section className="pr-listing-hero pr-listing-hero--loading">
        <div className="pr-gallery-main pr-card-skeleton" style={{ minHeight: '420px' }} />
        <div className="pr-listing-intro__card pr-card-skeleton" style={{ minHeight: '200px' }} />
      </section>
    </main>
  );
}
