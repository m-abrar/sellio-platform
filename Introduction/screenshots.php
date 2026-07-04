<?php include('config.php'); ?>
<?php
    $pageTitle = 'Screenshots Gallery | Sellio';
    $activeDemos = array_values(array_filter($demos, fn($d) => $d['status'] === 'active'));
    $activeCounts = array_count_values(array_column($activeDemos, 'cat'));
    $activeTotal = count($activeDemos);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <?php include('header.php'); ?>
</head>
<body id="page-top">
    <?php include('navbar.php'); ?>

    <section class="page-intro-band bg-hero">
        <div class="container">
            <div class="badge bg-sellio-solid rounded-pill px-3 py-2 mb-3">VISUAL TOUR</div>
            <h1 class="display-4 fw-800 mb-3">Every Interface. <span class="text-sellio">Every Detail.</span></h1>
            <p class="lead text-muted">Real captures from every marketplace vertical — storefronts, dashboards, and everything in between. Click any screenshot to view it full-size.</p>
        </div>
    </section>

    <section class="pb-100">
        <div class="container">
            <div class="gallery-filter-bar d-flex flex-wrap justify-content-center gap-2 mb-5" aria-label="Filter screenshots">
                <button class="filter-btn active" data-filter="all">
                    All <span class="badge-count"><?= $activeTotal ?></span>
                </button>
                <?php foreach ($activeCounts as $cat => $count): ?>
                    <button class="filter-btn" data-filter="<?= strtolower(str_replace(' ', '-', $cat)) ?>">
                        <?= htmlspecialchars($cat) ?> <span class="badge-count"><?= $count ?></span>
                    </button>
                <?php endforeach; ?>
            </div>

            <div class="row g-4" id="screenshot-grid">
                <?php foreach ($activeDemos as $demo): ?>
                    <?php $catSlug = strtolower(str_replace(' ', '-', $demo['cat'])); ?>
                    <div class="col-md-4 demo-item" data-category="<?= $catSlug ?>">
                        <div class="screenshot-card"
                             data-img="<?= htmlspecialchars($demo['img']) ?>"
                             data-title="<?= htmlspecialchars($demo['name']) ?>"
                             data-desc="<?= htmlspecialchars($demo['desc']) ?>">
                            <div class="screenshot-img-wrapper">
                                <img src="<?= htmlspecialchars($demo['img']) ?>" alt="<?= htmlspecialchars($demo['name']) ?>" loading="lazy">
                                <div class="screenshot-zoom-overlay"><i class="fas fa-magnifying-glass-plus"></i></div>
                            </div>
                            <div class="screenshot-card-body">
                                <h6 class="fw-bold mb-1"><?= htmlspecialchars($demo['name']) ?></h6>
                                <small class="text-muted text-uppercase" style="font-size: 10px; letter-spacing: 1px;"><?= htmlspecialchars($demo['cat']) ?></small>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Lightbox Modal -->
    <div class="modal fade screenshot-lightbox" id="screenshotLightbox" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <button type="button" class="btn-close position-absolute top-0 end-0 m-3" style="z-index:5;" data-bs-dismiss="modal" aria-label="Close"></button>
                <button type="button" class="lightbox-nav-btn lightbox-prev" aria-label="Previous screenshot"><i class="fas fa-chevron-left"></i></button>
                <button type="button" class="lightbox-nav-btn lightbox-next" aria-label="Next screenshot"><i class="fas fa-chevron-right"></i></button>
                <div class="modal-body">
                    <img class="lightbox-img" src="" alt="">
                    <div class="lightbox-caption">
                        <h5 class="lightbox-title fw-bold mb-1"></h5>
                        <p class="lightbox-desc text-muted small mb-0"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php include('footer.php'); ?>
    <?php include('popup-exit-intent.php'); ?>
    <?php include('floating-buy-bar.php'); ?>

    <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
</body>
</html>
