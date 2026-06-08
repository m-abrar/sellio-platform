export function ProductDetailLoadingShell() {
  return (
    <main className="pm-detail-page" aria-busy="true">
      <header className="pm-detail-header" aria-hidden="true">
        <div className="pm-detail-toolbar pm-detail-toolbar--loading">
          <div className="pm-detail-back-btn-skeleton" />
          <div className="pm-breadcrumbs-skeleton" />
        </div>
      </header>
      <section className="pm-detail-bento pm-detail-bento--loading">
        <div className="pm-gallery-main pm-detail-skeleton" />
        <div className="pm-detail-glass pm-detail-skeleton" />
      </section>
    </main>
  );
}
