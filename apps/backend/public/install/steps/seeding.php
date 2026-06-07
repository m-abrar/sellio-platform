<?php
// =================================================================================
// Sellio Installer - Demo Data Seeding Step
// File: steps/seeding.php
// =================================================================================
global $basePath;

// --- PHP LOGIC START ---
set_time_limit(0);

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
} catch (Exception $e) {}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (ob_get_level())
        ob_end_clean();
    ob_implicit_flush(true);

    header("Content-Type: text/html");
    $title = 'Importing Demo Demos';
    include __DIR__ . '/../layout/header.php';
    ?>
    <?php installer_step_intro('Data orchestration', 'Importing demo listings, roles, and settings for your activated modules.'); ?>

    <div class="status-banner status-banner-success">
        <div class="spinner-grow spinner-grow-sm text-success" role="status"><span class="visually-hidden">Loading...</span></div>
        <div class="fw-bold text-success"><i class="fas fa-seedling me-2"></i>Planting data seeds…</div>
    </div>

    <div class="terminal-window">
        <div class="terminal-header">
            <div class="terminal-dots">
                <span class="terminal-dot terminal-dot-red"></span>
                <span class="terminal-dot terminal-dot-amber"></span>
                <span class="terminal-dot terminal-dot-green"></span>
            </div>
            <span class="terminal-title">database_seeding.log</span>
        </div>
        <pre class="terminal-body">
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
                
                $res = $pdo->query("SELECT COUNT(*) FROM settings");
                if ($res->fetchColumn() == 0) {
                    $error = true;
                    $message = "❌ False Success: The seeding command finished, but no demo data was populated. Check binary compatibility.";
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
        $message = "❌ Demo data import failed. Check terminal logs for technical errors.";
    }

    echo "\n--- SEEDING PIPELINE FINISHED ---";
?>
        </pre>
    </div>
    <?php
    display_message($message, $error);

    if (!$error) {
        ?>
        <div class="text-center mt-5 pt-4 border-top seeding-success-panel">
            <h4 class="mb-3 text-success fw-bold"><i class="fas fa-check-double me-2"></i> Environment Ready!</h4>
            <p class="text-muted mb-4 small">Redirecting to administrator account provisioning in <span id="countdown" class="fw-bold text-dark">3</span> seconds...</p>
            <a href="?step=admin" class="btn btn-primary btn-lg px-5 py-3 shadow-lg">
                Proceed to Final Step <i class="fas fa-arrow-right ms-2"></i>
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
    } else {
        echo '<form method="post" class="mt-4 pt-4 border-top">';
        installer_step_nav('modules', '#', 'Retry data import', true);
        echo '</form>';
    }

    include __DIR__ . '/../layout/footer.php';
    exit();
}

$title = 'Import Demo Content';
include __DIR__ . '/../layout/header.php';
?>
<?php installer_step_intro('Demo content import', 'Populate your marketplace with realistic sample data so you can explore every module immediately.'); ?>

<div class="info-panel mb-4">
    <h3 class="h6 fw-bold mb-3 text-brand smallest text-uppercase letter-spacing-1">
        <i class="fas fa-layer-group me-2"></i> Planned data packages
    </h3>
    <div class="d-flex flex-wrap gap-2 mb-4">
        <span class="badge-pill badge-pill-muted">Core settings</span>
        <span class="badge-pill badge-pill-muted">Roles & permissions</span>
        <span class="badge-pill badge-pill-muted">Blog content</span>
        <?php foreach ($enabledModules as $mod): ?>
            <span class="badge-pill badge-pill-brand"><?= htmlspecialchars($mod) ?> ecosystem</span>
        <?php endforeach; ?>
    </div>

    <div class="d-flex align-items-center gap-2 small text-muted">
        <i class="fas fa-wand-magic-sparkles text-brand"></i>
        <span>Only enabled marketplace verticals receive demo listings.</span>
    </div>
</div>

<form method="post">
    <?php installer_step_nav('modules', '#', 'Launch Data Import Pipeline', true); ?>
</form>
<?php include __DIR__ . '/../layout/footer.php'; ?>