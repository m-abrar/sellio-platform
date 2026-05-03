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
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Data Orchestration</h2>
        <p class="text-muted">Populating your environment with high-fidelity sample data and initial configurations.</p>
    </div>

    <div class="p-3 mb-4 rounded-4 shadow-sm border border-success-subtle" style="background: rgba(16, 185, 129, 0.05);">
        <div class="d-flex align-items-center">
            <div class="spinner-grow text-success me-3" role="status" style="width: 1.5rem; height: 1.5rem;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="fw-bold text-success">
                <i class="fas fa-seedling me-2"></i> PLANTING DATA SEEDS...
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
            <span class="text-muted smallest fw-bold uppercase letter-spacing-1">Terminal Session: database_seeding.log</span>
        </div>
        <pre class="text-light mb-0 p-4" style="max-height:450px; overflow:auto; font-family: 'Fira Code', monospace; font-size: 0.8rem; line-height: 1.6; white-space: pre-wrap; background: #0f172a;">
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
    if (!$error):
        ?>
        <div class="text-center mt-5 pt-4 border-top animate__animated animate__fadeInUp">
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
    endif;
    include __DIR__ . '/../layout/footer.php';
    exit();
}

$title = 'Import Demo Content';
include __DIR__ . '/../layout/header.php';
?>
<div class="mb-5">
    <h2 class="fw-bold text-dark">Mock Content Injection</h2>
    <p class="text-muted">Populate your new marketplace with realistic sample data to visualize the platform's full potential.</p>
</div>

<div class="card border-0 shadow-sm mb-5 overflow-hidden" style="border-radius: 24px; background: #fff;">
    <div class="card-body p-5">
        <h3 class="h6 fw-bold mb-4 text-dark uppercase letter-spacing-1 small">
            <i class="fas fa-layer-group me-2 text-primary"></i> Planned Data Packages:
        </h3>
        <div class="d-flex flex-wrap gap-3 mb-5">
            <span class="badge bg-indigo-soft text-indigo px-4 py-2 border border-indigo-subtle rounded-pill">Core Settings Registry</span>
            <span class="badge bg-indigo-soft text-indigo px-4 py-2 border border-indigo-subtle rounded-pill">ACL Roles & Permissions</span>
            <span class="badge bg-indigo-soft text-indigo px-4 py-2 border border-indigo-subtle rounded-pill">Editorial Blog Content</span>
            <?php foreach ($enabledModules as $mod): ?>
                <span class="badge bg-primary-soft text-primary px-4 py-2 border border-primary-subtle rounded-pill"><?= htmlspecialchars($mod) ?> Ecosystem</span>
            <?php endforeach; ?>
        </div>

        <div class="p-3 rounded-4 bg-light bg-opacity-50 d-flex align-items-center">
            <i class="fas fa-magic-wand-sparkles text-primary me-3"></i>
            <p class="text-muted smallest mb-0 fw-bold">The intelligent importer will only seed data for your activated marketplace verticals.</p>
        </div>
    </div>
</div>

<div class="text-center">
    <form method="post">
        <button type="submit" class="btn btn-primary btn-lg px-5 shadow-lg">
            <i class="fas fa-rocket me-2"></i> Launch Data Import Pipeline
        </button>
    </form>
</div>

<style>
    .bg-indigo-soft { background: rgba(99, 102, 241, 0.08); }
    .text-indigo { color: #4f46e5; }
    .border-indigo-subtle { border-color: rgba(99, 102, 241, 0.2) !important; }
    .bg-primary-soft { background: rgba(13, 148, 136, 0.08); }
</style>
<?php include __DIR__ . '/../layout/footer.php'; ?>