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
    <div class="mb-5 animate__animated animate__bounceIn">
        <div class="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle shadow-lg" style="width: 100px; height: 100px; font-size: 3rem;">
            <i class="fas fa-check"></i>
        </div>
    </div>
    
    <h2 class="fw-bold text-dark mb-3">System Online & Ready 🎉</h2>
    <p class="lead text-muted mx-auto mb-5" style="max-width: 600px;">
        Congratulations! Your **Sellio** environment has been successfully provisioned and is now live.
    </p>

    <div class="d-flex flex-column align-items-center gap-3 mx-auto" style="max-width: 350px;">
        <a href="../" class="btn btn-primary btn-lg w-100 py-3 shadow-lg">
            <i class="fas fa-rocket me-2"></i> Launch Marketplace
        </a>
        <a href="../admin" class="btn btn-outline-secondary w-100 py-3">
            <i class="fas fa-cog me-2"></i> Admin Dashboard
        </a>
    </div>
    
    <div class="mt-5 p-4 rounded-4" style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1);">
        <p class="text-danger small mb-0 fw-bold">
            <i class="fas fa-shield-alt me-2"></i> SECURITY PROTOCOL:
            <span class="fw-normal">Please delete or rename the <code>/install</code> directory from your public root to secure your platform.</span>
        </p>
    </div>
</div>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

<?php
include __DIR__ . '/../layout/footer.php'; 
?>