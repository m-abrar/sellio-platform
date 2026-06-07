<nav class="navbar navbar-expand-lg fixed-top px-lg-5 transition-all">
    <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2" href="#">
            <img src="images/logo.png" alt="Sellio" width="34" height="34" class="rounded-3 shadow-sm">
            <span>SELLIO <small class="ms-1 opacity-50 fw-normal d-none d-sm-inline" style="font-size: 0.7rem; letter-spacing: 2px;">V2.4</small></span>
        </a>
        
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="fas fa-bars"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto gap-lg-4">
                <li class="nav-item"><a class="nav-link fw-bold" href="#modules">Modules</a></li>
                <li class="nav-item"><a class="nav-link fw-bold" href="#automation">Smart Automation</a></li>
                <li class="nav-item"><a class="nav-link fw-bold" href="#demos">Demos</a></li>
                <li class="nav-item"><a class="nav-link fw-bold" href="#live-demo">Live Demo</a></li>
                <li class="nav-item"><a class="nav-link text-sellio fw-bold" href="<?= htmlspecialchars($sites['documentation']) ?>" target="_blank" rel="noopener">Documentation</a></li>
            </ul>
            <div class="ms-auto d-flex align-items-center gap-3">
                <button id="theme-toggle" class="btn btn-light border rounded-pill px-3 py-1 d-flex align-items-center gap-2 shadow-sm" type="button" aria-label="Toggle day and night mode">
                    <i class="fas fa-moon theme-icon-dark"></i>
                    <i class="fas fa-sun theme-icon-light d-none"></i>
                    <span class="theme-toggle-label smallest fw-bold text-uppercase">Night</span>
                </button>
                <a href="#live-demo" class="text-dark fw-bold d-none d-lg-inline-block text-decoration-none small">Live Preview</a>
                <a href="#" class="btn-sellio-solid shadow-sm">Get License</a>
            </div>
        </div>
    </div>
</nav>
