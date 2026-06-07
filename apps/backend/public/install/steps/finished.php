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

    <div class="mt-5 p-4 rounded-4 text-start mx-auto" style="max-width: 640px; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.15);">
        <p class="text-primary small mb-2 fw-bold">
            <i class="fas fa-user-circle me-2"></i> DEMO ACCOUNTS (if you imported sample data)
        </p>
        <p class="text-muted small mb-2">
            Your <strong>administrator</strong> login is the account you just created. These additional demo users may also exist from seeding:
        </p>
        <ul class="small text-muted mb-0 ps-3">
            <li><strong>Partner:</strong> <code>partner@sellio-platform.test</code> / <code>partner123</code></li>
            <li><strong>Buyer:</strong> <code>buyer@sellio-platform.test</code> / <code>buyer123</code></li>
        </ul>
        <p class="text-muted smallest mt-3 mb-0">Change or remove demo passwords before production. See <code>README.md</code> for the full credentials table.</p>
    </div>
    
    <div class="mt-4 p-4 rounded-4 text-start mx-auto" style="max-width: 640px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1);">
        <p class="text-danger small mb-2 fw-bold">
            <i class="fas fa-shield-alt me-2"></i> POST-INSTALL SECURITY
        </p>
        <ul class="small text-muted mb-0 ps-3">
            <li>Delete or rename the <code>/public/install</code> directory.</li>
            <li>Set <code>APP_DEBUG=false</code>, <code>INSTALLER_DEBUG=false</code>, and <code>APP_ENV=production</code> in <code>.env</code>.</li>
            <li>Run <code>php artisan storage:link</code> for media uploads.</li>
            <li>Rotate all demo user passwords if sample data was imported.</li>
        </ul>
    </div>
</div>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

<?php
include __DIR__ . '/../layout/footer.php'; 
?>