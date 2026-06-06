<nav class="navbar navbar-expand-lg fixed-top {{ request()->is('/') ? 'navbar-transparent' : 'navbar-light bg-white shadow-sm' }}" id="mainNav">
    <div class="container-xl px-4">
        {{-- Site Logo and Brand Name --}}
        <a class="navbar-brand fw-bolder" href="{{route('home')}}">
            <i class="bi @yield('icon_class', 'bi-house-door-fill') me-2"></i>
            <span style="color: var(--primary-color);">{{setting('site_name', env('APP_NAME'))}}</span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            {{-- Primary Navigation Links --}}
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                @php $activePage = View::getSection('active_page', 'none'); @endphp

                <li class="nav-item"><a class="nav-link fw-semibold @if($activePage === 'properties') active @endif" href="{{ route('properties.index') }}">Properties</a></li>
                <li class="nav-item"><a class="nav-link fw-semibold @if($activePage === 'autos') active @endif" href="{{ route('autos.index') }}">Autos</a></li>
                <li class="nav-item"><a class="nav-link fw-semibold @if($activePage === 'events') active @endif" href="{{ route('events.index') }}">Events</a></li>
                <li class="nav-item"><a class="nav-link fw-semibold @if($activePage === 'jobs') active @endif" href="{{ route('jobs.index') }}">Jobs</a></li>
                <li class="nav-item"><a class="nav-link fw-semibold @if($activePage === 'services') active @endif" href="{{ route('services.index') }}">Services</a></li>
                <li class="nav-item"><a class="nav-link fw-semibold @if($activePage === 'classifieds') active @endif" href="{{ route('classifieds.index') }}">Classifieds</a></li>
            </ul>
        </div>

        <div class="d-flex align-items-center">

            {{-- Post Listing Call to Action (CTA) Button --}}
            <a href="{{ route('#') }}" class="btn btn-primary btn-sm fw-bold d-none d-lg-inline-flex align-items-center me-3 shadow-sm">
                <i class="bi bi-plus-circle-fill me-2"></i>
                Post Listing
            </a>

            {{-- 1. AUTHENTICATED USER BLOCK --}}
            @auth
            {{-- Notifications with Badge --}}
            <a href="{{ route('#') }}" class="me-3 btn btn-sm btn-link text-muted position-relative p-0" aria-label="Notifications">
                <i class="bi bi-bell fs-5"></i>
                {{-- Assuming $unreadNotificationsCount is passed to the view --}}
                @if (isset($unreadNotificationsCount) && $unreadNotificationsCount > 0)
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.6rem; padding: 3px 6px;">
                    {{ $unreadNotificationsCount > 99 ? '99+' : $unreadNotificationsCount }}
                    <span class="visually-hidden">unread messages</span>
                </span>
                @endif
            </a>

            {{-- User Dropdown with Avatar --}}
            <div class="dropdown">
                <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    {{-- Assuming Auth::user() is available and has a name/avatar --}}
                    <img src="{{ Auth::user()->profile_photo_url ?? 'https://ui-avatars.com/api/?name=' . urlencode(Auth::user()->name ?? 'User') . '&background=6366f1&color=fff&size=36&font-size=0.35' }}"
                        alt="{{ Auth::user()->name ?? 'User Profile' }}" width="36" height="36" class="rounded-circle border border-2" style="border-color: var(--primary-color) !important;">
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow border-0" style="border-radius: 12px;">
                    <li>
                        <h6 class="dropdown-header fw-bold">{{ Auth::user()->name ?? 'Welcome' }}</h6>
                    </li>
                    <li><a class="dropdown-item" href="{{ route('dashboard.user.welcome') }}"><i class="bi bi-grid-fill me-2 opacity-75"></i> Dashboard</a></li>
                    <li><a class="dropdown-item" href="{{ route('dashboard.user.settings') }}"><i class="bi bi-person-circle me-2 opacity-75"></i> Profile Settings</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li>
                        <a class="dropdown-item text-danger fw-semibold" href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                            <i class="bi bi-box-arrow-right me-2"></i> Logout
                        </a>
                        {{-- Hidden form for POST request logout --}}
                        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                            @csrf
                        </form>
                    </li>
                </ul>
            </div>

            {{-- 2. GUEST (UNAUTHENTICATED) BLOCK --}}
            @elseguest
            <a href="{{ route('login') }}" class="btn btn-link text-decoration-none text-muted fw-semibold me-2">
                Login
            </a>
            <a href="{{ route('register') }}" class="btn btn-outline-primary btn-sm fw-bold">
                Register
            </a>
            @endauth

        </div>
    </div>
</nav>