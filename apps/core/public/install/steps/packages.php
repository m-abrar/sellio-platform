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
    <h2 class="mb-4">Installing Composer Packages</h2>
    <p class="mb-3">Preparing your Laravel environment. This process installs all core dependencies.</p>

    <div class="alert alert-warning small mb-4 shadow-sm">
        <i class="fa-solid fa-spinner fa-spin me-2"></i> <strong>Running Composer...</strong> Please stay on this page until
        the process finishes.
    </div>

    <div class="bg-dark rounded p-3 shadow-inner mb-4">
        <pre class="text-light mb-0"
            style="max-height:500px; overflow:auto; font-size: 0.85em; font-family: monospace; white-space: pre-wrap;">
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

    // Determine the composer command with a fallback for LSAPI/LiteSpeed
    $cmdWithFlags = "{$phpBinary} -d register_argc_argv=Off -d memory_limit=-1 {$composerPhar}";
    $cmdWithoutFlags = "{$phpBinary} {$composerPhar}";
    
    if (file_exists($composerPhar)) {
        // Pre-test: Verify if the binary supports CLI flags (-d)
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

    // We include dev dependencies (no --no-dev) to ensure Faker is available for seeders
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
    echo "\n--- COMPOSER FINISHED ---";
    ?>
        </pre>
    </div>
    <?php
    if ($message)
        display_message($message, $error);
    if ($success):
        ?>
        <div class="text-center mt-4 pt-3 border-top">
            <a href="?step=migration" class="btn btn-primary btn-lg px-5">
                Next: Import Database <i class="fa-solid fa-chevron-right ms-2"></i>
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
<h2 class="mb-4">Composer Packages</h2>
<p class="mb-4 text-muted">Install the required Laravel dependencies to initialize the application.</p>

<div class="card border-0 shadow-sm mb-4">
    <div class="card-body">
        <h3 class="h6 fw-bold mb-3">Core Dependencies to Install:</h3>
        <div class="bg-light p-3 rounded small" style="max-height:150px; overflow-y:auto;">
            <?php foreach ($packages as $pkg): ?>
                <div class="text-muted mb-1"><i
                        class="fa-solid fa-check me-2 text-success"></i><?= htmlspecialchars($pkg) ?></div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<div class="text-center mt-4 pt-3 border-top">
    <form method="post">
        <button type="submit" class="btn btn-primary btn-lg px-5 shadow">
            <i class="fa-solid fa-terminal me-2"></i> Install Dependencies
        </button>
    </form>
</div>
<?php include __DIR__ . '/../layout/footer.php'; ?>