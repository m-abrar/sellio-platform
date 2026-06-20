{{--
HEADER NAVIGATION
Description: Smart sticky navbar with transparency toggling and dynamic user controls.
Features: Responsive menu, auth-aware actions, and cart integration.
--}}
<nav @class([
    'navbar navbar-expand-lg transition-all',
    'navbar-transparent navbar-light' => request()->routeIs('index', 'home'),
    'navbar-light bg-white shadow-sm sticky-top' => ! request()->routeIs('index', 'home'),
]) id="mainNav" data-aos="fade-in" data-aos-duration="800" data-navbar-scroll>

    <div class="container-xl">
        {{-- Brand Identity --}}
        <a class="navbar-brand fw-bolder d-flex align-items-center" href="{{ url('/') }}">
            <img src="{{ page_content_string('global.header.brand_logo', setting('site_logo') ? Storage::url(setting('site_logo')) : asset('images/app-logo.webp')) }}"
                 alt="{{ setting_string('site_name', config('app.name')) }}" style="max-height: 40px;" />

            @if(!setting('hide_site_name'))
                <span class="fw-bold ms-2 d-none d-sm-inline-block text-uppercase">
                    @editable('global.header.brand_text', setting('site_name', config('app.name')))
                </span>
            @endif
        </a>

        {{-- Mobile Interface Toggler --}}
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            {{-- Dynamic Navigation Links --}}
            <ul class="navbar-nav me-auto">
                @foreach(menu_items('main_header') as $menuitem)
                    @if($menuitem->children->isNotEmpty())
                        <li class="nav-item dropdown" data-aos="fade-down" data-aos-delay="{{ $loop->iteration * 100 }}">
                            <a @class(['nav-link dropdown-toggle fw-semibold text-uppercase', 'active' => $menuitem->is_active])
                                href="{{ $menuitem->url }}"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                {{ __($menuitem->title) }}
                            </a>
                            <ul class="dropdown-menu border-0 shadow-sm rounded-3 p-2">
                                @foreach($menuitem->children as $child)
                                    <li>
                                        <a @class(['dropdown-item rounded-2', 'active' => $child->is_active])
                                            href="{{ $child->url }}">
                                            {{ __($child->title) }}
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </li>
                    @else
                        <li class="nav-item" data-aos="fade-down" data-aos-delay="{{ $loop->iteration * 100 }}">
                            <a @class(['nav-link fw-semibold text-uppercase', 'active' => $menuitem->is_active])
                                href="{{ $menuitem->url }}">
                                {{ __($menuitem->title) }}
                            </a>
                        </li>
                    @endif
                @endforeach
            </ul>

            {{-- User Actions & Global Controls --}}
            <div class="navbar-actions-group d-flex align-items-center gap-2 gap-lg-3" data-aos="fade-left"
                data-aos-delay="400">
                @auth
                    {{-- Profile Menu --}}
                    <div class="dropdown">
                        <a href="#" class="dropdown-toggle d-block link-dark text-decoration-none" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <img src="{{ Auth::user()->avatar_url }}" width="35" height="35"
                                class="rounded-circle border border-primary border-opacity-25" alt="Profile">
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2 rounded-3 scale-up-center">
                            @if(auth()->user()->hasRole(['admin', 'super-admin', 'moderator']))
                                <li>
                                    <a class="dropdown-item rounded-2 text-uppercase" href="{{ route('admin.welcome') }}">
                                        <i class="bi bi-shield-lock me-2"></i> {{ __('Admin Panel') }}
                                    </a>
                                </li>
                            @endif

                            @if(auth()->user()->hasRole('partner'))
                                <li>
                                    <a class="dropdown-item rounded-2 text-uppercase" href="{{ setting('url_partner', '#') }}">
                                        <i class="bi bi-shop me-2"></i> {{ __('Seller Portal') }}
                                    </a>
                                </li>
                            @endif

                            @if(auth()->user()->hasRole('user'))
                                <li>
                                    <a class="dropdown-item rounded-2 text-uppercase" href="{{ setting('url_user', '#') }}">
                                        <i class="bi bi-speedometer2 me-2"></i> {{ __('User Dashboard') }}
                                    </a>
                                </li>
                            @endif

                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <a class="dropdown-item text-danger rounded-2 text-uppercase" href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('frontend-logout-form').submit();">
                                    <i class="bi bi-box-arrow-right me-2"></i> {{ __('Logout') }}
                                </a>
                                <form id="frontend-logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                    @csrf
                                </form>
                            </li>

                        </ul>
                    </div>
                @else
                    <a href="{{ route('login') }}"
                        class="btn btn-link text-decoration-none text-muted fw-semibold text-uppercase">{{ __('Login') }}</a>
                @endauth

                {{-- Shopping Cart Badge --}}
                @if(isset($cartCount) && $cartCount > 0)
                    <a href="{{ route('cart.index') }}"
                        class="btn btn-outline-dark border-0 position-relative hvr-icon-pop">
                        <i class="bi bi-cart3 fs-5 hvr-icon"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ $cartCount }}
                        </span>
                    </a>
                @endif

                {{-- Primary Conversion Button --}}
                @auth
                    @if(auth()->user()->hasRole(['partner', 'admin', 'super-admin']))
                        <a href="{{ setting('url_partner', route('register')) }}"
                            class="btn btn-primary rounded-pill fw-bold px-4 shadow-sm hover-lift text-uppercase">
                            <i class="bi bi-plus-lg me-1"></i> {{ __('Post Listing') }}
                        </a>
                    @else
                        <a href="{{ route('register') }}"
                            class="btn btn-primary rounded-pill fw-bold px-4 shadow-sm hover-lift text-uppercase">
                            <i class="bi bi-shop me-1"></i> {{ __('Become a Seller') }}
                        </a>
                    @endif
                @else
                    <a href="{{ route('register') }}"
                        class="btn btn-primary rounded-pill fw-bold px-4 shadow-sm hover-lift text-uppercase">
                        <i class="bi bi-plus-lg me-1"></i> {{ __('Post Listing') }}
                    </a>
                @endauth
            </div>
        </div>
    </div>
</nav>

