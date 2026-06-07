<?php
// =================================================================================
// Sellio Installer - Main Router
// File: index.php
// =================================================================================

// The functions.php file contains shared logic, step definition, and utility functions.
require_once __DIR__ . '/functions.php';

configure_installer_error_reporting();

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