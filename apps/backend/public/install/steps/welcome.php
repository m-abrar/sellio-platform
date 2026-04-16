<?php 
// =================================================================================
// Sellio Installer - Welcome Step
// File: steps/welcome.php
// =================================================================================

// $steps and $currentStepKey are available from functions.php
$title = 'Start Installation';
include __DIR__ . '/../layout/header.php';
?>

<h2 class="text-center mb-4">Welcome to the Sellio Installer 👋</h2>

<p class="lead text-center text-muted mb-5">
    This wizard will guide you through setting up your **Sellio** application.
</p>

<div class="card p-4 shadow-sm border-0" style="background-color: var(--light-bg);">
    <h3 class="card-title fw-bold" style="color: var(--primary-color);">Getting Started Checklist</h3>
    <p class="card-text text-muted">
        Please ensure you have access to your server environment and database credentials.
    </p>
    <ul class="list-group list-group-flush mb-4">
        <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent">
            <strong>Time required:</strong> <span>~5 minutes</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent">
            <strong>Prerequisites:</strong> <span>Server access and database credentials</span>
        </li>
    </ul>

    <div class="text-center mt-3">
        <a href="?step=requirements" class="btn btn-primary btn-lg px-5">
            Start Installation
        </a>
    </div>
</div>

<?php 
include __DIR__ . '/../layout/footer.php'; 
?>