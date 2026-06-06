<nav class="navbar navbar-expand-lg bg-white sticky-top py-3">
    <div class="container-fluid container-xl">
        <a class="navbar-brand" href="{!! page_content('global.header.brand_link', '#') !!}">{!! page_content('global.header.brand', 'CLSFD') !!}</a>
        
        <div class="d-flex align-items-center order-lg-2 ms-auto ms-lg-0 me-3 me-lg-0">
            {{-- Favorites and User Icons (as previously implemented) --}}
            <a href="/favorites" class="btn btn-link text-decoration-none text-dark d-none d-sm-block me-2 me-lg-3 p-0" title="Favorites"><i class="fas fa-heart fa-lg"></i></a>
            <a href="/account" class="btn btn-link text-decoration-none text-dark d-none d-sm-block me-2 me-lg-3 p-0" title="Account"><i class="fas fa-user-circle fa-lg"></i></a>

            <button class="btn btn-post-ad d-none d-sm-block me-3" type="button">Post Ad</button>
            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
        
        <div class="collapse navbar-collapse order-lg-1" id="navbarNav">
            <div class="search-container d-flex align-items-center mx-lg-4"> 
                <input type="search" class="form-control search-input" placeholder="{{ page_content('global.header.search_input_placeholder', 'Search categories, items, or locations...') }}">
            </div>
            
            <div class="d-flex align-items-center ms-auto"> 
                
                {{-- 1. Display Primary Categories (e.g., first 3) --}}

                @foreach($categories->take(3) as $category)
                <a class="nav-link mx-2 accent-cyan {{ request('category') == $category->id ? 'active' : ''}}" href="?category={{$category->id}}">{{$category->title}}</a>
                @endforeach
                
                {{-- 2. "More Categories" Dropdown --}}
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle mx-2 accent-cyan" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        More
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        @foreach($categories->skip(3) as $category)
                        <li><a class="dropdown-item {{ request('category') == $category->id ? 'active' : ''}}" href="?category={{$category->id}}">{{$category->title}}</a></li>
                        @endforeach
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item fw-bold" href="/all-categories">Browse All Categories</a></li>
                    </ul>
                </div>
                
                <button class="btn btn-post-ad ms-3 d-sm-none d-lg-block" type="button">Post Ad</button>
            </div>
        </div>
    </div>
</nav>