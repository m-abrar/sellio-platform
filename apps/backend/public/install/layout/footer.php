<?php
// =================================================================================
// Sellio Installer - HTML Footer (Premium Edition)
// File: layout/footer.php
// =================================================================================
?>
    </div> <!-- .install-card -->
    
    <div class="text-center mt-4 mb-5 animate__animated animate__fadeIn" style="animation-delay: 0.5s;">
        <p class="text-muted smallest fw-bold uppercase letter-spacing-1 mb-1">
            &copy; <?= date('Y') ?> Sellio Platform. All rights reserved.
        </p>
        <div class="d-flex justify-content-center gap-3">
            <a href="https://docs.sellio.com" target="_blank" class="text-muted smallest text-decoration-none hover-primary">Documentation</a>
            <span class="text-muted opacity-25">|</span>
            <a href="https://support.sellio.com" target="_blank" class="text-muted smallest text-decoration-none hover-primary">Technical Support</a>
        </div>
    </div>
</div> <!-- .container-installer -->

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>

<style>
    .hover-primary:hover { color: var(--primary) !important; }
    .smallest { font-size: 0.65rem; }
    .letter-spacing-1 { letter-spacing: 1px; }
</style>

</body>
</html>