<header class="navbar navbar-expand-lg sticky-top">
    <div class="container-fluid container-xl">
        <a class="navbar-brand fw-bold fs-4 text-dark" href="{{ page_content('global.header.brand_link', '#') }}">{!! page_content('global.header.brand', '<i class="fas fa-box text-primary me-2"></i>CLASAFIND') !!}</a>
        
        <form class="d-flex mx-auto" style="max-width: 500px;">
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-secondary"></i></span>
                <input class="form-control border-start-0" type="search" placeholder="{{ page_content('global.header.search_placeholder', 'Search for anything...') }}" aria-label="Search">
            </div>
        </form>

        <div class="d-flex align-items-center">
            <a class="nav-link text-dark me-3" href="#">Log In</a>
            <a class="nav-link text-dark me-3" href="#">Sign Up</a>
            <a class="btn btn-primary" href="#"><i class="fas fa-plus me-1"></i> Post Ad</a>
        </div>
    </div>
</header>