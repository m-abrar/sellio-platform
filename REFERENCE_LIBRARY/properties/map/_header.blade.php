<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
    <div class="container-fluid">
        <a class="navbar-brand fw-bold text-primary" href="#">
            <i class="bi bi-house-door-fill me-2"></i>{!! page_content('global.header.brand', 'HomeFinder') !!}
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li class="nav-item"><a class="nav-link" href="#">Buy</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Rent</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Agents</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
            </ul>
            <form class="d-flex navbar-search-bar mt-2 mt-lg-0">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Location, Price, Type..." aria-label="Search">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Filters
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end p-3">
                        <li><h6 class="dropdown-header">Price Range</h6></li>
                        <li><input type="range" class="form-range" min="0" max="2000000" step="10000" value="500000"></li>
                        <li><div class="d-flex justify-content-between"><small>$0</small><small>$2M+</small></div></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><h6 class="dropdown-header">Property Type</h6></li>
                        <li><div class="form-check"><input class="form-check-input" type="checkbox" id="apt"><label class="form-check-label" for="apt">Apartment</label></div></li>
                        <li><div class="form-check"><input class="form-check-input" type="checkbox" id="condo"><label class="form-check-label" for="condo">Condo</label></div></li>
                        <li><div class="form-check"><input class="form-check-input" type="checkbox" id="house"><label class="form-check-label" for="house">House</label></div></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button type="submit" class="btn btn-primary w-100">Apply Filters</button></li>
                    </ul>
                    <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                </div>
            </form>
        </div>
    </div>
</nav>