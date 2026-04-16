<?php
// =================================================================================
// Sellio Installer - Finished Step
// File: steps/finished.php
// =================================================================================
global $basePath;

// --- PHP LOGIC START ---
$installedFile = $basePath . '/installed.lock'; 
// Create a lock file to prevent re-running the installer
file_put_contents($installedFile, 'Installed on ' . date('Y-m-d H:i:s'));

$title = 'Installation Complete';
// --- PHP LOGIC END ---

include __DIR__ . '/../layout/header.php';
?>

<div class="text-center py-5">
    <div style="font-size: 4rem; color: var(--accent-color); margin-bottom: 20px;">
        <i class="fa-solid fa-check-circle"></i>
    </div>
    <h2 class="mb-4 fw-bold">Installation Complete 🎉</h2>
    <p class="lead text-muted mb-5">
        Your Sellio application is now fully installed and ready to launch!
    </p>

    <div class="d-grid gap-2 col-6 mx-auto">
        <a href="../" class="btn btn-primary btn-lg">
            <i class="fa-solid fa-rocket me-2"></i> Go to Application
        </a>
    </div>
    
    <p class="text-danger small mt-5">
        <i class="fa-solid fa-triangle-exclamation me-1"></i> **Important Security Notice:** For a production environment, please **remove or rename the entire `/install` directory** now.
    </p>
</div>


<?php
include __DIR__ . '/../layout/footer.php'; 
?>