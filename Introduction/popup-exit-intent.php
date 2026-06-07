<div id="exitIntentPopup" class="exit-popup-overlay">
    <div class="exit-popup-content shadow-lg animate__animated">
        <button class="close-exit" onclick="closeExitPopup()" aria-label="Close">&times;</button>
        <div class="row g-0">
            <div class="col-md-5 d-none d-md-block bg-sellio-gradient p-5 text-white text-center d-flex flex-column justify-content-center">
                <div class="fs-1 mb-3">🛠️</div>
                <h3 class="fw-bold mb-2">Need a hand?</h3>
                <p class="small opacity-75 mb-0">Setup guidance is included with every purchase.</p>
            </div>
            <div class="col-md-7 p-5">
                <span class="badge bg-sellio-solid rounded-pill px-3 py-2 mb-3">Free installation help</span>
                <h4 class="fw-800 mb-2">Questions before you buy?</h4>
                <p class="text-muted small mb-4">
                    Server requirements, licensing, migrations, or customization — explore the docs and live demos, or reach out through your CodeCanyon downloads page.
                </p>
                <div class="d-grid gap-2">
                    <a
                        href="<?= htmlspecialchars($sites['documentation']) ?>"
                        target="_blank"
                        rel="noopener"
                        class="btn btn-sellio-solid w-100 py-3 rounded-4 fw-bold"
                    >
                        Read Documentation
                    </a>
                    <a
                        href="#demos"
                        class="btn btn-premium-outline w-100 py-3 rounded-4 fw-bold"
                        onclick="closeExitPopup()"
                    >
                        Explore Live Demos
                    </a>
                </div>
                <p class="small text-muted mt-4 mb-0">
                    <i class="fas fa-life-ring me-1 text-sellio"></i>
                    Need support? Open a ticket from your Envato downloads area — we respond to pre-sale and post-sale questions.
                </p>
            </div>
        </div>
    </div>
</div>
