<?php
// =================================================================================
// Sellio Installer - Main Router
// File: index.php
// =================================================================================

// Enable error reporting for the installation process
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// The functions.php file contains shared logic, step definition, and utility functions.
require_once __DIR__ . '/functions.php';

// Prevent re-running the installer if a lock file exists
if (file_exists(__DIR__ . '/../../installed.lock') && ($currentStepKey !== 'finished')) {
    header('Location: ../');
    exit;
}

// Determine the step file path based on the resolved $currentStepKey from functions.php
$stepFile = __DIR__ . '/steps/' . $currentStepKey . '.php';

// Load the appropriate step view file or fallback to 'welcome'.
if (file_exists($stepFile)) {
    include $stepFile;
} else {
    // Fallback if a step file is requested but doesn't exist.
    include __DIR__ . '/steps/welcome.php';
}