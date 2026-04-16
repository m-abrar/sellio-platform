<nav aria-label="breadcrumb" class="d-flex align-items-center gap-3 py-2">
    <a href="{{ route('autos.index') }}" 
       class="btn btn-sm btn-glass-back d-sm-none d-flex align-items-center px-3 rounded-pill shadow-sm transition-all">
        <i class="bi bi-arrow-left-short fs-5 me-1"></i>
        <span class="fw-bold small text-uppercase tracking-wider">{{ __('Vehicles Search') }}</span>
    </a>

    <ol class="breadcrumb mb-0 d-none d-md-flex align-items-center bg-glass-light px-3 py-2 rounded-pill border border-color-light shadow-sm">
        <li class="breadcrumb-item">
            <a href="{{ route('home') }}" class="text-muted hover-primary transition-all">
                <i class="bi bi-house-door-fill small"></i>
            </a>
        </li>
        <li class="breadcrumb-item">
            <a href="{{ route('autos.index') }}" class="text-muted text-decoration-none small fw-500 hover-primary">
                {{ __('Inventory') }}
            </a>
        </li>

        @if ($auto->category)
            <li class="breadcrumb-item">
                <a href="{{ route('autos.index', ['category' => $auto->category->slug]) }}" 
                   class="text-muted text-decoration-none small fw-500 hover-primary">
                    {{ $auto->category->title }}
                </a>
            </li>
        @endif

        <li class="breadcrumb-item active small fw-800 text-dark tracking-tight" aria-current="page">
            {{ $auto->year }} {{ $auto->make }} {{ $auto->model }}
        </li>
    </ol>
</nav>
