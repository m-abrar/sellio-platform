<?php
// =================================================================================
// Sellio Installer - Environment Setup Step
// File: steps/environment.php
// =================================================================================
global $basePath;

// --- PHP LOGIC START ---
$envPath = $basePath . '/.env';

// Detect current base URL
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$currentUrl = $protocol . $_SERVER['HTTP_HOST'] . rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
$appUrl = preg_replace('#/install$#i', '', $currentUrl); 

// Auto-detect environment using our helper function
$isLocal = is_local_env();
$appEnv = $isLocal ? 'local' : 'production';
$appDebug = $isLocal ? 'true' : 'false';
$installerDebug = $isLocal ? 'true' : 'false';

$errorMessage = null;

// Load existing .env values
$existingEnv = [];
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            [$key, $value] = explode('=', $line, 2);
            $existingEnv[trim($key)] = trim($value, "\"' ");
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $appName = trim($_POST['app_name'] ?? $existingEnv['APP_NAME'] ?? 'Sellio');
    $appUrl  = $_POST['app_url'] ?? $existingEnv['APP_URL'] ?? $appUrl;
    $dbHost  = $_POST['db_host'] ?? $existingEnv['DB_HOST'] ?? '127.0.0.1';
    $dbPort  = $_POST['db_port'] ?? $existingEnv['DB_PORT'] ?? '3306';
    $dbName  = $_POST['db_name'] ?? $existingEnv['DB_DATABASE'] ?? 'sellio';
    $dbUser  = $_POST['db_user'] ?? $existingEnv['DB_USERNAME'] ?? 'root';
    $dbPass  = $_POST['db_pass'] ?? $existingEnv['DB_PASSWORD'] ?? '';
    
    $mailMailer = $_POST['mail_mailer'] ?? $existingEnv['MAIL_MAILER'] ?? 'smtp';
    $mailHost   = $_POST['mail_host'] ?? $existingEnv['MAIL_HOST'] ?? 'smtp.mailtrap.io';
    $mailPort   = $_POST['mail_port'] ?? $existingEnv['MAIL_PORT'] ?? '2525';
    $mailUser   = $_POST['mail_user'] ?? $existingEnv['MAIL_USERNAME'] ?? '';
    $mailPass   = $_POST['mail_pass'] ?? $existingEnv['MAIL_PASSWORD'] ?? '';
    $mailEnc    = $_POST['mail_enc'] ?? $existingEnv['MAIL_ENCRYPTION'] ?? 'tls';
    $mailFrom   = $_POST['mail_from'] ?? $existingEnv['MAIL_FROM_ADDRESS'] ?? "no-reply@sellio.com";

    $tables = [];
    $overwrite_db = isset($_POST['overwrite_db']) && $_POST['overwrite_db'] === '1';

    // Test DB connection
    try {
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 5,
        ]);
    } catch (PDOException $e) {
        $errorMessage = "❌ Database connection failed: " . $e->getMessage();
    }

    if (!$errorMessage) {
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        if (!empty($tables) && !$overwrite_db) {
            $errorMessage = "⚠️ The database '{$dbName}' is not empty. Proceeding may overwrite existing data. Please check the 'Overwrite existing tables' box to continue.";
        }
    }

    if (!$errorMessage) {
        $overwrite = isset($_POST['overwrite_env']) && $_POST['overwrite_env'] === '1';
        if ($overwrite || !file_exists($envPath)) {
            $appKey = $existingEnv['APP_KEY'] ?? 'base64:' . base64_encode(random_bytes(32));

            $content = <<<ENV
APP_NAME="{$appName}"
APP_ENV={$appEnv}
APP_KEY={$appKey}
APP_DEBUG={$appDebug}
INSTALLER_DEBUG={$installerDebug}
APP_URL="{$appUrl}"

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST="{$dbHost}"
DB_PORT="{$dbPort}"
DB_DATABASE="{$dbName}"
DB_USERNAME="{$dbUser}"
DB_PASSWORD="{$dbPass}"

MAIL_MAILER="{$mailMailer}"
MAIL_HOST="{$mailHost}"
MAIL_PORT="{$mailPort}"
MAIL_USERNAME="{$mailUser}"
MAIL_PASSWORD="{$mailPass}"
MAIL_ENCRYPTION="{$mailEnc}"
MAIL_FROM_ADDRESS="{$mailFrom}"
MAIL_FROM_NAME="\${APP_NAME}"
ENV;
            if (file_put_contents($envPath, $content) === false) {
                $errorMessage = "❌ Failed to write .env file. Please check folder permissions.";
            }
        }

        if (!$errorMessage && !empty($tables) && $overwrite_db) {
            if (!set_installer_db_overwrite_flag()) {
                $errorMessage = "❌ Failed to prepare database overwrite. Please check storage/framework permissions.";
            }
        } elseif (!$errorMessage) {
            clear_installer_db_overwrite_flag();
        }
        
        if (!$errorMessage) {
            redirect('packages');
        }
    }
}

$title = 'Database Connection';
// --- PHP LOGIC END ---

include __DIR__ . '/../layout/header.php';
?>

<div class="mb-5">
    <h2 class="fw-bold text-dark">Environment Setup</h2>
    <p class="text-muted">Configure your platform settings and establish a secure database link.</p>
</div>

<?php if ($errorMessage) display_message($errorMessage, true); ?>

<form method="post" class="mx-auto" style="max-width:650px;">
    
    <div class="row g-4 mb-4">
        <div class="col-md-6">
            <label for="app_name" class="form-label">Application Name</label>
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="fas fa-building text-muted"></i></span>
                <input type="text" id="app_name" name="app_name" class="form-control border-start-0"
                    value="<?= htmlspecialchars($_POST['app_name'] ?? $existingEnv['APP_NAME'] ?? 'Sellio') ?>" required>
            </div>
        </div>

        <div class="col-md-6">
            <label for="app_url" class="form-label">Base Application URL</label>
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="fas fa-link text-muted"></i></span>
                <input type="url" id="app_url" name="app_url" class="form-control border-start-0"
                    value="<?= htmlspecialchars($_POST['app_url'] ?? $existingEnv['APP_URL'] ?? $appUrl) ?>" required>
            </div>
        </div>
    </div>

    <div class="p-4 rounded-4 mb-4" style="background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.1);">
        <h3 class="h6 mb-4 fw-bold text-uppercase letter-spacing-1" style="color: var(--primary-dark);">
            <i class="fas fa-database me-2"></i> Database Configuration
        </h3>
        
        <div class="row g-3 mb-3">
            <div class="col-md-8">
                <label for="db_host" class="form-label">Host Address</label>
                <input type="text" id="db_host" name="db_host" class="form-control"
                    value="<?= htmlspecialchars($_POST['db_host'] ?? $existingEnv['DB_HOST'] ?? '127.0.0.1') ?>" required>
            </div>

            <div class="col-md-4">
                <label for="db_port" class="form-label">Port</label>
                <input type="text" id="db_port" name="db_port" class="form-control"
                    value="<?= htmlspecialchars($_POST['db_port'] ?? $existingEnv['DB_PORT'] ?? '3306') ?>" required>
            </div>
        </div>

        <div class="mb-3">
            <label for="db_name" class="form-label">Database Name</label>
            <input type="text" id="db_name" name="db_name" class="form-control"
                value="<?= htmlspecialchars($_POST['db_name'] ?? $existingEnv['DB_DATABASE'] ?? 'sellio') ?>" required>
        </div>

        <div class="row g-3 mb-2">
            <div class="col-md-6">
                <label for="db_user" class="form-label">Username</label>
                <input type="text" id="db_user" name="db_user" class="form-control"
                    value="<?= htmlspecialchars($_POST['db_user'] ?? $existingEnv['DB_USERNAME'] ?? 'root') ?>" required>
            </div>
            <div class="col-md-6">
                <label for="db_pass" class="form-label">Password</label>
                <input type="password" id="db_pass" name="db_pass" class="form-control"
                    placeholder="••••••••"
                    value="<?= htmlspecialchars($_POST['db_pass'] ?? $existingEnv['DB_PASSWORD'] ?? '') ?>">
            </div>
        </div>
    </div>

    <div class="p-4 rounded-4 mb-4" style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.1);">
        <h3 class="h6 mb-4 fw-bold text-uppercase letter-spacing-1 text-success">
            <i class="fas fa-envelope me-2"></i> Mail Server Configuration
        </h3>
        
        <div class="row g-3 mb-3">
            <div class="col-md-6">
                <label for="mail_mailer" class="form-label">Mailer</label>
                <select name="mail_mailer" id="mail_mailer" class="form-select">
                    <option value="smtp" <?= ($existingEnv['MAIL_MAILER'] ?? 'smtp') === 'smtp' ? 'selected' : '' ?>>SMTP</option>
                    <option value="log" <?= ($existingEnv['MAIL_MAILER'] ?? '') === 'log' ? 'selected' : '' ?>>Log (Dev)</option>
                </select>
            </div>
            <div class="col-md-6">
                <label for="mail_host" class="form-label">SMTP Host</label>
                <input type="text" id="mail_host" name="mail_host" class="form-control"
                    value="<?= htmlspecialchars($_POST['mail_host'] ?? $existingEnv['MAIL_HOST'] ?? 'smtp.mailtrap.io') ?>">
            </div>
        </div>

        <div class="row g-3 mb-3">
            <div class="col-md-4">
                <label for="mail_port" class="form-label">Port</label>
                <input type="text" id="mail_port" name="mail_port" class="form-control"
                    value="<?= htmlspecialchars($_POST['mail_port'] ?? $existingEnv['MAIL_PORT'] ?? '2525') ?>">
            </div>
            <div class="col-md-4">
                <label for="mail_enc" class="form-label">Encryption</label>
                <select name="mail_enc" id="mail_enc" class="form-select">
                    <option value="tls" <?= ($existingEnv['MAIL_ENCRYPTION'] ?? 'tls') === 'tls' ? 'selected' : '' ?>>TLS</option>
                    <option value="ssl" <?= ($existingEnv['MAIL_ENCRYPTION'] ?? '') === 'ssl' ? 'selected' : '' ?>>SSL</option>
                    <option value="null" <?= ($existingEnv['MAIL_ENCRYPTION'] ?? '') === 'null' ? 'selected' : '' ?>>None</option>
                </select>
            </div>
            <div class="col-md-4">
                <label for="mail_from" class="form-label">From Address</label>
                <input type="email" id="mail_from" name="mail_from" class="form-control"
                    value="<?= htmlspecialchars($_POST['mail_from'] ?? $existingEnv['MAIL_FROM_ADDRESS'] ?? 'no-reply@sellio.com') ?>">
            </div>
        </div>

        <div class="row g-3">
            <div class="col-md-6">
                <label for="mail_user" class="form-label">Username</label>
                <input type="text" id="mail_user" name="mail_user" class="form-control"
                    value="<?= htmlspecialchars($_POST['mail_user'] ?? $existingEnv['MAIL_USERNAME'] ?? '') ?>">
            </div>
            <div class="col-md-6">
                <label for="mail_pass" class="form-label">Password</label>
                <input type="password" id="mail_pass" name="mail_pass" class="form-control"
                    value="<?= htmlspecialchars($_POST['mail_pass'] ?? $existingEnv['MAIL_PASSWORD'] ?? '') ?>">
            </div>
        </div>
    </div>

    <div class="d-flex flex-wrap align-items-center justify-content-center gap-4 mb-5">
        <?php if (file_exists($envPath)): ?>
            <div class="form-check custom-check">
                <input class="form-check-input" type="checkbox" name="overwrite_env" value="1" id="overwrite_env_check">
                <label class="form-check-label text-muted small fw-bold" for="overwrite_env_check">
                    OVERWRITE .ENV
                </label>
            </div>
        <?php endif; ?>
        
        <div class="form-check custom-check">
            <input class="form-check-input" type="checkbox" name="overwrite_db" value="1" id="overwrite_db_check">
            <label class="form-check-label text-muted small fw-bold" for="overwrite_db_check">
                OVERWRITE TABLES (drops all tables on migration)
            </label>
        </div>
    </div>

    <div class="mt-4 pt-4 border-top d-flex justify-content-between align-items-center">
        <a href="?step=requirements" class="btn btn-outline-secondary px-4">
            <i class="fa-solid fa-arrow-left me-2"></i>Back
        </a>

        <button type="submit" class="btn btn-primary btn-lg px-4 shadow-lg">
            Connect & Initialize <i class="fa-solid fa-chevron-right ms-2"></i>
        </button>
    </div>

</form>

<?php
include __DIR__ . '/../layout/footer.php'; 
?>