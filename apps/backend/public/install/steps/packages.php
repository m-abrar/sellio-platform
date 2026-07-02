<?php
// =================================================================================
// Sellio Installer - Composer Packages Step
// File: steps/packages.php
// =================================================================================
global $basePath;

// --- PHP LOGIC START ---
set_time_limit(0);

$output = '';
$error = false;
$message = '';
$success = false;

// Dynamically fetch package list from composer.json
$packages = [];
$composerFile = $basePath . '/composer.json';

if (file_exists($composerFile)) {
    $composerData = json_decode(file_get_contents($composerFile), true);
    if (isset($composerData['require'])) {
        $packages = array_keys(array_filter($composerData['require'], fn($key) => $key !== 'php', ARRAY_FILTER_USE_KEY));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $isLocal = is_local_env();

    // Enable Live Progress
    if (ob_get_level())
        ob_end_clean();
    ob_implicit_flush(true);

    header("Content-Type: text/html");
    $title = 'Installing Packages';
    include __DIR__ . '/../layout/header.php';
    ?>
    <?php installer_step_intro('Initializing application core', 'Installing Composer dependencies. This may take a few minutes on shared hosting.'); ?>

    <div class="status-banner status-banner-warning">
        <div class="spinner-grow spinner-grow-sm text-warning" role="status"><span class="visually-hidden">Loading...</span></div>
        <div class="fw-bold"><i class="fas fa-terminal me-2"></i>Executing Composer pipeline…</div>
    </div>

    <div class="terminal-window">
        <div class="terminal-header">
            <div class="terminal-dots">
                <span class="terminal-dot terminal-dot-red"></span>
                <span class="terminal-dot terminal-dot-amber"></span>
                <span class="terminal-dot terminal-dot-green"></span>
            </div>
            <span class="terminal-title">composer_install.log</span>
        </div>
        <pre class="terminal-body">
<?php
    flush();
    chdir($basePath);

    // Setup for Server Environments (Temp Home for Composer)
    if (!$isLocal) {
        $composerHomeDir = $basePath . '/storage/framework/composer_tmp';
        if (!is_dir($composerHomeDir))
            mkdir($composerHomeDir, 0775, true);
        putenv("COMPOSER_HOME={$composerHomeDir}");
        putenv("HOME={$composerHomeDir}");
    }

    $phpBinary = get_php_binary();
    $composerPhar = $basePath . '/composer.phar';

    // --- Pre-flight diagnostics ---
    echo "ℹ️ [Diagnostic] PHP binary  : {$phpBinary}\n";
    echo "ℹ️ [Diagnostic] PHP version : " . PHP_VERSION . "\n";
    echo "ℹ️ [Diagnostic] Memory limit: " . ini_get('memory_limit') . "\n";
    echo "ℹ️ [Diagnostic] Composer    : " . (file_exists($composerPhar) ? $composerPhar : 'system composer') . "\n";
    echo "ℹ️ [Diagnostic] Base path   : {$basePath}\n\n";
    flush();

    $cmdWithFlags = "{$phpBinary} -d register_argc_argv=Off -d memory_limit=-1 " . escapeshellarg($composerPhar);
    $cmdWithoutFlags = "{$phpBinary} " . escapeshellarg($composerPhar);

    if (file_exists($composerPhar)) {
        $testOut = [];
        $testRes = -1;
        exec("{$cmdWithFlags} --version 2>&1", $testOut, $testRes);

        if ($testRes === 0 && strpos(implode('', $testOut), 'Usage:') === false) {
            $composerCmd = $cmdWithFlags;
        } else {
            $composerCmd = $cmdWithoutFlags;
            echo "ℹ️ [Notice] LiteSpeed/LSAPI environment detected. Using compatible command mode.\n";
        }
    } else {
        $composerCmd = "composer";
        echo "ℹ️ [Notice] composer.phar not found — falling back to system 'composer' command.\n";
    }

    $flags = "--no-interaction --prefer-dist --optimize-autoloader";
    echo "▶ Running: {$composerCmd} install {$flags}\n";
    echo str_repeat('─', 60) . "\n\n";
    flush();

    if (function_exists('passthru')) {
        passthru("{$composerCmd} install {$flags} 2>&1", $status);
    } else {
        $status = 1;
        echo "❌ [Error] The 'passthru' function is disabled on your server. This installer requires it to run Composer.";
    }

    echo "\n" . str_repeat('─', 60) . "\n";

    $failureHint = '';
    if ($status !== 0) {
        $error = true;
        $message = '❌ Package installation failed (exit code ' . $status . ').';

        // Map common Composer exit codes to actionable hints
        if ($status === 127) {
            $failureHint = 'The PHP binary or composer.phar could not be found. Check that your server\'s PHP CLI path is reachable, or ask your host to enable the <code>exec</code> function.';
        } elseif ($status === 1) {
            $failureHint = 'Composer reported an error (see terminal output above). Common causes: missing PHP extensions, a blocked outbound network connection to packagist.org, or insufficient disk space.';
        } elseif ($status === 2) {
            $failureHint = 'Composer failed with a dependency-resolution error. Ensure your PHP version (' . PHP_VERSION . ') satisfies all package requirements.';
        } else {
            $failureHint = 'Review the terminal output above for the exact error. If your server blocks outbound connections, ask your host to whitelist packagist.org and repo.packagist.com. Alternatively, upload a pre-built <code>vendor/</code> folder via FTP and reload this page.';
        }
    } else {
        $message = '✅ All packages installed successfully!';
        $success = true;
    }
    echo "\n--- COMPOSER PIPELINE FINISHED ---";
?>
        </pre>
    </div>
    <?php
    if ($message) {
        display_message($message, $error);
    }

    if ($failureHint): ?>
    <div class="info-panel mb-4">
        <h3 class="h6 fw-bold mb-2 text-danger smallest text-uppercase letter-spacing-1">
            <i class="fas fa-circle-info me-2"></i>Troubleshooting
        </h3>
        <p class="small mb-3"><?= $failureHint ?></p>
        <p class="small mb-2 fw-semibold">If you have SSH / terminal access, run this command from your site root:</p>
        <code class="d-block bg-dark text-light rounded p-2 small user-select-all">
            php -d memory_limit=-1 composer.phar install --no-interaction --prefer-dist --optimize-autoloader
        </code>
    </div>
    <?php endif; ?>
    <?php

    installer_step_result_nav(
        $success,
        'environment',
        'migration',
        'Next: Data Structure Import',
        'Retry package installation',
    );

    include __DIR__ . '/../layout/footer.php';
    exit();
}

$vendorReady = installer_vendor_ready();
$title = 'Composer Packages';
include __DIR__ . '/../layout/header.php';
?>
<?php installer_step_intro('Dependency registry', 'Sellio ships with a pre-built vendor folder in distribution packages. Run this step only if Composer packages are missing.'); ?>

<?php if ($vendorReady): ?>
    <div class="status-banner status-banner-success mb-4 align-items-start">
        <i class="fas fa-circle-check text-success"></i>
        <div>
            <div class="fw-bold text-success">Composer packages already installed</div>
            <div class="small text-muted">vendor/autoload.php was found — you can skip straight to database migration.</div>
        </div>
    </div>
<?php endif; ?>

<div class="info-panel mb-4">
    <h3 class="h6 fw-bold mb-3 text-brand smallest text-uppercase letter-spacing-1">
        <i class="fas fa-boxes me-2"></i> Required packages
    </h3>
    <?php if (empty($packages)): ?>
        <p class="small text-muted mb-0">
            <i class="fas fa-circle-info me-1 text-brand"></i>
            Could not read <code>composer.json</code>. If <code>vendor/</code> is already present you can continue; otherwise upload the full application source.
        </p>
    <?php else: ?>
        <div class="row g-2" style="max-height:280px; overflow-y:auto;">
            <?php foreach ($packages as $pkg): ?>
                <div class="col-md-6">
                    <div class="package-chip">
                        <i class="fa-solid fa-check-circle text-success smallest"></i>
                        <code><?= htmlspecialchars($pkg) ?></code>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php if ($vendorReady): ?>
    <div class="step-nav">
        <a href="?step=environment" class="btn btn-outline-secondary">
            <i class="fa-solid fa-arrow-left me-2"></i>Back
        </a>
        <div class="text-end ms-auto d-flex flex-column flex-sm-row gap-2 align-items-sm-center justify-content-sm-end">
            <form method="post" class="d-inline">
                <button type="submit" class="btn btn-outline-secondary btn-sm">Reinstall packages</button>
            </form>
            <a href="?step=migration" class="btn btn-primary btn-lg shadow-sm">
                Continue to migration <i class="fa-solid fa-chevron-right ms-2"></i>
            </a>
        </div>
    </div>
<?php else: ?>
    <form method="post">
        <?php installer_step_nav('environment', '#', 'Execute Package Installation', true); ?>
        <p class="text-center text-muted smallest mt-n3">Keep your connection stable — do not close this tab during installation.</p>
    </form>
<?php endif; ?>
<?php include __DIR__ . '/../layout/footer.php'; ?>