<?php
// =================================================================================
// Sellio Installer - Database Migration Step
// File: steps/migration.php
// =================================================================================
global $basePath;

// --- PHP LOGIC START ---
set_time_limit(0);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (ob_get_level())
        ob_end_clean();
    ob_implicit_flush(true);

    header("Content-Type: text/html");
    $title = 'Importing Database';
    include __DIR__ . '/../layout/header.php';
    ?>
    <div class="mb-5">
        <h2 class="fw-bold text-dark">Structural Initialization</h2>
        <p class="text-muted">Architecting the database schema and establishing core data relations.</p>
    </div>

    <div class="p-3 mb-4 rounded-4 shadow-sm border border-primary-subtle" style="background: rgba(99, 102, 241, 0.05);">
        <div class="d-flex align-items-center">
            <div class="spinner-border text-primary me-3" role="status" style="width: 1.5rem; height: 1.5rem; border-width: 0.2em;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="fw-bold text-primary">
                <i class="fas fa-database me-2"></i> MIGRATING TABLES...
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
            <span class="text-muted smallest fw-bold uppercase letter-spacing-1">Terminal Session: database_migration.log</span>
        </div>
        <pre class="text-light mb-0 p-4" style="max-height:450px; overflow:auto; font-family: 'Fira Code', monospace; font-size: 0.8rem; line-height: 1.6; white-space: pre-wrap; background: #0f172a;">
<?php
    flush();
    chdir($basePath);

    $phpBinary = get_php_binary();
    $command = "{$phpBinary} artisan migrate --force 2>&1";

    if (function_exists('passthru')) {
        passthru($command, $status);
    } else {
        $status = 1;
        echo "❌ [Error] The 'passthru' function is disabled on your server. This installer requires it to run migrations.";
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
                
                $res = $pdo->query("SHOW TABLES LIKE 'migrations'");
                if ($res->rowCount() === 0) {
                    $error = true;
                    $message = "❌ False Success: The migration command claimed to finish, but no database tables were created. Check PHP binary compatibility.";
                }
            }
        } catch (Exception $e) {
            $error = true;
            $message = "❌ Database Verification Failed: " . $e->getMessage();
        }
    }

    if (!$error) {
        $message = "✅ Database schema successfully created!";
    } else if (empty($message)) {
        $message = "❌ Database migration failed. Check the logs above for technical details.";
    }
    
    echo "\n--- MIGRATION PIPELINE FINISHED ---";
?>
        </pre>
    </div>
    <?php
    display_message($message, $error);
    if (!$error):
        ?>
        <div class="text-center mt-5 pt-4 border-top">
            <a href="?step=modules" class="btn btn-primary btn-lg px-5 shadow-lg">
                Next: Configure Modules <i class="fa-solid fa-chevron-right ms-2"></i>
            </a>
        </div>
    <?php
    endif;
    include __DIR__ . '/../layout/footer.php';
    exit();
}

$title = 'Import Database Structure';
include __DIR__ . '/../layout/header.php';
?>
<div class="mb-5">
    <h2 class="fw-bold text-dark">Data Structure Export</h2>
    <p class="text-muted">Initialize the core data architecture for your Sellio instance.</p>
</div>

<div class="card border-0 shadow-sm mb-5 overflow-hidden" style="border-radius: 20px; background: rgba(99, 102, 241, 0.03);">
    <div class="card-body p-4 d-flex align-items-center">
        <div class="icon-square bg-white text-primary p-3 rounded-4 me-4 shadow-xs">
            <i class="fas fa-info-circle fa-xl"></i>
        </div>
        <div>
            <h4 class="fw-bold mb-1 text-dark small uppercase letter-spacing-1">Important Note</h4>
            <p class="text-muted mb-0 small">This process will create over <strong>40+ tables</strong>. Seeding and demo data will be handled in a subsequent step.</p>
        </div>
    </div>
</div>

<div class="text-center">
    <form method="post">
        <button type="submit" class="btn btn-primary btn-lg px-5 shadow-lg">
            <i class="fas fa-hammer me-2"></i> Deploy Schema Architecture
        </button>
    </form>
</div>
<?php include __DIR__ . '/../layout/footer.php'; ?>