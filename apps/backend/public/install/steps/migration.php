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
    <?php installer_step_intro('Structural initialization', 'Creating database tables and core relationships.'); ?>

    <div class="status-banner status-banner-primary">
        <div class="spinner-border spinner-border-sm text-brand" role="status"><span class="visually-hidden">Loading...</span></div>
        <div class="fw-bold text-brand"><i class="fas fa-database me-2"></i>Migrating tables…</div>
    </div>

    <div class="terminal-window">
        <div class="terminal-header">
            <div class="terminal-dots">
                <span class="terminal-dot terminal-dot-red"></span>
                <span class="terminal-dot terminal-dot-amber"></span>
                <span class="terminal-dot terminal-dot-green"></span>
            </div>
            <span class="terminal-title">database_migration.log</span>
        </div>
        <pre class="terminal-body">
<?php
    flush();
    chdir($basePath);

    $phpBinary = get_php_binary();
    $useFresh = should_installer_migrate_fresh();
    $migrateCommand = $useFresh ? 'migrate:fresh' : 'migrate';
    $command = "{$phpBinary} artisan {$migrateCommand} --force 2>&1";

    if ($useFresh) {
        echo "ℹ️ [Notice] Overwrite requested — running migrate:fresh to drop and rebuild all tables.\n\n";
    }

    if (function_exists('passthru')) {
        passthru($command, $status);
    } else {
        $status = 1;
        echo "❌ [Error] The 'passthru' function is disabled on your server. This installer requires it to run migrations.";
    }

    $error = ($status !== 0);

    if (!$error && $useFresh) {
        clear_installer_db_overwrite_flag();
    }
    
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
<?php installer_step_intro('Database structure', 'Deploy the core schema. Demo content is imported in the next steps.'); ?>

<div class="info-panel info-panel-primary mb-4 d-flex align-items-start gap-3">
    <div class="icon-square bg-white text-brand shadow-xs">
        <i class="fas fa-info-circle"></i>
    </div>
    <div>
        <h4 class="fw-bold mb-1 small text-uppercase letter-spacing-1">What happens here</h4>
        <p class="text-muted mb-0 small">Laravel migrations create 40+ tables. Sample listings and settings are added later during seeding.</p>
    </div>
</div>

<form method="post">
    <?php installer_step_nav('packages', '#', 'Deploy Schema Architecture', true); ?>
</form>
<?php include __DIR__ . '/../layout/footer.php'; ?>