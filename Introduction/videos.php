<?php include('config.php'); ?>
<?php $pageTitle = 'Video Gallery | Sellio'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <?php include('header.php'); ?>
</head>
<body id="page-top">
    <?php include('navbar.php'); ?>

    <section class="page-intro-band bg-hero">
        <div class="container">
            <div class="badge bg-sellio-solid rounded-pill px-3 py-2 mb-3">WATCH & LEARN</div>
            <h1 class="display-4 fw-800 mb-3">Walkthroughs for <span class="text-sellio">Every Workflow.</span></h1>
            <p class="lead text-muted">Start with the installation walkthrough, then check back as we add guides for the admin dashboard, selling, buying, and API integration.</p>
        </div>
    </section>

    <section class="pb-100">
        <div class="container">
            <div class="row g-4">
                <?php foreach ($videos as $video): ?>
                    <?php $isSoon = ($video['status'] !== 'active') || empty($video['youtube_id']); ?>
                    <div class="col-md-4">
                        <div class="video-card <?= $isSoon ? 'coming-soon' : '' ?>" <?= $isSoon ? '' : 'data-youtube-id="' . htmlspecialchars($video['youtube_id']) . '"' ?>>
                            <div class="video-thumb-wrapper">
                                <img src="<?= htmlspecialchars($video['thumb']) ?>" alt="<?= htmlspecialchars($video['title']) ?>" loading="lazy">
                                <div class="video-play-btn"><i class="fas fa-play"></i></div>
                                <?php if ($isSoon): ?>
                                    <div class="soon-badge">Coming Soon</div>
                                <?php endif; ?>
                            </div>
                            <div class="p-3">
                                <h6 class="fw-bold mb-1"><?= htmlspecialchars($video['title']) ?></h6>
                                <p class="text-muted small mb-0"><?= htmlspecialchars($video['desc']) ?></p>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Video Modal -->
    <div class="modal fade video-lightbox" id="videoLightbox" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <div class="ratio ratio-16x9">
                    <iframe src="" title="Sellio installation walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
