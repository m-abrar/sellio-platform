<?php 
// =================================================================================
// Sellio Installer - Welcome Step
// File: steps/welcome.php
// =================================================================================

$title = 'Start Installation';
include __DIR__ . '/../layout/header.php';
?>

<div class="text-center mb-5">
    <h2 class="fw-bold text-dark mb-3">Welcome to the Sellio Installer 👋</h2>
    <p class="lead text-muted mx-auto" style="max-width: 600px;">
        This wizard will guide you through setting up your **Sellio** application in a few simple steps.
    </p>
</div>

<div class="card p-4 shadow-sm border-0 mb-5" style="background: rgba(255,255,255,0.4); border-radius: 20px;">
    <div class="d-flex align-items-center mb-4">
        <div class="icon-square bg-primary text-white p-3 rounded-4 me-3">
            <i class="fas fa-list-check fa-lg"></i>
        </div>
        <div>
            <h4 class="fw-bold mb-0" style="color: var(--primary-dark);">Installation Readiness</h4>
            <p class="small text-muted mb-0">Ensure your environment is prepared before proceeding.</p>
        </div>
    </div>
    
    <div class="row g-4 mb-2">
        <div class="col-md-6">
            <div class="p-3 rounded-4 bg-white shadow-xs border">
                <span class="d-block text-muted smallest fw-bold uppercase letter-spacing-1 mb-1">Time Estimate</span>
                <span class="d-block fw-bold text-dark">Approximately 5 Minutes</span>
            </div>
        </div>
        <div class="col-md-6">
            <div class="p-3 rounded-4 bg-white shadow-xs border">
                <span class="d-block text-muted smallest fw-bold uppercase letter-spacing-1 mb-1">Complexity</span>
                <span class="d-block fw-bold text-dark">Beginner Friendly</span>
            </div>
        </div>
    </div>
</div>

<div class="text-center">
    <a href="?step=requirements" class="btn btn-primary btn-lg px-5 shadow-lg">
        Begin Setup Wizard <i class="fas fa-arrow-right ms-2"></i>
    </a>
</div>

<?php 
include __DIR__ . '/../layout/footer.php'; 
?>