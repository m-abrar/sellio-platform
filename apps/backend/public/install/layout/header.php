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

$progress = installer_step_progress();
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
    <link href="<?= htmlspecialchars(installer_url('style.css')) ?>" rel="stylesheet">
</head>
<body>
<div class="container container-installer">
    <div class="install-card fade-in">
        <div class="installer-brand">
            <div class="installer-logo" aria-hidden="true">S</div>
            <div>
                <div class="installer-brand-name">Sellio</div>
                <div class="installer-brand-tag">Installation Wizard</div>
            </div>
            <div class="installer-version">v2.4</div>
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

                    echo "<div class='step {$class}'>";
                    echo "<div class='step-icon'><i class='fa-solid {$icon}'></i></div>";
                    echo "<div class='step-name'>" . htmlspecialchars($name) . "</div>";
                    echo "</div>";
                }
            }
            ?>
            </div>
        </div>
