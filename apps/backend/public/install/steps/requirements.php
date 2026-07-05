<?php
// =================================================================================
// Sellio Installer - Requirements Check Step
// File: steps/requirements.php
// =================================================================================
global $basePath;

$requirements = [
    'PHP >= 8.2' => version_compare(PHP_VERSION, '8.2.0', '>='),
    'BCMath Extension' => extension_loaded('bcmath'),
    'Ctype Extension' => extension_loaded('ctype'),
    'Fileinfo Extension' => extension_loaded('fileinfo'),
    'JSON Extension' => extension_loaded('json'),
    'Mbstring Extension' => extension_loaded('mbstring'),
    'OpenSSL Extension' => extension_loaded('openssl'),
    'PDO Extension' => extension_loaded('pdo'),
    'Tokenizer Extension' => extension_loaded('tokenizer'),
    'XML Extension' => extension_loaded('xml'),
    'GD Extension' => extension_loaded('gd'),
    'Intl Extension' => extension_loaded('intl'),
    'Zip Extension' => extension_loaded('zip'),
    'Exif Extension' => extension_loaded('exif'),
    'exec() Function' => function_exists('exec'),
    'passthru() Function' => function_exists('passthru'),
    'Writable storage/' => is_path_writable('storage'),
    'Writable bootstrap/cache/' => is_path_writable('bootstrap/cache'),
];

$recommendations = [
    'Frontend assets (public_html/build or public/build)' => installer_vite_manifest_path() !== null,
];

$passedCount = count(array_filter($requirements));
$failedCount = count($requirements) - $passedCount;
$allPassed = $failedCount === 0;
$failedLabels = array_keys(array_filter($requirements, fn ($ok) => !$ok));
$missingRecommendations = array_keys(array_filter($recommendations, fn ($ok) => !$ok));
$title = 'System Requirements';

include __DIR__ . '/../layout/header.php';

installer_step_intro(
    'Server verification',
    'We audit PHP, extensions, and writable folders so Sellio can install reliably on your host.'
);
?>

<div class="d-flex flex-wrap gap-2 mb-4">
    <span class="summary-pill summary-pill-success">
        <i class="fas fa-check"></i> <?= (int) $passedCount ?> passed
    </span>
    <?php if ($failedCount > 0): ?>
        <span class="summary-pill summary-pill-danger">
            <i class="fas fa-times"></i> <?= (int) $failedCount ?> need attention
        </span>
    <?php endif; ?>
    <?php if (!empty($missingRecommendations)): ?>
        <span class="summary-pill summary-pill-warning">
            <i class="fas fa-circle-info"></i> <?= count($missingRecommendations) ?> recommended
        </span>
    <?php endif; ?>
</div>

<div class="row g-3 mb-4">
    <?php foreach ($requirements as $label => $ok): ?>
        <div class="col-md-6">
            <div class="requirement-item <?= $ok ? '' : 'is-fail' ?>">
                <div>
                    <?php if (strpos($label, 'Writable') !== false): ?>
                        <i class="fa-solid fa-folder-open <?= $ok ? 'text-brand' : 'text-danger' ?>"></i>
                    <?php elseif (strpos($label, 'PHP') !== false): ?>
                        <i class="fa-brands fa-php <?= $ok ? 'text-brand' : 'text-danger' ?>"></i>
                    <?php else: ?>
                        <i class="fa-solid fa-puzzle-piece <?= $ok ? 'text-brand' : 'text-danger' ?>"></i>
                    <?php endif; ?>
                </div>

                <div class="flex-grow-1">
                    <span class="d-block fw-bold small text-dark"><?= htmlspecialchars($label) ?></span>
                    <?php if (!$ok && ($hint = installer_requirement_hint($label))): ?>
                        <span class="requirement-hint d-block"><?= htmlspecialchars($hint) ?></span>
                    <?php endif; ?>
                </div>

                <div>
                    <?php if ($ok): ?>
                        <span class="badge bg-success-subtle text-success badge-status">
                            <i class="fas fa-check me-1"></i> PASS
                        </span>
                    <?php else: ?>
                        <span class="badge bg-danger-subtle text-danger badge-status">
                            <i class="fas fa-times me-1"></i> FAIL
                        </span>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<?php if (!empty($recommendations)): ?>
    <div class="info-panel info-panel-warning mb-4">
        <h3 class="h6 fw-bold mb-3 text-warning-emphasis smallest text-uppercase letter-spacing-1">
            <i class="fas fa-lightbulb me-2"></i> Recommended (not blocking)
        </h3>
        <div class="row g-3">
            <?php foreach ($recommendations as $label => $ok): ?>
                <div class="col-md-12">
                    <div class="requirement-item <?= $ok ? '' : 'is-advisory' ?>">
                        <div>
                            <i class="fa-solid fa-file-code <?= $ok ? 'text-brand' : 'text-warning' ?>"></i>
                        </div>
                        <div class="flex-grow-1">
                            <span class="d-block fw-bold small text-dark"><?= htmlspecialchars($label) ?></span>
                            <?php if (!$ok && ($hint = installer_requirement_hint($label))): ?>
                                <span class="requirement-hint d-block"><?= htmlspecialchars($hint) ?></span>
                            <?php endif; ?>
                        </div>
                        <div>
                            <?php if ($ok): ?>
                                <span class="badge bg-success-subtle text-success badge-status">
                                    <i class="fas fa-check me-1"></i> OK
                                </span>
                            <?php else: ?>
                                <span class="badge bg-warning-subtle text-warning-emphasis badge-status">
                                    <i class="fas fa-circle-info me-1"></i> MISSING
                                </span>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
<?php endif; ?>

<div class="step-nav">
    <a href="?step=welcome" class="btn btn-outline-secondary">
        <i class="fa-solid fa-arrow-left me-2"></i>Back
    </a>
    <div class="text-end ms-auto">
        <?php if ($allPassed): ?>
            <a href="?step=environment" class="btn btn-primary btn-lg shadow-sm">
                Continue Setup <i class="fa-solid fa-chevron-right ms-2"></i>
            </a>
        <?php else: ?>
            <button type="button" class="btn btn-primary btn-lg shadow-sm" onclick="window.location.reload();">
                <i class="fa-solid fa-rotate me-2"></i>Retry audit
            </button>
            <p class="text-danger smallest fw-bold mt-2 mb-0 text-uppercase letter-spacing-1">Resolve failed checks before continuing.</p>
        <?php endif; ?>
    </div>
</div>

<?php include __DIR__ . '/../layout/footer.php'; ?>
