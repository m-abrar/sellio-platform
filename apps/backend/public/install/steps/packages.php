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
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Initializing Application Core</h2>
        <p class="text-muted">Orchestrating system dependencies. This process may take a minute depending on your connection.</p>
    </div>

    <div class="p-3 mb-4 rounded-4 shadow-sm border border-warning-subtle" style="background: rgba(245, 158, 11, 0.05);">
        <div class="d-flex align-items-center">
            <div class="spinner-grow text-warning me-3" role="status" style="width: 1.5rem; height: 1.5rem;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="fw-bold text-warning-emphasis">
                <i class="fas fa-terminal me-2"></i> EXECUTING COMPOSER PIPELINE...
            </div>
        </div>
    </div>

    <div class="bg-dark rounded-4 p-0 shadow-lg border border-secondary mb-4 overflow-hidden">
        <div class="bg-secondary bg-opacity-25 px-3 py-2 border-bottom border-secondary d-flex align-items-center">
            <div class="d-flex gap-1 me-3">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></div>
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b;"></div>
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></div>
            </div>
            <span class="text-muted smallest fw-bold uppercase letter-spacing-1">Terminal Session: composer_install.log</span>
        </div>
        <pre class="text-light mb-0 p-4" style="max-height:450px; overflow:auto; font-family: 'Fira Code', monospace; font-size: 0.8rem; line-height: 1.6; white-space: pre-wrap; background: #0f172a;">
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
<div class="mb-5">
    <h2 class="fw-bold text-dark">Dependency Registry</h2>
    <p class="text-muted">The platform requires several core libraries to be initialized before it can operate.</p>
</div>

<div class="card border-0 shadow-sm mb-5 overflow-hidden" style="border-radius: 20px;">
    <div class="card-header bg-light py-3 border-0">
        <h3 class="h6 fw-bold mb-0 text-dark uppercase letter-spacing-1 small">
            <i class="fas fa-boxes me-2 text-primary"></i> Required Package Audit
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="row g-3" style="max-height:280px; overflow-y:auto;">
            <?php foreach ($packages as $pkg): ?>
                <div class="col-md-6">
                    <div class="d-flex align-items-center p-2 rounded-3 bg-light bg-opacity-50 border border-light">
                        <i class="fa-solid fa-check-circle me-2 text-success" style="font-size: 0.8rem;"></i>
                        <code class="smallest text-dark" style="font-family: 'Fira Code', monospace;"><?= htmlspecialchars($pkg) ?></code>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<div class="text-center">
    <form method="post">
        <button type="submit" class="btn btn-primary btn-lg px-5 shadow-lg">
            <i class="fas fa-play-circle me-2"></i> Execute Package Installation
        </button>
    </form>
    <p class="text-muted smallest mt-3 fw-bold uppercase letter-spacing-1">Warning: Ensure your internet connection is stable.</p>
</div>
<?php include __DIR__ . '/../layout/footer.php'; ?>