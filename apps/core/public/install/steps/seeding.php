<?php
// =================================================================================
// Sellio Installer - Demo Data Seeding Step
// File: steps/seeding.php
// =================================================================================
global $basePath;

// --- PHP LOGIC START ---
set_time_limit(0);

// 1. Fetch Enabled Modules for UI Feedback
$enabledModules = [];
try {
    $envPath = $basePath . '/.env';
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $dbConfig = [];
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                [$key, $value] = explode('=', $line, 2);
                $dbConfig[trim($key)] = trim($value, "\"' ");
            }
        }
        $dsn = "mysql:host={$dbConfig['DB_HOST']};port={$dbConfig['DB_PORT']};dbname={$dbConfig['DB_DATABASE']};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbConfig['DB_USERNAME'], $dbConfig['DB_PASSWORD']);

        $stmt = $pdo->query("SELECT `key` FROM settings WHERE `key` LIKE 'is_section.%' AND `value` = '1'");
        while ($row = $stmt->fetch()) {
            $key = str_replace('is_section.', '', $row['key']);
            $enabledModules[] = ucfirst($key);
        }
    }
} catch (Exception $e) {
    // Graceful fail if DB not ready
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (ob_get_level())
        ob_end_clean();
    ob_implicit_flush(true);

    header("Content-Type: text/html");
    $title = 'Importing Demo Demos';
    include __DIR__ . '/../layout/header.php';
    ?>
    <h2 class="mb-4">Importing Demo Data</h2>
    <p class="mb-4 text-muted">Populating your selected modules with sample listings, categories, and initial
        configurations.</p>

    <div class="alert alert-info small mb-4 shadow-sm">
        <i class="fa-solid fa-seedling fa-beat me-2"></i> <strong>Seeding Database...</strong> This may take a minute
        depending on your server speed.
    </div>

    <div class="bg-dark rounded p-3 shadow-inner mb-4">
        <pre class="text-light mb-0"
            style="max-height:500px; overflow:auto; font-size: 0.85em; font-family: monospace; white-space: pre-wrap;">
    <?php
    flush();
    chdir($basePath);

    $phpBinary = get_php_binary();
    $command = "{$phpBinary} artisan db:seed --force 2>&1";

    if (function_exists('passthru')) {
        passthru($command, $status);
    } else {
        $status = 1;
        echo "❌ [Error] The 'passthru' function is disabled on your server. This installer requires it to run seeders.";
    }

    $error = ($status !== 0);
    
    // --- POST-SEEDING VERIFICATION ---
    if (!$error) {
        try {
            $envPath = $basePath . '/.env';
            if (file_exists($envPath)) {
                $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                $dbConfig = [];
                foreach ($lines as $line) {
                    if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                        [$key, $value] = explode('=', $line, 2);
                        $dbConfig[trim($key)] = trim($value, "\"' ");
                    }
                }
                $dsn = "mysql:host={$dbConfig['DB_HOST']};port={$dbConfig['DB_PORT']};dbname={$dbConfig['DB_DATABASE']};charset=utf8mb4";
                $pdo = new PDO($dsn, $dbConfig['DB_USERNAME'], $dbConfig['DB_PASSWORD']);
                
                // Check if the 'settings' table contains data
                $res = $pdo->query("SELECT COUNT(*) FROM settings");
                if ($res->fetchColumn() == 0) {
                    $error = true;
                    $message = "❌ False Success: The seeding command finished, but no demo data was populated. This is usually due to a PHP binary incompatibility (LSAPI/CGI issues).";
                }
            }
        } catch (Exception $e) {
            $error = true;
            $message = "❌ Seeding Verification Failed: " . $e->getMessage();
        }
    }

    if (!$error) {
        $message = "✅ All demo data successfully imported!";
    } else if (empty($message)) {
        $message = "❌ Demo data import failed. The PHP binary may not be compatible or there was a database error.";
    }

    echo "\n--- SEEDING FINISHED ---";
    ?>
        </pre>
    </div>
    <?php
    display_message($message, $error);
    if (!$error):
        ?>
        <div class="text-center mt-5 pt-3 border-top">
            <h4 class="mb-3 text-success"><i class="fa-solid fa-circle-check fw-bold me-2"></i> Ready for the Final Step!</h4>
            <p class="text-muted mb-4 small">Redirecting you automatically to the Admin setup in <span id="countdown">3</span>
                seconds...</p>
            <a href="?step=admin" class="btn btn-primary btn-lg px-5 py-3 shadow">
                Next: Create Admin Account <i class="fa-solid fa-circle-arrow-right ms-2"></i>
            </a>
        </div>
        <script>
            let seconds = 3;
            const interval = setInterval(() => {
                seconds--;
                if (document.getElementById('countdown')) {
                    document.getElementById('countdown').innerText = seconds;
                }
                if (seconds <= 0) {
                    clearInterval(interval);
                    window.location.href = '?step=admin';
                }
            }, 1000);
        </script>
    <?php
    endif;
    include __DIR__ . '/../layout/footer.php';
    exit();
}

$title = 'Import Demo Content';
include __DIR__ . '/../layout/header.php';
?>
<h2 class="mb-4">Import Demo Data</h2>
<p class="mb-4 text-muted">This step will populate the enabled modules with realistic demo content to help you get
    started quickly.</p>

<div class="card border-0 shadow-sm mb-4">
    <div class="card-body p-4 bg-light">
        <h3 class="h6 fw-bold mb-3"><i class="fa-solid fa-list-check me-2 text-primary"></i> Selected Content to Import:
        </h3>
        <div class="d-flex flex-wrap gap-2 mb-4">
            <span class="badge bg-secondary px-3 py-2">Core Settings</span>
            <span class="badge bg-secondary px-3 py-2">Roles & Permissions</span>
            <span class="badge bg-secondary px-3 py-2">Blog Posts</span>
            <?php foreach ($enabledModules as $mod): ?>
                <span class="badge bg-primary px-3 py-2"><?= htmlspecialchars($mod) ?> Marketplace</span>
            <?php endforeach; ?>
        </div>

        <p class="text-muted small mb-0">The importer will intelligently skip any modules you disabled in the previous
            step.</p>
    </div>
</div>

<div class="text-center mt-4 pt-3 border-top">
    <form method="post">
        <button type="submit" class="btn btn-primary btn-lg px-5 shadow">
            <i class="fa-solid fa-rocket me-2"></i> Start Importing Demos
        </button>
    </form>
</div>
<?php include __DIR__ . '/../layout/footer.php'; ?>