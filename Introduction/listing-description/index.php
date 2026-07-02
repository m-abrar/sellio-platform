<!DOCTYPE html>
<html lang="en">
<head>
  <?php $publicContent = require dirname(__DIR__) . '/public-content.php'; ?>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="<?= htmlspecialchars($publicContent['product']['description']) ?>">
  <title><?= htmlspecialchars($publicContent['product']['title']) ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <?php include __DIR__ . '/partials/styles.php'; ?>
</head>
<body>
<main class="page">
<?php
  include __DIR__ . '/partials/cover.php';
  include __DIR__ . '/partials/quick-nav.php';
  // Resources & access cards below use placeholder links/credentials — replace before publishing
  include __DIR__ . '/partials/explore.php';
  include __DIR__ . '/partials/preview.php';
  include __DIR__ . '/partials/foundation.php';
  include __DIR__ . '/partials/storefronts.php';
  include __DIR__ . '/partials/modules.php';
  include __DIR__ . '/partials/workflows.php';
  include __DIR__ . '/partials/technology.php';
  include __DIR__ . '/partials/installation.php';
  include __DIR__ . '/partials/access.php';
  include __DIR__ . '/partials/platforms.php';
  include __DIR__ . '/partials/roles.php';
  include __DIR__ . '/partials/truth.php';
  include __DIR__ . '/partials/offers.php';
  include __DIR__ . '/partials/footer.php';
?>
</main>
</body>
</html>
