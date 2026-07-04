<footer class="py-100 bg-white border-top">
    <div class="container">
        <div class="row g-5">
            <div class="col-lg-5">
                <a class="navbar-brand d-flex align-items-center gap-2 mb-4" href="#">
                    <span class="brand-logo-wrap" aria-hidden="true">
                        <img src="images/logo-dark.png" alt="" class="brand-logo brand-logo-dark">
                        <img src="images/logo-light.png" alt="" class="brand-logo brand-logo-light">
                    </span>
                    <span>SELLIO</span>
                </a>
                <p class="text-muted pe-lg-5">The definitive marketplace solution for elite digital entrepreneurs. Eliminate recurring SaaS fees and take absolute control of your data and revenue.</p>
                <div class="d-flex gap-3 mt-4">
                    <a href="#" class="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style="width:40px; height:40px;"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style="width:40px; height:40px;"><i class="fab fa-github"></i></a>
                    <a href="#" class="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style="width:40px; height:40px;"><i class="fab fa-discord"></i></a>
                </div>
            </div>
            <div class="col-6 col-lg-2 ms-auto">
                <h6 class="fw-800 mb-4 text-uppercase smallest" style="letter-spacing: 2px;">Marketplace</h6>
                <ul class="list-unstyled text-muted">
                    <li class="mb-3"><a href="#modules" class="text-muted text-decoration-none hover-sellio">Industry Modules</a></li>
                    <li class="mb-3"><a href="#demos" class="text-muted text-decoration-none hover-sellio">All Demos</a></li>
                    <li class="mb-3"><a href="screenshots.php" class="text-muted text-decoration-none hover-sellio">Screenshots</a></li>
                    <li class="mb-3"><a href="videos.php" class="text-muted text-decoration-none hover-sellio">Video Gallery</a></li>
                    <li class="mb-3"><a href="#how-it-works" class="text-muted text-decoration-none hover-sellio">How it Works</a></li>
                    <li class="mb-3"><a href="#faq" class="text-muted text-decoration-none hover-sellio">Help Center</a></li>
                </ul>
            </div>
            <div class="col-6 col-lg-2">
                <h6 class="fw-800 mb-4 text-uppercase smallest" style="letter-spacing: 2px;">Developers</h6>
                <ul class="list-unstyled text-muted">
                    <li class="mb-3"><a href="<?= htmlspecialchars($sites['documentation']) ?>" target="_blank" rel="noopener" class="text-muted text-decoration-none hover-sellio">Documentation</a></li>
                    <li class="mb-3"><a href="<?= htmlspecialchars($sites['demo']['storefront']) ?>" target="_blank" rel="noopener" class="text-muted text-decoration-none hover-sellio">Live Storefront</a></li>
                    <li class="mb-3"><a href="#live-demo" class="text-muted text-decoration-none hover-sellio">Demo Logins</a></li>
                    <li class="mb-3"><a href="#" class="text-muted text-decoration-none hover-sellio">API Reference</a></li>
                    <li class="mb-3"><a href="#" class="text-muted text-decoration-none hover-sellio">Change Log</a></li>
                    <li class="mb-3"><a href="#" class="text-muted text-decoration-none hover-sellio">License Details</a></li>
                </ul>
            </div>
        </div>
        <div class="pt-5 mt-5 border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
            <p class="text-muted small mb-0">© 2026 <strong>Sellio Platform</strong>. Built for high-performance scale.</p>
            <div class="d-flex flex-wrap align-items-center justify-content-center gap-4">
                <a href="#" class="text-muted small text-decoration-none">Privacy Policy</a>
                <a href="#" class="text-muted small text-decoration-none">Terms of Service</a>
                <a href="#" class="text-muted small text-decoration-none">Cookie Policy</a>
                <a id="backToTop" href="#page-top" class="footer-back-to-top text-decoration-none" aria-label="Go back to the top of the page">
                    <span class="visually-hidden">Back to top</span><i class="fas fa-arrow-up"></i>
                </a>
            </div>
        </div>
    </div>
</footer>

<style>
    .hover-sellio:hover { color: var(--primary-sellio) !important; padding-left: 5px; transition: all 0.3s ease; }
    .footer-back-to-top { position: fixed; right: 22px; bottom: 22px; z-index: 1040; display: inline-grid; place-items: center; width: 48px; height: 48px; border-radius: 50%; background: var(--primary-sellio); color: #fff; box-shadow: 0 12px 30px rgba(15,23,42,0.3); opacity: 0; visibility: hidden; transform: translateY(14px); transition: opacity 0.25s ease, visibility 0.25s ease, transform 0.25s ease, background 0.2s ease; }
    .footer-back-to-top.is-visible { opacity: 1; visibility: visible; transform: translateY(0); }
    .footer-back-to-top i { color: #fff; }
    .footer-back-to-top:hover { color: #fff; background: var(--primary-dark); transform: translateY(-3px); }
</style>
