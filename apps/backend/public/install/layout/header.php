<?php
// =================================================================================
// Sellio Installer - HTML Header & Layout Shell
// File: layout/header.php
// =================================================================================

$bootstrapCss = installer_asset_or_cdn(
    'vendor/npm/bootstrap/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
);
$fontawesomeCss = installer_asset_or_cdn(
    'vendor/npm/fontawesome/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/css/all.min.css'
);
$fontsourceCss = installer_asset_or_cdn(
    'vendor/npm/fontsource/bundle.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap'
);
$headingFontCss = array_map(
    static fn (int $weight): string => installer_asset_or_cdn(
        "vendor/npm/fontsource/plus-jakarta-sans-{$weight}.css",
        "https://cdn.jsdelivr.net/npm/@fontsource/plus-jakarta-sans@5.2.8/{$weight}.css"
    ),
    [600, 800]
);

$progress = installer_step_progress();
$installerLogoUrl = installer_logo_url();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars(($title ?? 'Installation Wizard') . ' | Sellio') ?></title>
    <link rel="icon" type="image/x-icon" href="<?= htmlspecialchars(installer_asset('favicons/favicon.ico')) ?>">

    <link href="<?= htmlspecialchars($bootstrapCss) ?>" rel="stylesheet">
    <link href="<?= htmlspecialchars($fontawesomeCss) ?>" rel="stylesheet">
    <link href="<?= htmlspecialchars($fontsourceCss) ?>" rel="stylesheet">
    <?php foreach ($headingFontCss as $fontCss): ?>
        <link href="<?= htmlspecialchars($fontCss) ?>" rel="stylesheet">
    <?php endforeach; ?>
    <link href="<?= htmlspecialchars(installer_url('style.css')) ?>" rel="stylesheet">
</head>
<body>
<div class="container container-installer">
    <div class="install-card fade-in">
        <div class="installer-brand">
            <?php if ($installerLogoUrl): ?>
                <img src="<?= htmlspecialchars($installerLogoUrl) ?>" alt="Sellio" class="installer-logo installer-logo-img" width="52" height="52">
            <?php else: ?>
                <div class="installer-logo" aria-hidden="true">S</div>
            <?php endif; ?>
            <div>
                <div class="installer-brand-name">Sellio</div>
                <div class="installer-brand-tag">Installation Wizard</div>
            </div>
            <div class="installer-version">v2.4.0</div>
        </div>

        <div class="installer-progress-wrap">
            <div class="installer-progress-meta">
                <span>Step <?= (int) $progress['current'] ?> of <?= (int) $progress['total'] ?> — <?= htmlspecialchars($progress['label']) ?></span>
                <span><?= (int) $progress['percent'] ?>%</span>
            </div>
            <div class="installer-progress-track" role="progressbar" aria-valuenow="<?= (int) $progress['percent'] ?>" aria-valuemin="0" aria-valuemax="100">
                <div class="installer-progress-bar" style="width: <?= (int) $progress['percent'] ?>%;"></div>
            </div>
        </div>

        <div class="stepper-wrap">
            <div class="stepper">
            <?php
            if (!empty($steps) && !empty($currentStepKey)) {
                $stepKeys = array_keys($steps);
                $currentIndex = array_search($currentStepKey, $stepKeys, true);

                foreach ($steps as $key => $data) {
                    $name = $data[0];
                    $icon = $data[1];
                    $class = '';
                    $stepIndex = array_search($key, $stepKeys, true);

                    if ($key === $currentStepKey) {
                        $class = 'active';
                    } elseif ($stepIndex !== false && $currentIndex !== false && $stepIndex < $currentIndex) {
                        $class = 'completed';
                    }

                    $displayIcon = $class === 'completed' ? 'fa-check' : $icon;

                    echo "<div class='step {$class}'>";
                    echo "<div class='step-icon'><i class='fa-solid {$displayIcon}'></i></div>";
                    echo "<div class='step-name'>" . htmlspecialchars($name) . "</div>";
                    echo "</div>";
                }
            }
            ?>
            </div>
        </div>
