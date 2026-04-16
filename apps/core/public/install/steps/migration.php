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
    <h2 class="mb-4">Importing Database</h2>
    <p class="mb-4 text-muted">Building the database schema and initializing core tables.</p>

    <div class="alert alert-info small mb-4 shadow-sm">
        <i class="fa-solid fa-database fa-beat me-2"></i> <strong>Processing Tables...</strong> This usually takes 30-60
        seconds.
    </div>

    <div class="bg-dark rounded p-3 shadow-inner mb-4">
        <pre class="text-light mb-0"
            style="max-height:500px; overflow:auto; font-size: 0.85em; font-family: monospace; white-space: pre-wrap;">
    <?php
    flush();
    chdir($basePath);

    $phpBinary = get_php_binary();

    // Command: Migrate force (Seeding is now a separate step)
    $command = "{$phpBinary} artisan migrate --force 2>&1";

    if (function_exists('passthru')) {
        passthru($command, $status);
    } else {
        $status = 1;
        echo "❌ [Error] The 'passthru' function is disabled on your server. This installer requires it to run migrations.";
    }

    $error = ($status !== 0);
    
    // --- POST-MIGRATION VERIFICATION ---
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
                
                // Check if the 'migrations' table exists
                $res = $pdo->query("SHOW TABLES LIKE 'migrations'");
                if ($res->rowCount() === 0) {
                    $error = true;
                    $message = "❌ False Success: The migration command claimed to finish, but no database tables were created. This is usually due to a PHP binary incompatibility (LSAPI/CGI issues).";
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
        $message = "❌ Database migration failed. The PHP binary may not be compatible or there was a database error.";
    }
    
    echo "\n--- MIGRATION FINISHED ---";
    ?>
        </pre>
    </div>
    <?php
    display_message($message, $error);
    if (!$error):
        ?>
        <div class="text-center mt-4 pt-3 border-top">
            <a href="?step=modules" class="btn btn-primary btn-lg px-5">
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
<h2 class="mb-4">Database Migration</h2>
<p class="mb-4 text-muted">Initialize the database schema for Sellio. This step creates all necessary tables and
    columns.</p>

<div class="alert alert-light border shadow-sm mb-4">
    <i class="fa-solid fa-circle-info text-primary me-2"></i> This process takes about 10-20 seconds. Demo data will be
    imported in a later step.
</div>

<div class="text-center mt-4 pt-3 border-top">
    <form method="post">
        <button type="submit" class="btn btn-primary btn-lg px-5 shadow">
            <i class="fa-solid fa-upload me-2"></i> Initialize Database Schema
        </button>
    </form>
</div>
<?php include __DIR__ . '/../layout/footer.php'; ?>