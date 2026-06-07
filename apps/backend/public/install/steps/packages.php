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

    $cmdWithFlags = "{$phpBinary} -d register_argc_argv=Off -d memory_limit=-1 {$composerPhar}";
    $cmdWithoutFlags = "{$phpBinary} {$composerPhar}";
    
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
    }

    $flags = "--no-interaction --prefer-dist --optimize-autoloader";

    if (function_exists('passthru')) {
        passthru("{$composerCmd} install {$flags} 2>&1", $status);
    } else {
        $status = 1;
        echo "❌ [Error] The 'passthru' function is disabled on your server. This installer requires it to run Composer.";
    }

    if ($status !== 0) {
        $error = true;
        $message = '❌ Package installation failed. The PHP binary may not be compatible or there was a network error.';
    } else {
        $message = '✅ All packages installed successfully!';
        $success = true;
    }
    echo "\n--- COMPOSER PIPELINE FINISHED ---";
?>
        </pre>
    </div>
    <?php
    if ($message)
        display_message($message, $error);
    if ($success):
        ?>
        <div class="text-center mt-5 pt-4 border-top">
            <a href="?step=migration" class="btn btn-primary btn-lg px-5 shadow-lg">
                Next: Data Structure Import <i class="fa-solid fa-chevron-right ms-2"></i>
            </a>
        </div>
    <?php
    endif;
    include __DIR__ . '/../layout/footer.php';
    exit();
}

$title = 'Composer Packages';
include __DIR__ . '/../layout/header.php';
?>
<?php installer_step_intro('Dependency registry', 'Sellio ships with a pre-built vendor folder in distribution packages. Run this step only if Composer packages are missing.'); ?>

<div class="info-panel mb-4">
    <h3 class="h6 fw-bold mb-3 text-brand smallest text-uppercase letter-spacing-1">
        <i class="fas fa-boxes me-2"></i> Required packages
    </h3>
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
</div>

<form method="post">
    <?php installer_step_nav('environment', '#', 'Execute Package Installation', true); ?>
    <p class="text-center text-muted smallest mt-n3">Keep your connection stable — do not close this tab during installation.</p>
</form>
<?php include __DIR__ . '/../layout/footer.php'; ?>