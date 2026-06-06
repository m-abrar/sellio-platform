<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
    <div class="container-xl">
        <a class="navbar-brand text-uppercase fw-bold" href="{!! page_content('global.header.brand_link', '#') !!}" style="color: var(--bs-sales-blue);">{!! page_content('global.header.brand', 'H&R Homes') !!}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto">
                <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Buy</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Rent</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Agents</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
            </ul>
            <a href="{!! page_content('global.header.button_link', '#') !!}" class="btn btn-sales text-nowrap">{!! page_content('global.header.button_text', 'List Your Property') !!}</a>
        </div>
    </div>
</nav>