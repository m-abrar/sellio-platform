<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

// Start timer for performance profiling
define('LARAVEL_START', microtime(true));

// --- 1. Installation Wizard Logic ---

$basePath      = __DIR__ . '/../';
$autoload      = $basePath . 'vendor/autoload.php';
$installedLock = $basePath . 'installed.lock';
$installerDir  = __DIR__ . '/install';

// Check if Composer dependencies exist
if (!file_exists($autoload)) {
    if (file_exists($installerDir)) {
        // Redirect to installer folder if vendor is missing
        $installerUrl = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\') . '/install/';
        header('Location: ' . $installerUrl);
        exit;
    } else {
        header('Content-Type: text/html', true, 500);
        echo "<h2>System Error</h2><p>The <code>vendor</code> directory is missing. Please run <code>composer install</code>.</p>";
        exit;
    }
}

// Check Installation Status
$isInstalled = file_exists($installedLock);
$requestUri  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$isAccessingInstaller = str_contains($requestUri, '/install');

// Redirect to installer if not installed
if (!$isInstalled && !$isAccessingInstaller) {
    $installerUrl = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\') . '/install/';
    header('Location: ' . $installerUrl);
    exit;
}

// Prevent re-accessing installer if already installed
if ($isInstalled && $isAccessingInstaller) {
    $appUrl = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\') . '/';
    header('Location: ' . $appUrl);
    exit;
}

// --- 2. Laravel Bootstrap ---

// Register the Composer autoloader
require $autoload;

// Maintenance mode check
if (file_exists($maintenance = $basePath . 'storage/framework/maintenance.php')) {
    require $maintenance;
}

// Bootstrap Laravel and handle the request
/** @var Application $app */
$app = require_once $basePath . 'bootstrap/app.php';

// In Laravel 11/12, handleRequest() is the standard entry point
$app->handleRequest(Request::capture());