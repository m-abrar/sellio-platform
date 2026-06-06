<nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
        <a class="navbar-brand" href="#">
            <i class="bi bi-water"></i> {{ page_content('global.header.brand', 'StayFind') }}
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Rentals</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Vacation Homes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Agents</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Contact</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Blog</a>
                </li>
            </ul>
            <form class="d-flex d-none d-lg-flex form-width" style="width:600px" role="search">
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                    <input class="form-control form-control-sm" type="search" placeholder="Location">
                    <span class="input-group-text"><i class="bi bi-calendar-event"></i></span>
                    <input class="form-control form-control-sm" type="text" placeholder="Check-in/out">
                    <span class="input-group-text"><i class="bi bi-people"></i></span>
                    <input class="form-control form-control-sm" type="text" placeholder="Guests" style="max-width:100px" >
                    <button class="btn btn-primary btn-sm" type="submit" style="min-width:70px" ><i class="bi bi-search"></i></button>
                </div>
            </form>
        </div>
    </div>
</nav>