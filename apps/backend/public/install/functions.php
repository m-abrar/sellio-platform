<?php
// =================================================================================
// Sellio Installer - Global Functions and Setup
// File: functions.php
// =================================================================================

// Define base path (Installer is assumed to be in a subdirectory like '/install')
$basePath = realpath(__DIR__ . '/../..');

require_once __DIR__ . '/support/error_reporting.php';

/**
 * Path to the lock file that marks a completed installation.
 */
function installer_lock_path(): string
{
    global $basePath;

    return $basePath . DIRECTORY_SEPARATOR . 'installed.lock';
}

/**
 * Configure PHP error visibility for the web installer.
 */
function configure_installer_error_reporting(): void
{
    global $basePath;

    $lockExists = file_exists(installer_lock_path());
    $env = parse_installer_env_file($basePath . DIRECTORY_SEPARATOR . '.env');
    $display = should_installer_display_errors($lockExists, installer_debug_requested($env, is_local_env()));

    if ($display) {
        ini_set('display_errors', '1');
        ini_set('display_startup_errors', '1');
        error_reporting(E_ALL);

        return;
    }

    ini_set('display_errors', '0');
    ini_set('display_startup_errors', '0');
    error_reporting(E_ALL);
}

/**
 * Detect if the current environment is local (XAMPP/WAMP) or a remote server.
 * This helps adjust instructions and defaults (e.g., DB host, SSL checks).
 */
function is_local_env(): bool {
    return in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']);
}

/**
 * Web path to Laravel's public/ directory (respects subdirectory installs).
 */
function installer_public_base(): string
{
    static $base = null;

    if ($base !== null) {
        return $base;
    }

    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '/install/index.php');
    // dirname('/') is '\' on Windows — normalize so root installs resolve to an empty base.
    $publicPath = str_replace('\\', '/', dirname(dirname($scriptName)));

    if ($publicPath === '/' || $publicPath === '.' || $publicPath === '') {
        $base = '';
    } else {
        $base = rtrim($publicPath, '/');
    }

    return $base;
}

/**
 * Resolve a path under public/ for installer views and assets.
 */
function installer_asset(string $path): string
{
    $path = ltrim(str_replace('\\', '/', $path), '/');
    $base = installer_public_base();

    return ($base === '' ? '' : $base) . '/' . $path;
}

/**
 * Prefer a local public/ asset; fall back to CDN when vendor files were not uploaded.
 */
function installer_asset_or_cdn(string $publicPath, string $cdnUrl): string
{
    global $basePath;

    $localFile = $basePath . '/public/' . ltrim(str_replace('\\', '/', $publicPath), '/');

    if (is_file($localFile)) {
        return installer_asset($publicPath);
    }

    return $cdnUrl;
}

/**
 * Marketing documentation URL shown in the installer footer.
 */
function installer_doc_url(): string
{
    return 'https://sellio.buzz/documentation';
}

/**
 * Support contact URL shown in the installer footer.
 */
function installer_support_url(): string
{
    return 'mailto:support@example.com';
}

/**
 * Resolve the Sellio logo for the installer header (pre-install safe paths only).
 */
function installer_logo_url(): ?string
{
    global $basePath;

    $publicCandidates = [
        'install/assets/logo.webp',
        'install/assets/logo.png',
        'images/logo.png',
        'images/app-logo.webp',
        'images/app-logo.png',
    ];

    foreach ($publicCandidates as $publicPath) {
        $full = $basePath . '/public/' . str_replace('/', DIRECTORY_SEPARATOR, $publicPath);

        if (is_file($full)) {
            return installer_asset($publicPath);
        }
    }

    $linkedLogo = $basePath . '/public/storage/settings/logo.png';

    if (is_file($linkedLogo)) {
        return installer_asset('storage/settings/logo.png');
    }

    return null;
}

/**
 * Web path to a file inside public/install/.
 */
function installer_url(string $path = ''): string
{
    $scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '/install/index.php');
    $installPath = rtrim(dirname($scriptName), '/');
    $path = ltrim(str_replace('\\', '/', $path), '/');

    if ($path === '') {
        return $installPath === '' ? '/install' : $installPath;
    }

    return ($installPath === '' ? '' : $installPath) . '/' . $path;
}

/**
 * Returns the correct PHP binary path based on the environment with fallbacks.
 * Checks for specific server paths first, then common binary locations.
 */
function get_php_binary(): string {
    $primary = is_local_env() ? 'php' : '/opt/alt/php82/usr/bin/php';
    
    // List of common binary paths for shared hosting environments.
    // We prioritize generic 'php' and common system paths because PHP_BINARY 
    // in a web context often points to a non-CLI (LSAPI/CGI) SAPI.
    $fallbacks = [
        $primary,
        'php',
        '/usr/local/bin/php',
        '/usr/bin/php',
        '/opt/alt/php84/usr/bin/php',
        '/opt/alt/php83/usr/bin/php',
        '/opt/alt/php82/usr/bin/php',
        '/opt/alt/php81/usr/bin/php',
        PHP_BINARY, // Use the current PHP binary as a final fallback
    ];

    foreach ($fallbacks as $path) {
        if (empty($path)) continue;

        // If 'exec' is disabled, we can't reliably check the path with 'where'/'command -v'
        if (!function_exists('exec')) {
            // Return PHP_BINARY if we are currently checking it, otherwise return $primary as a guess
            return ($path === PHP_BINARY) ? $path : $primary;
        }

        // Check if the path is executable/exists
        $cmd = (PHP_OS_FAMILY === 'Windows') ? "where $path" : "command -v $path";
        
        // Execute detection
        $out = [];
        $res = -1;
        exec($cmd . ' 2>&1', $out, $res);
        
        if ($res === 0) {
            // Additional check: Verify if this is a functional PHP binary.
            // We test basic execution with -r. 
            $checkCmd = "{$path} -r \"echo 1;\" 2>&1";
            $checkOut = [];
            $checkRes = -1;
            exec($checkCmd, $checkOut, $checkRes);
            if ($checkRes === 0 && trim(implode('', $checkOut)) === '1') {
                return $path;
            }
        }
    }
    
    // Default to the primary if everything fails (the step will catch the execution error)
    return $primary; 
}

/**
 * Whether public/storage already resolves to a real target (link or directory).
 * is_link() alone would also be true for a dangling/broken symlink, so this also
 * confirms the target is actually reachable via file_exists().
 */
function installer_storage_link_ready(string $link): bool
{
    if (is_dir($link) && !is_link($link)) {
        return true;
    }

    return is_link($link) && file_exists($link);
}

/**
 * Recursively copy a directory tree. Last-resort fallback for hosts that block
 * both `artisan storage:link` and PHP's symlink().
 */
function installer_copy_directory(string $source, string $destination): bool
{
    if (!is_dir($source)) {
        return false;
    }

    if (!is_dir($destination) && !@mkdir($destination, 0775, true)) {
        return false;
    }

    $items = @scandir($source);
    if ($items === false) {
        return false;
    }

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }

        $from = $source . DIRECTORY_SEPARATOR . $item;
        $to = $destination . DIRECTORY_SEPARATOR . $item;

        if (is_dir($from)) {
            if (!installer_copy_directory($from, $to)) {
                return false;
            }
        } elseif (!@copy($from, $to)) {
            return false;
        }
    }

    return true;
}

/**
 * Ensure public/storage resolves to storage/app/public so seeded branding
 * (site_logo/favicon) and future uploads are reachable, without requiring the
 * buyer to have shell/SSH access to run `php artisan storage:link` themselves.
 *
 * Tries, in order: artisan (matches other install steps) -> native PHP
 * symlink() (works even if exec/passthru are disabled) -> a plain directory
 * copy (last resort on hosts that block symlinks entirely; uploads made after
 * this point won't sync automatically, but shipped branding assets show up).
 */
function installer_ensure_storage_link(): array
{
    global $basePath;

    $link = $basePath . '/public/storage';
    $target = $basePath . '/storage/app/public';

    if (installer_storage_link_ready($link)) {
        return ['ok' => true, 'method' => 'existing'];
    }

    if (function_exists('exec')) {
        $phpBinary = get_php_binary();
        $cwd = getcwd();
        chdir($basePath);
        $output = [];
        $status = 1;
        @exec("{$phpBinary} artisan storage:link --force 2>&1", $output, $status);
        chdir($cwd);

        if ($status === 0 && installer_storage_link_ready($link)) {
            return ['ok' => true, 'method' => 'artisan'];
        }
    }

    if (is_link($link)) {
        @unlink($link);
    }

    if (function_exists('symlink') && @symlink($target, $link)) {
        return ['ok' => true, 'method' => 'symlink'];
    }

    if (installer_copy_directory($target, $link)) {
        return ['ok' => true, 'method' => 'copy'];
    }

    return ['ok' => false, 'method' => null];
}

/**
 * Check if a specific directory relative to Laravel base is writable.
 * Crucial for Laravel's storage and cache folders.
 */
function is_path_writable(string $path): bool {
    global $basePath;
    $fullPath = $basePath . DIRECTORY_SEPARATOR . trim($path, '/');
    return is_writable($fullPath);
}

/**
 * Redirect helper for moving between steps.
 */
function redirect(string $step): void
{
    header('Location: ?step=' . $step);
    exit;
}

/**
 * Path to the flag file set when the user opts to overwrite a non-empty database.
 */
function installer_db_overwrite_flag_path(): string
{
    global $basePath;

    return $basePath . '/storage/framework/installer_overwrite_db.flag';
}

/**
 * Mark that the migration step should run migrate:fresh instead of migrate.
 */
function set_installer_db_overwrite_flag(): bool
{
    $path = installer_db_overwrite_flag_path();
    $dir = dirname($path);

    if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
        return false;
    }

    return file_put_contents($path, date('c')) !== false;
}

/**
 * Whether migrate:fresh was requested for this install run.
 */
function should_installer_migrate_fresh(): bool
{
    return file_exists(installer_db_overwrite_flag_path());
}

/**
 * Remove the migrate:fresh flag after a successful migration.
 */
function clear_installer_db_overwrite_flag(): void
{
    $path = installer_db_overwrite_flag_path();

    if (file_exists($path)) {
        unlink($path);
    }
}

/**
 * Display a styled Bootstrap alert message.
 */
function display_message(?string $message, bool $isError = false): void
{
    if ($message) {
        $class = $isError ? 'border-danger-subtle bg-danger-subtle text-danger' : 'border-success-subtle bg-success-subtle text-success';
        $icon = $isError ? 'fa-circle-xmark' : 'fa-circle-check';
        echo "<div class='alert {$class} rounded-4 d-flex align-items-start mb-4 px-4 py-3 border' role='alert'>
                <i class='fa-solid {$icon} fs-5 me-3 mt-1'></i>
                <div class='fw-semibold small'>" . htmlspecialchars($message) . "</div>
              </div>";
    }
}

/**
 * Installer steps configuration and mapping to Font Awesome Icons.
 * Key => [Friendly Name, Icon Class]
 */
$steps = [
    'welcome' => ['Welcome', 'fa-hand-sparkles'], 
    'requirements' => ['Requirements', 'fa-server'], 
    'environment' => ['Database', 'fa-database'], 
    'packages' => ['Packages', 'fa-box-open'], 
    'migration' => ['Import Database', 'fa-database'], 
    'modules' => ['Configure Modules', 'fa-th-large'], 
    'seeding' => ['Import Demos', 'fa-seedling'],
    'admin' => ['Admin User', 'fa-user-tie'],
    'platform_urls' => ['Platform URLs', 'fa-link'],
    'finished' => ['Finished', 'fa-check-double']
];

/**
 * Determine current step from the URL parameter.
 */
$currentStepKey = $_GET['step'] ?? 'welcome';

// Validate the step key, default to 'welcome' if it's invalid
if (!array_key_exists($currentStepKey, $steps)) {
    $currentStepKey = 'welcome';
}

// Get the friendly name and icon for the current step
$currentStepName = $steps[$currentStepKey][0];
$currentStepIcon = $steps[$currentStepKey][1];

/**
 * Current step position for the progress header.
 */
function installer_step_progress(): array
{
    global $steps, $currentStepKey;

    $keys = array_keys($steps);
    $index = array_search($currentStepKey, $keys, true);
    $index = $index === false ? 0 : $index;
    $total = max(count($keys), 1);

    return [
        'current' => $index + 1,
        'total' => $total,
        'percent' => (int) round((($index + 1) / $total) * 100),
        'label' => $steps[$currentStepKey][0] ?? 'Setup',
    ];
}

/**
 * Whether Composer vendor/ is already present (distribution or prior install).
 */
function installer_vendor_ready(): bool
{
    global $basePath;

    return is_file($basePath . '/vendor/autoload.php');
}

/**
 * Actionable hint for a failed requirement or recommendation check.
 */
function installer_requirement_hint(string $label): ?string
{
    $hints = [
        'PHP >= 8.2' => 'Upgrade to PHP 8.2+ via your hosting control panel or server administrator.',
        'exec() Function' => 'Remove exec from disable_functions in php.ini — required to locate the PHP CLI binary.',
        'passthru() Function' => 'Remove passthru from disable_functions — the installer streams Composer and Artisan output through it.',
        'Writable storage/' => 'chmod 775 storage/ (or 755) and ensure the web-server user owns or can write to it.',
        'Writable bootstrap/cache/' => 'chmod 775 bootstrap/cache/ so Laravel can compile config and routes.',
        'Frontend assets (public/build/manifest.json)' => 'Use the Sellio distribution ZIP (includes public/build/), or run npm run build in the backend before installing. Login still works without it via a CSS fallback, but the admin UI needs built assets.',
    ];

    if (isset($hints[$label])) {
        return $hints[$label];
    }

    if (str_ends_with($label, ' Extension')) {
        return 'Enable this PHP extension in php.ini or your hosting “Select PHP Extensions” panel, then reload this page.';
    }

    return null;
}

/**
 * Standard step heading block.
 */
function installer_step_intro(string $title, string $description, bool $centered = false): void
{
    $class = $centered ? 'step-intro step-intro-center' : 'step-intro';
    echo '<div class="' . $class . '">';
    echo '<h2 class="step-title">' . htmlspecialchars($title) . '</h2>';
    echo '<p class="step-lead">' . htmlspecialchars($description) . '</p>';
    echo '</div>';
}

/**
 * Navigation after async terminal steps (composer, migrate, seed).
 */
function installer_step_result_nav(
    bool $success,
    string $backStep,
    string $nextStep,
    string $nextLabel,
    string $retryLabel = 'Try again',
): void {
    if ($success) {
        echo '<div class="text-center mt-5 pt-4 border-top">';
        echo '<a href="?step=' . htmlspecialchars($nextStep) . '" class="btn btn-primary btn-lg px-5 shadow-lg">';
        echo htmlspecialchars($nextLabel) . ' <i class="fa-solid fa-chevron-right ms-2"></i></a>';
        echo '</div>';

        return;
    }

    echo '<form method="post" class="mt-4 pt-4 border-top">';
    installer_step_nav($backStep, '#', $retryLabel, true);
    echo '</form>';
}

/**
 * Consistent back / continue navigation row.
 */
function installer_step_nav(
    ?string $backStep = null,
    ?string $nextHref = null,
    string $nextLabel = 'Continue',
    bool $nextIsButton = false,
    ?string $nextHint = null,
): void {
    echo '<div class="step-nav">';

    if ($backStep) {
        echo '<a href="?step=' . htmlspecialchars($backStep) . '" class="btn btn-outline-secondary">';
        echo '<i class="fa-solid fa-arrow-left me-2"></i>Back';
        echo '</a>';
    } else {
        echo '<span></span>';
    }

    echo '<div class="text-end ms-auto">';
    if ($nextHref) {
        if ($nextIsButton) {
            echo '<button type="submit" class="btn btn-primary btn-lg shadow-sm">' . htmlspecialchars($nextLabel) . ' <i class="fa-solid fa-chevron-right ms-2"></i></button>';
        } else {
            echo '<a href="' . htmlspecialchars($nextHref) . '" class="btn btn-primary btn-lg shadow-sm">' . htmlspecialchars($nextLabel) . ' <i class="fa-solid fa-chevron-right ms-2"></i></a>';
        }
        if ($nextHint) {
            echo '<p class="text-danger smallest fw-bold mt-2 mb-0 text-uppercase letter-spacing-1">' . htmlspecialchars($nextHint) . '</p>';
        }
    }
    echo '</div>';

    echo '</div>';
}