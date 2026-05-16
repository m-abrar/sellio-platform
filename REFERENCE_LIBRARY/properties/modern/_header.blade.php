<nav class="navbar navbar-expand-lg sticky-top">
    <div class="container-xl">
        <a class="navbar-brand" href="{{ url('/') }}">
            {{-- Assuming FontAwesome is already loaded by the layout --}}
            <i class="bi bi-house-door-fill me-2"></i>{{ strtoupper(setting('site_name') ?? 'ESTATE') }}
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            {{-- Navigation Links --}}
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link" href="#">Properties</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Rentals</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Agents</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Sales</a></li>
            </ul>
            
            {{-- Search Bar --}}
            <div class="search-container ms-lg-3">
                <input type="text" class="form-control search-input" placeholder="Search properties...">
                <i class="bi bi-funnel-fill filter-icon" data-bs-toggle="offcanvas" data-bs-target="#filterOffcanvas" aria-controls="filterOffcanvas"></i>
            </div>
        </div>
    </div>
</nav>