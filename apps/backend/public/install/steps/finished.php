<?php
// =================================================================================
// Sellio Installer - Finished Step
// File: steps/finished.php
// =================================================================================
global $basePath;

$installedFile = $basePath . '/installed.lock';
file_put_contents($installedFile, 'Installed on ' . date('Y-m-d H:i:s'));

$storageLink = installer_ensure_storage_link();

$title = 'Installation Complete';

include __DIR__ . '/../layout/header.php';
?>

<div class="text-center py-4">
    <div class="mb-4">
        <div class="success-icon-wrap">
            <i class="fas fa-check"></i>
        </div>
    </div>

    <?php installer_step_intro(
        'System online & ready',
        'Congratulations! Your Sellio environment is provisioned and ready to use.',
        true,
    ); ?>

    <div class="finish-actions d-flex flex-column gap-3 mb-5">
        <a href="../" class="btn btn-primary btn-lg py-3">
            <i class="fas fa-rocket me-2"></i> Launch Marketplace
        </a>
        <a href="../admin" class="btn btn-outline-secondary py-3">
            <i class="fas fa-cog me-2"></i> Admin Dashboard
        </a>
    </div>

    <div class="info-panel info-panel-info text-start mx-auto mb-3" style="max-width: 640px;">
        <p class="text-brand small mb-2 fw-bold">
            <i class="fas fa-user-circle me-2"></i> Demo accounts (if sample data was imported)
        </p>
        <p class="text-muted small mb-2">
            Your administrator login is the account you just created. These additional demo users may also exist:
        </p>
        <ul class="small text-muted mb-0 ps-3">
            <li><strong>Partner:</strong> <code>partner@sellio.buzz</code> / <code>partner123</code></li>
            <li><strong>Buyer:</strong> <code>buyer@sellio.buzz</code> / <code>buyer123</code></li>
        </ul>
        <p class="text-muted smallest mt-3 mb-0">Change or remove demo passwords before production. See <code>README.md</code> for the full credentials table.</p>
    </div>

    <div class="info-panel info-panel-danger text-start mx-auto" style="max-width: 640px;">
        <p class="text-danger small mb-2 fw-bold">
            <i class="fas fa-shield-alt me-2"></i> Post-install security
        </p>
        <ul class="small text-muted mb-0 ps-3">
            <li>Delete or rename the <code>/public/install</code> directory.</li>
            <li>Set <code>APP_DEBUG=false</code>, <code>INSTALLER_DEBUG=false</code>, and <code>APP_ENV=production</code> in <code>.env</code>.</li>
            <?php if ($storageLink['ok']): ?>
                <li><i class="fas fa-check text-success me-1"></i> Media storage link created automatically<?= $storageLink['method'] === 'copy' ? ' (copied — your host blocks symlinks, so re-run <code>php artisan storage:link</code> via SSH later if you get one, to keep future uploads in sync)' : '' ?>.</li>
            <?php else: ?>
                <li class="text-danger"><strong>Action required:</strong> run <code>php artisan storage:link</code> manually — your host blocked automatic linking, so uploaded media (including your logo) won't display until this runs.</li>
            <?php endif; ?>
            <li>Rotate all demo user passwords if sample data was imported.</li>
        </ul>
    </div>
</div>

<?php
include __DIR__ . '/../layout/footer.php';
