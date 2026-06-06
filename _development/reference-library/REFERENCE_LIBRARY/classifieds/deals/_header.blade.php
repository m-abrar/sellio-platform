<header>
    <nav class="navbar navbar-expand-lg navbar-dark navbar-top py-3">
        <div class="container">
            <a class="navbar-brand logo-text" href="{{ page_content('global.header.brand_link', '#') }}">{!! page_content('global.header.brand', 'DEALFINDER') !!}</a>
            <div class="d-flex ms-auto align-items-center">
                <form class="d-flex me-3" role="search">
                    <input class="form-control" type="search" placeholder="Search deals..." aria-label="Search">
                    <button class="btn btn-light ms-2" type="submit"><i class="fas fa-search"></i></button>
                </form>
                <a class="nav-link" href="#" aria-label="Shopping Cart"><i class="fas fa-shopping-cart text-white fs-4"></i></a>
            </div>
        </div>
    </nav>

    <nav class="navbar navbar-expand-lg navbar-light navbar-bottom py-2 shadow-sm">
        <div class="container">
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link text-dark" href="#">HOME</a></li>
                    
                    {{-- TODO: improve the styling --}}
                    {{-- START: CATEGORIES DROPDOWN MENU --}}
                    <li class="nav-item dropdown">
                        <a 
                            class="nav-link dropdown-toggle text-dark" 
                            href="#" 
                            id="navbarDropdownCategories" 
                            role="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            CATEGORIES
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdownCategories">
                            @foreach($categories as $category)
                            <li><a class="dropdown-item" href="?category={{$category->id}}">{{$category->title}}</a></li>
                            @endforeach
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#">All Categories</a></li>
                        </ul>
                    </li>
                    {{-- END: CATEGORIES DROPDOWN MENU --}}
                    
                    <li class="nav-item"><a class="nav-link text-dark" href="#">TODAY'S DEALS</a></li>
                    <li class="nav-item"><a class="nav-link text-dark" href="#">TRENDING</a></li>
                    <li class="nav-item"><a class="nav-link text-dark" href="#">FEATURED SELLERS</a></li>
                </ul>
            </div>
        </div>
    </nav>
</header>