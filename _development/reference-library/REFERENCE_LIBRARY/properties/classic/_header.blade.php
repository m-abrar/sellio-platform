<nav class="navbar navbar-expand-lg sticky-top classic-navbar p-3 bg-white">
    <div class="container">
        <a class="navbar-brand h4 mb-0" href="{{ route('home') }}" style="font-family: var(--font-family-heading); color: var(--color-primary);">
            {{ page_content('global.header.brand', 'Estate Realty') }} 
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav mb-2 mb-lg-0 me-3">
                <li class="nav-item">
                    <a class="nav-link @if(request()->routeIs('#')) active @endif" aria-current="page" href="{{ route('properties.index') }}" style="color: var(--color-primary);">Properties</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('#') }}" style="color: var(--color-primary);">Agents</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('#') }}" style="color: var(--color-primary);">Rentals</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('#') }}" style="color: var(--color-primary);">Sales</a>
                </li>
            </ul>

            <form class="d-flex" role="search" action="{{ route('#') }}" method="GET">
                <div class="input-group">
                    <input class="form-control" type="search" name="query" placeholder="Search" aria-label="Search">
                    <button class="btn" type="submit" style="background-color: var(--color-primary); color: white;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    </div>
</nav>