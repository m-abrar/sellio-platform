<nav class="navbar navbar-expand-lg navbar-light sticky-top">
    <div class="container container-max">
        {{-- Brand Logo/Name --}}
        <a class="navbar-brand d-flex align-items-center" href="{{ url('/') }}">
            <span class="brand-mark fw-bold fs-5 me-2">LuxEstate</span> 
            <small class="text-muted">Villas & Penthouses</small>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMain">
            <ul class="navbar-nav ms-auto align-items-lg-center">
                {{-- Navigation Links (using anchor links for the demo page sections) --}}
                <li class="nav-item"><a class="nav-link" href="#listings">Listings</a></li>
                <li class="nav-item"><a class="nav-link" href="#featured">Featured</a></li>
                <li class="nav-item"><a class="nav-link" href="#agents">Agents</a></li>
                <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                
                {{-- Search Toggle Button --}}
                <li class="nav-item ms-3">
                    <button class="btn btn-sm btn-outline-secondary" id="searchToggle" aria-label="Open search">
                        {{-- SVG for Search Icon --}}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 21l-4.35-4.35"/>
                            <circle cx="11" cy="11" r="6"/>
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</nav>