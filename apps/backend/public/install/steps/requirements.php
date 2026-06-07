<?php
// =================================================================================
// Sellio Installer - Requirements Check Step
// File: steps/requirements.php
// =================================================================================
global $basePath;

$viteManifest = $basePath . '/public/build/manifest.json';

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
    'Frontend assets (public/build/manifest.json)' => file_exists($viteManifest),
];

$allPassed = !in_array(false, $requirements, true);
$title = 'System Requirements';

include __DIR__ . '/../layout/header.php';
?>

<div class="mb-5">
    <h2 class="fw-bold text-dark">Server Verification</h2>
    <p class="text-muted">
        We're auditing your server environment to ensure it meets all necessary dependencies for a stable installation of **Sellio**.
    </p>
</div>

<div class="row g-3 mb-5">
    <?php foreach ($requirements as $label => $ok): ?>
        <div class="col-md-6">
            <div class="requirement-item <?= $ok ? 'border-light' : 'border-danger-subtle' ?>" style="<?= $ok ? '' : 'background: rgba(239, 68, 68, 0.05);' ?>">
                <div class="me-3">
                    <?php if (strpos($label, 'Writable') !== false): ?>
                        <i class="fa-solid fa-folder-open <?= $ok ? 'text-primary' : 'text-danger' ?>"></i>
                    <?php elseif (strpos($label, 'PHP') !== false): ?>
                        <i class="fa-brands fa-php <?= $ok ? 'text-primary' : 'text-danger' ?>"></i>
                    <?php else: ?>
                        <i class="fa-solid fa-puzzle-piece <?= $ok ? 'text-primary' : 'text-danger' ?>"></i>
                    <?php endif; ?>
                </div>
                
                <div class="flex-grow-1">
                    <span class="d-block fw-bold small text-dark"><?= htmlspecialchars($label) ?></span>
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

<div class="mt-4 pt-4 border-top d-flex justify-content-between align-items-center">
    <a href="?step=welcome" class="btn btn-outline-secondary px-4">
        <i class="fa-solid fa-arrow-left me-2"></i>Back
    </a>

    <?php if ($allPassed): ?>
        <a href="?step=environment" class="btn btn-primary btn-lg px-5 shadow-lg">
            Continue Setup <i class="fa-solid fa-chevron-right ms-2"></i>
        </a>
    <?php else: ?>
        <div class="text-end">
            <button class="btn btn-danger btn-lg px-5 shadow-lg" onclick="window.location.reload();">
                <i class="fa-solid fa-rotate me-2"></i>Retry Audit
            </button>
            <p class="text-danger smallest fw-bold mt-2 mb-0 uppercase letter-spacing-1">Missing requirements must be resolved to proceed.</p>
        </div>
    <?php endif; ?>
</div>

<?php
include __DIR__ . '/../layout/footer.php'; 
?>