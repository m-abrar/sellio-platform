<header>
        <nav id="navbar" class="navbar navbar-expand-lg navbar-dark fixed-top navbar-transparent">
            <div class="container container-max">
                {{-- Use setting('site_name') for dynamic title --}}
                <a class="navbar-brand" href="#"><i class="bi bi-buildings-fill"></i> {{ page_content('global.header.brand', 'METRO HOMES') }}</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mx-auto">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="{{ route('properties.index') }}">Listings</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Rentals</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Agents</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Map Search</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Contact</a>
                        </li>
                    </ul>
                    <form class="d-flex" role="search">
                        <input class="form-control me-2 form-control-sm" type="search" placeholder="Location, Price, Beds..." aria-label="Search">
                        <button class="btn btn-primary btn-sm" type="submit"><i class="bi bi-search"></i></button>
                    </form>
                </div>
            </div>
        </nav>
    </header>