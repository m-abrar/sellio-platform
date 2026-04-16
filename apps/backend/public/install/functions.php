<?php
// =================================================================================
// Sellio Installer - Global Functions and Setup
// File: functions.php
// =================================================================================

// Define base path (Installer is assumed to be in a subdirectory like '/install')
$basePath = realpath(__DIR__ . '/../..'); 

/**
 * Detect if the current environment is local (XAMPP/WAMP) or a remote server.
 * This helps adjust instructions and defaults (e.g., DB host, SSL checks).
 */
function is_local_env(): bool {
    return in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']);
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
        '/opt/alt/php82/usr/bin/php',
        '/opt/alt/php83/usr/bin/php',
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
 * Display a styled Bootstrap alert message.
 */
function display_message(?string $message, bool $isError = false): void
{
    if ($message) {
        // Use Bootstrap classes, but custom colors are defined in CSS variables
        $class = $isError ? 'alert-danger' : 'alert-success';
        echo "<div class='alert {$class}' role='alert'>" . htmlspecialchars($message) . "</div>";
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