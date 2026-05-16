<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
    <div class="container-fluid mx-4">
        <a class="navbar-brand text-primary" href="#">
            {!! page_content('global.header.brand', '<i class="bi bi-house-door-fill me-2 text-success"></i> <span class="text-success">Community</span> Classifieds') !!}
        </a>
        <form class="d-flex mx-auto" style="width: 400px;">
            <input class="form-control rounded-pill border-0" type="search" placeholder="{{ page_content('global.header.search_input_placeholder', 'Search for items, services, neighborhoods...') }}" style="background-color: var(--light-bg);">
        </form>
        <div class="d-flex align-items-center">
            <a href="/post-ad" class="btn btn-success me-3 text-decoration-none">
            {!! page_content('global.header.button_text', '<i class="bi bi-plus-lg me-1"></i> Post Ad') !!}
            </a>
            <i class="bi bi-bell-fill fs-5 text-dark me-3" style="cursor:pointer;"></i>
            <i class="bi bi-person-circle fs-4 text-dark" style="cursor:pointer;"></i>
        </div>
    </div>
</nav>


