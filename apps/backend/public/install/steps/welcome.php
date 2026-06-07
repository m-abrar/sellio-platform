<?php
// =================================================================================
// Sellio Installer - Welcome Step
// File: steps/welcome.php
// =================================================================================

$title = 'Start Installation';
include __DIR__ . '/../layout/header.php';

installer_step_intro(
    'Welcome to the Sellio Installer',
    'This guided wizard configures your marketplace in a few steps — server checks, database, packages, demo data, and your admin account.'
);
?>

<div class="welcome-panel mb-4">
    <div class="d-flex align-items-start gap-3 mb-4">
        <div class="icon-square icon-square-primary">
            <i class="fas fa-list-check"></i>
        </div>
        <div>
            <h3 class="h5 fw-bold mb-1 text-brand">Before you begin</h3>
            <p class="small text-muted mb-0">Have your database credentials ready. Shared hosting works — the wizard adapts commands for your environment.</p>
        </div>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="stat-tile">
                <span class="stat-label">Time estimate</span>
                <span class="stat-value">~5 minutes</span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-tile">
                <span class="stat-label">Skill level</span>
                <span class="stat-value">Beginner friendly</span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="stat-tile">
                <span class="stat-label">Requirements</span>
                <span class="stat-value">PHP 8.2+ & MySQL</span>
            </div>
        </div>
    </div>

    <ul class="list-unstyled mb-0 small text-muted">
        <li class="d-flex align-items-center gap-2 mb-2"><i class="fa-solid fa-circle-check text-brand"></i> Verify server extensions and folder permissions</li>
        <li class="d-flex align-items-center gap-2 mb-2"><i class="fa-solid fa-circle-check text-brand"></i> Connect database and optional mail settings</li>
        <li class="d-flex align-items-center gap-2 mb-2"><i class="fa-solid fa-circle-check text-brand"></i> Install packages, migrate schema, and import demos</li>
        <li class="d-flex align-items-center gap-2"><i class="fa-solid fa-circle-check text-brand"></i> Create your administrator account</li>
    </ul>
</div>

<div class="text-center">
    <a href="?step=requirements" class="btn btn-primary btn-lg px-5">
        Begin Setup Wizard <i class="fas fa-arrow-right ms-2"></i>
    </a>
</div>

<?php
include __DIR__ . '/../layout/footer.php';
