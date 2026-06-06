<nav class="navbar navbar-expand-lg navbar-light fixed-top navbar-custom" aria-label="Main navigation">
    <div class="container container-max">
        <a class="navbar-brand" href="#">
            {!! page_content('global.footer.brand', 'LUXE <span style="font-weight: 400;">ESTATES</span>') !!}
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#" style="color: var(--color-secondary);">
                        Listings
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" style="color: var(--color-secondary);">
                        Agents
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" style="color: var(--color-secondary);">
                        Services
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" style="color: var(--color-secondary);">
                        Contact
                    </a>
                </li>
            </ul>
            <div class="d-flex align-items-center">
                <button class="btn btn-link text-decoration-none p-0 me-3" aria-label="Search">
                    <i class="fas fa-search fa-lg" style="color: var(--color-secondary);"></i>
                </button>
                <input type="text" class="form-control me-2 d-none" placeholder="Search..." aria-label="Search input">
                <button class="btn btn-link text-decoration-none p-0" aria-label="Dark mode toggle">
                    <i class="fas fa-moon fa-lg" style="color: var(--color-secondary);"></i>
                </button>
            </div>
        </div>
    </div>
</nav>