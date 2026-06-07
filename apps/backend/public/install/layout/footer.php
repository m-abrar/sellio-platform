<?php
// =================================================================================
// Sellio Installer - HTML Footer
// File: layout/footer.php
// =================================================================================

$bootstrapJs = installer_asset_or_cdn(
    'vendor/npm/bootstrap/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
);
?>
    </div> <!-- .install-card -->

    <div class="installer-footer">
        <p class="installer-footer-copy">
            &copy; <?= date('Y') ?> Sellio Platform. All rights reserved.
        </p>
        <div class="installer-footer-links">
            <a href="<?= htmlspecialchars(installer_doc_url()) ?>" target="_blank" rel="noopener">Documentation</a>
            <span class="text-muted opacity-25">|</span>
            <a href="<?= htmlspecialchars(installer_support_url()) ?>">Technical Support</a>
        </div>
    </div>
</div> <!-- .container-installer -->

<script src="<?= htmlspecialchars($bootstrapJs) ?>"></script>
<script src="<?= htmlspecialchars(installer_url('installer.js')) ?>"></script>
</body>
</html>
